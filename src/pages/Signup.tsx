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

    const formatName = (name: string) => {
      return name
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const success = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formatName(formData.fullName),
      businessName: formatName(formData.businessName),
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


    </AuthShell>
  );
}
