import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'

export async function createDraft(templateId) {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('Please sign in before creating a draft.')
  }

  const draftRef = doc(collection(db, 'pages'))
  const id = draftRef.id
  const now = Timestamp.now()
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))

  const draftData = {
    id,
    status: 'pending',
    templateId,
    recipientName: '',
    senderName: '',
    showSenderName: true,
    showFooter: true,
    palette: 'pink',
    font: 'playful',
    scenes: {},
    reasons: [],
    musicEnabled: false,
    musicUrl: '',
    stripeSessionId: '',
    ownerUid: currentUser?.uid || '',
    ownerEmail: currentUser?.email || '',
    createdAt: now,
    expiresAt,
  }

  await setDoc(draftRef, draftData)
  // localStorage can fail in private/restricted browser contexts.
  // Draft creation should still succeed even if persistence is unavailable.
  try {
    localStorage.setItem('currentDraftId', id)
  } catch (err) {
    console.warn('Unable to persist draft ID in localStorage:', err)
  }
  return id
}
