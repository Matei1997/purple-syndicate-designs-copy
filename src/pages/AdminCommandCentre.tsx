import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Radio,
  Lock,
  Server,
  Users,
  Shield,
  Zap,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/shop/TopNav";
import FloatingOrbs from "@/components/shop/FloatingOrbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_ITEMS = [
  { label: "Main Database", value: "Online", icon: Server, color: "text-emerald-400" },
  { label: "Auth Gateway", value: "Secure", icon: ShieldCheck, color: "text-cyan-400" },
  { label: "Dispatch Net", value: "Low Latency", icon: Radio, color: "text-purple-300" },
  { label: "Audit Trails", value: "Synced", icon: Activity, color: "text-yellow-400" },
];

const CLEARANCE_REQUESTS = [
  { id: "#E-9921", gang: "Vagos", item: "RPG x1", total: "$35,000" },
  { id: "#E-9924", gang: "Ballas", item: "Bulk Ammo (5k)", total: "$12,200" },
  { id: "#E-9931", gang: "Sons", item: "Railgun Prototype", total: "$52,500" },
];

const ACTIVE_SESSIONS = [
  { name: "Admin_1", activity: "Reviewing orders", location: "Los Santos", status: "Active" },
  { name: "Razor", activity: "Inventory sync", location: "Sandy Shores", status: "Idle" },
  { name: "Phoenix", activity: "Treasury audit", location: "Grapeseed", status: "Active" },
];

export default function AdminCommandCentre() {
  const navigate = useNavigate();
  const currentUser = { name: "Razor", role: "admin" };

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

      <div className="flex-1 p-6 relative z-10">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <section className="glass-intense rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-heading uppercase">
                    Level 5 Clearance
                  </div>
                  <h1 className="font-display text-3xl font-bold text-foreground mt-3">
                    Administration Console
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    System configuration, asset visibility, and tax profile management.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase">Session Revenue</p>
                    <p className="text-2xl font-display font-bold text-primary">$142,500</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase mb-4">
                  System Status
                </h2>
                <div className="space-y-4">
                  {STATUS_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-center">
                          <item.icon className={cn("w-4 h-4", item.color)} />
                        </div>
                        <div>
                          <p className="text-sm text-foreground font-heading font-semibold">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.value}</p>
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-success" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase">
                    Revenue Intelligence
                  </h2>
                  <div className="text-xs text-muted-foreground">24h · 7d · 30d</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/40 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="text-xl font-display font-bold text-foreground">48</p>
                    <div className="h-1 bg-primary/40 rounded-full mt-2" />
                  </div>
                  <div className="bg-background/40 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">Avg. Basket</p>
                    <p className="text-xl font-display font-bold text-foreground">$2,940</p>
                    <div className="h-1 bg-accent/40 rounded-full mt-2" />
                  </div>
                  <div className="bg-background/40 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">Tax Revenue</p>
                    <p className="text-xl font-display font-bold text-foreground">$21,300</p>
                    <div className="h-1 bg-success/40 rounded-full mt-2" />
                  </div>
                  <div className="bg-background/40 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">Flags Triggered</p>
                    <p className="text-xl font-display font-bold text-foreground">3</p>
                    <div className="h-1 bg-warning/40 rounded-full mt-2" />
                  </div>
                </div>
              </div>
            </section>

            <section className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase">
                  Pending Manual Clearance
                </h2>
                <span className="text-xs text-warning bg-warning/10 border border-warning/30 rounded-full px-3 py-1">
                  {CLEARANCE_REQUESTS.length} requests
                </span>
              </div>
              <div className="space-y-3">
                {CLEARANCE_REQUESTS.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-background/40 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-heading font-semibold text-foreground">{item.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.gang} · {item.item}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-display font-bold text-primary">{item.total}</p>
                      <Button variant="ghost" size="sm" className="gap-1">
                        Review
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="w-full xl:w-80 space-y-6">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase">
                  Active Sessions
                </h2>
                <span className="text-xs text-success bg-success/10 border border-success/30 rounded-full px-3 py-1">
                  {ACTIVE_SESSIONS.length} live
                </span>
              </div>
              <div className="space-y-3">
                {ACTIVE_SESSIONS.map((session) => (
                  <div key={session.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-heading font-semibold text-foreground">{session.name}</p>
                      <p className="text-xs text-muted-foreground">{session.activity}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{session.location}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase mb-4">
                System Overrides
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-sm text-foreground">Manual Clearance</p>
                      <p className="text-xs text-muted-foreground">Force admin approval</p>
                    </div>
                  </div>
                  <span className="w-10 h-6 rounded-full bg-success/20 border border-success/40 flex items-center justify-end p-1">
                    <span className="w-4 h-4 rounded-full bg-success" />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <div>
                      <p className="text-sm text-foreground">Catalog Lockdown</p>
                      <p className="text-xs text-muted-foreground">Suspend external access</p>
                    </div>
                  </div>
                  <span className="w-10 h-6 rounded-full bg-muted/40 border border-border flex items-center p-1">
                    <span className="w-4 h-4 rounded-full bg-muted-foreground/40" />
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-heading font-semibold text-sm text-muted-foreground uppercase mb-4">
                Audit Stream
              </h2>
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-foreground">Tax profile updated to 15%</p>
                    <p>10:42 · System</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-foreground">Session approved for dispatch</p>
                    <p>10:15 · Dispatch</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <div>
                    <p className="text-foreground">Inventory sync completed</p>
                    <p>09:55 · Node EU-WEST</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
