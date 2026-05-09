import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'

export const TEMPLATE_SCENE_DEFAULTS = {
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
    introLine: "There's something I have been wanting to ask...",
    hint: 'Tap seal to open ♥',
    confessionTitle: 'But first, let me tell you...',
    confession1Text: 'Your smile resets my whole day.',
    confession2Text: 'You make ordinary moments feel cinematic.',
    confession3Text: 'I still get excited every time your name appears.',
    confession4Text: 'My calmest place is right next to you.',
    confession5Text: 'You are my favorite person to celebrate life with.',
    confession6Text: 'I like you. A lot. Maybe forever.',
    memoriesTitle: 'Remember these?',
    polaroidCaption1: 'Our first little adventure',
    polaroidCaption2: 'When we laughed all night',
    polaroidCaption3: 'A day I keep replaying',
    polaroidCaption4: 'Coffee, rain, and your smile',
    polaroidCaption5: 'The moment I knew',
    continueLabel: 'Continue',
    questionCta: 'Ask the question',
    questionTitle: 'Will you be my Valentine?',
    questionSubtitle: 'A playful yes means everything to me.',
    yesLabel: 'Yes, absolutely',
    noLabel: 'No',
    noTaunt1: 'Are you sure?',
    noTaunt2: 'Nice try 😏',
    noTaunt3: 'I can wait all day 💘',
    celebrationTitle: "I knew you would say yes!",
    celebrationText: 'Now we celebrate this moment and make it unforgettable.',
  },
  'iva-birthday': {
    accessName: 'Iva',
    accessPassword: 'volim te',
    welcomeTitle: 'Dobro dosla, ljubavi 🩵',
    welcomeSubtitle: 'Ovo je nas mali, privatni svet.',
    questionTitle: 'Da li biras mene zauvek? 💍',
    homeTitle: 'Srecan rodjendan, ljubavi 🩵',
    homeSubtitle: 'Svaki klik je mali podsetnik koliko te volim.',
    galleryTitle: 'Nasi trenuci 📸',
    gallerySubtitle: 'A collection of our favorite memories.',
    reasonsTitle: 'Razlozi zasto te volim 🩵',
    diaryTitle: 'Mini dnevnik ✍️',
    diarySubtitle: 'Write a tiny note and keep it here.',
    sideCardTitle: 'Quick Memories',
    letterText: "Srecan rodjendan, ljubavi.\nNapravio sam ovo malo mesto samo za tebe.\nHvala ti za svaki osmeh, svaki zagrljaj i svaki dan koji je lepsi zbog tebe.",
    closingMessage: 'Volim te najvise.',
    polaroidCaption1: 'Ti i tvoj najlepši osmeh',
    polaroidCaption2: 'Dan koji pamtim zauvek',
    polaroidCaption3: 'Najdraži trenutak',
    polaroidCaption4: 'Još jedan razlog da se smejem',
    polaroidCaption5: 'Mi, baš ovako',
    startDate: '2025-12-06',
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
    storyTitle: 'Our Storybook',
    startDate: 'June 14, 2021',
    chapter1Title: 'How We Met',
    chapter1Text: 'It started with one simple conversation and quickly became my favorite story.',
    chapter2Title: 'Our First Date',
    chapter2Text: 'I remember smiling the whole way home, knowing this felt different.',
    polaroidCaption1: 'The laugh that started everything',
    polaroidCaption2: 'Our first long walk together',
    polaroidCaption3: 'The sunset we never forgot',
    polaroidCaption4: 'One ordinary day that felt magical',
    polaroidCaption5: 'My favorite photo of us',
    letterTitle: 'A Letter For You',
    finalLetter: "If every page in this book had one truth, it would be this: loving you has changed my world for the better.\nThank you for being my calm, my joy, and my favorite chapter.",
    closingMessage: 'And our story is only getting better.',
  },
}

export const TEMPLATE_STYLE_DEFAULTS = {
  'kawaii-letter': { palette: 'pink', font: 'playful' },
  '100-reasons': { palette: 'pink', font: 'playful' },
  'our-gallery': { palette: 'pink', font: 'playful' },
  'dark-romance': { palette: 'pink', font: 'elegant' },
  'our-story': { palette: 'pink', font: 'classic' },
  'midnight-love': { palette: 'navy', font: 'elegant' },
  'rose-whisper': { palette: 'lavender', font: 'elegant' },
  'golden-promise': { palette: 'gold', font: 'classic' },
  'date-invite': { palette: 'pink', font: 'playful' },
  'iva-birthday': { palette: 'navy', font: 'playful' },
}

export function getInitialDraftFormData(templateId) {
  const styleDefaults = TEMPLATE_STYLE_DEFAULTS[templateId] || TEMPLATE_STYLE_DEFAULTS['kawaii-letter']

  return {
    recipientName: '',
    senderName: '',
    showSenderName: true,
    showFooter: true,
    palette: styleDefaults.palette,
    font: styleDefaults.font,
    scenes: TEMPLATE_SCENE_DEFAULTS[templateId] ? { ...TEMPLATE_SCENE_DEFAULTS[templateId] } : {},
    reasons: [],
    musicEnabled: false,
    musicUrl: '',
    volume: 60,
  }
}

export function buildQuickPersonalizedScenes(templateId, { recipientName = '', tone = 'sweet' } = {}) {
  const name = String(recipientName || '').trim() || 'you'
  const toneLines = {
    sweet: [
      `Dear ${name}, I made this because you deserve something soft, thoughtful, and only yours.`,
      'You make ordinary moments feel warmer, and I hope this little page makes you smile today.',
      'Thank you for being someone my heart keeps choosing in the smallest ways.',
    ],
    deep: [
      `Dear ${name}, some feelings are too real to leave unsaid.`,
      'You stay with me in quiet moments, in the pauses, and in the way my day changes when I think of you.',
      'This is my small way of saying that you matter more than I always know how to explain.',
    ],
    playful: [
      `Dear ${name}, this is your official reminder that you are dangerously easy to adore.`,
      'You make my days brighter, my smile less optional, and my brain a little ridiculous in the best way.',
      'So yes, this page exists because I wanted to make you grin.',
    ],
  }
  const lines = toneLines[tone] || toneLines.sweet

  const byTemplate = {
    'dark-romance': {
      letterText: lines.join('\n'),
      closingMessage: 'Yours, in every lifetime.',
      hint: 'Break the wax seal to read',
    },
    'midnight-love': {
      letterText: lines.join('\n'),
      closingMessage: 'Yours under every star.',
      hint: 'Open under the stars',
    },
    'date-invite': {
      introLine: `${name}, there is something I want to ask you...`,
      confession1Text: lines[0],
      confession2Text: lines[1],
      confession3Text: lines[2],
      confession4Text: `You make even boring days feel softer, ${name}.`,
      confession5Text: `I keep collecting little memories of us in my head.`,
      confession6Text: 'So yes... this question has my whole heart in it.',
      questionTitle: `${name}, will you be my Valentine?`,
      questionSubtitle: 'One tap on yes and we celebrate properly.',
      celebrationText: `You said yes, ${name}. This just became one of my favorite memories.`,
    },
    'iva-birthday': {
      homeTitle: `Happy birthday, ${name} 💙`,
      homeSubtitle: 'I made this little private world just for you.',
      letterText: lines.join('\n'),
      closingMessage: 'Made with all my love.',
    },
    'our-story': {
      storyTitle: `${name} & Me`,
      chapter1Text: lines[0],
      chapter2Text: lines[1],
      finalLetter: `${lines.join('\n')}\n\nWith love, always.`,
    },
  }

  return {
    scene2Header: `A letter for ${name}`,
    letterText: lines.join('\n'),
    closingMessage: 'Made just for you.',
    ...(byTemplate[templateId] || {}),
  }
}

export async function createDraft(templateId, initialData = {}) {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error('Please sign in before creating a draft.')
  }

  const draftRef = doc(collection(db, 'pages'))
  const id = draftRef.id
  const now = Timestamp.now()
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
  const defaults = getInitialDraftFormData(templateId)

  const draftData = {
    id,
    status: 'pending',
    templateId,
    recipientName: initialData.recipientName ?? defaults.recipientName,
    senderName: initialData.senderName ?? defaults.senderName,
    showSenderName: initialData.showSenderName ?? defaults.showSenderName,
    showFooter: initialData.showFooter ?? defaults.showFooter,
    palette: initialData.palette ?? defaults.palette,
    font: initialData.font ?? defaults.font,
    scenes: { ...defaults.scenes, ...(initialData.scenes || {}) },
    reasons: Array.isArray(initialData.reasons) ? initialData.reasons : defaults.reasons,
    musicEnabled: initialData.musicEnabled ?? defaults.musicEnabled,
    musicUrl: initialData.musicUrl ?? defaults.musicUrl,
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
