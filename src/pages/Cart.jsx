import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";

function CartItem({ item }) {
  const { removeItem, updateQty } = useCart();

  function handleRemove() {
    removeItem(item.id);
    toast.success(`${item.name} removed`);
  }

  const lineTotal = item.price * item.qty;

  return (
    <div className="card flex gap-3 sm:gap-4 p-3 sm:p-4 animate-fade-in">
      {/* Image */}
      <Link
        to={`/product/${item.id}`}
        className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl flex-shrink-0 overflow-hidden border border-gray-100"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-1.5"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/96x96/f3f4f6/94a3b8?text=Img";
          }}
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.id}`}
          className="font-semibold text-gray-800 hover:text-brand-700 text-sm sm:text-base line-clamp-2 leading-snug transition-colors"
        >
          {item.name}
        </Link>
        <p className="text-xs text-brand-600 mt-0.5 font-medium">{item.category}</p>
        <p className="text-xs text-gray-400 mt-0.5">Unit: ₹{Number(item.price).toLocaleString("en-IN")}</p>

        {/* Qty + remove row */}
        <div className="flex items-center justify-between mt-3">
          {/* Qty stepper */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl px-1 py-0.5">
            <button
              onClick={() => updateQty(item.id, item.qty - 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-600 active:scale-90"
              aria-label="Decrease"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center font-bold text-sm">{item.qty}</span>
            <button
              onClick={() => {
                if (item.qty < item.stock) updateQty(item.id, item.qty + 1);
                else toast.error("Max stock reached");
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-gray-600 active:scale-90"
              aria-label="Increase"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Line total + remove */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-sm sm:text-base">
              ₹{lineTotal.toLocaleString("en-IN")}
            </span>
            <button
              onClick={handleRemove}
              className="text-gray-300 hover:text-red-500 transition-colors"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cart, subtotal, itemCount, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="w-9 h-9 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-400 text-sm mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/" className="btn-primary">
            <ShoppingBag className="w-4 h-4" />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 sm:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Cart{" "}
          <span className="text-lg font-normal text-gray-400">
            ({itemCount} item{itemCount !== 1 && "s"})
          </span>
        </h1>
        <button
          onClick={() => {
            if (confirm("Clear your entire cart?")) {
              clearCart();
              toast.success("Cart cleared");
            }
          }}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear all
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
        {/* ── Cart Items ── */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 font-medium transition-colors mt-2"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* ── Order Summary ── */}
        <div className="card p-5 h-fit lg:sticky lg:top-24">
          <h2 className="font-bold text-lg text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Order Summary
          </h2>

          {/* Item breakdown */}
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-500 line-clamp-1 flex-1 mr-3">
                  {item.name}
                  <span className="text-gray-400"> ×{item.qty}</span>
                </span>
                <span className="font-medium text-gray-700 flex-shrink-0">
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 pt-3 space-y-2 mb-5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-medium text-gray-700">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery charges</span>
              <span className="text-gray-400 italic">At checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
              <span>Total</span>
              <span className="text-brand-700">
                ₹{subtotal.toLocaleString("en-IN")}+
              </span>
            </div>
          </div>

          {/* COD badge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700 text-center font-medium">
            💵 Cash on Delivery — Pay when your order arrives
          </div>

          {/* Checkout button */}
          <Link to="/checkout" className="btn-primary w-full py-3.5 text-base">
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
