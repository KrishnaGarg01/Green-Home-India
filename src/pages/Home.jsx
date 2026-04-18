import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  PhoneCall,
  ArrowRight,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import RevealOnScroll from "../components/RevealOnScroll.jsx";

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
      <div className="space-y-3 p-4">
        <div className="skeleton h-3 w-24 rounded-full" />
        <div className="skeleton h-5 rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-6 w-1/2 rounded" />
        <div className="skeleton h-11 rounded-lg" />
      </div>
    </div>
  );
}

export default function Home() {
  const { products, loading, error } = useProducts();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const initialCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(
    initialCategory && CATEGORIES.includes(initialCategory) ? initialCategory : "All"
  );

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    } else {
      setActiveCategory("All");
    }
  }, [location.search, searchParams]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        activeCategory === "All" || product.category === activeCategory;
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        (product.brand || "").toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchCategory && matchSearch;
    });
  }, [products, search, activeCategory]);

  const categoryCount = useMemo(() => {
    const counts = {};
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const featuredProducts = filtered.slice(0, 3);

  function handleCategoryChange(category) {
    setActiveCategory(category);
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  function clearFilters() {
    setSearch("");
    setActiveCategory("All");
    setSearchParams({});
  }

  const stats = [
    { label: "Active catalog", value: `${products.length}+` },
    { label: "Fast dispatch", value: "Pan India" },
    { label: "Order support", value: "COD ready" },
  ];

  const trustPoints = [
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Verified stock",
      desc: "Reliable hardware with genuine product focus.",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Smooth delivery",
      desc: "Clear order flow from cart to doorstep.",
    },
    {
      icon: <PhoneCall className="h-5 w-5" />,
      title: "Quick follow-up",
      desc: "Simple support for order confirmation and updates.",
    },
  ];

  return (
    <div className="pb-8">
      <section className="relative overflow-hidden border-b border-white/50 bg-slate-950 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
            alt="Electronics workspace"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(3,14,9,0.94)_15%,rgba(8,44,25,0.82)_50%,rgba(20,83,45,0.55)_100%)]" />
        </div>

        <div className="container-custom relative grid min-h-[calc(100vh-72px)] items-end py-12 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <RevealOnScroll className="max-w-2xl pb-8 lg:pb-16">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-100">
              <Sparkles className="h-3.5 w-3.5 text-lime-300" />
              Green Home India storefront
            </span>
            <h1 className="max-w-xl text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Greener design, faster browsing, same order flow underneath.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Explore CCTV accessories, networking gear, power supplies, and
              electronics in a cleaner catalog built for quick scanning on any
              screen.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#catalog" className="btn-primary">
                Browse catalog
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link to="/cart" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/16 hover:text-white">
                Open cart
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map((stat, index) => (
                <RevealOnScroll
                  key={stat.label}
                  delay={index * 110}
                  className="rounded-lg border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm"
                >
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </RevealOnScroll>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll
            delay={140}
            className="grid gap-3 self-end lg:justify-self-end lg:pb-10"
          >
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[76px_1fr_auto] items-center gap-4 rounded-lg border border-white/10 bg-white/[0.08] p-3 backdrop-blur-sm"
              >
                <div className="flex h-[76px] w-[76px] items-center justify-center rounded-lg bg-white/85 p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {product.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-300">{product.category}</p>
                </div>
                <span className="text-sm font-semibold text-lime-300">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      <section className="container-custom -mt-8 relative z-10">
        <RevealOnScroll className="panel-blur grid gap-4 border border-white/80 p-4 shadow-[0_24px_60px_-30px_rgba(21,128,61,0.45)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products, categories, brands..."
              className="input-field pl-12 pr-12"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <ShoppingBag className="h-4 w-4 text-brand-700" />
            <span>{filtered.length} products ready to explore</span>
          </div>
        </RevealOnScroll>
      </section>

      <section className="container-custom mt-10">
        <RevealOnScroll className="grid gap-4 lg:grid-cols-3">
          {trustPoints.map((point, index) => (
            <RevealOnScroll
              key={point.title}
              delay={index * 120}
              className="card p-5"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
                {point.icon}
              </div>
              <h2 className="text-lg font-semibold text-slate-950">{point.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{point.desc}</p>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>
      </section>

      <div
        id="catalog"
        className="sticky top-[72px] z-40 mt-12 border-y border-white/60 bg-[rgba(248,250,248,0.82)] backdrop-blur-xl"
      >
        <div className="container-custom overflow-x-auto py-3 scrollbar-hide">
          <div className="flex min-w-max gap-2">
            {CATEGORIES.map((category) => {
              const count =
                category === "All" ? products.length : categoryCount[category] || 0;
              const active = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
                    active
                      ? "border-brand-900 bg-brand-900 text-white"
                      : "border-white/70 bg-white/80 text-slate-700 hover:border-brand-200 hover:text-brand-800"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-brand-100 text-brand-800"
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

      <section className="container-custom py-8 sm:py-10">
        {!loading && !error && (
          <RevealOnScroll className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.12em] text-brand-700">
                Catalog
              </p>
              <h2 className="section-title mt-1">
                {search ? "Search results" : activeCategory === "All" ? "All products" : activeCategory}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Showing {filtered.length} product{filtered.length !== 1 && "s"}
                {search ? ` for "${search}"` : ""}
              </p>
            </div>

            {(search || activeCategory !== "All") && (
              <button type="button" onClick={clearFilters} className="btn-secondary">
                <X className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </RevealOnScroll>
        )}

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {error && (
          <div className="card py-16 text-center">
            <p className="text-lg font-semibold text-slate-800">
              Failed to load products
            </p>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="card py-16 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-lg font-semibold text-slate-800">
              No products match this search
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Try a broader keyword or reset the current category filter.
            </p>
            <button type="button" onClick={clearFilters} className="btn-primary mt-6">
              Reset filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, index) => (
              <RevealOnScroll key={product.id} delay={(index % 8) * 60}>
                <ProductCard product={product} />
              </RevealOnScroll>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
