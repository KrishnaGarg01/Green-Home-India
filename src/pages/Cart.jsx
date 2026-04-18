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
import RevealOnScroll from "../components/RevealOnScroll.jsx";

function CartItem({ item }) {
  const { removeItem, updateQty } = useCart();
  const lineTotal = item.price * item.qty;

  function handleRemove() {
    removeItem(item.id);
    toast.success(`${item.name} removed`);
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          to={`/product/${item.id}`}
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-white/60 bg-[linear-gradient(180deg,#f5fbf3_0%,#edf6ec_100%)] p-2"
        >
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-contain"
            onError={(event) => {
              event.target.src =
                "https://placehold.co/96x96/f3f4f6/94a3b8?text=Img";
            }}
          />
        </Link>

        <div className="flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <Link
                to={`/product/${item.id}`}
                className="text-base font-semibold leading-7 text-slate-900 hover:text-brand-800"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-brand-700">
                {item.category}
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Unit price ₹{Number(item.price).toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <button
                type="button"
                onClick={() => updateQty(item.id, item.qty - 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-800 shadow-sm hover:bg-brand-50"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-lg font-semibold text-slate-950">
                {item.qty}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (item.qty < item.stock) {
                    updateQty(item.id, item.qty + 1);
                    return;
                  }

                  toast.error("Max stock reached");
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-800 shadow-sm hover:bg-brand-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xl font-semibold text-slate-950">
              ₹{lineTotal.toLocaleString("en-IN")}
            </p>
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
        <div className="mx-auto max-w-md">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100">
            <ShoppingCart className="h-9 w-9 text-brand-700" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-950">
            Your cart is waiting.
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Add products from the catalog and come back here when you are ready to
            place an order.
          </p>
          <Link to="/" className="btn-primary mt-8">
            <ShoppingBag className="h-4 w-4" />
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 sm:py-10">
      <RevealOnScroll className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
            Your order
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">
            Cart summary
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {itemCount} item{itemCount !== 1 && "s"} selected for checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm("Clear your entire cart?")) {
              clearCart();
              toast.success("Cart cleared");
            }
          }}
          className="btn-secondary"
        >
          <Trash2 className="h-4 w-4" />
          Clear cart
        </button>
      </RevealOnScroll>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {cart.map((item, index) => (
            <RevealOnScroll key={item.id} delay={index * 70}>
              <CartItem item={item} />
            </RevealOnScroll>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-800 hover:text-brand-900"
          >
            Continue shopping
          </Link>
        </div>

        <RevealOnScroll delay={120}>
          <aside className="card p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold text-slate-950">Order summary</h2>
            <p className="mt-1 text-sm text-slate-500">
              Review your selected products before checkout.
            </p>

            <div className="mt-6 space-y-3 border-y border-slate-100 py-5">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="flex-1 text-slate-600">
                    {item.name} <span className="text-slate-400">x{item.qty}</span>
                  </span>
                  <span className="font-medium text-slate-900">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery</span>
                <span>Added at checkout</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-950">
                <span>Total</span>
                <span className="text-brand-800">
                  ₹{subtotal.toLocaleString("en-IN")}+
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-lime-200 bg-lime-50 p-4 text-sm text-lime-800">
              Cash on delivery is available for this order.
            </div>

            <Link to="/checkout" className="btn-primary mt-6 w-full">
              Proceed to checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </RevealOnScroll>
      </div>
    </div>
  );
}
