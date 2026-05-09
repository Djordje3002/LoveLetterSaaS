import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DEFAULT_LOVE_MUSIC_URL } from '../config/music';
import { DEFAULT_TEMPLATE_ID, TEMPLATE_COMPONENTS } from '../templates/registry';

const RecipientPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState(id ? 'loading' : 'not-found'); // loading | found | not-found | inactive
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'pages', id));
        if (!snap.exists()) { setStatus('not-found'); return; }
        const data = snap.data();
        if (data.status !== 'active') { setStatus('inactive'); return; }
        setPageData(data);
        setStatus('found');
      } catch (err) {
        console.error(err);
        setStatus('not-found');
      }
    };
    load();
  }, [id]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-light">
        <Loader2 className="text-primary-pink animate-spin" size={48} />
      </div>
    );
  }

  if (status === 'not-found') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-8 text-center">
        <div className="text-8xl mb-6">💔</div>
        <h1 className="text-3xl font-bold text-dark mb-3">Page not found</h1>
        <p className="text-secondary mb-8 max-w-sm">This love page doesn't exist or the link may be incorrect.</p>
        <Link to="/" className="btn-primary px-8">Create your own page →</Link>
      </div>
    );
  }

  if (status === 'inactive') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light p-8 text-center">
        <div className="text-8xl mb-6">⏳</div>
        <h1 className="text-3xl font-bold text-dark mb-3">Not available yet</h1>
        <p className="text-secondary mb-8 max-w-sm">This page hasn't been published yet. Check back soon!</p>
        <Link to="/" className="btn-outline px-8">Go home</Link>
      </div>
    );
  }

  const templateId = pageData?.templateId || DEFAULT_TEMPLATE_ID;
  const TemplateComponent = TEMPLATE_COMPONENTS[templateId];
  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-secondary">Unknown template type.</p>
      </div>
    );
  }

  const giftRecipientName = String(pageData.recipientName || '').trim() || 'you';

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] pointer-events-none">
        <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
          Special Gift Just For {giftRecipientName}
        </div>
      </div>
      <TemplateComponent
        recipientName={pageData.recipientName}
        senderName={pageData.senderName}
        scenes={pageData.scenes || {}}
        reasons={pageData.reasons || []}
        palette={pageData.palette || 'pink'}
        font={pageData.font || 'playful'}
        showSenderName={pageData.showSenderName ?? true}
        showFooter={pageData.showFooter ?? true}
        musicEnabled
        musicUrl={pageData.musicUrl || DEFAULT_LOVE_MUSIC_URL}
      />
    </>
  );
};

export default RecipientPage;
