import KawaiiLetter from './KawaiiLetter'
import ReasonsILoveYou from './ReasonsILoveYou'
import OurGallery from './OurGallery'
import DarkRomance from './DarkRomance'
import OurStory from './OurStory'
import MidnightLove from './MidnightLove'
import RoseWhisper from './RoseWhisper'
import GoldenPromise from './GoldenPromise'
import DateInviteLetter from './DateInviteLetter'
import BirthdayCandles from './BirthdayCandles'
import IvaBirthday from './IvaBirthday'
import SkyLove from './SkyLove'
import ChatReveal from './ChatReveal'

export const DEFAULT_TEMPLATE_ID = 'kawaii-letter'

export const TEMPLATE_COMPONENTS = {
  'kawaii-letter': KawaiiLetter,
  '100-reasons': ReasonsILoveYou,
  'our-gallery': OurGallery,
  'dark-romance': DarkRomance,
  'our-story': OurStory,
  'midnight-love': MidnightLove,
  'rose-whisper': RoseWhisper,
  'golden-promise': GoldenPromise,
  'iva-birthday': IvaBirthday,
  'birthday-candles': BirthdayCandles,
  'date-invite': DateInviteLetter,
  'sky-love': SkyLove,
  'chat-reveal': ChatReveal,
}

export const TEMPLATE_REGISTRY = [
  {
    id: 'kawaii-letter',
    title: 'Love Letter',
    cardTitle: 'Love Letter',
    tags: ['Most Popular', 'Love'],
    description: 'A kawaii digital letter experience featuring an interactive envelope, a heartfelt letter, draggable polaroid memories, a retro TV music player, and a flower explosion finale. All text and photos are fully customizable.',
    emoji: '✉️',
    color: 'bg-[#FFD1DC]',
    supportsImages: false,
    hideRecipientSetting: true,
    hidePaletteSetting: true,
  },
  {
    id: 'iva-birthday',
    title: 'Full House of Love',
    cardTitle: 'Full Love',
    tags: ['Full Experience', 'Love'],
    description: 'A private love-themed experience with a playful entry gate, love question, memory gallery, cinematic letter reveal, and a 100-style reasons grid.',
    emoji: '💙',
    color: 'bg-gradient-to-br from-[#13263f] to-[#2c4f7c]',
    supportsImages: true,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: 'birthday-candles',
    title: 'Birthday Candles',
    cardTitle: 'Birthday Candles',
    tags: ['Birthday', 'Love'],
    description: 'A joyful birthday page with animated cake candles, celebratory visuals, and a personalized birthday message.',
    emoji: '🎂',
    color: 'bg-gradient-to-br from-[#ffd7a8] via-[#ffe8c8] to-[#ffccab]',
    supportsImages: false,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: 'date-invite',
    title: 'Will You Be My Valentine?',
    cardTitle: 'Will You Be My Valentine?',
    tags: ['Date', 'Love'],
    description: 'A playful confession journey with clickable reveals, draggable memories, a runaway "No" button, and confetti when they say yes. Every line and photo is customizable.',
    emoji: '💘',
    color: 'bg-gradient-to-br from-pink-200 via-rose-200 to-red-200',
    supportsImages: true,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: 'chat-reveal',
    title: 'Chat Reveal',
    cardTitle: 'Chat Reveal',
    tags: ['Love', 'Chat'],
    description: 'An iMessage-style love confession with typing dots, dramatic bubble reveals, floating hearts, and replay. Fully customizable with long chat scripts.',
    emoji: '💬',
    color: 'bg-gradient-to-br from-[#111111] to-[#2a1a3a]',
    supportsImages: false,
    hideRecipientSetting: false,
    hidePaletteSetting: true,
  },
  {
    id: 'sky-love',
    title: 'Sky Love',
    cardTitle: 'Sky Love',
    tags: ['Night', 'Love'],
    description: 'A moonlit letter journey with glowing stars, celestial visuals, and a dreamy reveal crafted for heartfelt messages.',
    emoji: '🌌',
    color: 'bg-gradient-to-br from-[#0D1B3E] to-[#1A0533]',
    supportsImages: false,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: '100-reasons',
    title: '100 Reasons',
    cardTitle: '100 Reasons',
    tags: ['Reasons', 'Love'],
    description: 'Flip beautifully animated cards revealing all the reasons you love someone. Includes confetti finale and playful interactions.',
    emoji: '💯',
    color: 'bg-gradient-to-br from-violet-200 to-rose-200',
    supportsImages: false,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: 'our-gallery',
    title: 'Our Gallery',
    cardTitle: 'Our Gallery',
    tags: ['Gallery', 'Memories'],
    description: 'A cinematic gallery-style experience for your memories with smooth transitions, captions, and romantic atmosphere.',
    emoji: '🖼️',
    color: 'bg-gradient-to-br from-amber-200 to-orange-200',
    supportsImages: true,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: 'dark-romance',
    title: 'Dark Romance',
    cardTitle: 'Dark Romance',
    tags: ['Elegant', 'Letter'],
    description: 'A dramatic, elegant letter template with ember effects and moody visuals for a timeless romantic vibe.',
    emoji: '🕯️',
    color: 'bg-gradient-to-br from-[#1C1007] to-[#2D1A0E]',
    supportsImages: false,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: 'our-story',
    title: 'Our Story',
    cardTitle: 'Our Story',
    tags: ['Story', 'Timeline'],
    description: 'An interactive storybook with left/right page arrows, photo-gallery pages from your uploads, and a final heartfelt letter page.',
    emoji: '📖',
    color: 'bg-[#F5ECD7]',
    supportsImages: true,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
  {
    id: 'midnight-love',
    title: 'Midnight Love',
    cardTitle: 'Midnight Love',
    tags: ['Night', 'Elegant'],
    description: 'A starry night template with a typewriter-style reveal and dreamy motion effects for heartfelt long-form letters.',
    emoji: '🌙',
    color: 'bg-gradient-to-br from-[#0D1B3E] to-[#1A0533]',
    supportsImages: false,
    hideRecipientSetting: false,
    hidePaletteSetting: false,
  },
]

export const TEMPLATE_BY_ID = TEMPLATE_REGISTRY.reduce((acc, template) => {
  acc[template.id] = template
  return acc
}, {})

export const TEMPLATE_GALLERY_FILTERS = ['All', 'Love', 'Birthday', 'Chat', 'Reasons', 'Gallery', 'Story', 'Elegant', 'Date', 'Night']

export const getTemplateConfig = (templateId) => TEMPLATE_BY_ID[templateId] || TEMPLATE_BY_ID[DEFAULT_TEMPLATE_ID]

export const getTemplateComponent = (templateId) => TEMPLATE_COMPONENTS[templateId] || TEMPLATE_COMPONENTS[DEFAULT_TEMPLATE_ID]

export const getTemplateCards = () => TEMPLATE_REGISTRY.map((template) => ({
  id: template.id,
  name: template.cardTitle,
  tags: template.tags,
}))
