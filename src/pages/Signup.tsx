import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Mail, Lock, User, Building } from "lucide-react";
import { AuthShell } from "../components/auth/AuthShell";
import { Button } from "../components/ui/Button";
import { CheckboxField } from "../components/ui/CheckboxField";
import { FormDivider } from "../components/ui/FormDivider";
import { InputField } from "../components/ui/InputField";
import { useAuthStore } from "../stores/authStore";

export function Signup() {
  const navigate = useNavigate();
  const { loading, error, signUp, clearError } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (error) {
      clearError();
    }

    if (formData.password !== formData.confirmPassword) {
      window.alert("Passwords don't match!");
      return;
    }

    const success = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      businessName: formData.businessName,
    });

    if (!success) {
      return;
    }

    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:text-emerald-500"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        <InputField
          id="fullName"
          name="fullName"
          type="text"
          required
          label="Full Name"
          icon={User}
          value={formData.fullName}
          onChange={(e) => {
            if (error) {
              clearError();
            }
            setFormData({ ...formData, fullName: e.target.value });
          }}
          placeholder="John Doe"
        />

        <InputField
          id="businessName"
          name="businessName"
          type="text"
          required
          label="Business Name"
          icon={Building}
          value={formData.businessName}
          onChange={(e) => {
            if (error) {
              clearError();
            }
            setFormData({ ...formData, businessName: e.target.value });
          }}
          placeholder="My Small Business"
        />

        <InputField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Email address"
          icon={Mail}
          value={formData.email}
          onChange={(e) => {
            if (error) {
              clearError();
            }
            setFormData({ ...formData, email: e.target.value });
          }}
          placeholder="you@example.com"
        />

        <InputField
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          label="Password"
          icon={Lock}
          value={formData.password}
          onChange={(e) => {
            if (error) {
              clearError();
            }
            setFormData({ ...formData, password: e.target.value });
          }}
          placeholder="••••••••"
        />

        <InputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          label="Confirm Password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={(e) => {
            if (error) {
              clearError();
            }
            setFormData({ ...formData, confirmPassword: e.target.value });
          }}
          placeholder="••••••••"
        />

        <CheckboxField
          id="terms"
          name="terms"
          required
          align="start"
          label={
            <>
              I agree to the{" "}
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-emerald-600 hover:text-emerald-500">
                Privacy Policy
              </a>
            </>
          }
        />

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-6">
        <FormDivider label="Or sign up with" />

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" fullWidth>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </Button>

          <Button type="button" variant="secondary" fullWidth>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </Button>
        </div>
      </div>
    </AuthShell>
  );
}
