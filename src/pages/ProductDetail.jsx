import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCcw,
  Tag,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchProduct } from "../utils/api";
import { useCart } from "../context/CartContext";
import RevealOnScroll from "../components/RevealOnScroll.jsx";

function Skeleton() {
  return (
    <div className="container-custom py-10">
      <div className="skeleton mb-6 h-4 w-28 rounded-full" />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="skeleton aspect-square rounded-lg" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-32 rounded-full" />
          <div className="skeleton h-10 rounded" />
          <div className="skeleton h-8 w-1/2 rounded" />
          <div className="skeleton h-28 rounded-lg" />
          <div className="skeleton h-12 rounded-lg" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="skeleton h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addItem, updateQty, getItemQty, isInCart } = useCart();

  const qty = getItemQty(id);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    fetchProduct(id)
      .then((response) => {
        if (response.success && response.product) {
          setProduct(response.product);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Skeleton />;

  if (notFound || !product) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="mx-auto max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
            Product unavailable
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            We could not find that item.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The product may have been removed or the link is no longer valid.
          </p>
          <Link to="/" className="btn-primary mt-8">
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const stock = Number(product.stock) || 50;
  const isOutOfStock =
    stock <= 0 || String(product.status).toLowerCase() === "out of stock";
  const inCart = isInCart(id);
  const discount =
    product.mrp && Number(product.mrp) > Number(product.price)
      ? Math.round(
          ((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100
        )
      : 0;
  const savings =
    discount > 0 ? Number(product.mrp) - Number(product.price) : 0;

  function handleAdd() {
    addItem({ ...product, stock });
    toast.success(`${product.name} added to cart!`);
  }

  function handleIncrease() {
    if (qty < stock) {
      updateQty(id, qty + 1);
      return;
    }

    toast.error("Max stock reached");
  }

  function handleDecrease() {
    updateQty(id, qty - 1);
  }

  const perks = [
    {
      icon: <Truck className="h-4 w-4" />,
      title: "Pan India delivery",
      sub: "Fast order follow-up after confirmation.",
    },
    {
      icon: <Tag className="h-4 w-4" />,
      title: "Cash on delivery",
      sub: "Simple pay-on-arrival ordering.",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Genuine stock",
      sub: "Built for dependable installs.",
    },
    {
      icon: <RefreshCcw className="h-4 w-4" />,
      title: "Easy support",
      sub: "Quick help if you need changes.",
    },
  ];

  return (
    <div className="container-custom py-8 sm:py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to catalog
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <RevealOnScroll className="overflow-hidden rounded-lg border border-white/70 bg-[linear-gradient(180deg,#f5fbf3_0%,#eaf5ea_100%)] p-4 shadow-[0_24px_60px_-32px_rgba(21,128,61,0.38)] sm:p-6">
          <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-white/60 bg-white/70 p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(187,247,208,0.72),transparent_48%)]" />
            <img
              src={product.image}
              alt={product.name}
              className="relative z-10 h-full w-full object-contain"
              onError={(event) => {
                event.target.src =
                  "https://placehold.co/500x500/f3f4f6/94a3b8?text=No+Image";
              }}
            />
            {discount > 0 && !isOutOfStock && (
              <div className="absolute left-4 top-4 rounded-full bg-lime-300 px-3 py-1 text-xs font-semibold text-slate-950">
                Save {discount}%
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                Out of stock
              </div>
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <div className="card p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
              <span>{product.category}</span>
              {product.brand && <span className="text-slate-400">{product.brand}</span>}
            </div>

            <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
              {product.name}
            </h1>

            <div className="mt-6 rounded-lg border border-brand-100 bg-brand-50 p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-4xl font-semibold text-slate-950">
                  ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </span>
                {discount > 0 && (
                  <>
                    <span className="pb-1 text-lg text-slate-400 line-through">
                      ₹{Number(product.mrp).toLocaleString("en-IN")}
                    </span>
                    <span className="rounded-full bg-lime-300 px-2.5 py-1 text-xs font-semibold text-slate-950">
                      {discount}% off
                    </span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <p className="mt-2 text-sm font-medium text-brand-800">
                  You save ₹{savings.toLocaleString("en-IN")}
                </p>
              )}
            </div>

            <div className="mt-5">
              {isOutOfStock ? (
                <span className="badge-red px-3 py-1 text-sm">Currently unavailable</span>
              ) : stock <= 10 ? (
                <span className="badge bg-amber-100 px-3 py-1 text-sm text-amber-700">
                  Only {stock} left
                </span>
              ) : (
                <span className="badge-green px-3 py-1 text-sm">
                  In stock ({stock} units)
                </span>
              )}
            </div>

            {product.description && (
              <p className="mt-6 border-l-2 border-brand-200 pl-4 text-sm leading-7 text-slate-600">
                {product.description}
              </p>
            )}

            {!isOutOfStock && (
              <div className="mt-8">
                {qty > 0 ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-800 shadow-sm hover:bg-brand-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-xl font-semibold text-slate-950">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        disabled={qty >= stock}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-800 shadow-sm hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Link to="/cart" className="btn-primary sm:min-w-[180px]">
                      <ShoppingCart className="h-4 w-4" />
                      View cart
                    </Link>
                  </div>
                ) : (
                  <button type="button" onClick={handleAdd} className="btn-primary w-full">
                    <ShoppingCart className="h-5 w-5" />
                    Add to cart
                  </button>
                )}
              </div>
            )}

            {isOutOfStock && (
              <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                This item is out of stock right now. Browse the catalog for similar
                options or check back later.
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {perks.map((perk, index) => (
                <RevealOnScroll
                  key={perk.title}
                  delay={index * 80}
                  className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
                    {perk.icon}
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{perk.title}</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">{perk.sub}</p>
                </RevealOnScroll>
              ))}
            </div>

            {inCart && qty > 0 && (
              <button
                type="button"
                onClick={() => navigate("/cart")}
                className="btn-secondary mt-6 w-full"
              >
                Review cart and checkout
              </button>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
}
