import { Link } from "react-router";
import {
  Package,
  BarChart3,
  Bell,
  Shield,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function Landing() {
  const featureTones = [
    {
      iconWrap: "bg-emerald-100 group-hover:bg-emerald-200",
      borderAccent: "before:bg-emerald-500",
      iconColor: "text-emerald-600",
    },
    {
      iconWrap: "bg-amber-100 group-hover:bg-amber-200",
      borderAccent: "before:bg-amber-500",
      iconColor: "text-amber-600",
    },
    {
      iconWrap: "bg-blue-100 group-hover:bg-blue-200",
      borderAccent: "before:bg-blue-500",
      iconColor: "text-blue-600",
    },
    {
      iconWrap: "bg-slate-100 group-hover:bg-slate-200",
      borderAccent: "before:bg-slate-500",
      iconColor: "text-slate-600",
    },
  ] as const;

  const features = [
    {
      icon: BarChart3,
      title: "Dashboard + Smart Analytics",
      description:
        "See your stock value, low-stock items, weekly restocks, and recent activity in one quick view.",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description:
        "Add, update, search, and organize products easily so your inventory stays accurate.",
    },
    {
      icon: Bell,
      title: "Restock Tracking",
      description:
        "Record every restock and review your history by item and date whenever you need it.",
    },

    {
      icon: Shield,
      title: "Secure Access & Alerts",
      description:
        "Sign in securely and get alerts for low stock and recent restocks so nothing is missed.",
    },
  ];

  const benefits = [
    "Secure account sign in",
    "Simple dashboard overview",
    "Fast product updates",
    "Restock history you can review anytime",
    "Works on desktop and mobile",
    "Faster returning user experience",
  ];

  const flow = [
    {
      title: "Create your workspace",
      description:
        "Sign up and set your business profile so your dashboard starts with your context.",
    },
    {
      title: "Add and organize inventory",
      description:
        "Track item quantity, category, pricing, and minimum stock levels in one place.",
    },
    {
      title: "Monitor and restock",
      description:
        "Use low-stock alerts and restock history to keep shelves ready without overstocking.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-20 border-b border-gray-200/90 bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                <img
                  src="/smartstock.png"
                  alt="Smart Stock logo"
                  className="w-8 h-8 object-contain scale-110"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Smart Stock
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium transition-colors hover:bg-gray-50"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/70 via-white to-white" />
        <div className="absolute inset-0 -z-10 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.35)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute -left-10 top-20 -z-10 h-56 w-56 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute -right-24 top-12 -z-10 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Run your stock room
              <span className="block text-emerald-600">
                like a control center
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-gray-600">
              Smart Stock gives you one operational view for alerts, movement,
              and restock planning so decisions feel fast and clear.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-7 py-3 text-base font-medium text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Already registered?{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-700 hover:text-emerald-600"
              >
                Log in here
              </Link>
            </p>

            <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Operational status
                </p>
                <p className="mt-1 text-lg font-bold text-emerald-700">
                  Live now
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Critical alerts
                </p>
                <p className="mt-1 text-lg font-bold text-amber-700">
                  Prioritized
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Restock planning
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  Trend-based
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <LandingShowcase />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden bg-gray-50 py-18 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.16)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Core Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Features for Daily Inventory Work
            </h2>
            <p className="text-lg text-gray-600">
              Built to help small businesses manage stock with less manual work.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const tone = featureTones[index % featureTones.length];

              return (
                <div
                  key={index}
                  className={`group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-l-xl ${tone.borderAccent}`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${tone.iconWrap}`}
                  >
                    <Icon className={`w-6 h-6 ${tone.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-emerald-50/40 to-white" />
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <p className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Workflow
            </p>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              How Smart Stock Works
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              A simple workflow built for day-to-day inventory operations.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16.66%] right-[16.66%] top-4 hidden h-px bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 md:block" />
            {flow.map((step, index) => (
              <div
                key={step.title}
                className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Why Teams Choose It
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Small Business Success
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Smart Stock helps you stay organized, save time, and make better
                business decisions with our intuitive inventory management
                platform.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 p-8 lg:p-10">
              <div className="rounded-xl border border-white/90 bg-white/95 p-6 shadow-lg shadow-emerald-100/60">
                <p className="text-sm font-semibold text-gray-500">
                  At a glance
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Products
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      1,248
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Low Stock Items
                    </span>
                    <span className="text-2xl font-bold text-yellow-600">
                      23
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Inventory Value
                    </span>
                    <span className="text-2xl font-bold text-emerald-600">
                      PHP 1.24M
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                      <span>Stock health</span>
                      <span>88%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div className="h-2 w-[88%] rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
                      <span>Restock completion</span>
                      <span>74%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div className="h-2 w-[74%] rounded-full bg-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-emerald-600 py-18 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:22px_22px]" />
        <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-emerald-400/40 blur-3xl" />
        <div className="absolute -right-10 top-0 h-52 w-52 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Inventory?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Create your account and start organizing inventory in minutes.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg shadow-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
              <img
                src="/smartstock.png"
                alt="Smart Stock logo"
                className="w-8 h-8 object-contain scale-110"
              />
            </div>
            <span className="text-xl font-semibold text-white">
              Smart Stock
            </span>
          </div>
          <p className="text-sm">© 2026 Smart Stock. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const chartHeights = [30, 56, 50, 78, 52, 74, 66, 44];

function LandingShowcase() {
  return (
    <div className="relative h-full w-full overflow-visible p-2 sm:p-6">
      <div
        aria-hidden="true"
        className="absolute right-[-2%] top-[5%] h-72 w-72 rounded-full bg-emerald-100/70 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[10%] right-[12%] h-80 w-80 rounded-full bg-emerald-200/60 blur-[95px]"
      />
      <div
        aria-hidden="true"
        className="absolute left-[8%] top-[16%] h-96 w-72 rounded-[44%] bg-emerald-200/70"
      />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="relative w-full max-w-184 -rotate-6 rounded-[1.75rem] border border-white/45 bg-white/45 p-3 shadow-[0_30px_70px_-30px_rgba(70,90,68,0.55)] backdrop-blur-lg transition-transform duration-500 hover:-rotate-3">
          <div className="grid gap-2 rounded-3xl bg-white/62 p-3 sm:grid-cols-[3.2rem_1fr_13rem]">
            <div className="rounded-2xl border border-white/70 bg-white/65 p-2">
              <div className="h-6 w-6 rounded-md bg-emerald-400" />
              <div className="mt-4 space-y-2">
                <div className="h-5 w-5 rounded bg-emerald-100/90" />
                <div className="h-5 w-5 rounded bg-emerald-100/90" />
                <div className="h-5 w-5 rounded bg-emerald-100/90" />
              </div>
              <div className="mt-10 h-5 w-5 rounded bg-emerald-100/90" />
            </div>

            <div className="space-y-2">
              <div className="rounded-2xl border border-white/80 bg-white/72 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#1A221D]">Performance chart</p>
                  <span className="rounded-full bg-[#F2E9C8] px-2 py-0.5 text-[10px] font-semibold text-[#8A6C20]">
                    Low Stock
                  </span>
                </div>

                <div className="flex h-36 items-end gap-1.5 rounded-xl bg-emerald-50 p-2">
                  {chartHeights.map((height, index) => (
                    <div key={index} className="flex-1 rounded-t-sm bg-emerald-100">
                      <div
                        style={{ height: `${height}%` }}
                        className="w-full rounded-t-sm bg-emerald-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="h-20 rounded-2xl border border-white/75 bg-linear-to-br from-emerald-100/80 to-white/75" />
                <div className="h-20 rounded-2xl border border-white/75 bg-linear-to-br from-emerald-100/80 to-white/75" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-[7.2rem] rounded-2xl border border-white/80 bg-white/75 p-2">
                <div className="h-full w-full rounded-xl bg-linear-to-br from-emerald-200/55 via-emerald-100/45 to-transparent" />
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/78 p-3">
                <p className="text-xs font-semibold text-[#1A221D]">Recent activity</p>
                <div className="mt-2 space-y-2.5">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-emerald-200" />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-full rounded bg-emerald-100" />
                        <div className="h-1.5 w-2/3 rounded bg-emerald-100/80" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
