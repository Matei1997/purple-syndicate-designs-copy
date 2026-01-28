import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Filter,
  Calendar,
  Package,
  DollarSign,
  Landmark,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Truck,
} from "lucide-react";
import TopNav from "@/components/shop/TopNav";
import FloatingOrbs from "@/components/shop/FloatingOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MOCK_ORDERS, Order, OrderStatus, STATUS_CONFIG, STATUS_FLOW } from "@/data/mockOrders";

const ORDERS_PER_PAGE = 6;

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const currentUser = {
    name: "Razor",
    role: "admin",
  };
  const isAdmin = currentUser.role === "admin";

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId || order.status === nextStatus) {
          return order;
        }

        return {
          ...order,
          status: nextStatus,
          isRefunded: nextStatus === "refunded" ? true : order.isRefunded,
          history: [
            ...order.history,
            {
              action: "status",
              from: order.status,
              to: nextStatus,
              by: currentUser.name,
              at: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.buyerName.toLowerCase().includes(term) ||
          o.trackingId.toLowerCase().includes(term) ||
          o.id.toLowerCase().includes(term)
      );
    }

    if (filterStatus) {
      result = result.filter((o) => o.status === filterStatus);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, searchTerm, filterStatus, sortOrder]);

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const exportToCSV = () => {
    const headers = ["Order ID", "Tracking ID", "Status", "Total", "Date", "Buyer"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.trackingId,
      STATUS_CONFIG[o.status].label,
      o.totalPrice,
      format(new Date(o.createdAt), "yyyy-MM-dd HH:mm"),
      o.buyerName,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "syndicate_orders.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <FloatingOrbs />
      <TopNav
        cartCount={0}
        onCartClick={() => navigate("/")}
        onMenuClick={() => {}}
        userName={currentUser.name}
        userRole={currentUser.role}
        onSignOut={() => navigate("/track")}
      />

      <div className="flex-1 p-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
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
              <h1 className="font-display text-2xl font-bold text-foreground">Order History</h1>
              <p className="text-sm text-muted-foreground">{filteredOrders.length} orders found</p>
            </div>
          </div>

          <Button variant="glass" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <div className="glass-intense rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </Button>
        </div>

        <div className="space-y-4">
          {paginatedOrders.map((order) => {
            const expanded = expandedOrderId === order.id;
            const StatusIcon = STATUS_CONFIG[order.status].icon;

            return (
              <div
                key={order.id}
                className={cn(
                  "glass-intense rounded-xl overflow-hidden transition-all duration-300",
                  expanded && "ring-1 ring-primary/50"
                )}
              >
                <button
                  onClick={() => setExpandedOrderId(expanded ? null : order.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <StatusIcon className={cn("w-5 h-5", STATUS_CONFIG[order.status].color)} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-foreground">#{order.trackingId}</span>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", STATUS_CONFIG[order.status].color, "border-current/30")}
                        >
                          {STATUS_CONFIG[order.status].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")} • {order.items.length} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-display font-bold text-primary">
                        ${order.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.buyerName}</p>
                    </div>
                    {expanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-border/50 p-4 space-y-4 animate-fade-in">
                    <div className="bg-background/30 rounded-lg p-4">
                      <h4 className="text-sm font-heading font-semibold text-muted-foreground mb-3">
                        Status Timeline
                      </h4>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {STATUS_FLOW.map((status, idx) => {
                          const isActive = STATUS_FLOW.indexOf(order.status as typeof STATUS_FLOW[number]) >= idx;
                          const isCurrent = order.status === status;
                          const StepIcon = STATUS_CONFIG[status].icon;

                          return (
                            <div key={status} className="flex items-center">
                              <div
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap",
                                  isActive
                                    ? "bg-primary/20 border border-primary/50"
                                    : "bg-muted/30 border border-border/30",
                                  isCurrent && "ring-2 ring-primary shadow-lg shadow-primary/20"
                                )}
                              >
                                <StepIcon
                                  className={cn(
                                    "w-4 h-4",
                                    isActive ? STATUS_CONFIG[status].color : "text-muted-foreground"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "text-xs font-medium",
                                    isActive ? "text-foreground" : "text-muted-foreground"
                                  )}
                                >
                                  {STATUS_CONFIG[status].label}
                                </span>
                              </div>
                              {idx < STATUS_FLOW.length - 1 && (
                                <div
                                  className={cn(
                                    "w-8 h-0.5 mx-1",
                                    isActive ? "bg-primary/50" : "bg-border/50"
                                  )}
                                />
                              )}
                            </div>
                          );
                        })}

                        {order.isRefunded && (
                          <>
                            <div className="w-8 h-0.5 mx-1 bg-orange-500/50" />
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/20 border border-orange-500/50">
                              <RotateCcw className="w-4 h-4 text-orange-400" />
                              <span className="text-xs font-medium text-orange-400">Refunded</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="bg-background/30 rounded-lg p-4">
                        <h4 className="text-sm font-heading font-semibold text-muted-foreground mb-3">
                          Update Status
                        </h4>
                        <div className="flex flex-wrap items-center gap-3">
                          <select
                            value={order.status}
                            onChange={(event) => handleStatusChange(order.id, event.target.value as OrderStatus)}
                            className="bg-background/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                              <option key={key} value={key}>
                                {config.label}
                              </option>
                            ))}
                          </select>
                          <span className="text-xs text-muted-foreground">
                            Changes are logged under {currentUser.name}.
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-background/30 rounded-lg p-4">
                        <h4 className="text-sm font-heading font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Order Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-mono text-foreground">{order.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Buyer</span>
                            <span className="text-foreground">{order.buyerName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Phone</span>
                            <span className="text-foreground">{order.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gang</span>
                            <span className="text-foreground">{order.gangName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/30 rounded-lg p-4">
                        <h4 className="text-sm font-heading font-semibold text-muted-foreground mb-3">
                          📦 Items ({order.items.length})
                        </h4>
                        <div className="space-y-2 text-sm max-h-32 overflow-y-auto">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-muted-foreground">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="text-foreground">
                                ${(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Total:</span>
                        <span className="font-display font-bold text-primary">
                          ${order.totalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border",
                          order.isPaid
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-amber-500/10 border-amber-500/30"
                        )}
                      >
                        <DollarSign
                          className={cn("w-4 h-4", order.isPaid ? "text-green-400" : "text-amber-400")}
                        />
                        <span
                          className={cn("text-sm font-medium", order.isPaid ? "text-green-400" : "text-amber-400")}
                        >
                          {order.isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border",
                          order.inTreasury
                            ? "bg-cyan-500/10 border-cyan-500/30"
                            : "bg-muted/30 border-border/30"
                        )}
                      >
                        <Landmark
                          className={cn("w-4 h-4", order.inTreasury ? "text-cyan-400" : "text-muted-foreground")}
                        />
                        <span
                          className={cn("text-sm font-medium", order.inTreasury ? "text-cyan-400" : "text-muted-foreground")}
                        >
                          {order.inTreasury ? "In Treasury" : "Not in Treasury"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="neon" onClick={() => navigate(`/track/${order.trackingId}`)} className="gap-2">
                        <Truck className="w-4 h-4" />
                        Track Order
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {paginatedOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-foreground mb-2">No Orders Found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
