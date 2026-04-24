import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  User,
  Building,
} from "lucide-react";
import { SignupDashboardShowcase } from "../components/auth/AuthDashboardShowcase";
import { Button } from "../components/ui/Button";
import { CheckboxField } from "../components/ui/CheckboxField";
import { InputField } from "../components/ui/InputField";
import { useAuthStore } from "../stores/authStore";

export function Signup() {
  const { loading, error, signUp, resendVerificationEmail, clearError } =
    useAuthStore();
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
  });
  const [verificationEmail, setVerificationEmail] = useState<string | null>(
    null,
  );
  const [resendStatus, setResendStatus] = useState<string | null>(null);

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

    const formatName = (name: string) => {
      return name
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    const result = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formatName(formData.fullName),
      businessName: formatName(formData.businessName),
    });

    if (!result.success) {
      return;
    }

    if (result.needsEmailVerification) {
      setVerificationEmail(formData.email.trim());
      setResendStatus(null);
      setFormData({
        fullName: "",
        businessName: "",
        email: "",
        password: "",
      });
    }
  };

  const handleResendVerification = async () => {
    if (!verificationEmail) {
      return;
    }

    const success = await resendVerificationEmail(verificationEmail);
    if (success) {
      setResendStatus(
        `A new confirmation link was sent to ${verificationEmail}.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-[minmax(0,28rem)_1fr]">
      <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10 xl:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Sign up to Smart Stock
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-emerald-600 transition-colors hover:text-emerald-500"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-xl shadow-gray-200/50 sm:px-7">
            {verificationEmail ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-semibold">
                      Check your email to finish signing up.
                    </p>
                    <p>
                      We sent a confirmation link to{" "}
                      <span className="font-medium">{verificationEmail}</span>.
                      You need to verify it before you can sign in.
                    </p>
                  </div>
                </div>
                {resendStatus ? (
                  <p className="mt-3 text-sm font-medium text-emerald-700">
                    {resendStatus}
                  </p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={loading}
                  >
                    Resend confirmation email
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                {error ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    <span className="inline-flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </span>
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

                <CheckboxField
                  id="terms"
                  name="terms"
                  required
                  align="start"
                  label={
                    <>
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-emerald-600 hover:text-emerald-500"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-emerald-600 hover:text-emerald-500"
                      >
                        Privacy Policy
                      </a>
                    </>
                  }
                />

                <Button type="submit" disabled={loading} fullWidth>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>

      <SignupDashboardShowcase />
    </div>
  );
}
