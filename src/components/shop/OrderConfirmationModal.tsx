import { useEffect, useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  orderNumber: string;
  onComplete: () => void;
}

export default function OrderConfirmationModal({
  isOpen,
  orderNumber,
  onComplete,
}: OrderConfirmationModalProps) {
  const [countdown, setCountdown] = useState(5);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (countdown / 5) * circumference;

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    onComplete();
  }, [isOpen, countdown, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <div
        className={cn(
          "relative w-[90%] max-w-md p-8 rounded-2xl",
          "glass-intense",
          "border border-primary/40",
          "text-center",
          "animate-scale-in",
          "overflow-hidden"
        )}
      >
        <div className="absolute inset-0 pointer-events-none scan-lines opacity-30" />

        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(hsla(270, 80%, 60%, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsla(270, 80%, 60%, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              strokeWidth="4"
              className="stroke-primary/20"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
              className="stroke-success transition-all duration-1000"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: progressOffset,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-10 h-10 text-success animate-pulse" />
          </div>
          <div className="absolute inset-0 bg-success/20 blur-2xl rounded-full animate-pulse" />
        </div>

        <h2 className="font-display font-black text-2xl text-gradient mb-2">ORDER CONFIRMED</h2>
        <p className="font-heading text-muted-foreground mb-4">
          Your order has been successfully placed
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass neon-border mb-6">
          <span className="font-heading text-muted-foreground">Order #</span>
          <span className="font-display font-bold text-xl text-primary">{orderNumber}</span>
        </div>

        <div className={cn("flex items-start gap-3 p-4 rounded-xl mb-6", "bg-warning/10 border border-warning/30")}>
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-left text-sm font-heading text-warning/90">
            Keep this order number safe. Do <strong className="text-warning">NOT</strong> share it
            with anyone outside the organisation.
          </p>
        </div>

        <p className="font-heading text-sm text-muted-foreground">
          Redirecting in <span className="text-primary font-bold">{countdown}</span> seconds...
        </p>

        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-success/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
