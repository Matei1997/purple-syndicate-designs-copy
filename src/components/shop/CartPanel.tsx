import { Minus, Plus, Trash2, Check, ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "./ProductCardV2";
import { Input } from "@/components/ui/input";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPanelProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  buyerName: string;
  buyerPhone: string;
  onBuyerNameChange: (value: string) => void;
  onBuyerPhoneChange: (value: string) => void;
  checkoutDisabled?: boolean;
  taxRate?: number;
}

export default function CartPanel({
  items,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout,
  buyerName,
  buyerPhone,
  onBuyerNameChange,
  onBuyerPhoneChange,
  checkoutDisabled = false,
  taxRate = 0.07,
}: CartPanelProps) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <aside className="w-80 flex-shrink-0 border-l border-border/50 flex flex-col h-full bg-card/30">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBasket className="w-5 h-5 text-primary" />
          <h2 className="font-heading font-bold text-foreground">Current Basket</h2>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors font-heading"
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-4 py-3 border-b border-border/50 text-xs text-muted-foreground font-heading">
        <span className="text-success">Auto-saved this session</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingBasket className="w-12 h-12 text-muted-foreground/20 mb-3" />
            <p className="text-sm font-heading text-muted-foreground">Your basket is empty</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add items from the catalogue</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-3 p-3 rounded-xl bg-muted/30 border border-border/30"
            >
              <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center flex-shrink-0">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-lg">📦</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-sm text-foreground truncate">
                  {item.product.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="min-w-[24px] text-center font-heading text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {item.product.weight && (
                    <>
                      <span>·</span>
                      <span>Weight {(item.product.weight * item.quantity).toFixed(1)}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="font-display font-bold text-sm text-primary">
                  ${(item.product.price * item.quantity).toLocaleString()}
                </div>
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t border-border/50 space-y-4 bg-card/50">
          <div className="space-y-2">
            <div>
              <label className="text-xs font-heading text-muted-foreground">Name *</label>
              <Input
                value={buyerName}
                onChange={(event) => onBuyerNameChange(event.target.value)}
                placeholder="Enter your name"
                className="mt-1 bg-background/50 border-border/50"
              />
            </div>
            <div>
              <label className="text-xs font-heading text-muted-foreground">Phone *</label>
              <Input
                value={buyerPhone}
                onChange={(event) => onBuyerPhoneChange(event.target.value)}
                placeholder="Enter your number"
                className="mt-1 bg-background/50 border-border/50"
              />
            </div>
            {checkoutDisabled && (
              <p className="text-[11px] text-warning">
                Name and phone number are required to place an order.
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-heading text-muted-foreground">Subtotal</span>
              <span className="font-heading text-foreground">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-heading text-muted-foreground">
                Tax ({(taxRate * 100).toFixed(0)}%)
              </span>
              <span className="font-heading text-foreground">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/50">
              <span className="font-display font-bold text-foreground">Total</span>
              <span className="font-display font-bold text-xl text-primary">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            disabled={checkoutDisabled}
            className={cn(
              "w-full py-3.5 rounded-xl font-heading font-bold text-sm",
              "bg-primary text-primary-foreground",
              "flex items-center justify-center gap-2",
              "hover:bg-primary/90 transition-all",
              "hover:shadow-lg hover:shadow-primary/30",
              checkoutDisabled && "opacity-60 cursor-not-allowed hover:bg-primary"
            )}
          >
            <Check className="w-4 h-4" />
            Confirm Order
          </button>
        </div>
      )}
    </aside>
  );
}
