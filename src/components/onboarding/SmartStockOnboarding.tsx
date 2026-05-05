import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  PackagePlus,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { useInventory } from "../../hooks/useInventory";
import type { UserProfile } from "../../types";
import {
  getOnboarding,
  markFirstItemAdded,
  startOnboarding,
  updateOnboardingStatus,
  type UserOnboarding,
} from "../../services/onboardingService";

const ACTIVE_KEY = "smartstock:onboarding-active";

type OnboardingStep =
  | "welcome"
  | "goal"
  | "dashboard"
  | "inventory"
  | "success";

const steps: OnboardingStep[] = [
  "welcome",
  "goal",
  "dashboard",
  "inventory",
  "success",
];

const roles = ["Store owner", "Inventory manager", "Staff member", "Admin"];
const goals = [
  "Add my first stock item",
  "View current inventory",
  "Check low-stock products",
  "Explore the dashboard",
];

interface OnboardingPanel {
  icon: LucideIcon;
  title: string;
  body: string;
  content: ReactNode;
  primaryLabel: string;
  primaryAction: () => void;
  secondaryLabel: string;
  secondaryAction: () => void;
}

interface SmartStockOnboardingProps {
  profile: UserProfile;
}

function trackOnboarding(eventName: string, payload?: Record<string, unknown>) {
  window.dispatchEvent(
    new CustomEvent("smartstock:onboarding-metric", {
      detail: { eventName, ...payload },
    }),
  );

  if (import.meta.env.DEV) {
    console.info("[onboarding]", eventName, payload ?? {});
  }
}

export function SmartStockOnboarding({ profile }: SmartStockOnboardingProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { inventory, loading } = useInventory();
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenModal, setHasOpenModal] = useState(false);
  const [onboarding, setOnboarding] = useState<UserOnboarding | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Inventory manager");
  const [selectedGoal, setSelectedGoal] = useState("Add my first stock item");
  const hasTrackedOpenRef = useRef(false);

  const hasAccountIdentity = Boolean(
    profile.email.trim() || profile.businessName.trim(),
  );
  const stepIndex = steps.indexOf(step);
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const isDashboard = location.pathname.startsWith("/dashboard");
  const isInventory = location.pathname.startsWith("/inventory");

  useEffect(() => {
    if (!hasAccountIdentity) {
      setOnboarding(null);
      setIsOpen(false);
      setStatusLoading(false);
      return;
    }

    let isMounted = true;
    setStatusLoading(true);

    void getOnboarding()
      .then((nextOnboarding) => {
        if (!isMounted) return;

        setOnboarding(nextOnboarding);
        if (nextOnboarding?.role) {
          setSelectedRole(nextOnboarding.role);
        }
        if (nextOnboarding?.firstGoal) {
          setSelectedGoal(nextOnboarding.firstGoal);
        }
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Failed to load onboarding:", error);
        setOnboarding(null);
      })
      .finally(() => {
        if (isMounted) {
          setStatusLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasAccountIdentity, profile.email, profile.businessName]);

  useEffect(() => {
    if (loading || statusLoading || step === "success") return;

    const isNewUser = inventory.length === 0;
    const shouldAutoStart =
      onboarding?.status === "not_started" ||
      onboarding?.status === "in_progress";
    const isFinished =
      onboarding?.status === "completed" || onboarding?.status === "skipped";

    setIsOpen(Boolean(shouldAutoStart && isNewUser && !isFinished));
    if (!shouldAutoStart || !isNewUser || isFinished) {
      localStorage.removeItem(ACTIVE_KEY);
    }
  }, [inventory.length, loading, onboarding?.status, statusLoading, step]);

  useEffect(() => {
    if (!isOpen) {
      hasTrackedOpenRef.current = false;
      return;
    }

    localStorage.setItem(ACTIVE_KEY, "true");
    if (!hasTrackedOpenRef.current) {
      trackOnboarding("onboarding_started", { step });
      hasTrackedOpenRef.current = true;
    }
  }, [isOpen, step]);

  useEffect(() => {
    const handleFirstItemAdded = (event: Event) => {
      const itemName =
        event instanceof CustomEvent && typeof event.detail?.name === "string"
          ? event.detail.name
          : undefined;

      trackOnboarding("first_item_saved", { itemName });
      void markFirstItemAdded();
      setStep("success");
      setIsOpen(true);
      navigate("/inventory", { replace: true });
    };

    window.addEventListener(
      "smartstock:onboarding-item-added",
      handleFirstItemAdded,
    );

    return () => {
      window.removeEventListener(
        "smartstock:onboarding-item-added",
        handleFirstItemAdded,
      );
    };
  }, [navigate]);

  useEffect(() => {
    const updateModalState = () => {
      setHasOpenModal(Boolean(document.querySelector("[data-app-modal='true']")));
    };

    updateModalState();

    const observer = new MutationObserver(updateModalState);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const complete = async () => {
    localStorage.removeItem(ACTIVE_KEY);
    try {
      await updateOnboardingStatus("completed");
      setOnboarding((prev) =>
        prev
          ? {
              ...prev,
              status: "completed",
              completedAt: new Date().toISOString(),
              skippedAt: "",
            }
          : prev,
      );
      trackOnboarding("onboarding_completed");
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
    setIsOpen(false);
  };

  const skip = async () => {
    localStorage.removeItem(ACTIVE_KEY);
    try {
      await updateOnboardingStatus("skipped");
      setOnboarding((prev) =>
        prev
          ? {
              ...prev,
              status: "skipped",
              skippedAt: new Date().toISOString(),
              completedAt: "",
            }
          : prev,
      );
      trackOnboarding("onboarding_skipped", { step });
    } catch (error) {
      console.error("Failed to skip onboarding:", error);
    }
    setIsOpen(false);
  };

  const goToInventoryAdd = () => {
    setStep("inventory");
    trackOnboarding("first_item_started");
    navigate(`/inventory?newItem=1&onboarding=${Date.now()}`);
  };

  const startSelectedGoal = () => {
    void startOnboarding(selectedRole, selectedGoal)
      .then((nextOnboarding) => {
        setOnboarding(nextOnboarding);
      })
      .catch((error) => {
        console.error("Failed to start onboarding:", error);
      });

    trackOnboarding("goal_started", { goal: selectedGoal });

    if (selectedGoal === "Add my first stock item") {
      goToInventoryAdd();
      return;
    }

    if (selectedGoal === "View current inventory") {
      setStep("inventory");
      navigate("/inventory");
      return;
    }

    if (selectedGoal === "Check low-stock products") {
      setStep("dashboard");
      navigate("/dashboard");
      trackOnboarding("low_stock_intro_viewed");
      return;
    }

    setStep("dashboard");
    trackOnboarding("dashboard_intro_viewed");
    navigate("/dashboard");
  };

  let panel: OnboardingPanel;

  switch (step) {
    case "welcome":
      panel = {
          icon: Sparkles,
          title: "Welcome to SmartStock",
          body: "Let's get your inventory ready in a few quick steps.",
          content: (
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    trackOnboarding("role_selected", { role });
                  }}
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors ${
                    selectedRole === role
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          ),
          primaryLabel: "Continue",
          primaryAction: () => setStep("goal"),
          secondaryLabel: "Skip for now",
          secondaryAction: () => {
            void skip();
          },
      };
      break;
    case "goal":
      panel = {
          icon: ClipboardList,
          title: "What do you want to do first?",
          body: "We'll keep the guide focused on the action that matters most.",
          content: (
            <div className="space-y-2">
              {goals.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => {
                    setSelectedGoal(goal);
                    trackOnboarding("goal_selected", { goal });
                  }}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    selectedGoal === goal
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {goal}
                  {selectedGoal === goal && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                </button>
              ))}
            </div>
          ),
          primaryLabel: "Start",
          primaryAction: () => {
            startSelectedGoal();
          },
          secondaryLabel: "Explore on my own",
          secondaryAction: () => {
            void skip();
          },
      };
      break;
    case "dashboard":
      panel = {
          icon: BarChart3,
          title: "Your dashboard shows what needs attention",
          body: "Start with total inventory, stock alerts, recent activity, and restock trends.",
          content: (
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              Tip: stock alerts only need attention when items reach their
              minimum stock level.
            </div>
          ),
          primaryLabel: "Add first stock item",
          primaryAction: goToInventoryAdd,
          secondaryLabel: "View inventory",
          secondaryAction: () => {
            setStep("inventory");
            navigate("/inventory");
          },
      };
      break;
    case "inventory":
      panel = {
          icon: PackagePlus,
          title: "Add your first stock item",
          body: "Use the real item form. You only need the basics now: name, category, price, quantity, and minimum stock.",
          content: (
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
              After saving, SmartStock will show the item in your inventory list
              with its stock status.
            </div>
          ),
          primaryLabel: isInventory ? "Open item form" : "Go to inventory",
          primaryAction: goToInventoryAdd,
          secondaryLabel: "Skip and explore",
          secondaryAction: () => {
            void skip();
          },
      };
      break;
    case "success":
      panel = {
          icon: CheckCircle2,
          title: "First item added!",
          body: "Inventory is ready to track. You can now find this item in the list and watch its stock status.",
          content: (
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">
                Item saved
              </div>
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-800">
                List updated
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                Status visible
              </div>
            </div>
          ),
          primaryLabel: "Go to dashboard",
          primaryAction: () => {
            void complete();
            navigate("/dashboard");
          },
          secondaryLabel: "Add more items",
          secondaryAction: () => {
            void complete();
            navigate(`/inventory?newItem=1&onboarding=${Date.now()}`);
          },
      };
      break;
  }

  const Icon = panel.icon;

  return (
    <>
      {isOpen && !hasOpenModal && (
        <div className="pointer-events-none fixed inset-x-3 top-[4.75rem] z-40 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:top-auto lg:right-8">
          <div className="pointer-events-auto max-h-[calc(100svh-6rem)] w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-2xl shadow-gray-900/20 sm:w-[26rem]">
            <div className="h-1 rounded-t-lg bg-gray-100">
              <div
                className="h-full rounded-tl-lg bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="p-3 sm:p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Step {stepIndex + 1} of {steps.length}
                    </p>
                    <h2 className="mt-1 text-base font-semibold text-gray-900 sm:text-lg">
                      {panel.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">{panel.body}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void skip();
                  }}
                  className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Skip onboarding"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">{panel.content}</div>

              {step === "dashboard" && isDashboard && (
                <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600">
                  <p className="rounded-lg border border-gray-200 px-3 py-2">
                    Total Inventory: items tracked now.
                  </p>
                  <p className="rounded-lg border border-gray-200 px-3 py-2">
                    Stock Alerts: products needing attention.
                  </p>
                  <p className="rounded-lg border border-gray-200 px-3 py-2">
                    Recent Activity: edits and restocks.
                  </p>
                </div>
              )}

              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={panel.secondaryAction}>
                  {panel.secondaryLabel}
                </Button>
                <Button onClick={panel.primaryAction}>
                  {panel.primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
