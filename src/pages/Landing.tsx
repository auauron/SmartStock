import { Link } from "react-router";
import {
  Package,
  BarChart3,
  Bell,
  Shield,
  Gauge,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function Landing() {
  const features = [
    {
      icon: Package,
      title: "Inventory Tracking",
      description:
        "Track all your products in one place with real-time updates and status monitoring.",
    },
    {
      icon: Bell,
      title: "Low Stock Alerts",
      description:
        "Get instant notifications when products fall below minimum stock levels.",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description:
        "Visualize inventory trends and make data-driven restocking decisions.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Your data is encrypted and backed up automatically for peace of mind.",
    },
  ];

  const benefits = [
    "Supabase-backed authentication",
    "Dashboard with inventory health overview",
    "Inventory CRUD workflows",
    "Restock logging and history tracking",
    "Responsive layout for desktop and mobile",
    "Profile cache for faster user experience",
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
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-18">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/70 via-white to-white" />
        <div className="absolute inset-0 -z-10 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.35)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute -left-10 top-20 -z-10 h-56 w-56 rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute -right-24 top-12 -z-10 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
              <Gauge className="h-3.5 w-3.5" />
              Inventory command board
            </p>

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

          <div className="relative">
            <div className="absolute -left-5 top-4 hidden h-full w-full rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 lg:block" />

            <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_20px_45px_-24px_rgba(17,24,39,0.4)] sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Live Operations
                  </p>
                  <h2 className="mt-1.5 text-xl font-semibold text-gray-900">
                    Today&apos;s board
                  </h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                  Synced
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-medium text-gray-700">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Low-stock queue
                    </span>
                    <span className="font-semibold text-amber-700">
                      17 items
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 w-[58%] rounded-full bg-amber-500" />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-medium text-gray-700">
                      <RefreshCw className="h-4 w-4 text-emerald-600" />
                      Restock completion
                    </span>
                    <span className="font-semibold text-emerald-700">
                      84 units
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 w-[74%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 font-medium text-gray-700">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      Inventory value
                    </span>
                    <span className="font-semibold text-gray-900">
                      PHP 245,400
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div className="h-2 w-[66%] rounded-full bg-blue-500" />
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-gray-100 bg-white px-3 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Board summary
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  View your current stock status, restock history, and inventory
                  in one panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Inventory
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features designed for small business owners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 transition-colors group-hover:bg-emerald-200">
                    <Icon className="w-6 h-6 text-emerald-600" />
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
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              How Smart Stock Works
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              A simple workflow built for day-to-day inventory operations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {flow.map((step, index) => (
              <div
                key={step.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Small Business Success
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Smart Stock helps you stay organized, save time, and make better
                business decisions with our intuitive inventory management
                platform.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-18 px-4 sm:px-6 lg:px-8 bg-emerald-600">
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
