import { Leaf } from "lucide-react";

export default function RouteLoader({ active }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[70] transition-all duration-300 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!active}
    >
      <div className="absolute inset-0 bg-[rgba(5,18,12,0.24)] backdrop-blur-md" />
      <div className="absolute left-1/2 top-1/2 w-[min(90vw,320px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/25 bg-[rgba(8,28,18,0.88)] p-5 text-white shadow-2xl shadow-brand-950/30">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/20 text-brand-100">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-brand-100">
              Green Home India
            </p>
            <p className="text-lg font-semibold text-white">Loading your next view</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-full bg-white/10">
          <div
            className={`route-loader-bar h-1.5 rounded-full bg-gradient-to-r from-brand-300 via-lime-300 to-emerald-100 ${
              active ? "animate-loader-progress" : ""
            }`}
          />
        </div>

        <div className="mt-4 flex gap-2">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-2 w-2 rounded-full bg-brand-200/75 animate-loader-dot"
              style={{ animationDelay: `${item * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
