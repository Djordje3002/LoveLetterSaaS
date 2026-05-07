import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'

const TEMPLATE_SCENE_DEFAULTS = {
  'kawaii-letter': {
    hint: 'Tap the seal to open ♥',
    scene2Header: 'My sweetest letter to you',
    letterText: "Every day with you feels softer, brighter, and more alive.\nYou make ordinary moments feel like little celebrations.\nThank you for being my calm, my laughter, and my favorite hello.",
    scene3Header: 'Our favorite memories',
    polaroidCaption1: 'The day you made me laugh nonstop',
    polaroidCaption2: 'Our quiet walk and warm coffee',
    polaroidCaption3: 'That perfect golden-hour photo',
    polaroidCaption4: 'A tiny moment I never forgot',
    polaroidCaption5: 'My favorite smile in the world',
    closingMessage: 'Forever yours, always.',
  },
  'rose-whisper': {
    hint: 'A soft note waits for you...',
    scene2Header: 'A rose whisper from my heart',
    letterText: "You make my world feel gentle and full of color.\nEven in silence, being near you feels like home.\nI hope this little page reminds you how deeply you are loved.",
    scene3Header: 'Little moments of us',
    closingMessage: 'Forever in bloom, with you.',
  },
  'golden-promise': {
    hint: 'Open to read a promise ✨',
    scene2Header: 'A promise I mean with all my heart',
    letterText: "I promise to choose you in loud days and quiet days.\nTo protect what we build and celebrate what we become.\nTo keep loving you with patience, honesty, and joy.",
    scene3Header: 'Memories I treasure',
    closingMessage: 'You are my always.',
  },
  'dark-romance': {
    letterText: "In the quiet dark, your name still glows like fire.\nYou are the calm in my chaos and the spark in my silence.\nIf love had a heartbeat, mine would still whisper your name.",
    closingMessage: 'Yours, in every lifetime.',
    hint: 'Break the wax seal to read',
  },
  'midnight-love': {
    letterText: "Tonight the stars feel closer because I am thinking of you.\nEvery wish I make ends the same way: with your smile in it.\nIf the sky could read my heart, it would spell your name.",
    closingMessage: 'Yours under every star.',
    hint: 'Open under the stars',
  },
  'date-invite': {
    hint: 'Open your invitation 💌',
    inviteHeadline: 'Will you go on a date with me?',
    inviteMessage: "I planned a little evening just for us, with your favorite vibe and no pressure - only good moments together.",
    dateWhen: 'Saturday, 7:30 PM',
    dateWhere: 'Our favorite cozy spot',
    dressCode: 'Come exactly as you are',
    rsvpContact: 'Send me a yes when you are ready ♥',
    closingMessage: "I'd love to share this evening with you.",
  },
  '100-reasons': {
    introText: 'Before you read these, know this: loving you is the easiest thing I do.',
    closingMessage: 'With all my love, always.',
  },
  'our-gallery': {
    galleryTitle: 'Our Story in Photos',
    introText: 'Every photo is a tiny proof that love can be seen.',
    polaroidCaption1: 'Our first unforgettable moment',
    polaroidCaption2: 'The day everything felt easy',
    polaroidCaption3: 'Us, exactly where we belong',
    polaroidCaption4: 'A memory that still feels warm',
    polaroidCaption5: 'One of my forever favorites',
  },
  'our-story': {
    startDate: 'June 14, 2021',
    chapter1Title: 'How We Met',
    chapter1Text: 'It started with one simple conversation and quickly became my favorite story.',
    chapter2Title: 'Our First Date',
    chapter2Text: 'I remember smiling the whole way home, knowing this felt different.',
    closingMessage: 'And our story is only getting better.',
  },
}

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
    scenes: TEMPLATE_SCENE_DEFAULTS[templateId] ? { ...TEMPLATE_SCENE_DEFAULTS[templateId] } : {},
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
