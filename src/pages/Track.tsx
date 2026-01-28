import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Search,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Wrench,
  RotateCcw,
  ShoppingCart,
  Calendar,
  User,
  DollarSign,
  MapPin,
} from "lucide-react";
import TopNav from "@/components/shop/TopNav";
import FloatingOrbs from "@/components/shop/FloatingOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_FLOW = [
  "pending_review",
  "accepted",
  "in_progress",
  "ready_for_pickup",
  "completed",
] as const;

type OrderStatus = (typeof STATUS_FLOW)[number] | "cancelled" | "refunded";

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending_review: { label: "Pending Review", icon: Clock, color: "text-amber-400", bgColor: "bg-amber-500/20" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  in_progress: { label: "In Progress", icon: Wrench, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  ready_for_pickup: { label: "Ready for Pickup", icon: Package, color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  completed: { label: "Completed", icon: Truck, color: "text-green-400", bgColor: "bg-green-500/20" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/20" },
  refunded: { label: "Refunded", icon: RotateCcw, color: "text-orange-400", bgColor: "bg-orange-500/20" },
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  trackingId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  buyerName: string;
  phone: string;
  gangName: string;
  estimatedPickup?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Track() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = {
    name: "Ghost",
    role: "customer",
  };

  useEffect(() => {
    if (orderId) {
      setTrackId(orderId);
      fetchOrder(orderId);
    }
  }, [orderId]);

  const fetchOrder = async (code: string) => {
    setMessage("");
    setOrder(null);

    const cleaned = code.trim().toUpperCase();
    if (!cleaned || cleaned.length !== 6) {
      setMessage("Please enter a valid 6-character tracking code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${cleaned}`);
      if (!response.ok) {
        setMessage(
          response.status === 404
            ? "Order not found. Please check your tracking code."
            : "Unable to fetch order details. Please try again."
        );
        return;
      }

      const data = (await response.json()) as Order;
      setOrder(data);
    } catch (error) {
      console.error("Failed to fetch order", error);
      setMessage("Unable to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackClick = () => {
    const cleaned = trackId.trim().toUpperCase();
    navigate(`/track/${cleaned}`);
  };

  const currentStatusIndex = order ? STATUS_FLOW.indexOf(order.status as (typeof STATUS_FLOW)[number]) : -1;

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <FloatingOrbs />
      <TopNav
        cartCount={0}
        onCartClick={() => navigate("/")}
        onMenuClick={() => {}}
        userName={currentUser.name}
        userRole={currentUser.role}
        onSignOut={() => navigate("/")}
      />

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
              title="Back to shop"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Track Your Order</h1>
              <p className="text-sm text-muted-foreground">Enter your 6-character tracking code</p>
            </div>
          </div>

          <div className="glass-intense rounded-xl p-6 mb-6">
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter Tracking ID (e.g., SYN7X2)"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="pl-12 h-14 text-lg font-mono tracking-wider bg-background/50 border-border/50 uppercase"
                  onKeyDown={(e) => e.key === "Enter" && handleTrackClick()}
                />
              </div>
              <Button
                variant="neon"
                size="xl"
                onClick={handleTrackClick}
                disabled={loading}
                className="px-8"
              >
                {loading ? "Checking..." : "Track"}
              </Button>
            </div>

            {message && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {message}
              </div>
            )}
          </div>

          {order && (
            <div className="glass-intense rounded-xl overflow-hidden animate-fade-in">
              <div className={cn("p-6", STATUS_CONFIG[order.status].bgColor)}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-background/30 flex items-center justify-center">
                    {(() => {
                      const StatusIcon = STATUS_CONFIG[order.status].icon;
                      return <StatusIcon className={cn("w-8 h-8", STATUS_CONFIG[order.status].color)} />;
                    })()}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                    <h2 className={cn("font-display text-2xl font-bold", STATUS_CONFIG[order.status].color)}>
                      {STATUS_CONFIG[order.status].label}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-border/50">
                <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-4">Order Progress</h3>
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-1 bg-border/50 rounded-full" />
                  <div
                    className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500"
                    style={{
                      width:
                        currentStatusIndex >= 0
                          ? `${(currentStatusIndex / (STATUS_FLOW.length - 1)) * 100}%`
                          : "0%",
                    }}
                  />

                  <div className="relative flex justify-between">
                    {STATUS_FLOW.map((status, idx) => {
                      const isActive = currentStatusIndex >= idx;
                      const isCurrent = currentStatusIndex === idx;
                      const StepIcon = STATUS_CONFIG[status].icon;

                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-all z-10",
                              isActive
                                ? "bg-primary shadow-lg shadow-primary/30"
                                : "bg-muted border border-border",
                              isCurrent && "ring-4 ring-primary/30 scale-110"
                            )}
                          >
                            <StepIcon
                              className={cn(
                                "w-5 h-5",
                                isActive ? "text-primary-foreground" : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <span
                            className={cn(
                              "mt-3 text-xs font-medium text-center max-w-[80px]",
                              isActive ? "text-foreground" : "text-muted-foreground"
                            )}
                          >
                            {STATUS_CONFIG[status].label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tracking ID</p>
                      <p className="font-mono font-bold text-foreground">#{order.trackingId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Order Date</p>
                      <p className="font-medium text-foreground">
                        {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>
                  </div>

                  {order.estimatedPickup && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Est. Pickup</p>
                        <p className="font-medium text-cyan-400">
                          {format(new Date(order.estimatedPickup), "dd MMM yyyy, HH:mm")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Buyer</p>
                      <p className="font-medium text-foreground">{order.buyerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total</p>
                      <p className="font-display font-bold text-primary text-lg">
                        ${order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border/50">
                <h3 className="text-sm font-heading font-semibold text-muted-foreground mb-4">
                  Order Items ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-display font-bold text-foreground">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-border/50 flex justify-between items-center">
                <Button variant="ghost" onClick={() => navigate("/orders")} className="gap-2">
                  View All Orders
                </Button>
                <Button variant="neon" onClick={() => navigate("/")} className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Back to Shop
                </Button>
              </div>
            </div>
          )}

          {!order && !message && (
            <div className="text-center text-muted-foreground text-sm">
              <p>
                Your tracking code was provided when you placed your order.
                <br />
                Check your order confirmation for the 6-character code.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
