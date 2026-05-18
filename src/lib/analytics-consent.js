export const CONSENT_STORAGE_KEY = 'vercel-analytics-consent';

/** @returns {'accepted' | 'declined' | null} */
export function getStoredConsent() {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === 'accepted' || value === 'declined') return value;
  } catch {
    /* private browsing / blocked storage */
  }
  return null;
}

/** @param {'accepted' | 'declined'} value */
export function setStoredConsent(value) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

export const VERCEL_ANALYTICS_PRIVACY_URL =
  'https://vercel.com/docs/analytics/privacy-policy';
