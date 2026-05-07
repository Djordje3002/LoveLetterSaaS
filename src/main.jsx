import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './index.css'

// Real components
import LandingPage from './pages/LandingPage'
import TemplateGallery from './pages/TemplateGallery'
import TemplateDetail from './pages/TemplateDetail'
import Builder from './pages/Builder'
import FullscreenPreview from './pages/FullscreenPreview'
import SuccessPage from './pages/SuccessPage'
import RecipientPage from './pages/RecipientPage'
import PageWrapper from './components/PageWrapper'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import DashboardPage from './pages/DashboardPage'
import AuthPage from './pages/AuthPage'
import { AuthProvider } from './context/AuthContext'
import RomanticSequencePlayer from './components/RomanticSequencePlayer'

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/templates" element={<PageWrapper><TemplateGallery /></PageWrapper>} />
        <Route path="/templates/:templateId" element={<PageWrapper><TemplateDetail /></PageWrapper>} />
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
    </AnimatePresence>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
)
