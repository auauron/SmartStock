import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface DisplayNameProps {
  fallback?: string;
}

export function DisplayName({ fallback = "there" }: DisplayNameProps) {
  const [name, setName] = useState(fallback);

  useEffect(() => {
    let isMounted = true;

    const loadUserName = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      const metadataName = user?.user_metadata?.full_name as string | undefined;
      const fallbackEmail = user?.email?.split("@")[0];
      const nextName = metadataName?.trim() || fallbackEmail || fallback;

      if (isMounted) {
        setName(nextName);
      }
    };

    void loadUserName();

    return () => {
      isMounted = false;
    };
  }, [fallback]);

  return <>{name}</>;
}
