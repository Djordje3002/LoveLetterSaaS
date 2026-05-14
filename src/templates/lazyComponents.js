import { lazy } from 'react'
import { DEFAULT_TEMPLATE_ID } from './registry'

export const TEMPLATE_COMPONENT_LAZY = {
  'kawaii-letter': lazy(() => import('./KawaiiLetter')),
  '100-reasons': lazy(() => import('./ReasonsILoveYou')),
  'our-gallery': lazy(() => import('./OurGallery')),
  'dark-romance': lazy(() => import('./DarkRomance')),
  'our-story': lazy(() => import('./OurStory')),
  'midnight-love': lazy(() => import('./MidnightLove')),
  'rose-whisper': lazy(() => import('./RoseWhisper')),
  'golden-promise': lazy(() => import('./GoldenPromise')),
  'iva-birthday': lazy(() => import('./IvaBirthday')),
  'bouquet-garden': lazy(() => import('./BouquetGarden')),
  'our-year-book': lazy(() => import('./OurYearBook')),
  'birthday-candles': lazy(() => import('./BirthdayCandles')),
  'date-invite': lazy(() => import('./DateInviteLetter')),
  'sky-love': lazy(() => import('./SkyLove')),
  'chat-reveal': lazy(() => import('./ChatReveal')),
}

export function getLazyTemplateComponent(templateId) {
  return TEMPLATE_COMPONENT_LAZY[templateId] || TEMPLATE_COMPONENT_LAZY[DEFAULT_TEMPLATE_ID]
}
