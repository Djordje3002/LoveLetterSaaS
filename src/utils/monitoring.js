const ERROR_STORAGE_KEY = 'lovepage_runtime_errors'

function toMessage(error) {
  if (!error) return 'Unknown error'
  if (typeof error === 'string') return error
  return String(error.message || error.code || 'Unknown error')
}

export function captureAppError(error, context = {}) {
  const payload = {
    message: toMessage(error),
    code: error?.code || '',
    stack: error?.stack || '',
    context,
    timestamp: new Date().toISOString(),
  }

  try {
    const current = JSON.parse(localStorage.getItem(ERROR_STORAGE_KEY) || '[]')
    const next = Array.isArray(current) ? [...current.slice(-99), payload] : [payload]
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(next))
  } catch (storageErr) {
    console.warn('Monitoring storage unavailable:', storageErr)
  }

  if (typeof window !== 'undefined' && window.Sentry?.captureException) {
    window.Sentry.captureException(error || new Error(payload.message), { extra: context })
  }

  console.error('[app-error]', payload.message, context, error)
}

