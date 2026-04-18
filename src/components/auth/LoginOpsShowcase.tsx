import {
  CheckCircle2,
  Clock3,
  Siren,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const activity = [
  {
    id: "a1",
    title: "Low-stock alert detected",
    detail: "Rice 25kg is below minimum stock",
    time: "3 mins ago",
    tone: "text-amber-700",
    dot: "bg-amber-500",
  },
  {
    id: "a2",
    title: "Restock recorded",
    detail: "Beverages +42 units added",
    time: "26 mins ago",
    tone: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    id: "a3",
    title: "Inventory sync complete",
    detail: "All items and trends are up to date",
    time: "1 hour ago",
    tone: "text-blue-700",
    dot: "bg-blue-500",
  },
];

export function LoginOpsShowcase() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden lg:flex lg:items-center lg:px-14 xl:px-20">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/55 via-white to-sky-100/45" />
      <div className="absolute inset-0 opacity-24 [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.32)_1px,transparent_0)] [background-size:22px_22px]" />
      <div className="absolute right-8 top-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute left-8 bottom-14 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />
      <div className="absolute -left-18 top-1/3 h-72 w-72 rounded-full bg-emerald-100/35 blur-3xl" />

      <div className="relative z-10 w-full max-w-xl">
        <h2 className="mt-5 text-4xl font-semibold leading-tight text-gray-900 xl:text-5xl">
          Pick up where your inventory left off.
        </h2>

        <div className="mt-9 rounded-2xl border border-gray-200 bg-white/95 p-6 shadow-[0_24px_45px_-28px_rgba(17,24,39,0.45)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Operations Pulse
              </p>
              <h3 className="mt-1.5 text-xl font-semibold text-gray-900">
                Today at a glance
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Live
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Stock Alerts
              </p>
              <p className="mt-1 text-xl font-bold text-amber-700">17</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wide text-gray-500">
                Weekly Restock
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-700">84</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {activity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5"
              >
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.dot}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${item.tone}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="inline-flex items-center justify-center gap-1 rounded-md bg-emerald-50 px-2 py-1.5 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5" />
              Trends
            </div>
            <div className="inline-flex items-center justify-center gap-1 rounded-md bg-blue-50 px-2 py-1.5 text-[11px] font-semibold text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Insights
            </div>
            <div className="inline-flex items-center justify-center gap-1 rounded-md bg-amber-50 px-2 py-1.5 text-[11px] font-semibold text-amber-700">
              <Siren className="h-3.5 w-3.5" />
              Alerts
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-gray-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Stable and synced. Ready to continue operations.
          </div>
        </div>
      </div>
    </div>
  );
}
