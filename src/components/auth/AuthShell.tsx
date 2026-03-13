import type { ReactNode } from "react";
import { Package } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600">
            <Package className="h-7 w-7 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {title}
        </h2>
        <div className="mt-2 text-center text-sm text-gray-600">{subtitle}</div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
