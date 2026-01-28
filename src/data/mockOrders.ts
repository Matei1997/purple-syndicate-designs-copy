import { Clock, CheckCircle2, Package, Truck, Wrench, XCircle, RotateCcw } from "lucide-react";

export const STATUS_FLOW = [
  "pending_review",
  "accepted",
  "in_progress",
  "ready_for_pickup",
  "completed",
] as const;

export type OrderStatus = typeof STATUS_FLOW[number] | "cancelled" | "refunded";

export interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending_review: { label: "Pending Review", icon: Clock, color: "text-amber-400" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-blue-400" },
  in_progress: { label: "In Progress", icon: Wrench, color: "text-purple-400" },
  ready_for_pickup: { label: "Ready for Pickup", icon: Package, color: "text-cyan-400" },
  completed: { label: "Completed", icon: Truck, color: "text-green-400" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-400" },
  refunded: { label: "Refunded", icon: RotateCcw, color: "text-orange-400" },
};

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface HistoryEntry {
  action: string;
  from: string;
  to: string;
  by: string;
  at: string;
}

export interface Order {
  id: string;
  trackingId: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice: number;
  importTotal?: number;
  createdAt: string;
  buyerName: string;
  phone: string;
  gangName: string;
  isPaid: boolean;
  inTreasury: boolean;
  isRefunded: boolean;
  history: HistoryEntry[];
  estimatedPickup?: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord_001",
    trackingId: "SYN7X2",
    status: "completed",
    items: [
      { name: "Carbine Rifle MK2", quantity: 2, price: 45000 },
      { name: "5.56mm Box (x60)", quantity: 5, price: 2400 },
    ],
    totalPrice: 102000,
    importTotal: 78000,
    createdAt: "2026-01-28T14:30:00Z",
    buyerName: "Ghost",
    phone: "555-0142",
    gangName: "The Syndicate",
    isPaid: true,
    inTreasury: true,
    isRefunded: false,
    history: [
      { action: "status", from: "pending_review", to: "accepted", by: "Razor", at: "2026-01-28T14:35:00Z" },
      { action: "status", from: "accepted", to: "in_progress", by: "Razor", at: "2026-01-28T14:45:00Z" },
      { action: "status", from: "in_progress", to: "ready_for_pickup", by: "Razor", at: "2026-01-28T15:00:00Z" },
      { action: "payment", from: "unpaid", to: "paid", by: "Razor", at: "2026-01-28T15:05:00Z" },
      { action: "status", from: "ready_for_pickup", to: "completed", by: "Razor", at: "2026-01-28T15:30:00Z" },
    ],
    estimatedPickup: "2026-01-28T16:00:00Z",
  },
  {
    id: "ord_002",
    trackingId: "K9M3PL",
    status: "in_progress",
    items: [
      { name: "Combat MG", quantity: 1, price: 85000 },
      { name: "Holographic Sight", quantity: 1, price: 4500 },
      { name: "Extended Mag", quantity: 2, price: 2500 },
    ],
    totalPrice: 94500,
    importTotal: 72000,
    createdAt: "2026-01-28T12:15:00Z",
    buyerName: "Viper",
    phone: "555-0198",
    gangName: "Iron Serpents",
    isPaid: false,
    inTreasury: false,
    isRefunded: false,
    history: [
      { action: "status", from: "pending_review", to: "accepted", by: "Admin", at: "2026-01-28T12:20:00Z" },
      { action: "status", from: "accepted", to: "in_progress", by: "Admin", at: "2026-01-28T12:45:00Z" },
    ],
    estimatedPickup: "2026-01-28T18:00:00Z",
  },
  {
    id: "ord_003",
    trackingId: "QW8N4R",
    status: "pending_review",
    items: [
      { name: "AP Pistol", quantity: 3, price: 18000 },
      { name: "9mm Box (x50)", quantity: 10, price: 1200 },
    ],
    totalPrice: 66000,
    createdAt: "2026-01-28T10:00:00Z",
    buyerName: "Shadow",
    phone: "555-0167",
    gangName: "Night Howlers",
    isPaid: false,
    inTreasury: false,
    isRefunded: false,
    history: [],
  },
  {
    id: "ord_004",
    trackingId: "BX2Y9T",
    status: "cancelled",
    items: [{ name: "Heavy Sniper MK2", quantity: 1, price: 125000 }],
    totalPrice: 125000,
    createdAt: "2026-01-27T18:30:00Z",
    buyerName: "Spectre",
    phone: "555-0234",
    gangName: "The Syndicate",
    isPaid: false,
    inTreasury: false,
    isRefunded: false,
    history: [
      { action: "status", from: "pending_review", to: "cancelled", by: "Spectre", at: "2026-01-27T19:00:00Z" },
    ],
  },
  {
    id: "ord_005",
    trackingId: "LM5C7Z",
    status: "ready_for_pickup",
    items: [
      { name: "Suppressor (Rifle)", quantity: 2, price: 12000 },
      { name: "Grip (Tactical)", quantity: 2, price: 1800 },
      { name: "Medical Kit", quantity: 5, price: 8000 },
    ],
    totalPrice: 67600,
    importTotal: 52000,
    createdAt: "2026-01-28T08:45:00Z",
    buyerName: "Phoenix",
    phone: "555-0189",
    gangName: "The Syndicate",
    isPaid: true,
    inTreasury: false,
    isRefunded: false,
    history: [
      { action: "status", from: "pending_review", to: "accepted", by: "Razor", at: "2026-01-28T09:00:00Z" },
      { action: "status", from: "accepted", to: "in_progress", by: "Razor", at: "2026-01-28T09:30:00Z" },
      { action: "payment", from: "unpaid", to: "paid", by: "Phoenix", at: "2026-01-28T10:00:00Z" },
      { action: "status", from: "in_progress", to: "ready_for_pickup", by: "Razor", at: "2026-01-28T11:00:00Z" },
    ],
    estimatedPickup: "2026-01-28T20:00:00Z",
  },
];
