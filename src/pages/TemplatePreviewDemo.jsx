import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import KawaiiLetter from '../templates/KawaiiLetter';
import ReasonsILoveYou from '../templates/ReasonsILoveYou';
import OurGallery from '../templates/OurGallery';
import DarkRomance from '../templates/DarkRomance';
import OurStory from '../templates/OurStory';
import MidnightLove from '../templates/MidnightLove';
import RoseWhisper from '../templates/RoseWhisper';
import GoldenPromise from '../templates/GoldenPromise';
import DateInviteLetter from '../templates/DateInviteLetter';
import IvaBirthday from '../templates/IvaBirthday';
import { TEMPLATE_SCENE_DEFAULTS } from '../utils/createDraft';

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
  'iva-birthday': IvaBirthday,
};

const TEMPLATE_PRESENTATION = {
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
};

const DEMO_REASONS = Array.from({ length: 100 }, (_, i) => `Reason ${i + 1}: You make life brighter.`);

const DemoPreviewPage = () => {
  const { templateId } = useParams();
  const TemplateComponent = TEMPLATES[templateId] || TEMPLATES['kawaii-letter'];
  const safeTemplateId = templateId && TEMPLATES[templateId] ? templateId : 'kawaii-letter';
  const defaultScenes = TEMPLATE_SCENE_DEFAULTS[safeTemplateId] ? { ...TEMPLATE_SCENE_DEFAULTS[safeTemplateId] } : {};
  const presentation = TEMPLATE_PRESENTATION[safeTemplateId] || TEMPLATE_PRESENTATION['kawaii-letter'];

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold uppercase tracking-widest">
        Demo Preview
      </div>
      <Link
        to={`/templates/${safeTemplateId}`}
        className="fixed top-4 left-4 z-50 w-11 h-11 rounded-full bg-white/85 border border-card flex items-center justify-center text-primary-pink shadow-lg hover:scale-105 transition-transform"
      >
        <ArrowLeft size={18} />
      </Link>
      <TemplateComponent
        recipientName="Your Love"
        senderName="From Me"
        scenes={defaultScenes}
        reasons={DEMO_REASONS}
        palette={presentation.palette}
        font={presentation.font}
        showSenderName
        showFooter
        musicEnabled={false}
        musicUrl=""
      />
    </div>
  );
};

export default DemoPreviewPage;
