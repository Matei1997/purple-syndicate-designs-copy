import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const orders = [
  {
    id: "ord_001",
    trackingId: "SYN7X2",
    status: "completed",
    items: [
      { name: "Carbine Rifle MK2", quantity: 2, price: 45000 },
      { name: "5.56mm Box (x60)", quantity: 5, price: 2400 },
    ],
    totalPrice: 102000,
    createdAt: "2026-01-28T14:30:00Z",
    buyerName: "Ghost",
    phone: "555-0142",
    gangName: "The Syndicate",
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
    createdAt: "2026-01-28T12:15:00Z",
    buyerName: "Viper",
    phone: "555-0198",
    gangName: "Iron Serpents",
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
    createdAt: "2026-01-28T08:45:00Z",
    buyerName: "Phoenix",
    phone: "555-0189",
    gangName: "The Syndicate",
    estimatedPickup: "2026-01-28T20:00:00Z",
  },
];

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/orders/:trackingId", (req, res) => {
  const trackingId = req.params.trackingId?.toUpperCase();
  const order = orders.find((o) => o.trackingId === trackingId);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
