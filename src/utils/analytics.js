const ANALYTICS_STORAGE_KEY = 'lovepage_funnel_events';

export function trackEvent(name, properties = {}) {
  const event = {
    name,
    properties,
    timestamp: new Date().toISOString(),
  };

  try {
    const current = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || '[]');
    const next = Array.isArray(current) ? [...current.slice(-99), event] : [event];
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.warn('Analytics storage unavailable:', err);
  }

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, properties);
  }

  if (import.meta.env.DEV) {
    console.info('[analytics]', name, properties);
  }
}
