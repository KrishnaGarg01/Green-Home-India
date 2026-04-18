import { Leaf } from "lucide-react";

export default function RouteLoader({ active }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[70] transition-all duration-500 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!active}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(72,187,120,0.18),transparent_28%),linear-gradient(180deg,rgba(3,12,8,0.88),rgba(7,24,16,0.94))] backdrop-blur-md" />
      <div className="absolute inset-x-0 top-1/2 mx-auto w-[min(92vw,430px)] -translate-y-1/2 overflow-hidden rounded-[28px] border border-white/15 bg-[linear-gradient(180deg,rgba(10,34,22,0.94),rgba(6,22,14,0.94))] p-6 text-white shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(163,230,53,0.16),transparent_35%)]" />
        <div className="relative mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-100 ring-1 ring-white/10">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-brand-100">
              Green Home India
            </p>
            <p className="text-2xl font-semibold text-white">Launching your storefront</p>
            <p className="mt-1 text-sm text-slate-300">
              Cleaner browsing, richer visuals, ready in a moment.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-full bg-white/10">
          <div
            className={`route-loader-bar h-2 rounded-full bg-gradient-to-r from-brand-300 via-lime-300 to-emerald-100 ${
              active ? "animate-loader-progress" : ""
            }`}
          />
        </div>

        <div className="relative mt-5 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
            Fixed intro loader
          </p>
          <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-lime-200">
            2 seconds
          </p>
        </div>

        <div className="relative mt-4 flex gap-2">
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
