import { Link } from "react-router-dom";
import { Leaf, Phone, MapPin, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  const categories = [
    "Connectors & Jointers",
    "HDMI Cables",
    "Power Supply",
    "POE & Switch",
    "Storage",
    "Tools",
  ];

  return (
    <footer className="mt-16 border-t border-white/40 bg-[linear-gradient(180deg,rgba(6,18,12,0.98),rgba(10,35,22,0.98))] text-slate-300">
      <div className="container-custom py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-lg font-semibold text-white">
                  Green Home India
                </span>
                <span className="text-xs uppercase tracking-[0.12em] text-brand-200/70">
                  CCTV | Networking | Electronics
                </span>
              </div>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              Built for everyday installers, resellers, and homeowners who need
              dependable hardware with quick support and reliable delivery.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-white/90">
              Popular Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-slate-400 hover:text-brand-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-white/90">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 text-lime-300" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="mt-0.5 h-4 w-4 text-lime-300" />
                <span>WhatsApp available for quick support</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-lime-300" />
                <span>Serving customers across India</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 text-lime-300" />
                <span>support@greenhomeindia.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Green Home India. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>Cash on delivery</span>
            <span>Fast dispatch</span>
            <span>Genuine stock</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
