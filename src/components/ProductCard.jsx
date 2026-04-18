import { Link } from "react-router-dom";
import { ShoppingCart, Eye, CheckCircle, Tag } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

function getStockNum(stock) {
  if (stock === undefined || stock === null) return 50;
  const n = Number(stock);
  return isNaN(n) ? 50 : n;
}

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCart();
  const stock = getStockNum(product.stock);
  const isOutOfStock = stock <= 0 ||
    String(product.status).toLowerCase() === "out of stock";
  const inCart = isInCart(product.id);

  const discount =
    product.mrp && product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({ ...product, stock });
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="card group flex flex-col hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/300x300/f3f4f6/94a3b8?text=No+Image";
          }}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isOutOfStock && (
            <span className="badge-red text-xs px-2 py-0.5">Out of Stock</span>
          )}
          {!isOutOfStock && discount > 0 && (
            <span className="badge bg-brand-600 text-white text-xs px-2 py-0.5">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Category */}
        <span className="text-xs text-brand-600 font-medium uppercase tracking-wide mb-1">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-auto line-clamp-2 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price?.toLocaleString("en-IN")}
          </span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.mrp?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : inCart
              ? "bg-brand-50 text-brand-700 border-2 border-brand-200 hover:bg-brand-100"
              : "bg-brand-700 hover:bg-brand-800 text-white"
          }`}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : inCart ? (
            <>
              <CheckCircle className="w-4 h-4" />
              In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </Link>
  );
}
