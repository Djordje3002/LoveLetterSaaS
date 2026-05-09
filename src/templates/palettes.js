import { DEFAULT_LOVE_MUSIC_ID } from '../config/music'

export const palettes = {
  pink:     { primary: '#F43F73', bg: '#FFF0F3', accent: '#FF8FA3', text: '#1A1A2E' },
  lavender: { primary: '#9B7FE8', bg: '#F3F0FF', accent: '#C4B0F0', text: '#1A1A2E' },
  mint:     { primary: '#2DD4BF', bg: '#F0FDFB', accent: '#99E9DF', text: '#1A1A2E' },
  gold:     { primary: '#D4AF37', bg: '#FFFBEB', accent: '#F0D060', text: '#1A1A2E' },
  navy:     { primary: '#3B5BDB', bg: '#EEF2FF', accent: '#748FFC', text: '#1A1A2E' },
}

export const fonts = {
  playful: { heading: "'Nunito', sans-serif", body: "'Nunito', sans-serif" },
  elegant: { heading: "'Playfair Display', serif", body: "'Inter', sans-serif" },
  classic: { heading: "'Cormorant Garamond', serif", body: "Georgia, serif" },
}

export function extractYouTubeId(url) {
  const raw = String(url || '').trim()
  if (!raw) return DEFAULT_LOVE_MUSIC_ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw
  const match = raw.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? match[1] : DEFAULT_LOVE_MUSIC_ID
}
