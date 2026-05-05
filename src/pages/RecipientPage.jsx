import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, HeartCrack } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import KawaiiLetter from '../templates/KawaiiLetter';
import ReasonsILoveYou from '../templates/ReasonsILoveYou';
import OurGallery from '../templates/OurGallery';
import DarkRomance from '../templates/DarkRomance';
import OurStory from '../templates/OurStory';
import MidnightLove from '../templates/MidnightLove';
import RoseWhisper from '../templates/RoseWhisper';
import GoldenPromise from '../templates/GoldenPromise';
import DateInviteLetter from '../templates/DateInviteLetter';

const TEMPLATES = {
  'kawaii-letter': KawaiiLetter,
  '100-reasons': ReasonsILoveYou,
  'our-gallery': OurGallery,
  'dark-romance': DarkRomance,
  'our-story': OurStory,
  'midnight-love': MidnightLove,
  'rose-whisper': RoseWhisper,
  'golden-promise': GoldenPromise,
  'date-invite': DateInviteLetter,
};

const RecipientPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('loading'); // loading | found | not-found | inactive
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    if (!id) { setStatus('not-found'); return; }
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

  const TemplateComponent = TEMPLATES[pageData.templateId];
  if (!TemplateComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-secondary">Unknown template type.</p>
      </div>
    );
  }

  return (
    <TemplateComponent
      recipientName={pageData.recipientName}
      senderName={pageData.senderName}
      scenes={pageData.scenes || {}}
      reasons={pageData.reasons || []}
      palette={pageData.palette || 'pink'}
      font={pageData.font || 'playful'}
      showSenderName={pageData.showSenderName ?? true}
      showFooter={pageData.showFooter ?? true}
      musicEnabled={pageData.musicEnabled ?? false}
      musicUrl={pageData.musicUrl || ''}
    />
  );
};

export default RecipientPage;
