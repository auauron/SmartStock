import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../../lib/supabaseClient";
import type { UserProfile } from "../../types";

export type { UserProfile };

interface DisplayProfileProps {
  fallback?: UserProfile;
  onLoad?: (profile: UserProfile) => void;
  children?: (profile: UserProfile) => ReactNode;
}

const defaultProfile: UserProfile = {
  fullName: "",
  email: "",
  businessName: "",
};

export function DisplayProfile({
  fallback = defaultProfile,
  onLoad,
  children,
}: DisplayProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(fallback);

  useEffect(() => {
    setProfile(fallback);
  }, [fallback]);

  useEffect(() => {
    if (onLoad) {
      onLoad(profile);
    }
  }, [onLoad, profile]);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (!user) {
        setProfile(fallback);
        return;
      }

      setProfile({
        fullName: (user.user_metadata?.full_name as string | undefined) || "",
        email: user.email || "",
        businessName:
          (user.user_metadata?.business_name as string | undefined) || "",
      });
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [fallback]);

  if (!children) {
    return null;
  }

  return <>{children(profile)}</>;
}
