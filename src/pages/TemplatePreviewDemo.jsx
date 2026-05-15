import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { buildDefaultReasons, TEMPLATE_SCENE_DEFAULTS, TEMPLATE_STYLE_DEFAULTS } from '../utils/createDraft';
import TemplateRenderer from '../components/TemplateRenderer';
import { DEFAULT_TEMPLATE_ID, TEMPLATE_BY_ID, normalizeTemplateId } from '../templates/registry';

const DEMO_REASONS = buildDefaultReasons(100);

const DemoPreviewPage = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const normalizedTemplateId = normalizeTemplateId(templateId);
  const safeTemplateId = normalizedTemplateId && TEMPLATE_BY_ID[normalizedTemplateId] ? normalizedTemplateId : DEFAULT_TEMPLATE_ID;
  const defaultScenes = TEMPLATE_SCENE_DEFAULTS[safeTemplateId] ? { ...TEMPLATE_SCENE_DEFAULTS[safeTemplateId] } : {};
  const presentation = TEMPLATE_STYLE_DEFAULTS[safeTemplateId] || TEMPLATE_STYLE_DEFAULTS[DEFAULT_TEMPLATE_ID];
  const demoRecipientName = 'Your Love';

  useEffect(() => {
    if (templateId && templateId !== safeTemplateId) {
      navigate(`/preview-demo/${safeTemplateId}`, { replace: true });
    }
  }, [navigate, safeTemplateId, templateId]);

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1 rounded-full bg-black/70 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">
        Demo Preview
      </div>
      <div className="hidden sm:block fixed top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
          Special Gift Just For {demoRecipientName}
        </div>
      </div>
      <Link
        to={`/templates/${safeTemplateId}`}
        className="fixed top-3 sm:top-4 left-3 sm:left-4 z-50 h-10 sm:h-11 pl-2.5 sm:pl-3 pr-3 sm:pr-4 rounded-full bg-white/90 border border-card flex items-center justify-center gap-1.5 sm:gap-2 text-primary-pink shadow-lg hover:scale-105 transition-transform text-xs sm:text-sm font-bold"
      >
        <ArrowLeft size={18} />
        <span className="hidden sm:inline">Back</span>
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
