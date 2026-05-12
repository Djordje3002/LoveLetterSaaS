import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TEMPLATE_SCENE_DEFAULTS, TEMPLATE_STYLE_DEFAULTS } from '../utils/createDraft';
import TemplateRenderer from '../components/TemplateRenderer';
import { DEFAULT_TEMPLATE_ID, TEMPLATE_BY_ID } from '../templates/registry';

const DEMO_REASONS = Array.from({ length: 100 }, (_, i) => `Reason ${i + 1}: You make life brighter.`);

const DemoPreviewPage = () => {
  const { templateId } = useParams();
  const safeTemplateId = templateId && TEMPLATE_BY_ID[templateId] ? templateId : DEFAULT_TEMPLATE_ID;
  const defaultScenes = TEMPLATE_SCENE_DEFAULTS[safeTemplateId] ? { ...TEMPLATE_SCENE_DEFAULTS[safeTemplateId] } : {};
  const presentation = TEMPLATE_STYLE_DEFAULTS[safeTemplateId] || TEMPLATE_STYLE_DEFAULTS[DEFAULT_TEMPLATE_ID];
  const demoRecipientName = 'Your Love';

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-black/70 text-white text-xs font-bold uppercase tracking-widest">
        Demo Preview
      </div>
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
          Special Gift Just For {demoRecipientName}
        </div>
      </div>
      <Link
        to={`/templates/${safeTemplateId}`}
        className="fixed top-4 left-4 z-50 h-11 pl-3 pr-4 rounded-full bg-white/90 border border-card flex items-center justify-center gap-2 text-primary-pink shadow-lg hover:scale-105 transition-transform text-sm font-bold"
      >
        <ArrowLeft size={18} />
        Back
      </Link>
      <TemplateRenderer
        pageData={{
          templateId: safeTemplateId,
          recipientName: demoRecipientName,
          senderName: 'From Me',
          scenes: defaultScenes,
          reasons: DEMO_REASONS,
          palette: presentation.palette,
          font: presentation.font,
          showSenderName: true,
          showFooter: true,
        }}
        musicEnabled
      />
    </div>
  );
};

export default DemoPreviewPage;
