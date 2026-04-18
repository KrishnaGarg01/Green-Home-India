import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

// Individual form field component
function Field({ label, error, children, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
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
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      // Clear error on change
      if (errors[field]) setErrors((err) => ({ ...err, [field]: "" }));
    };
  }

  function validate() {
    const e = {};
    const nameTrim = form.name.trim();
    const phoneTrim = form.phone.trim().replace(/\s|-/g, "");
    const addrTrim = form.address.trim();

    if (!nameTrim) {
      e.name = "Full name is required";
    } else if (nameTrim.length < 2) {
      e.name = "Name must be at least 2 characters";
    }

    if (!phoneTrim) {
      e.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phoneTrim)) {
      e.phone = "Enter a valid 10-digit mobile number";
    }

    if (!addrTrim) {
      e.address = "Delivery address is required";
    } else if (addrTrim.length < 15) {
      e.address = "Please enter a complete address (min 15 characters)";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const res = await placeOrder({
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim().replace(/\s|-/g, ""),
          address: form.address.trim(),
        },
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        subtotal,
        delivery: deliveryNum,
        total,
      });

      if (res.success) {
        clearCart();
        navigate("/order-success", {
          state: {
            orderId: res.orderId,
            name: form.name.trim(),
            total,
          },
          replace: true,
        });
      } else {
        toast.error(res.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <ShoppingBag className="w-14 h-14 mx-auto text-gray-200 mb-4" />
        <p className="text-gray-500 text-lg mb-4">Nothing in your cart</p>
        <Link to="/" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-6 sm:py-8">
      {/* Back link */}
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        <span className="flex items-center gap-1.5 text-brand-700 font-semibold">
          <span className="w-6 h-6 bg-brand-700 text-white rounded-full text-xs flex items-center justify-center font-bold">1</span>
          Cart
        </span>
        <div className="flex-1 h-0.5 bg-brand-200 max-w-8" />
        <span className="flex items-center gap-1.5 text-brand-700 font-semibold">
          <span className="w-6 h-6 bg-brand-700 text-white rounded-full text-xs flex items-center justify-center font-bold">2</span>
          Checkout
        </span>
        <div className="flex-1 h-0.5 bg-gray-200 max-w-8" />
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full text-xs flex items-center justify-center font-bold">3</span>
          Confirm
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left: Form ── */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 space-y-5"
          noValidate
        >
          {/* Customer details */}
          <div className="card p-5 sm:p-6">
            <h2 className="font-bold text-base text-gray-900 mb-5 flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-brand-700" />
              </div>
              Your Details
            </h2>

            <div className="space-y-4">
              <Field label="Full Name" error={errors.name} required>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    className={`input-field pl-10 ${errors.name ? "border-red-400 focus:ring-red-300" : ""}`}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>
              </Field>

              <Field label="Mobile Number" error={errors.phone} required>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    className={`input-field pl-10 ${errors.phone ? "border-red-400 focus:ring-red-300" : ""}`}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    maxLength={10}
                    autoComplete="tel"
                  />
                </div>
              </Field>

              <Field label="Delivery Address" error={errors.address} required>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <textarea
                    value={form.address}
                    onChange={set("address")}
                    className={`input-field pl-10 h-28 resize-none ${errors.address ? "border-red-400 focus:ring-red-300" : ""}`}
                    placeholder="House No., Street, Area, City, State, PIN Code"
                    autoComplete="street-address"
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Delivery charge */}
          <div className="card p-5 sm:p-6">
            <h2 className="font-bold text-base text-gray-900 mb-5 flex items-center gap-2">
              <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-brand-700" />
              </div>
              Delivery Charges
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Delivery Charge (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={delivery}
                  onChange={(e) => setDelivery(e.target.value)}
                  className="input-field pl-10"
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Enter the delivery charge as communicated by the seller. Leave
                empty or 0 for free delivery.
              </p>
            </div>
          </div>

          {/* Payment method */}
          <div className="card p-5 sm:p-6 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">💵</span>
              </div>
              <div>
                <p className="font-bold text-amber-800">
                  Cash on Delivery (COD)
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  This store accepts cash payment only at the time of delivery.
                  No online payment is required.
                </p>
              </div>
              <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-base shadow-lg shadow-brand-700/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Placing your order…
              </>
            ) : (
              <>
                Place Order — ₹{total.toLocaleString("en-IN")}
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            By placing this order you agree to receive a confirmation call on
            your mobile number.
          </p>
        </form>

        {/* ── Right: Summary ── */}
        <div className="card p-5 h-fit lg:sticky lg:top-24">
          <h2 className="font-bold text-base text-gray-900 mb-4 pb-3 border-b border-gray-100">
            Order Summary
            <span className="text-sm font-normal text-gray-400 ml-1">
              ({itemCount} item{itemCount !== 1 && "s"})
            </span>
          </h2>

          {/* Items list */}
          <div className="space-y-2.5 mb-4 max-h-52 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-2">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-0.5"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/40x40/f3f4f6/94a3b8?text=·";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    ×{item.qty} · ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Price rows */}
          <div className="border-t border-gray-100 pt-3 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span className="font-medium text-gray-700">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery</span>
              <span className={`font-medium ${deliveryNum === 0 ? "text-green-600" : "text-gray-700"}`}>
                {deliveryNum === 0 ? "FREE" : `₹${deliveryNum.toLocaleString("en-IN")}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2.5 mt-2">
              <span>Total Payable</span>
              <span className="text-brand-700 text-lg">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4">
            🔒 Safe &amp; secure ordering
          </p>
        </div>
      </div>
    </div>
  );
}
