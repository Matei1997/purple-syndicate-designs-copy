import { Minus, Plus, Check, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  weight?: number;
  stock?: number;
  ammoType?: string;
  caliber?: string;
  tags?: string[];
  enabled?: boolean;
}

interface ProductCardV2Props {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  showAdminControls?: boolean;
  onToggleEnabled?: (productId: string) => void;
}

export default function ProductCardV2({
  product,
  onAddToCart,
  showAdminControls,
  onToggleEnabled,
}: ProductCardV2Props) {
  const [quantity, setQuantity] = useState(1);
  const isDisabled = product.enabled === false;

  const handleAdd = () => {
    if (!isDisabled && quantity > 0) {
      onAddToCart(product, quantity);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-card/50 border border-border/50",
        "hover:border-primary/30 hover:bg-card/70",
        "transition-all duration-300 group",
        product.enabled === false && "opacity-60"
      )}
    >
      {product.tags && product.tags.length > 0 && (
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          {product.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded text-[10px] font-heading font-semibold uppercase tracking-wide bg-muted/80 text-muted-foreground border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="relative h-36 flex items-center justify-center p-4 bg-gradient-to-b from-muted/20 to-transparent">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-20 h-20 rounded-lg bg-muted/30 flex items-center justify-center">
            <span className="text-3xl opacity-50">📦</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-heading font-bold text-sm text-foreground leading-tight mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {product.weight && <span>Weight: {product.weight}</span>}
            {product.stock !== undefined && <span>Stock: {product.stock}</span>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="font-display font-bold text-lg text-foreground">
              ${product.price.toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground/70">incl. tax</div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Qty</span>
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-7 h-7 rounded border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-10 h-8 text-center bg-muted/50 border border-border rounded text-sm font-heading focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleAdd}
              disabled={isDisabled}
              className={cn(
                "w-8 h-8 rounded border flex items-center justify-center transition-all",
                isDisabled
                  ? "bg-muted/40 border-border/50 text-muted-foreground cursor-not-allowed"
                  : "bg-primary/20 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
              )}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showAdminControls && (
          <button
            onClick={() => onToggleEnabled?.(product.id)}
            className={cn(
              "w-full py-2 rounded-lg text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-all",
              product.enabled !== false
                ? "bg-success/10 text-success border border-success/20 hover:bg-success/20"
                : "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20"
            )}
          >
            {product.enabled !== false ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Enabled in catalogue
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hidden from shop
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
