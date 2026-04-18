import { useState, useMemo } from "react";
import { Search, X, ShoppingBag, Zap } from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  "All",
  "Connectors & Jointers",
  "HDMI Cables",
  "Power Supply",
  "POE & Switch",
  "Rack & Boxes",
  "Storage",
  "Home Electronics",
  "3+1 Wire",
  "LAN Wire",
  "USB Cables",
  "Mouse & Keyboard",
  "Tools",
];

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-4 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-9 rounded-xl mt-1" />
      </div>
    </div>
  );
}

export default function Home() {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        activeCategory === "All" || p.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [products, search, activeCategory]);

  const categoryCount = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container-custom relative py-14 md:py-18">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <Zap className="w-3 h-3 text-yellow-300" />
              62+ Products · COD Available · Pan India Delivery
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 text-balance">
              Green Home India
            </h1>
            <p className="text-brand-200 text-base sm:text-lg mb-8">
              CCTV Accessories · Networking · Cables · Electronics
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, categories, brands…"
                className="w-full pl-12 pr-12 py-4 rounded-2xl text-gray-800 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl placeholder-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter Bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="container-custom py-2.5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const count = cat === "All" ? products.length : categoryCount[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-brand-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                      activeCategory === cat
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Products Section ── */}
      <section className="container-custom py-6 sm:py-8">
        {/* Result header */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <div>
              {search ? (
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
                  result{filtered.length !== 1 && "s"} for "
                  <span className="text-brand-700">{search}</span>"
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
                  product{filtered.length !== 1 && "s"}
                  {activeCategory !== "All" && (
                    <> in <span className="text-brand-700">{activeCategory}</span></>
                  )}
                </p>
              )}
            </div>

            {(search || activeCategory !== "All") && (
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="text-xs text-gray-500 hover:text-brand-700 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-lg font-semibold text-gray-700 mb-1">Failed to load products</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="py-20 text-center">
            <ShoppingBag className="w-14 h-14 mx-auto text-gray-200 mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-1">No products found</p>
            <p className="text-sm text-gray-400 mb-4">
              Try a different keyword or category
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 animate-fade-in">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── Features strip ── */}
      {!loading && !error && (
        <section className="bg-brand-50 border-t border-brand-100 mt-8">
          <div className="container-custom py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { icon: "🚚", title: "Pan India Delivery", desc: "Delivered to your doorstep" },
                { icon: "💵", title: "Cash on Delivery", desc: "Pay when you receive" },
                { icon: "✅", title: "Genuine Products", desc: "Quality guaranteed" },
                { icon: "📞", title: "Quick Support", desc: "Call or WhatsApp us" },
              ].map((f) => (
                <div key={f.title} className="p-4">
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <p className="font-semibold text-sm text-gray-800">{f.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
