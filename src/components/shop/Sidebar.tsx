import React from "react";
import {
  Crosshair,
  Bomb,
  Target,
  FlaskConical,
  Wrench,
  Sword,
  Package,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  subcategories?: string[];
}

interface SidebarProps {
  categories: Category[];
  activeCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export default function Sidebar({ categories, activeCategory, onCategorySelect }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-border/50 flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-xs font-heading font-semibold tracking-widest text-muted-foreground uppercase">
          Catalogue
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <button
          onClick={() => onCategorySelect(null)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200",
            "hover:bg-primary/5 group",
            activeCategory === null && "bg-primary/10 border-l-2 border-primary"
          )}
        >
          <Package
            className={cn(
              "w-5 h-5 transition-colors",
              activeCategory === null ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "font-heading font-semibold text-sm",
                activeCategory === null ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              All equipment
            </div>
            <div className="text-xs text-muted-foreground/70">
              {categories.reduce((sum, cat) => sum + cat.count, 0)} items · tax applied
            </div>
          </div>
          <span className="text-xs text-muted-foreground/50 font-mono">CTRL+K</span>
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200",
              "hover:bg-primary/5 group",
              activeCategory === category.id && "bg-primary/10 border-l-2 border-primary"
            )}
          >
            <span
              className={cn(
                "transition-colors",
                activeCategory === category.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {category.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  "font-heading font-semibold text-sm",
                  activeCategory === category.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {category.name}
              </div>
              {category.subcategories && (
                <div className="text-xs text-muted-foreground/70 truncate">
                  {category.subcategories.join(" · ")}
                </div>
              )}
            </div>
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-all",
                activeCategory === category.id
                  ? "text-primary opacity-100"
                  : "text-muted-foreground/30 opacity-0 group-hover:opacity-100"
              )}
            />
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-heading text-muted-foreground">SESSION</span>
        </div>
        <div className="text-sm font-heading text-success mt-1">Encrypted · 12ms</div>
      </div>
    </aside>
  );
}

export const CATEGORIES: Category[] = [
  {
    id: "weapons",
    name: "Weapons",
    icon: <Crosshair className="w-5 h-5" />,
    count: 32,
    subcategories: ["32 rifles", "18 SMGs"],
  },
  {
    id: "ammo",
    name: "Ammo",
    icon: <Target className="w-5 h-5" />,
    count: 24,
    subcategories: ["Calibers .36 – 12ga"],
  },
  {
    id: "ammo-mods",
    name: "Ammo Mods",
    icon: <Bomb className="w-5 h-5" />,
    count: 12,
    subcategories: ["HP", "FMJ", "Tracer", "AP"],
  },
  {
    id: "attachments",
    name: "Attachments",
    icon: <Wrench className="w-5 h-5" />,
    count: 18,
    subcategories: ["Optics", "Muzzles", "Grips"],
  },
  {
    id: "chemicals",
    name: "Chemical",
    icon: <FlaskConical className="w-5 h-5" />,
    count: 8,
    subcategories: ["Precursors", "Solvents"],
  },
  {
    id: "melee",
    name: "Melee",
    icon: <Sword className="w-5 h-5" />,
    count: 6,
    subcategories: ["Blades", "Improvised"],
  },
];
