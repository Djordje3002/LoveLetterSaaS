export function getAppUrl() {
  const runtimeOrigin =
    typeof window !== 'undefined' && window.location?.origin
      ? String(window.location.origin).trim()
      : ''

  if (runtimeOrigin) {
    return runtimeOrigin.replace(/\/+$/, '')
  }

  const configured = String(import.meta.env.VITE_APP_URL || '').trim()
  return configured.replace(/\/+$/, '')
}
