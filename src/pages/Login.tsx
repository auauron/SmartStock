import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { LoginOpsShowcase } from "../components/auth/LoginOpsShowcase";
import { Button } from "../components/ui/Button";
import { CheckboxField } from "../components/ui/CheckboxField";
import { InputField } from "../components/ui/InputField";
import { useAuthStore } from "../stores/authStore";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, signIn, clearError } = useAuthStore();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signIn(email, password);

    if (!success) {
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-[minmax(0,28rem)_1fr]">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10 xl:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-emerald-600 transition-colors hover:text-emerald-500"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-xl shadow-gray-200/50 sm:px-7">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {error}
                </p>
              ) : null}

              <InputField
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                icon={Mail}
                value={email}
                onChange={(e) => {
                  if (error) {
                    clearError();
                  }
                  setEmail(e.target.value);
                }}
                placeholder="you@example.com"
              />

              <InputField
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                label="Password"
                icon={Lock}
                value={password}
                onChange={(e) => {
                  if (error) {
                    clearError();
                  }
                  setPassword(e.target.value);
                }}
                placeholder="••••••••"
              />

              <div className="flex items-center justify-between gap-4">
                <CheckboxField
                  id="remember-me"
                  name="remember-me"
                  label="Remember me"
                />

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <Button type="submit" disabled={loading} fullWidth>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <LoginOpsShowcase />
    </div>
  );
}
