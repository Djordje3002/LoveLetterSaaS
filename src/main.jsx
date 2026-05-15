import { Suspense, StrictMode, lazy, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import './index.css'

import PageWrapper from './components/PageWrapper'
import { AuthProvider } from './context/AuthContext'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const TemplateGallery = lazy(() => import('./pages/TemplateGallery'))
const TemplateDetail = lazy(() => import('./pages/TemplateDetail'))
const Builder = lazy(() => import('./pages/Builder'))
const FullscreenPreview = lazy(() => import('./pages/FullscreenPreview'))
const SuccessPage = lazy(() => import('./pages/SuccessPage'))
const RecipientPage = lazy(() => import('./pages/RecipientPage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const RomanticSequencePlayer = lazy(() => import('./components/RomanticSequencePlayer'))
const TemplatePreviewDemo = lazy(() => import('./pages/TemplatePreviewDemo'))

const LoadingRoute = () => (
  <div className="min-h-screen flex items-center justify-center bg-primary-light">
    <div className="w-10 h-10 rounded-full border-4 border-primary-pink/20 border-t-primary-pink animate-spin" />
  </div>
)

const AnimatedRoutes = ({ disableMotion = false }) => {
  const location = useLocation();

  const routesContent = (
    <Suspense fallback={<LoadingRoute />}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/templates" element={<PageWrapper><TemplateGallery /></PageWrapper>} />
        <Route path="/templates/:templateId" element={<PageWrapper><TemplateDetail /></PageWrapper>} />
        <Route path="/preview-demo/:templateId" element={<TemplatePreviewDemo />} />
        <Route path="/create/:templateId" element={<PageWrapper><Builder /></PageWrapper>} />
        <Route path="/preview/:draftId" element={<PageWrapper><FullscreenPreview /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/drafts" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><AuthPage /></PageWrapper>} />
        <Route path="/success" element={<PageWrapper><SuccessPage /></PageWrapper>} />
        <Route path="/p/:id" element={<PageWrapper><RecipientPage /></PageWrapper>} />
        <Route path="/privacy" element={<PageWrapper><PrivacyPolicy /></PageWrapper>} />
        <Route path="/terms" element={<PageWrapper><TermsOfService /></PageWrapper>} />
        <Route path="/romantic-sequence" element={<RomanticSequencePlayer />} />
      </Routes>
    </Suspense>
  );

  if (disableMotion) {
    return routesContent;
  }

  return (
    <AnimatePresence mode="wait">
      {routesContent}
    </AnimatePresence>
  );
};

const MOBILE_QUERY = '(max-width: 767px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

const AppRoot = () => {
  const [mobileLiteMode, setMobileLiteMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const reducedQuery = window.matchMedia(REDUCED_QUERY);

    const syncMode = () => {
      setMobileLiteMode(mobileQuery.matches || reducedQuery.matches);
    };

    syncMode();
    mobileQuery.addEventListener('change', syncMode);
    reducedQuery.addEventListener('change', syncMode);

    return () => {
      mobileQuery.removeEventListener('change', syncMode);
      reducedQuery.removeEventListener('change', syncMode);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('mobile-lite', mobileLiteMode);
    return () => root.classList.remove('mobile-lite');
  }, [mobileLiteMode]);

  return (
    <MotionConfig reducedMotion={mobileLiteMode ? 'always' : 'never'}>
      <AuthProvider>
        <Router>
          <AnimatedRoutes disableMotion={mobileLiteMode} />
        </Router>
      </AuthProvider>
    </MotionConfig>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
)
