import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Home, Phone, Clock, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirect if arrived here without order state (e.g. direct URL visit)
  useEffect(() => {
    if (!state?.orderId) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.orderId) return null;

  const orderId = state.orderId;
  const name = state.name || "Customer";
  const total = state.total;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container-custom py-12 sm:py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Success icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <span className="absolute -top-1 -right-1 text-2xl">🎉</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 mb-8">
          Thank you, <strong className="text-gray-700">{name}</strong>! Your
          order has been received and will be processed shortly.
        </p>

        {/* Order card */}
        <div className="card p-5 sm:p-6 mb-6 text-left">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-brand-600" />
            <h2 className="font-bold text-gray-800">Order Details</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Order ID</span>
              <span className="font-bold text-gray-800 font-mono text-sm bg-gray-50 px-2 py-1 rounded-lg">
                {orderId}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Date &amp; Time</span>
              <span className="text-sm font-medium text-gray-700">
                {dateStr}, {timeStr}
              </span>
            </div>

            {total !== undefined && (
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">Amount Payable</span>
                <span className="text-lg font-extrabold text-brand-700">
                  ₹{Number(total).toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">Payment Method</span>
              <span className="badge bg-amber-100 text-amber-700 font-semibold">
                💵 Cash on Delivery
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-500">Status</span>
              <span className="badge-green font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="card p-5 mb-6 bg-brand-50 border-brand-100 text-left">
          <h3 className="font-bold text-brand-800 mb-3 text-sm">
            📋 What happens next?
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: <Phone className="w-4 h-4" />,
                title: "Confirmation Call",
                desc: "Our team will call you to confirm the order and delivery address.",
              },
              {
                icon: <Package className="w-4 h-4" />,
                title: "Order Packed",
                desc: "Your items will be carefully packed and dispatched.",
              },
              {
                icon: <Clock className="w-4 h-4" />,
                title: "Delivery",
                desc: "Delivered to your address within the agreed timeline. Pay in cash.",
              },
            ].map((step) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 flex-shrink-0 mt-0.5">
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-800">
                    {step.title}
                  </p>
                  <p className="text-xs text-brand-600 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="btn-primary flex-1 py-3.5 text-base">
            <Home className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Order ID: <span className="font-mono">{orderId}</span> · Please save
          this for reference.
        </p>
      </div>
    </div>
  );
}
