import { Link } from "react-router";
import { Compass } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Compass className="h-6 w-6" />
        </div>

        <h1 className="text-2xl font-semibold text-slate-900">404 Not Found</h1>
        <p className="mt-3 text-slate-600">
          The page you requested could not be found.
        </p>


        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
