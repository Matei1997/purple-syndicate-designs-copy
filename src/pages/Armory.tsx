import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/armory.css";

type ProductSpec = {
  label: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  weight: number;
  price: number;
  image: string;
  specs: ProductSpec[];
};

type BasketItem = {
  product: Product;
  quantity: number;
};

const PRODUCTS: Product[] = [
  {
    id: "carbine-rifle",
    name: "Carbine Rifle MK2",
    category: "weapons",
    weight: 7.5,
    price: 45000,
    image:
      "https://storage.googleapis.com/banani-generated-images/generated-images/ca63fb14-ddc3-4fec-ab4f-1109ef129f60.jpg",
    specs: [
      { label: "Weapon type", value: "Rifle" },
      { label: "Ammo type", value: "5.56mm" },
    ],
  },
  {
    id: "ammo-556",
    name: "5.56mm Box (x60)",
    category: "ammo",
    weight: 2.4,
    price: 4800,
    image:
      "https://storage.googleapis.com/banani-generated-images/generated-images/2dd8f1a0-ab4c-494e-bcef-a2d713256a0c.jpg",
    specs: [
      { label: "Caliber", value: "5.56mm" },
      { label: "Compatibility", value: "Assault rifles" },
    ],
  },
  {
    id: "combat-knife",
    name: "Combat Knife",
    category: "melee",
    weight: 1.2,
    price: 3200,
    image:
      "https://storage.googleapis.com/banani-generated-images/generated-images/8222bd6f-ac59-4424-841f-f317200b11b9.jpg",
    specs: [{ label: "Category", value: "Melee" }],
  },
  {
    id: "12-gauge",
    name: "12 Gauge (25 shells)",
    category: "ammo",
    weight: 1.9,
    price: 3750,
    image:
      "https://storage.googleapis.com/banani-generated-images/generated-images/4e8762b2-fa9b-4c3c-9b3f-0e5ee6da2837.jpg",
    specs: [
      { label: "Caliber", value: "12-Gauge" },
      { label: "Compatibility", value: "Shotguns" },
    ],
  },
  {
    id: "acetone-barrel",
    name: "Acetone Barrel",
    category: "chemical",
    weight: 20.0,
    price: 5000,
    image:
      "https://storage.googleapis.com/banani-generated-images/generated-images/d71027ba-f9bf-4989-9949-139500f64269.jpg",
    specs: [{ label: "Category", value: "Chemical" }],
  },
];

const CATEGORY_LABELS: { id: string; name: string }[] = [
  { id: "all", name: "All items" },
  { id: "weapons", name: "Weapons" },
  { id: "armour", name: "Armour vests" },
  { id: "ammo", name: "Ammo" },
  { id: "mods", name: "Ammo mods" },
  { id: "attachments", name: "Attachments" },
  { id: "chemical", name: "Chemical" },
  { id: "melee", name: "Melee" },
  { id: "misc", name: "Misc" },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Armory() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "carbine-rifle": 1,
    "ammo-556": 1,
    "combat-knife": 1,
    "12-gauge": 1,
    "acetone-barrel": 1,
  });
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [sessionLogs, setSessionLogs] = useState([
    "> Session verified",
    "> Audit trail: Active",
  ]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const counts = useMemo(() => {
    return PRODUCTS.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, {});
  }, []);

  const basketTotal = basketItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] ?? 1) + delta),
    }));
  };

  const handleAddToBasket = (product: Product) => {
    const qty = quantities[product.id] ?? 1;
    setBasketItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setSessionLogs((prev) => [`> Added ${qty} × ${product.name}`, ...prev].slice(0, 4));
  };

  const handleConfirmOrder = () => {
    if (!buyerName.trim() || !buyerPhone.trim() || basketItems.length === 0) {
      setSessionLogs((prev) => ["> Buyer details required before confirmation", ...prev].slice(0, 4));
      return;
    }

    setSessionLogs((prev) => ["> Order confirmed. Allocation queued", ...prev].slice(0, 4));
    setBasketItems([]);
    setBuyerName("");
    setBuyerPhone("");
  };

  return (
    <div className="armory-page">
      <header className="armory-topnav">
        <div className="topnav-left">
          <div className="topnav-logo-mark" />
          <div className="topnav-logo-text">
            <div className="topnav-logo-title">The Empire</div>
            <div className="topnav-logo-sub">Vault</div>
          </div>
        </div>
        <nav className="topnav-links">
          <button
            className="topnav-link"
            data-active="true"
            onClick={() => navigate("/armory")}
            type="button"
          >
            Shop
          </button>
          <button className="topnav-link" onClick={() => navigate("/orders")} type="button">
            Orders
          </button>
          <button className="topnav-link" onClick={() => navigate("/track")} type="button">
            Track order
          </button>
          <button className="topnav-link" onClick={() => navigate("/admin")} type="button">
            Admin
          </button>
        </nav>
        <div className="topnav-right">
          <div className="topnav-divider" />
          <button className="topnav-logout" onClick={() => navigate("/")}
            type="button">
            Log out
          </button>
        </div>
      </header>

      <div className="armory-root">
        <aside className="armory-column armory-sidebar-left">
          <div className="brand-header">
            <div className="brand-title">
              <div className="brand-mark" />
              Catalogue
            </div>
            <div className="brand-subtitle">Armory access</div>
          </div>

          <div className="sidebar-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="sidebar-search-input"
                type="text"
                placeholder="Search catalogue"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <span className="search-shortcut">CTRL+K</span>
            </div>
          </div>

          <div className="sidebar-nav">
            <div className="nav-section-label">Catalogue</div>
            {CATEGORY_LABELS.map((category) => (
              <button
                className={`nav-item${activeCategory === category.id ? " active" : ""}`}
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="nav-item-label">
                  <span className="nav-badge-dot" />
                  <span>{category.name}</span>
                </div>
                <span className="nav-count">{counts[category.id] ?? 0}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="operator-avatar">
              <img
                src="https://storage.googleapis.com/banani-avatars/avatar%2Fmale%2F25-35%2FEuropean%2F3"
                alt="Operator avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="operator-meta">
              <div className="operator-name">Operator-014</div>
              <div className="operator-role">Full Access</div>
            </div>
          </div>
        </aside>

        <main className="armory-column armory-main">
          <div className="armory-main-inner">
            <div className="hero-row">
              <section className="nightshift-card">
                <div className="nightshift-meta">
                  <div className="meta-kv">Night shift panel</div>
                  <div className="nightshift-title">High-Caliber Weaponry</div>
                  <p className="nightshift-copy">
                    Assault rifles, SMGs, and heavy weapons. Orders in this category may require
                    additional approval before fulfilment.
                  </p>
                  <div className="nightshift-stats">
                    <button className="stat-pill" type="button">
                      <div className="stat-label">Order queue</div>
                      <div className="stat-value">3 pending</div>
                      <div style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
                        View queued orders
                      </div>
                    </button>
                  </div>
                </div>
                <div className="nightshift-hero-image">
                  <img
                    className="nightshift-hero-img-tag"
                    alt="High-Caliber Weaponry"
                    src="https://storage.googleapis.com/banani-generated-images/generated-images/b816b215-dac0-494a-8e07-426a77e62d2c.jpg"
                  />
                </div>
              </section>
            </div>

            <div className="catalogue-header-row">
              <div className="catalogue-title-block">
                <div className="catalogue-label">Catalogue</div>
                <div className="catalogue-subcopy">
                  Use categories to narrow the grid. Pricing shown matches your session profile.
                </div>
              </div>
              <div className="catalogue-filters">
                {CATEGORY_LABELS.filter((category) => category.id !== "all").map((category) => (
                  <button
                    className={`pill-filter${activeCategory === category.id ? " active" : ""}`}
                    key={`filter-${category.id}`}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <section className="catalogue-grid">
              {filteredProducts.map((product) => (
                <article className="asset-card" key={product.id}>
                  <div className="asset-media">
                    <img alt={product.name} src={product.image} />
                    <div className="asset-policy-tag">
                      <span className="policy-dot" />
                      Cleared
                    </div>
                  </div>
                  <div className="asset-body">
                    <div className="asset-header-row">
                      <div className="asset-title-block">
                        <div className="asset-name">{product.name}</div>
                      </div>
                      <div className="asset-weight-chip">Weight {product.weight}</div>
                    </div>
                    <div className="asset-specs-row">
                      {product.specs.map((spec) => (
                        <div className="spec-chip" key={`${product.id}-${spec.label}`}>
                          <div className="spec-label">{spec.label}</div>
                          <div className="spec-value">{spec.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="asset-footer-row">
                      <div className="asset-price-block">
                        <div className="asset-price-main">{formatCurrency(product.price)}</div>
                        <div className="asset-price-meta">Price includes tax</div>
                      </div>
                      <div className="asset-actions">
                        <div className="quantity-control">
                          <button
                            className="quantity-step"
                            type="button"
                            onClick={() => handleQuantityChange(product.id, -1)}
                          >
                            -
                          </button>
                          <span className="quantity-value">{quantities[product.id] ?? 1}</span>
                          <button
                            className="quantity-step"
                            type="button"
                            onClick={() => handleQuantityChange(product.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn-allocate"
                          type="button"
                          onClick={() => handleAddToBasket(product)}
                        >
                          Add to basket
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </main>

        <aside className="armory-column armory-sidebar-right">
          <header className="session-header">
            <div className="session-label">Session overview</div>
            <div className="session-id-row">
              <div className="session-id-code">NX-771-A8</div>
              <div className="session-status-pill">Connected</div>
            </div>
            <div className="session-meta-grid">
              <div className="session-meta-item">
                <div className="session-meta-label">Role</div>
                <div className="session-meta-value">Empire · Admin</div>
              </div>
              <div className="session-meta-item">
                <div className="session-meta-label">Location</div>
                <div className="session-meta-value">Los Santos</div>
              </div>
              <div className="session-meta-item">
                <div className="session-meta-label">Tax rate</div>
                <div className="session-meta-value">0% (internal)</div>
              </div>
            </div>
          </header>

          <section className="basket-panel">
            <div className="basket-heading-row">
              <span>Current basket</span>
              <span>Auto-saved this session</span>
            </div>
            {basketItems.length === 0 ? (
              <div className="basket-item">
                <div className="basket-asset-meta">
                  <div className="basket-asset-name">No items added yet</div>
                  <div className="basket-asset-sub">Select from the catalogue</div>
                </div>
                <div className="basket-price">$0</div>
              </div>
            ) : (
              basketItems.map((item) => (
                <div className="basket-item" key={item.product.id}>
                  <div className="basket-asset-meta">
                    <div className="basket-asset-name">{item.product.name}</div>
                    <div className="basket-asset-sub">
                      Qty {item.quantity} · Weight {item.product.weight}
                    </div>
                  </div>
                  <div className="basket-price">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))
            )}
          </section>

          <footer className="session-footer">
            <div className="session-total-row">
              <div className="session-total-labels">
                <span>Session total</span>
                <span>All allocations logged to this session</span>
              </div>
              <div className="session-total-value">{formatCurrency(basketTotal)}</div>
            </div>
            <div className="session-buyer-details">
              <div style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                Buyer details (required to confirm order)
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginTop: "4px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Buyer name
                  </div>
                  <input
                    className="session-input"
                    value={buyerName}
                    onChange={(event) => setBuyerName(event.target.value)}
                    placeholder="Required"
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    Phone number
                  </div>
                  <input
                    className="session-input"
                    value={buyerPhone}
                    onChange={(event) => setBuyerPhone(event.target.value)}
                    placeholder="Required"
                  />
                </div>
              </div>
            </div>
            <button
              className="btn-authorise"
              type="button"
              onClick={handleConfirmOrder}
              disabled={!buyerName.trim() || !buyerPhone.trim() || basketItems.length === 0}
            >
              Confirm order
            </button>
            <div className="session-log-feed">
              {sessionLogs.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </footer>
        </aside>
      </div>
    </div>
  );
}
