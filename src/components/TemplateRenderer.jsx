import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { DEFAULT_TEMPLATE_ID } from '../templates/registry'
import { TEMPLATE_COMPONENT_LAZY } from '../templates/lazyComponents'
import { buildTemplatePayload } from '../utils/pagePayload'

const TemplateRenderer = ({ pageData, musicEnabled = true }) => {
  const payload = buildTemplatePayload(pageData)
  const TemplateComponent = TEMPLATE_COMPONENT_LAZY[payload.templateId] || TEMPLATE_COMPONENT_LAZY[DEFAULT_TEMPLATE_ID]

  return (
    <Suspense
      fallback={(
        <div className="min-h-screen flex items-center justify-center bg-primary-light">
          <Loader2 className="text-primary-pink animate-spin" size={48} />
        </div>
      )}
    >
      <TemplateComponent
        templateVersion={payload.templateVersion}
        recipientName={payload.recipientName}
        senderName={payload.senderName}
        scenes={payload.scenes}
        reasons={payload.reasons}
        palette={payload.palette}
        font={payload.font}
        showSenderName={payload.showSenderName}
        showFooter={payload.showFooter}
        musicEnabled={musicEnabled}
        musicUrl={payload.musicUrl}
      />
    </Suspense>
  )
}

export default TemplateRenderer
