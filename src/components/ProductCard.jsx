import { Link } from "react-router-dom";
import { ShoppingCart, Eye, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

function getStockNum(stock) {
  if (stock === undefined || stock === null) return 50;
  const num = Number(stock);
  return Number.isNaN(num) ? 50 : num;
}

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCart();
  const stock = getStockNum(product.stock);
  const isOutOfStock =
    stock <= 0 || String(product.status).toLowerCase() === "out of stock";
  const inCart = isInCart(product.id);

  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock) return;

    addItem({ ...product, stock });
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/70 bg-white/85 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(21,128,61,0.45)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[linear-gradient(180deg,#f5fbf3_0%,#edf6ec_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(187,247,208,0.55),transparent_44%)]" />
        <img
          src={product.image}
          alt={product.name}
          className="relative z-10 h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(event) => {
            event.target.src =
              "https://placehold.co/300x300/f3f4f6/94a3b8?text=No+Image";
          }}
        />

        <div className="absolute left-3 top-3 z-20 flex flex-col gap-2">
          {isOutOfStock && <span className="badge-red">Out of Stock</span>}
          {!isOutOfStock && discount > 0 && (
            <span className="badge bg-lime-300 text-slate-900">{discount}% OFF</span>
          )}
        </div>

        <div className="absolute inset-x-3 bottom-3 z-20 flex translate-y-2 items-center justify-center opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/85 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
            <Eye className="h-3.5 w-3.5" />
            Open details
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-700">
            {product.category}
          </span>
          <span className="text-[11px] text-slate-400">
            {product.brand || "Green Home"}
          </span>
        </div>

        <h3 className="min-h-[44px] text-sm font-semibold leading-6 text-slate-900 transition group-hover:text-brand-800">
          {product.name}
        </h3>

        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-semibold text-slate-950">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className="pb-0.5 text-xs text-slate-400 line-through">
              ₹{Number(product.mrp).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${
            isOutOfStock
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : inCart
                ? "border border-brand-200 bg-brand-50 text-brand-800 hover:bg-brand-100"
                : "bg-slate-950 text-white hover:bg-brand-800"
          }`}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : inCart ? (
            <>
              <CheckCircle className="h-4 w-4" />
              In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
