import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface DisplayEmailProps {
  fallback?: string;
}

export function DisplayEmail({ fallback = "your-email@example.com" }: DisplayEmailProps) {
  const [email, setEmail] = useState(fallback);

  useEffect(() => {
    let isMounted = true;

    const loadUserEmail = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      const nextEmail = user?.email?.trim() || fallback;

      if (isMounted) {
        setEmail(nextEmail);
      }
    };

    void loadUserEmail();

    return () => {
      isMounted = false;
    };
  }, [fallback]);

  return <>{email}</>;
}
