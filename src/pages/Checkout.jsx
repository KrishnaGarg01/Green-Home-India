import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../utils/api";
import {
  Truck,
  User,
  Phone,
  MapPin,
  ArrowLeft,
  Loader2,
  CheckCircle,
  IndianRupee,
  ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import RevealOnScroll from "../components/RevealOnScroll.jsx";

function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function Checkout() {
  const { cart, subtotal, clearCart, itemCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});

  const deliveryNum = Number(delivery) || 0;
  const total = subtotal + deliveryNum;

  function set(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((current) => ({ ...current, [field]: "" }));
      }
    };
  }

  function validate() {
    const nextErrors = {};
    const nameTrim = form.name.trim();
    const phoneTrim = form.phone.trim().replace(/\s|-/g, "");
    const addressTrim = form.address.trim();

    if (!nameTrim) {
      nextErrors.name = "Full name is required";
    } else if (nameTrim.length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }

    if (!phoneTrim) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneTrim)) {
      nextErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!addressTrim) {
      nextErrors.address = "Delivery address is required";
    } else if (addressTrim.length < 15) {
      nextErrors.address = "Please enter a complete address";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fix the form before placing the order");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      const response = await placeOrder({
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim().replace(/\s|-/g, ""),
          address: form.address.trim(),
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        subtotal,
        delivery: deliveryNum,
        total,
      });

      if (response.success) {
        clearCart();
        navigate("/order-success", {
          state: {
            orderId: response.orderId,
            name: form.name.trim(),
            total,
          },
          replace: true,
        });
      } else {
        toast.error(response.error || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-slate-300" />
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">
          Nothing to check out yet.
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Add products to your cart and return here when you are ready.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 sm:py-10">
      <Link
        to="/cart"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <RevealOnScroll className="mt-6 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
          Checkout
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl">
          Confirm details and place the order.
        </h1>
        <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
          {[
            { step: "1", label: "Cart", active: true },
            { step: "2", label: "Details", active: true },
            { step: "3", label: "Confirm", active: false },
          ].map((item) => (
            <div
              key={item.step}
              className={`rounded-lg border px-4 py-3 ${
                item.active
                  ? "border-brand-200 bg-brand-50 text-brand-800"
                  : "border-slate-200 bg-white/70 text-slate-400"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.12em]">Step {item.step}</p>
              <p className="mt-1 font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <RevealOnScroll className="card p-6 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
                <User className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Customer details</h2>
                <p className="text-sm text-slate-500">
                  Use the same phone number you want the confirmation call on.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Field label="Full Name" error={errors.name} required>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    className={`input-field pl-10 ${errors.name ? "border-red-300 focus:ring-red-100" : ""}`}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
              </Field>

              <Field label="Mobile Number" error={errors.phone} required>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    className={`input-field pl-10 ${errors.phone ? "border-red-300 focus:ring-red-100" : ""}`}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                  />
                </div>
              </Field>

              <Field label="Delivery Address" error={errors.address} required>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-400" />
                  <textarea
                    value={form.address}
                    onChange={set("address")}
                    className={`input-field h-32 resize-none pl-10 ${errors.address ? "border-red-300 focus:ring-red-100" : ""}`}
                    placeholder="House number, street, area, city, state, PIN code"
                    autoComplete="street-address"
                  />
                </div>
              </Field>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={80} className="card p-6 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
                <Truck className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Delivery charge</h2>
                <p className="text-sm text-slate-500">
                  Add the agreed delivery amount or leave it at zero.
                </p>
              </div>
            </div>

            <Field label="Delivery Charge (₹)">
              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  value={delivery}
                  onChange={(event) => setDelivery(event.target.value)}
                  className="input-field pl-10"
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
            </Field>
          </RevealOnScroll>

          <RevealOnScroll delay={140} className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">Cash on delivery</p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  This order uses COD only. No online payment is required during
                  checkout.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Placing your order...
              </>
            ) : (
              <>Place order - ₹{total.toLocaleString("en-IN")}</>
            )}
          </button>
        </form>

        <RevealOnScroll delay={120}>
          <aside className="card p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-semibold text-slate-950">Order summary</h2>
            <p className="mt-1 text-sm text-slate-500">
              {itemCount} item{itemCount !== 1 && "s"} in this order.
            </p>

            <div className="mt-6 space-y-3 border-y border-slate-100 py-5">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-white/60 bg-[linear-gradient(180deg,#f5fbf3_0%,#edf6ec_100%)] p-1.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        event.target.src =
                          "https://placehold.co/48x48/f3f4f6/94a3b8?text=Img";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      x{item.qty} · ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                  </div>
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
                <span className={deliveryNum === 0 ? "font-medium text-brand-700" : "font-medium text-slate-900"}>
                  {deliveryNum === 0 ? "Free" : `₹${deliveryNum.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-950">
                <span>Total payable</span>
                <span className="text-brand-800">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>
        </RevealOnScroll>
      </div>
    </div>
  );
}
