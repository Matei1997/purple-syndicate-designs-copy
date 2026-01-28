import { ShoppingCart, Search, Menu, Crown, LogOut, Shield } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TopNavProps {
  cartCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  userName?: string;
  userRole?: string;
  onSignOut?: () => void;
}

export default function TopNav({
  cartCount,
  onCartClick,
  onMenuClick,
  userName,
  userRole,
  onSignOut,
}: TopNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "shop", label: "Shop", path: "/" },
    { id: "orders", label: "Orders", path: "/orders" },
    { id: "track", label: "Track Order", path: "/track" },
    ...(userRole === "admin" ? [{ id: "admin", label: "Admin", path: "/admin" }] : []),
  ];

  const getActiveTab = () => {
    if (location.pathname.startsWith("/track")) return "track";
    if (location.pathname.startsWith("/orders")) return "orders";
    if (location.pathname.startsWith("/admin")) return "admin";
    return "shop";
  };

  const activeTab = getActiveTab();

  return (
    <header className="h-16 border-b border-border/50 flex items-center justify-between px-4 lg:px-6 glass-intense sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
          title="Toggle menu"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}
        >
          <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-wide text-foreground hidden sm:block">
            SYNDICATE ARMORY
          </span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-1 bg-muted/30 rounded-full p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-heading font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {(userName || userRole) && (
          <div className="hidden sm:flex flex-col items-end text-xs text-muted-foreground mr-2">
            {userName && <span className="font-heading font-semibold text-foreground">{userName}</span>}
            {userRole && (
              <span className="uppercase tracking-widest text-[10px] text-muted-foreground">
                {userRole}
              </span>
            )}
          </div>
        )}
        <button className="p-2.5 rounded-lg hover:bg-muted/50 transition-colors" title="Search">
          <Search className="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          onClick={onCartClick}
          className={cn(
            "relative p-2.5 rounded-lg transition-all duration-200",
            "hover:bg-primary/10 hover:text-primary",
            cartCount > 0 && "text-primary"
          )}
          title="Open basket"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 text-xs font-heading text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        )}

        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30 flex items-center justify-center ml-2">
          <Shield className="w-4 h-4 text-foreground" />
        </div>
      </div>
    </header>
  );
}
