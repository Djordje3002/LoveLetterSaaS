import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, doc, setDoc, Timestamp } from 'firebase/firestore'
import { DEFAULT_LOVE_MUSIC_URL } from '../config/music'

const BASE_REASON_LINES = [
  'You make ordinary moments feel special.',
  'Your smile makes my whole day better.',
  'You listen with your whole heart.',
  'You believe in me when I doubt myself.',
  'You make me laugh when I need it most.',
  'You are kind even when nobody is watching.',
  'You make hard days feel lighter.',
  'You notice the little things.',
  'You are my calm in chaos.',
  'You make me want to be better.',
  'You make home feel like a person.',
  'You are gentle with my heart.',
  'You make love feel safe.',
  'You turn simple days into memories.',
  'You are my favorite conversation.',
  'You celebrate my wins like they are yours.',
  'You stand by me through everything.',
  'You make life feel brighter.',
  'You are beautifully, unapologetically you.',
  'You are my favorite part of every day.',
]

const buildDefaultReasons = (count = 100) =>
  Array.from({ length: count }, (_, i) => `Reason ${i + 1}: ${BASE_REASON_LINES[i % BASE_REASON_LINES.length]}`)

export const TEMPLATE_SCENE_DEFAULTS = {
  'kawaii-letter': {
    hint: 'Tap the seal to open ♥',
    scene2Header: 'My sweetest letter to you',
    letterText: "Every day with you feels softer, brighter, and more alive.\nYou make ordinary moments feel like little celebrations.\nI still smile when I remember the small things only we understand.\nYou make my heart feel safe, seen, and deeply at home.\nThank you for being my calm, my laughter, and my favorite hello.",
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
    letterText: "You make my world feel gentle and full of color.\nEven in silence, being near you feels like home.\nYour kindness turns heavy days into lighter ones.\nYour voice feels like a place I can always return to.\nI hope this little page reminds you how deeply you are loved.",
    scene3Header: 'Little moments of us',
    closingMessage: 'Forever in bloom, with you.',
  },
  'golden-promise': {
    hint: 'Open to read a promise ✨',
    scene2Header: 'A promise I mean with all my heart',
    letterText: "I promise to choose you in loud days and quiet days.\nI promise to protect what we build and celebrate what we become.\nI promise to listen with patience and speak with honesty.\nI promise to show up even when life feels messy.\nAnd I promise to keep loving you with intention, tenderness, and joy.",
    scene3Header: 'Memories I treasure',
    closingMessage: 'You are my always.',
  },
  'dark-romance': {
    letterText: "In the quiet dark, your name still glows like fire.\nYou are the calm in my chaos and the spark in my silence.\nEven when the room is still, my thoughts find you first.\nYou are the shadow that feels warm, never cold.\nIf love had a heartbeat, mine would still whisper your name.",
    closingMessage: 'Yours, in every lifetime.',
    hint: 'Break the wax seal to read',
  },
  'midnight-love': {
    letterText: "Tonight the stars feel closer because I am thinking of you.\nEvery wish I make ends the same way: with your smile in it.\nEven the moonlight feels softer when your name crosses my mind.\nYou are my favorite thought at the end of every day.\nIf the sky could read my heart, it would spell your name.",
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
    accessName: 'iva',
    accessPassword: 'love',
    welcomeTitle: 'Welcome, my love 💙',
    welcomeSubtitle: 'This is our little private world.',
    questionTitle: 'Will you keep choosing me forever? 💍',
    homeTitle: 'Happy Birthday, my love 💙',
    homeSubtitle: 'Every click is a little reminder of how much I love you.',
    galleryTitle: 'Our Moments 📸',
    gallerySubtitle: 'A collection of our favorite memories.',
    reasonsTitle: 'Reasons I Love You 💙',
    sideCardTitle: 'Quick Memories',
    letterText: "Happy birthday, my love.\nI made this little world just for you.\nThank you for every smile, every hug, and every gentle moment we share.\nYou make ordinary days feel golden and unforgettable.\nI am endlessly grateful for your heart, your warmth, and your love.",
    closingMessage: 'I love you the most.',
    polaroidCaption1: 'You and your beautiful smile',
    polaroidCaption2: 'A day I will always remember',
    polaroidCaption3: 'My favorite moment',
    polaroidCaption4: 'Another reason to smile',
    polaroidCaption5: 'Us, just like this',
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
    finalLetter: "If every page in this book had one truth, it would be this: loving you has changed my world for the better.\nYou taught me that love can feel safe, playful, and steady all at once.\nThank you for being my calm, my joy, and my favorite chapter.\nNo matter where life takes us, I will keep choosing you.\nOur story is still becoming my favorite part of every day.",
    closingMessage: 'And our story is only getting better.',
  },
  'sky-love': {
    hint: 'Tap the moon seal to open ✨',
    scene2Header: 'For you, beneath the stars',
    scene3Header: 'Tonight the sky keeps your name',
    letterText: "Tonight the sky feels endless, and every star reminds me of you.\nIn the quiet hours, my heart still reaches for your warmth.\nYou are the softest part of my day and the calmest part of my night.\nI carry your smile with me like moonlight in my pocket.\nIf wishes come true, mine is always you.",
    closingMessage: 'Always yours under this sky.',
  },
  'chat-reveal': {
    chatSenderName: 'baby 🩷',
    chatSenderAvatar: '🩷',
    chatIntroTitle: 'you have a message',
    chatIntroSubtitle: 'tap anywhere to open',
    chatScript: "them: hey\n\
them: are you awake right now\n\
me: yes, what happened\n\
them: nothing bad, promise\n\
them: i have been carrying this in my heart for a while\n\
me: omg now i am nervous\n\
them: do not be\n\
them: you are the person who makes heavy days feel lighter\n\
them: you make ordinary moments feel warm and safe\n\
them: when i am with you, i breathe easier\n\
me: ...\n\
them: you are my favorite hello and my calmest place\n\
them: and i wanted to tell you properly\n\
them: not rushed, not hidden, just honest\n\
them: i admire your heart, your mind, and the way you love\n\
them: i still smile when i see your name on my phone\n\
them: every single day you make life brighter\n\
them: love: i love you so much 🩷",
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
  'sky-love': { palette: 'navy', font: 'elegant' },
  'chat-reveal': { palette: 'pink', font: 'playful' },
}

export function getInitialDraftFormData(templateId) {
  const styleDefaults = TEMPLATE_STYLE_DEFAULTS[templateId] || TEMPLATE_STYLE_DEFAULTS['kawaii-letter']
  const defaultReasons = templateId === '100-reasons' ? buildDefaultReasons(100) : []

  return {
    recipientName: '',
    senderName: '',
    showSenderName: true,
    showFooter: true,
    palette: styleDefaults.palette,
    font: styleDefaults.font,
    scenes: TEMPLATE_SCENE_DEFAULTS[templateId] ? { ...TEMPLATE_SCENE_DEFAULTS[templateId] } : {},
    reasons: defaultReasons,
    musicEnabled: true,
    musicUrl: DEFAULT_LOVE_MUSIC_URL,
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
      'I love the way life feels calmer and brighter when you are in it.',
      'If this message could hug you, it would never let go.',
    ],
    deep: [
      `Dear ${name}, some feelings are too real to leave unsaid.`,
      'You stay with me in quiet moments, in the pauses, and in the way my day changes when I think of you.',
      'This is my small way of saying that you matter more than I always know how to explain.',
      'You are not just in my memories, you are in the shape of my future.',
      'Wherever life moves, my heart still moves toward you.',
    ],
    playful: [
      `Dear ${name}, this is your official reminder that you are dangerously easy to adore.`,
      'You make my days brighter, my smile less optional, and my brain a little ridiculous in the best way.',
      'So yes, this page exists because I wanted to make you grin.',
      'You are my favorite distraction and my favorite destination.',
      'If loving you is a game, I happily lose every round.',
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
    'chat-reveal': {
      chatSenderName: `${name} 🩷`,
      chatScript: `them: hey ${name}\n\
them: i wanted to tell you this in a sweet way\n\
me: okay i am listening\n\
them: you make my days warmer and my nights calmer\n\
them: you are the person i think about in every quiet moment\n\
them: you make life feel softer, safer, and brighter\n\
them: and i never want to hide this from you again\n\
them: love: i love you so much ${name} 🩷`,
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
