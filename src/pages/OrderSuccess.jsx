import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Package, Home, Phone, Clock } from "lucide-react";
import RevealOnScroll from "../components/RevealOnScroll.jsx";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.orderId) {
      navigate("/", { replace: true });
    }
  }, [navigate, state]);

  if (!state?.orderId) return null;

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

  const steps = [
    {
      icon: <Phone className="h-4 w-4" />,
      title: "Confirmation call",
      desc: "The store will verify order and delivery details.",
    },
    {
      icon: <Package className="h-4 w-4" />,
      title: "Packing and dispatch",
      desc: "Your selected products are prepared for shipment.",
    },
    {
      icon: <Clock className="h-4 w-4" />,
      title: "Delivery",
      desc: "Pay on delivery when the order reaches you.",
    },
  ];

  return (
    <div className="container-custom py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <RevealOnScroll className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-100">
            <CheckCircle className="h-12 w-12 text-brand-700" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-brand-700">
            Order confirmed
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">
            Thanks, {state.name || "Customer"}.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Your order has been received successfully and the team will contact
            you shortly to confirm delivery details.
          </p>
        </RevealOnScroll>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <RevealOnScroll className="card p-6 sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
                <Package className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-semibold text-slate-950">Order details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 text-sm">
                <span className="text-slate-500">Order ID</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-900">
                  {state.orderId}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 text-sm">
                <span className="text-slate-500">Placed on</span>
                <span className="font-medium text-slate-900">
                  {dateStr}, {timeStr}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 text-sm">
                <span className="text-slate-500">Amount payable</span>
                <span className="text-lg font-semibold text-brand-800">
                  ₹{Number(state.total || 0).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-slate-500">Payment</span>
                <span className="badge bg-amber-100 text-amber-700">
                  Cash on delivery
                </span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100} className="card p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-950">What happens next</h2>
            <div className="mt-6 space-y-5">
              {steps.map((step, index) => (
                <RevealOnScroll
                  key={step.title}
                  delay={index * 90}
                  className="flex items-start gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-800">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{step.desc}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={160} className="mt-8 flex justify-center">
          <Link to="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Continue shopping
          </Link>
        </RevealOnScroll>
      </div>
    </div>
  );
}
