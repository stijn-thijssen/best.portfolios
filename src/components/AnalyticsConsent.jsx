import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import {
  getStoredConsent,
  setStoredConsent,
  VERCEL_ANALYTICS_PRIVACY_URL,
} from '../lib/analytics-consent';

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState(() => getStoredConsent());

  const trackingEnabled = consent === 'accepted';
  const showBanner = consent === null;

  function accept() {
    setStoredConsent('accepted');
    setConsent('accepted');
  }

  function decline() {
    setStoredConsent('declined');
    setConsent('declined');
  }

  return (
    <>
      {trackingEnabled && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}

      {showBanner && (
        <div
          className="cookie-banner"
          role="dialog"
          aria-label="Cookie consent"
          aria-describedby="cookie-banner-desc"
        >
          <p id="cookie-banner-desc" className="cookie-banner-text">
            We use cookies for{' '}
            <a
              href={VERCEL_ANALYTICS_PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cookie-banner-link"
            >
              analytics
            </a>{' '}
            to improve this site.
          </p>
          <div className="cookie-banner-actions">
            <button
              type="button"
              className="cookie-banner-decline"
              onClick={decline}
            >
              Decline
            </button>
            <button
              type="button"
              className="cookie-banner-accept"
              onClick={accept}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
