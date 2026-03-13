import type { UserProfile } from "../components/auth/DisplayProfile";

const PROFILE_CACHE_KEY = "smart-stock:profile-cache";
const PROFILE_CACHE_TTL_MS = 10 * 60 * 1000;

interface CachedProfilePayload {
  profile: UserProfile;
  cachedAt: number;
}

export function readCachedProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CachedProfilePayload;
    const isExpired = Date.now() - parsed.cachedAt > PROFILE_CACHE_TTL_MS;

    if (isExpired) {
      localStorage.removeItem(PROFILE_CACHE_KEY);
      return null;
    }

    return parsed.profile;
  } catch {
    return null;
  }
}

export function writeCachedProfile(profile: UserProfile) {
  try {
    const payload: CachedProfilePayload = {
      profile,
      cachedAt: Date.now(),
    };
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage write failures
  }
}

export function clearCachedProfile() {
  localStorage.removeItem(PROFILE_CACHE_KEY);
}
