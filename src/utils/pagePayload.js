import { DEFAULT_LOVE_MUSIC_URL } from '../config/music'
import { DEFAULT_TEMPLATE_ID, TEMPLATE_BY_ID, normalizeTemplateId } from '../templates/registry'

export const CURRENT_TEMPLATE_RENDER_VERSION = 2
export const LEGACY_TEMPLATE_RENDER_VERSION = 1

export function normalizeTemplateVersion(value) {
  const numeric = Number(value)
  if (Number.isInteger(numeric) && numeric > 0) return numeric
  return LEGACY_TEMPLATE_RENDER_VERSION
}

export function buildTemplatePayload(rawData = {}) {
  const normalizedTemplateId = normalizeTemplateId(rawData.templateId || DEFAULT_TEMPLATE_ID)
  const templateId = TEMPLATE_BY_ID[normalizedTemplateId] ? normalizedTemplateId : DEFAULT_TEMPLATE_ID

  return {
    templateId,
    templateVersion: normalizeTemplateVersion(rawData.templateVersion),
    recipientName: String(rawData.recipientName || ''),
    senderName: String(rawData.senderName || ''),
    scenes: rawData.scenes && typeof rawData.scenes === 'object' ? rawData.scenes : {},
    reasons: Array.isArray(rawData.reasons) ? rawData.reasons : [],
    palette: String(rawData.palette || 'pink'),
    font: String(rawData.font || 'playful'),
    showSenderName: rawData.showSenderName ?? true,
    showFooter: rawData.showFooter ?? true,
    musicUrl: String(rawData.musicUrl || DEFAULT_LOVE_MUSIC_URL),
  }
}
