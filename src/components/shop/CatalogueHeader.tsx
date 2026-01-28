import { cn } from "@/lib/utils";

interface CaliberFilter {
  id: string;
  label: string;
}

interface CatalogueHeaderProps {
  title: string;
  itemCount: number;
  calibers?: CaliberFilter[];
  activeCaliber: string | null;
  onCaliberSelect: (caliberId: string | null) => void;
  sortValue: string;
  onSortChange: (value: string) => void;
}

const CALIBERS: CaliberFilter[] = [
  { id: "all", label: "All" },
  { id: ".36", label: ".36" },
  { id: ".45", label: ".45" },
  { id: "9mm", label: "9mm" },
  { id: "5.56", label: "5.56" },
  { id: "7.62", label: "7.62" },
  { id: "12ga", label: "12ga" },
];

export default function CatalogueHeader({
  title,
  itemCount,
  calibers = CALIBERS,
  activeCaliber,
  onCaliberSelect,
  sortValue,
  onSortChange,
}: CatalogueHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-3">
          <h2 className="font-display font-bold text-xl text-foreground">{title}</h2>
          <span className="text-sm text-muted-foreground font-heading">
            {itemCount} items found
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-xs text-muted-foreground font-heading">
          Tap a caliber or category to narrow the grid. All prices shown with your tax profile.
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {calibers.map((caliber) => (
              <button
                key={caliber.id}
                onClick={() => onCaliberSelect(caliber.id === "all" ? null : caliber.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all",
                  (caliber.id === "all" && activeCaliber === null) || activeCaliber === caliber.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                )}
              >
                {caliber.label}
              </button>
            ))}
          </div>

          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-heading bg-muted/50 border border-border/50 text-muted-foreground focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="popular">Sort: Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
