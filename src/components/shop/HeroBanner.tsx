import { Clock, Package, Users } from "lucide-react";
import heroImage from "@/assets/hero-armory.png";

interface HeroBannerProps {
  orderQueue: number;
  etaMinutes: number;
}

export default function HeroBanner({ orderQueue = 3, etaMinutes = 6 }: HeroBannerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden glass neon-border mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />

      <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-50">
        <img src={heroImage} alt="Armory" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background" />
      </div>

      <div className="relative z-20 p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-heading font-semibold tracking-widest text-success uppercase">
            Live Stock · Syndicate Secure
          </span>
        </div>

        <h1 className="font-display font-black text-3xl lg:text-4xl text-foreground mb-3">
          Night shift armory panel
        </h1>

        <p className="text-muted-foreground font-heading text-sm max-w-md mb-6">
          Browse pre-tax pricing for all categories. Orders are logged and routed directly to
          dispatch.
        </p>

        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/50 border border-border flex items-center justify-center">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-heading">Order queue</div>
              <div className="font-display font-bold text-lg text-foreground">
                {String(orderQueue).padStart(2, "0")} active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted/50 border border-border flex items-center justify-center">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-heading">ETA fulfillment</div>
              <div className="font-display font-bold text-lg text-foreground">~ {etaMinutes} min</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm font-heading text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{orderQueue} orders ahead across all gangs</span>
        </div>
      </div>
    </div>
  );
}
