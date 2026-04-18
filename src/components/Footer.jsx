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
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg leading-none block">
                  Green Home India
                </span>
                <span className="text-xs text-gray-400">
                  Your Trusted Tech Partner
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Supplying quality CCTV accessories, networking equipment, cables,
              and electronics across India. Fast delivery, genuine products.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MessageCircle className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>WhatsApp Available</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>India</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 mt-0.5 text-brand-400 flex-shrink-0" />
                <span>support@greenhomeindia.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Green Home India. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              COD Available
            </span>
            <span>Fast Shipping</span>
            <span>Genuine Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
