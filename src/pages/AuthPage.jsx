import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

const getSafeNextPath = (rawNext) => {
  if (!rawNext) return '/templates'
  if (!rawNext.startsWith('/') || rawNext.startsWith('//')) return '/templates'
  return rawNext
}

const AuthPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const initialMode = searchParams.get('mode') === 'signin' ? 'signin' : 'signup'
  const nextPath = useMemo(() => getSafeNextPath(searchParams.get('next')), [searchParams])

  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'
  const mapAuthError = (err, isGoogle = false) => {
    const code = err?.code || ''
    const msg = err?.message || ''

    if (code === 'auth/configuration-not-found' || msg.includes('CONFIGURATION_NOT_FOUND')) {
      return 'Firebase Authentication is not configured yet. Enable it in Firebase Console first.'
    }
    if (code === 'auth/operation-not-allowed') {
      return isGoogle
        ? 'Google sign-in is disabled in Firebase Console. Enable Google provider and try again.'
        : 'Email/password auth is disabled in Firebase Console. Enable it and try again.'
    }
    if (code === 'auth/unauthorized-domain') {
      return 'This domain is not authorized for Firebase Auth. Add it in Firebase Authentication settings.'
    }
    if (code === 'auth/operation-not-supported-in-this-environment') {
      return 'Google sign-in is not supported in this browser context. Open the app in Chrome/Safari and try again.'
    }
    if (code === 'auth/web-storage-unsupported') {
      return 'Browser storage is blocked, so Google sign-in cannot continue. Allow cookies/storage and try again.'
    }
    if (code === 'auth/popup-closed-by-user') return 'Google sign-in window was closed. Try again.'
    if (code === 'auth/popup-blocked') return 'Popup was blocked by your browser. Please allow popups and try again.'
    if (code === 'auth/network-request-failed') return 'Network error. Check your internet connection and try again.'
    if (code === 'auth/invalid-credential') return 'Invalid email or password.'
    if (code === 'auth/email-already-in-use') return 'This email is already in use.'
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.'
    return isGoogle ? 'Could not continue with Google. Please try again.' : 'Could not complete authentication. Please try again.'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      if (isSignup) await signUp(email, password)
      else await signIn(email, password)
      navigate(nextPath, { replace: true })
    } catch (err) {
      setError(mapAuthError(err, false))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setSubmitting(true)
    try {
      await signInWithGoogle()
      navigate(nextPath, { replace: true })
    } catch (err) {
      setError(mapAuthError(err, true))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout showFooter={false} showParticles={false}>
      <section className="min-h-[70vh] flex items-start sm:items-center justify-center px-4 sm:px-6 pt-24 sm:pt-20 pb-8">
        <div className="w-full max-w-md bg-white border border-card rounded-2xl shadow-xl p-5 sm:p-7">
          <p className="text-xs uppercase tracking-widest font-bold text-primary-pink mb-2">Account</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-secondary text-sm mb-6">
            {isSignup ? 'Sign up to start customizing your page.' : 'Sign in to continue your draft.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={submitting}
              className="w-full border-2 border-card rounded-xl py-2.5 text-sm sm:text-base font-semibold text-dark hover:bg-slate-50 transition-colors disabled:opacity-70"
            >
              Continue with Google
            </button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-secondary">
              <div className="h-px bg-card flex-1"></div>
              or
              <div className="h-px bg-card flex-1"></div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 text-sm border border-card rounded-xl focus:outline-none focus:border-primary-pink"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2.5 text-sm border border-card rounded-xl focus:outline-none focus:border-primary-pink"
                placeholder="••••••••"
              />
            </div>

            {isSignup && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">Confirm password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 text-sm border border-card rounded-xl focus:outline-none focus:border-primary-pink"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && <p className="text-xs sm:text-sm text-red-500 font-medium break-words">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 text-sm sm:text-base disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Please wait...' : (isSignup ? 'Create account' : 'Sign in')}
            </button>
          </form>

          <p className="text-sm text-secondary mt-5 text-center">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="font-bold text-primary-pink"
              onClick={() => {
                setError('')
                setMode(isSignup ? 'signin' : 'signup')
              }}
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>

          <div className="text-center mt-5">
            <Link to="/templates" className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-primary-pink">
              Back to templates
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default AuthPage
