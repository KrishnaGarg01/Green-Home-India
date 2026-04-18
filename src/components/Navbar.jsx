import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Leaf, Menu, X, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [cartAnimating, setCartAnimating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (itemCount !== prevCount) {
      setCartAnimating(true);
      setPrevCount(itemCount);
      const timer = window.setTimeout(() => setCartAnimating(false), 320);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [itemCount, prevCount]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Catalog" },
    { to: "/cart", label: "Cart" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-[rgba(248,250,248,0.76)] backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex min-h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 via-brand-700 to-brand-900 text-white shadow-lg shadow-brand-900/20">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <span className="block truncate text-base font-semibold text-slate-950 sm:text-lg">
                Green Home India
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Sparkles className="h-3 w-3 text-lime-600" />
                Smart gear for modern installs
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    active
                      ? "bg-brand-900 text-white shadow-lg shadow-brand-900/15"
                      : "text-slate-600 hover:bg-white hover:text-brand-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:border-brand-400 hover:text-brand-800"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span
                  className={`absolute -right-2 -top-2 min-w-[22px] rounded-full bg-lime-400 px-1.5 py-1 text-center text-[11px] font-bold leading-none text-slate-950 shadow-md ${
                    cartAnimating ? "cart-bounce" : ""
                  }`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/80 bg-white/75 text-slate-700 shadow-sm md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="panel-blur mb-4 space-y-1 border border-white/80 p-2 md:hidden">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                    active
                      ? "bg-brand-900 text-white"
                      : "text-slate-700 hover:bg-brand-50 hover:text-brand-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
