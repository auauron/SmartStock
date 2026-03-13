import type { ReactNode } from "react";

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
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden">
            <img
              src="/smartstock.png"
              alt="Smart Stock logo"
              className="h-10 w-10 object-contain scale-110"
            />
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
