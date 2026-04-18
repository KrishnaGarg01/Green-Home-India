import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchProduct } from "../utils/api";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  ArrowLeft,
  Minus,
  Plus,
  CheckCircle,
  Truck,
  Shield,
  RefreshCcw,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

function Skeleton() {
  return (
    <div className="container-custom py-8 animate-pulse">
      <div className="skeleton h-4 w-32 rounded mb-6" />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        <div className="skeleton aspect-square rounded-2xl" />
        <div className="space-y-4 pt-2">
          <div className="skeleton h-3 w-1/3 rounded" />
          <div className="skeleton h-8 rounded" />
          <div className="skeleton h-8 w-1/2 rounded" />
          <div className="skeleton h-5 w-1/4 rounded" />
          <div className="skeleton h-24 rounded" />
          <div className="skeleton h-12 rounded-xl" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[1,2,3,4].map(i=><div key={i} className="skeleton h-16 rounded-xl" />)}
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
  const inCart = isInCart(id);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    fetchProduct(id).then((res) => {
      if (res.success && res.product) {
        setProduct(res.product);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <Skeleton />;

  if (notFound) {
    return (
      <div className="container-custom py-20 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Product not found</h2>
        <p className="text-gray-400 mb-6">This product may have been removed or the link is incorrect.</p>
        <Link to="/" className="btn-primary">Back to Store</Link>
      </div>
    );
  }

  const stock = Number(product.stock) ?? 50;
  const isOOS =
    stock <= 0 ||
    String(product.status).toLowerCase() === "out of stock";

  const discount =
    product.mrp && Number(product.mrp) > Number(product.price)
      ? Math.round(
          ((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100
        )
      : 0;

  const savings = discount > 0 ? Number(product.mrp) - Number(product.price) : 0;

  function handleAdd() {
    addItem({ ...product, stock });
    toast.success(`${product.name} added to cart!`);
  }

  function handleIncrease() {
    if (qty < stock) updateQty(id, qty + 1);
    else toast.error("Max stock reached");
  }

  function handleDecrease() {
    updateQty(id, qty - 1);
  }

  const perks = [
    { icon: <Truck className="w-4 h-4" />, title: "Pan India Delivery", sub: "Fast & reliable shipping" },
    { icon: <Tag className="w-4 h-4" />, title: "COD Available", sub: "Pay on delivery" },
    { icon: <Shield className="w-4 h-4" />, title: "Genuine Product", sub: "Quality assured" },
    { icon: <RefreshCcw className="w-4 h-4" />, title: "Easy Returns", sub: "Hassle-free process" },
  ];

  return (
    <div className="container-custom py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm mb-6 text-gray-400">
        <Link to="/" className="hover:text-brand-700 transition-colors">Home</Link>
        <span>/</span>
        <button
          onClick={() => navigate(`/?category=${encodeURIComponent(product.category)}`)}
          className="hover:text-brand-700 transition-colors"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14 animate-fade-in">
        {/* ── Product Image ── */}
        <div className="relative">
          <div className="card bg-gray-50 aspect-square flex items-center justify-center p-8 sm:p-12">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/500x500/f3f4f6/94a3b8?text=No+Image";
              }}
            />
          </div>

          {/* Discount badge overlay */}
          {discount > 0 && !isOOS && (
            <div className="absolute top-4 left-4 bg-brand-700 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-md">
              {discount}% OFF
            </div>
          )}
          {isOOS && (
            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-md">
              Out of Stock
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="flex flex-col">
          {/* Category & Brand */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-brand-600 text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>
            {product.brand && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-gray-400 text-xs">{product.brand}</span>
              </>
            )}
          </div>

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4 text-balance">
            {product.name}
          </h1>

          {/* Price block */}
          <div className="bg-brand-50 rounded-2xl p-4 mb-4">
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-4xl font-extrabold text-gray-900">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through pb-0.5">
                    ₹{Number(product.mrp).toLocaleString("en-IN")}
                  </span>
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-2.5 py-1 rounded-lg">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm text-green-600 font-medium mt-1">
                🎉 You save ₹{savings.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-5">
            {isOOS ? (
              <span className="badge-red text-sm px-3 py-1">⛔ Out of Stock</span>
            ) : stock <= 10 ? (
              <span className="badge bg-orange-100 text-orange-700 text-sm px-3 py-1">
                ⚡ Only {stock} left
              </span>
            ) : (
              <span className="badge-green text-sm px-3 py-1">
                ✅ In Stock ({stock} units)
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-500 leading-relaxed text-sm mb-6 border-l-2 border-brand-200 pl-4">
              {product.description}
            </p>
          )}

          {/* Cart controls */}
          {!isOOS && (
            <div className="mb-6">
              {qty > 0 ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2">
                    <button
                      onClick={handleDecrease}
                      className="w-9 h-9 rounded-xl bg-white shadow-sm text-brand-700 font-bold flex items-center justify-center hover:bg-brand-50 active:scale-95 transition-all"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{qty}</span>
                    <button
                      onClick={handleIncrease}
                      disabled={qty >= stock}
                      className="w-9 h-9 rounded-xl bg-white shadow-sm text-brand-700 font-bold flex items-center justify-center hover:bg-brand-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to="/cart"
                    className="btn-primary py-3 px-6 flex-1 sm:flex-initial"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    View Cart
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleAdd}
                  className="btn-primary w-full py-4 text-base"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              )}
            </div>
          )}

          {isOOS && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-700 font-semibold text-sm">
                This product is currently out of stock.
              </p>
              <p className="text-red-500 text-xs mt-0.5">Check back soon or browse similar products.</p>
            </div>
          )}

          {/* Perks grid */}
          <div className="grid grid-cols-2 gap-3">
            {perks.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3 border border-gray-100"
              >
                <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
