import { db } from '../firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

export async function createDraft(templateId) {
  const id = Math.random().toString(36).substring(2, 10)
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
    createdAt: now,
    expiresAt,
  }

  await setDoc(doc(db, 'pages', id), draftData)
  localStorage.setItem('currentDraftId', id)
  return id
}
