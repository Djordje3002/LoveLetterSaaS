import React, { useMemo, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AuthModal = ({ isOpen, onClose, onSuccess, initialMode = 'signin', title = 'Continue' }) => {
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isSignup = mode === 'signup'
  const actionLabel = useMemo(() => (isSignup ? 'Create account' : 'Sign in'), [isSignup])
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
    if (code === 'auth/popup-closed-by-user') return 'Google sign-in window was closed. Try again.'
    if (code === 'auth/popup-blocked') return 'Popup was blocked by your browser. Please allow popups and try again.'
    if (code === 'auth/network-request-failed') return 'Network error. Check your internet connection and try again.'
    if (code === 'auth/invalid-credential') return 'Invalid email or password.'
    if (code === 'auth/email-already-in-use') return 'This email is already in use.'
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.'
    return isGoogle ? 'Could not continue with Google. Please try again.' : 'Could not complete authentication. Please try again.'
  }

  if (!isOpen) return null

  const resetAndClose = () => {
    setError('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    onClose()
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
      if (isSignup) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      if (onSuccess) await onSuccess()
      resetAndClose()
    } catch (err) {
      setError(err?.code ? mapAuthError(err, false) : (err?.message || 'Could not finish after sign in. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setSubmitting(true)
    try {
      await signInWithGoogle()
      if (onSuccess) await onSuccess()
      resetAndClose()
    } catch (err) {
      setError(err?.code ? mapAuthError(err, true) : (err?.message || 'Could not finish after sign in. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-card shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-dark">{title}</h3>
          <button onClick={resetAndClose} className="text-secondary hover:text-dark">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={submitting}
            className="w-full border-2 border-card rounded-xl py-2.5 font-semibold text-dark hover:bg-slate-50 transition-colors disabled:opacity-70"
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
              className="w-full mt-1 px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink"
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
              className="w-full mt-1 px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink"
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
                className="w-full mt-1 px-4 py-2 border border-card rounded-xl focus:outline-none focus:border-primary-pink"
                placeholder="••••••••"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {submitting ? 'Please wait...' : actionLabel}
          </button>
        </form>

        <p className="text-sm text-secondary mt-4 text-center">
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
      </div>
    </div>
  )
}

export default AuthModal
