import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "@/components/shop/TopNav";
import Sidebar, { CATEGORIES } from "@/components/shop/Sidebar";
import HeroBanner from "@/components/shop/HeroBanner";
import CatalogueHeader from "@/components/shop/CatalogueHeader";
import ProductCardV2, { Product } from "@/components/shop/ProductCardV2";
import CartPanel, { CartItem } from "@/components/shop/CartPanel";
import OrderConfirmationModal from "@/components/shop/OrderConfirmationModal";
import FloatingOrbs from "@/components/shop/FloatingOrbs";
import { MOCK_ORDERS } from "@/data/mockOrders";

import desertEagle from "@/assets/weapons/desert-eagle.png";
import m4a1 from "@/assets/weapons/m4a1.png";
import ak47 from "@/assets/weapons/ak47.png";
import glock19 from "@/assets/weapons/glock19.png";
import mp5 from "@/assets/weapons/mp5.png";
import redDot from "@/assets/attachments/red-dot.png";
import suppressor from "@/assets/attachments/suppressor.png";
import medkit from "@/assets/chemicals/medkit.png";
import ammoBox from "@/assets/ammo/9mm-box.png";

const SAMPLE_PRODUCTS: Product[] = [
  { id: "w1", name: "Carbine Rifle MK2", price: 45000, category: "weapons", ammoType: "5.56", weight: 7.5, stock: 18, image: m4a1, tags: ["Weapon", "5.56mm"] },
  { id: "w2", name: "Compact SMG", price: 28500, category: "weapons", ammoType: "9mm", weight: 4.2, stock: 42, image: mp5, tags: ["9mm", "Fast"] },
  { id: "w3", name: "Combat MG", price: 85000, category: "weapons", ammoType: "7.62", weight: 14.0, stock: 5, image: ak47, tags: ["7.62mm", "Heavy"] },
  { id: "w4", name: "Pump Shotgun MK2", price: 55000, category: "weapons", ammoType: "12ga", weight: 6.8, stock: 24, image: desertEagle, tags: ["12ga", "Pump"] },
  { id: "w5", name: "Heavy Sniper MK2", price: 125000, category: "weapons", ammoType: ".50cal", weight: 12.5, stock: 8, image: m4a1, tags: [".50cal", "Sniper"] },
  { id: "w6", name: "AP Pistol", price: 18000, category: "weapons", ammoType: "9mm", weight: 2.1, stock: 65, image: glock19, tags: ["9mm", "Auto"] },
  { id: "w7", name: "Special Carbine", price: 38000, category: "weapons", ammoType: "5.56", weight: 5.8, stock: 32, image: m4a1, tags: ["5.56mm", "Rifle"] },
  { id: "w8", name: "Assault Rifle MK2", price: 52000, category: "weapons", ammoType: "7.62", weight: 8.2, stock: 15, image: ak47, tags: ["7.62mm", "Auto"] },
  {
    id: "a1",
    name: "5.56mm Box (x60)",
    price: 2400,
    category: "ammo",
    weight: 1.2,
    stock: 90,
    image: ammoBox,
    tags: ["Ammo", "5.56 - FMJ"],
    caliber: "5.56",
  },
  { id: "a2", name: "9mm Box (x50)", price: 1200, category: "ammo", weight: 0.8, stock: 150, image: ammoBox, tags: ["Ammo", "9mm"], caliber: "9mm" },
  { id: "a3", name: "7.62mm Box (x40)", price: 3200, category: "ammo", weight: 1.6, stock: 45, image: ammoBox, tags: ["Ammo", "7.62"], caliber: "7.62" },
  { id: "a4", name: "12 Gauge (25 shells)", price: 3750, category: "ammo", weight: 1.9, stock: 64, image: ammoBox, tags: ["Ammo", "12ga - HP"], caliber: "12ga", enabled: false },
  { id: "a5", name: ".45 ACP Box (x40)", price: 1800, category: "ammo", weight: 1.0, stock: 80, image: ammoBox, tags: ["Ammo", ".45"], caliber: ".45" },
  { id: "at1", name: "Holographic Sight", price: 4500, category: "attachments", weight: 0.3, stock: 28, image: redDot, tags: ["Optic", "Reflex"] },
  { id: "at2", name: "Suppressor (Rifle)", price: 12000, category: "attachments", weight: 0.8, stock: 12, image: suppressor, tags: ["Muzzle", "Stealth"] },
  { id: "at3", name: "Extended Mag", price: 2500, category: "attachments", weight: 0.2, stock: 55, image: redDot, tags: ["Magazine", "+50%"] },
  { id: "at4", name: "Grip (Tactical)", price: 1800, category: "attachments", weight: 0.15, stock: 40, image: suppressor, tags: ["Grip", "Stability"] },
  { id: "c1", name: "Acetone Barrel", price: 5000, category: "chemicals", weight: 20.0, stock: 12, image: medkit, tags: ["Chemical", "Solvent"] },
  { id: "c2", name: "Medical Kit", price: 8000, category: "chemicals", weight: 2.5, stock: 35, image: medkit, tags: ["Medical", "Heal"] },
  { id: "c3", name: "Adrenaline Shot", price: 3500, category: "chemicals", weight: 0.3, stock: 48, image: medkit, tags: ["Medical", "Boost"] },
  { id: "m1", name: "Combat Knife", price: 3200, category: "melee", weight: 1.2, stock: 35, image: suppressor, tags: ["Melee", "Blade"] },
  { id: "m2", name: "Machete", price: 2800, category: "melee", weight: 1.8, stock: 22, image: suppressor, tags: ["Melee", "Heavy"] },
];

export default function Index() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCaliber, setActiveCaliber] = useState<string | null>(null);
  const [sortValue, setSortValue] = useState("popular");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const currentUser = {
    name: "Razor",
    role: "admin",
  };
  const isAdmin = currentUser.role === "admin";

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory);
    }

    if (!isAdmin) {
      filtered = filtered.filter((p) => p.enabled !== false);
    }

    if (activeCaliber) {
      filtered = filtered.filter((p) => p.caliber === activeCaliber || p.ammoType?.includes(activeCaliber));
    }

    switch (sortValue) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [activeCategory, activeCaliber, isAdmin, sortValue, products]);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemove = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClear = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (!buyerName.trim() || !buyerPhone.trim()) {
      return;
    }

    const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setOrderNumber(orderId);
    setShowOrderModal(true);
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const categoryTitle = activeCategory
    ? CATEGORIES.find((c) => c.id === activeCategory)?.name || "Catalogue"
    : "Catalogue";
  const ordersAhead = MOCK_ORDERS.filter(
    (order) => !["completed", "cancelled", "refunded"].includes(order.status)
  ).length;
  const canCheckout = cartItems.length > 0 && buyerName.trim().length > 0 && buyerPhone.trim().length > 0;

  const handleSignOut = () => {
    navigate("/track");
  };

  const handleOrderComplete = () => {
    setShowOrderModal(false);
    setBuyerName("");
    setBuyerPhone("");
    if (orderNumber) {
      navigate(`/track/${orderNumber}`);
    }
  };

  const handleToggleProduct = (productId: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, enabled: product.enabled === false ? true : false }
          : product
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <FloatingOrbs />

      <TopNav
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userName={currentUser.name}
        userRole={currentUser.role}
        onSignOut={handleSignOut}
      />

      <div className="flex flex-1 relative z-10">
        <div
          className={`
          fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:block
        `}
        >
          <div className="h-[calc(100vh-64px)] bg-background border-r border-border/50">
            <Sidebar
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategorySelect={(cat) => {
                setActiveCategory(cat);
                setSidebarOpen(false);
              }}
            />
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {cartOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            onClick={() => setCartOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="p-6">
            <HeroBanner orderQueue={ordersAhead} etaMinutes={6} />

            <CatalogueHeader
              title={categoryTitle}
              itemCount={filteredProducts.length}
              activeCaliber={activeCaliber}
              onCaliberSelect={setActiveCaliber}
              sortValue={sortValue}
              onSortChange={setSortValue}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="opacity-0 animate-slide-up"
                  style={{ animationDelay: `${index * 0.03}s`, animationFillMode: "forwards" }}
                >
                  <ProductCardV2
                    product={product}
                    onAddToCart={handleAddToCart}
                    showAdminControls={isAdmin}
                    onToggleEnabled={handleToggleProduct}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>

        <div className="hidden xl:block h-[calc(100vh-64px)]">
          <CartPanel
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemove}
            onClear={handleClear}
            onCheckout={handleCheckout}
            buyerName={buyerName}
            buyerPhone={buyerPhone}
            onBuyerNameChange={setBuyerName}
            onBuyerPhoneChange={setBuyerPhone}
            checkoutDisabled={!canCheckout}
            taxRate={0.07}
          />
        </div>

        <div
          className={`fixed xl:hidden inset-y-0 right-0 z-50 transform transition-transform duration-300 ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-[calc(100vh-64px)] bg-background border-l border-border/50 w-80">
            <CartPanel
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemove}
              onClear={handleClear}
              onCheckout={() => {
                handleCheckout();
                setCartOpen(false);
              }}
              buyerName={buyerName}
              buyerPhone={buyerPhone}
              onBuyerNameChange={setBuyerName}
              onBuyerPhoneChange={setBuyerPhone}
              checkoutDisabled={!canCheckout}
              taxRate={0.07}
            />
          </div>
        </div>
      </div>

      <OrderConfirmationModal
        isOpen={showOrderModal}
        orderNumber={orderNumber}
        onComplete={handleOrderComplete}
      />
    </div>
  );
}
