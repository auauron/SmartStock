import { Link } from "react-router";
import {
  Package,
  BarChart3,
  Bell,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export function Landing() {
  const features = [
    {
      icon: Package,
      title: "Inventory Tracking",
      description: "Track all your products in one place with real-time updates and status monitoring.",
    },
    {
      icon: Bell,
      title: "Low Stock Alerts",
      description: "Get instant notifications when products fall below minimum stock levels.",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Visualize inventory trends and make data-driven restocking decisions.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is encrypted and backed up automatically for peace of mind.",
    },
  ];

  const benefits = [
    "Easy product management",
    "Automated restock alerts",
    "Detailed reporting",
    "Multi-device access",
    "Export & import data",
    "Priority support",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Smart Inventory</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Manage Your Inventory with{" "}
              <span className="text-emerald-600">Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              The smart way for small businesses to track products, manage restocking, and
              never run out of stock again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link   
                to="dashboard"
                className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
              >
                Start Stocking
                <ArrowRight className="w-5 h-5" />
              </Link>
              
            </div>
            <p className="text-sm text-gray-500 mt-4">
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Inventory
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for small business owners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
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

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for Small Business Success
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Smart Inventory helps you stay organized, save time, and make better
                business decisions with our intuitive inventory management platform.
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
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 lg:p-12">
              <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Products</span>
                  <span className="text-2xl font-bold text-gray-900">1,248</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Low Stock Items</span>
                  <span className="text-2xl font-bold text-yellow-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inventory Value</span>
                  <span className="text-2xl font-bold text-emerald-600">$124.5K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Inventory?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join hundreds of small businesses already using Smart Inventory
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
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">Smart Inventory</span>
          </div>
          <p className="text-sm">
            © 2026 Smart Inventory. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
