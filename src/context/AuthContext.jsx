import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const googleProvider = useMemo(() => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    return provider
  }, [])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
    })
    return () => unsub()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      return await signInWithPopup(auth, googleProvider)
    } catch (err) {
      const code = String(err?.code || '')
      const canFallbackToRedirect =
        code === 'auth/popup-blocked'
        || code === 'auth/operation-not-supported-in-this-environment'
        || code === 'auth/web-storage-unsupported'

      if (canFallbackToRedirect) {
        await signInWithRedirect(auth, googleProvider)
        return null
      }
      throw err
    }
  }, [googleProvider])

  const value = useMemo(() => ({
    user,
    authLoading,
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    signInWithGoogle,
    signOutUser: () => signOut(auth),
  }), [user, authLoading, signInWithGoogle])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
