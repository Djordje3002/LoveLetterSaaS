import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock3, Edit3, Eye, ExternalLink, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Layout from '../components/Layout';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { normalizeTemplateId } from '../templates/registry';

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
};

const formatDate = (timestamp) => {
  if (!timestamp?.toDate) return 'Unknown date';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp.toDate());
};

const DraftCard = ({ draft }) => {
  const resolvedTemplateId = normalizeTemplateId(draft.templateId);
  const templateName = TEMPLATE_NAMES[resolvedTemplateId] || resolvedTemplateId;
  const isPending = draft.status === 'pending';
  const statusDate = isPending ? draft.createdAt : (draft.publishedAt || draft.createdAt);

  return (
    <article className="card-white bg-white/90 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-widest font-bold text-primary-pink mb-1">{isPending ? 'Draft' : 'Published'}</p>
          <h3 className="text-xl font-bold text-dark">{draft.recipientName?.trim() ? `For ${draft.recipientName}` : 'Untitled letter'}</h3>
          <p className="text-secondary text-sm mt-1">{templateName}</p>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${isPending ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
          {isPending ? 'In progress' : 'Live'}
        </span>
      </div>

      <div className="text-xs text-secondary flex items-center gap-2 mb-5">
        <Clock3 size={14} className="text-primary-pink" />
        {isPending ? 'Created' : 'Published'} {formatDate(statusDate)}
      </div>

      <div className="flex flex-wrap gap-2">
        {isPending ? (
          <>
            <Link to={`/create/${resolvedTemplateId}?draft=${draft.id}`} className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2">
              <Edit3 size={14} /> Continue editing
            </Link>
            <Link to={`/preview/${draft.id}`} className="btn-outline py-2 px-4 text-sm inline-flex items-center gap-2">
              <Eye size={14} /> Preview
            </Link>
          </>
        ) : (
          <>
            <Link to={`/p/${draft.id}`} className="btn-primary py-2 px-4 text-sm inline-flex items-center gap-2">
              <ExternalLink size={14} /> Open live page
            </Link>
            <Link to={`/templates/${resolvedTemplateId}`} className="btn-outline py-2 px-4 text-sm inline-flex items-center gap-2">
              <Edit3 size={14} /> Start new draft
            </Link>
          </>
        )}
      </div>
    </article>
  );
};

const DraftsPage = () => {
  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setDrafts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const q = query(collection(db, 'pages'), where('ownerUid', '==', user.uid));
        const snap = await getDocs(q);
        const rows = snap.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .sort((a, b) => {
            const bTime = b.createdAt?.toMillis?.() || 0;
            const aTime = a.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          });
        setDrafts(rows);
      } catch (err) {
        console.error('Failed to load drafts:', err);
        setError('Could not load your drafts right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (authLoading) return;
    load();
  }, [user, authLoading]);

  const pendingDrafts = useMemo(() => drafts.filter((d) => d.status === 'pending'), [drafts]);
  const livePages = useMemo(() => drafts.filter((d) => d.status === 'active'), [drafts]);

  return (
    <Layout showParticles={false}>
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        <div className="mb-10">
          <p className="text-primary-pink uppercase tracking-widest text-xs font-bold mb-2">Workspace</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Your Drafts</h1>
          <p className="text-secondary text-lg">Manage your unfinished pages and open published links in one place.</p>
        </div>

        {authLoading || loading ? (
          <div className="card-white flex items-center gap-3 text-secondary">
            <Loader2 className="animate-spin text-primary-pink" size={20} /> Loading your drafts...
          </div>
        ) : null}

        {!authLoading && !loading && !user ? (
          <div className="card-white text-center py-12">
            <ShieldAlert className="mx-auto text-primary-pink mb-4" size={34} />
            <h2 className="text-2xl font-bold text-dark mb-2">Sign in to see your drafts</h2>
            <p className="text-secondary mb-6">Your drafts are tied to your account so only you can manage them.</p>
            <Link to="/templates" className="btn-primary inline-flex">Go to templates</Link>
          </div>
        ) : null}

        {!authLoading && !loading && user && error ? (
          <div className="card-white border-red-200 text-red-600">{error}</div>
        ) : null}

        {!authLoading && !loading && user && !error && drafts.length === 0 ? (
          <div className="card-white text-center py-12">
            <Sparkles className="mx-auto text-primary-pink mb-4" size={34} />
            <h2 className="text-2xl font-bold text-dark mb-2">No drafts yet</h2>
            <p className="text-secondary mb-6">Create your first page and it will appear here automatically.</p>
            <Link to="/templates" className="btn-primary inline-flex">Create your first draft</Link>
          </div>
        ) : null}

        {!authLoading && !loading && user && !error && drafts.length > 0 ? (
          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">In Progress</h2>
                <span className="text-sm text-secondary">{pendingDrafts.length} draft{pendingDrafts.length === 1 ? '' : 's'}</span>
              </div>
              <div className="space-y-4">
                {pendingDrafts.length > 0 ? pendingDrafts.map((draft) => (
                  <DraftCard key={draft.id} draft={draft} />
                )) : (
                  <p className="text-secondary text-sm">No in-progress drafts right now.</p>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Published Pages</h2>
                <span className="text-sm text-secondary">{livePages.length} live</span>
              </div>
              <div className="space-y-4">
                {livePages.length > 0 ? livePages.map((draft) => (
                  <DraftCard key={draft.id} draft={draft} />
                )) : (
                  <p className="text-secondary text-sm">No published pages yet.</p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default DraftsPage;
