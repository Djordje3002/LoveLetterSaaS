import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock3,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  Grid2x2,
  Loader2,
  Plus,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import Layout from '../components/Layout'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { normalizeTemplateId } from '../templates/registry'

const TEMPLATE_NAMES = {
  'kawaii-letter': 'Love Letter',
  'full-house-love': 'Full House of Love',
  'birthday-candles': 'Birthday Candles',
  '100-reasons': '100 Reasons',
  'our-gallery': 'Our Gallery',
  'dark-romance': 'Dark Romance',
  'our-story': 'Our Story',
  'midnight-love': 'Midnight Love',
  'rose-whisper': 'Rose Whisper',
  'golden-promise': 'Golden Promise',
  'date-invite': 'Will You Be My Valentine?',
  'chat-reveal': 'Chat Reveal',
}

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'Unknown date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(timestamp.toDate())
}

const dashboardNameFromUser = (user) => {
  if (!user) return 'Your'
  if (user.displayName?.trim()) return user.displayName.trim()
  if (user.email?.includes('@')) return user.email.split('@')[0]
  return 'Your'
}

const getExpiryMeta = (expiresAt) => {
  if (!expiresAt?.toDate) return null

  const diffMs = expiresAt.toDate().getTime() - Date.now()
  if (diffMs <= 0) {
    return { label: 'Expired', tone: 'text-red-600 bg-red-50 border-red-200' }
  }

  const hours = diffMs / (1000 * 60 * 60)
  if (hours < 6) {
    return { label: 'Expires very soon', tone: 'text-red-600 bg-red-50 border-red-200' }
  }

  if (hours < 24) {
    return { label: 'Expires soon', tone: 'text-amber-700 bg-amber-50 border-amber-200' }
  }

  return null
}

const TemplateStatusCard = ({ item }) => {
  const isPending = item.status === 'pending'
  const resolvedTemplateId = normalizeTemplateId(item.templateId)
  const templateName = TEMPLATE_NAMES[resolvedTemplateId] || resolvedTemplateId
  const title = isPending ? `${templateName} (Draft)` : templateName
  const expiryMeta = isPending ? getExpiryMeta(item.expiresAt) : null

  return (
    <article className="rounded-[24px] overflow-hidden border border-[#f4dce4] bg-white shadow-[0_10px_30px_rgba(244,63,115,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(244,63,115,0.16)]">
      <div className="h-48 bg-gradient-to-br from-[#fce8ee] via-[#f7e4ea] to-[#f4dde5] flex items-center justify-center relative">
        <div className="w-24 h-24 rounded-full border-4 border-[#efb7c8] flex items-center justify-center text-[#e17a9b]">
          <Sparkles size={36} />
        </div>
        <div className="absolute top-4 right-4">
          <span className={`text-[11px] uppercase tracking-widest font-black px-3 py-1 rounded-full border ${isPending ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'}`}>
            {isPending ? 'Draft' : 'Live'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-[1.8rem] leading-tight font-playfair font-bold text-dark mb-2 line-clamp-2">{title}</h3>
        <p className="text-secondary mb-3">Added {formatDate(item.createdAt)}</p>

        <div className="flex flex-wrap items-center gap-2 mb-5 min-h-[32px]">
          {expiryMeta && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${expiryMeta.tone}`}>
              <Clock3 size={12} className="inline mr-1" />
              {expiryMeta.label}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {isPending ? (
            <>
	              <Link
	                to={`/create/${resolvedTemplateId}?draft=${item.id}`}
                className="border-2 border-[#f4c4d3] text-primary-pink bg-white rounded-pill px-4 py-3 font-bold text-center hover:bg-primary-light transition-colors"
              >
                <Edit3 size={16} className="inline mr-1" />
                Edit
              </Link>
              <Link
                to={`/preview/${item.id}`}
                className="bg-gradient-to-r from-[#db8a2d] to-[#cf7d1f] text-white rounded-pill px-4 py-3 font-bold text-center hover:brightness-105 transition-all"
              >
                Publish & Share
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/p/${item.id}`}
                className="border-2 border-[#b6e9cf] text-emerald-700 bg-emerald-50 rounded-pill px-4 py-3 font-bold text-center hover:bg-emerald-100 transition-colors"
              >
                <ExternalLink size={16} className="inline mr-1" />
                Open Site
              </Link>
	              <Link
	                to={`/templates/${resolvedTemplateId}`}
                className="bg-pink-gradient text-white rounded-pill px-4 py-3 font-bold text-center hover:brightness-105 transition-all"
              >
                New From Template
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

const DashboardPage = () => {
  const { user, authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [tab, setTab] = useState('templates')

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setItems([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        // Run rule-safe queries that mirror Firestore access rules:
        // - pending drafts: owner only
        // - active pages: readable, but we scope to owner for dashboard
        const pagesRef = collection(db, 'pages')
        const [pendingSnap, activeSnap] = await Promise.all([
          getDocs(query(pagesRef, where('ownerUid', '==', user.uid), where('status', '==', 'pending'))),
          getDocs(query(pagesRef, where('ownerUid', '==', user.uid), where('status', '==', 'active'))),
        ])

        const byId = new Map()
        for (const docSnap of pendingSnap.docs) {
          byId.set(docSnap.id, { id: docSnap.id, ...docSnap.data() })
        }
        for (const docSnap of activeSnap.docs) {
          byId.set(docSnap.id, { id: docSnap.id, ...docSnap.data() })
        }

        const rows = Array.from(byId.values()).sort((a, b) => {
          const bTime = b.createdAt?.toMillis?.() || 0
          const aTime = a.createdAt?.toMillis?.() || 0
          return bTime - aTime
        })
        setItems(rows)
      } catch (err) {
        console.error('Failed to load dashboard items:', err)
        const errorCode = String(err?.code || '')
        if (errorCode.includes('permission-denied')) {
          setError('Dashboard access is blocked by Firestore rules right now. Please refresh in a moment.')
        } else {
          setError('Could not load your dashboard right now. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    if (authLoading) return
    load()
  }, [user, authLoading])

  const pendingItems = useMemo(() => items.filter((d) => d.status === 'pending'), [items])
  const publishedItems = useMemo(() => items.filter((d) => d.status === 'active'), [items])
  const visibleItems = tab === 'templates' ? pendingItems : publishedItems

  return (
    <Layout showParticles={false} showFooter={false}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-6 pt-10 pb-10">
        <div className="mb-7 flex items-center gap-2 text-dark">
          <Grid2x2 size={20} className="text-primary-pink" />
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        </div>

        {authLoading || loading ? (
          <div className="rounded-2xl bg-white border border-card shadow-soft px-6 py-5 flex items-center gap-3 text-secondary mb-8">
            <Loader2 className="animate-spin text-primary-pink" size={20} /> Loading your dashboard...
          </div>
        ) : null}

        {!authLoading && !loading && !user ? (
          <div className="rounded-3xl bg-white border border-card shadow-soft px-8 py-14 text-center">
            <ShieldAlert className="mx-auto text-primary-pink mb-4" size={38} />
            <h2 className="text-3xl font-bold text-dark mb-3">Sign in to open your dashboard</h2>
            <p className="text-secondary text-lg mb-8">Your templates and published pages live here.</p>
            <Link to="/auth?mode=signin&next=%2Fdashboard" className="btn-primary inline-flex">Sign in</Link>
          </div>
        ) : null}

        {!authLoading && !loading && user ? (
          <>
            <section className="relative overflow-hidden rounded-[34px] p-8 md:p-10 bg-gradient-to-r from-[#f06d8a] via-[#ea567a] to-[#d23d62] text-white shadow-[0_20px_60px_rgba(226,74,119,0.40)] mb-10">
              <div className="absolute -right-10 -top-12 opacity-20 text-[220px] leading-none select-none">♥</div>
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <p className="text-white/80 font-semibold tracking-wide mb-2">Welcome back 👋</p>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2">{dashboardNameFromUser(user)}'s Dashboard</h2>
                  <p className="text-white/85 text-lg">
                    {pendingItems.length} templates · {publishedItems.length} published sites
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="px-7 py-3 rounded-pill border border-white/40 text-white bg-white/10 backdrop-blur font-bold hover:bg-white/20 transition-colors"
                  >
                    Bundles
                  </button>
                  <Link
                    to="/templates"
                    className="px-7 py-3 rounded-pill bg-white text-[#e44973] font-bold shadow-lg shadow-[#8f2342]/20 hover:scale-[1.02] transition-transform"
                  >
                    <Plus size={18} className="inline mr-1" />
                    Browse Templates
                  </Link>
                </div>
              </div>
            </section>

            <div className="inline-flex items-center gap-1 p-1 rounded-[20px] bg-[#ebe7eb] border border-[#ded6dd] mb-8">
              <button
                type="button"
                onClick={() => setTab('templates')}
                className={`px-5 py-3 rounded-2xl text-base font-bold transition-all ${tab === 'templates' ? 'bg-white text-primary-pink shadow-sm' : 'text-secondary hover:text-dark'}`}
              >
                <FileText size={18} className="inline mr-2" />
                My Templates
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary-light text-primary-pink">{pendingItems.length}</span>
              </button>
              <button
                type="button"
                onClick={() => setTab('published')}
                className={`px-5 py-3 rounded-2xl text-base font-bold transition-all ${tab === 'published' ? 'bg-white text-primary-pink shadow-sm' : 'text-secondary hover:text-dark'}`}
              >
                <Globe size={18} className="inline mr-2" />
                Published Sites
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-[#f2f2f2] text-secondary">{publishedItems.length}</span>
              </button>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 text-red-600 px-5 py-4 font-medium mb-8">{error}</div>
            ) : null}

            {!error && visibleItems.length === 0 ? (
              <div className="rounded-3xl bg-white border border-card shadow-soft px-8 py-14 text-center">
                <Sparkles className="mx-auto text-primary-pink mb-4" size={36} />
                <h3 className="text-3xl font-bold text-dark mb-3">
                  {tab === 'templates' ? 'No templates yet' : 'No published pages yet'}
                </h3>
                <p className="text-secondary text-lg mb-8">
                  {tab === 'templates'
                    ? 'Start from a template and your drafts will appear here.'
                    : 'Publish a draft to see your live pages listed here.'}
                </p>
                <Link to="/templates" className="btn-primary inline-flex">Browse templates</Link>
              </div>
            ) : null}

            {!error && visibleItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                {visibleItems.map((item) => (
                  <TemplateStatusCard key={item.id} item={item} />
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </Layout>
  )
}

export default DashboardPage
