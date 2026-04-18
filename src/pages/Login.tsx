import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell";
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
    <AuthShell
      title="Welcome back"
      subtitle={
        <>
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-emerald-600 hover:text-emerald-500"
          >
            Sign up for free
          </Link>
        </>
      }
    >
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


    </AuthShell>
  );
}
