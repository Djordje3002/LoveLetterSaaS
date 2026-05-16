import Navbar from './Navbar';
import Footer from './Footer';
import HeartParticles from './HeartParticles';
import { motion, useReducedMotion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

const Layout = ({ children, showFooter = true, showParticles = true, showDecorations = true }) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const simplifyMobileVisuals = isMobile || prefersReducedMotion;

  const MainElement = simplifyMobileVisuals ? 'main' : motion.main;
  const mainProps = simplifyMobileVisuals
    ? {}
    : {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    };

  return (
    <div className={`min-h-screen relative flex flex-col overflow-x-hidden ${simplifyMobileVisuals ? 'bg-[#fffafc]' : 'bg-[linear-gradient(180deg,#fff9fc_0%,#fffefe_45%,#fff9fc_100%)]'}`}>
      <Navbar />
      
      {/* Background Blobs */}
      {showDecorations && !simplifyMobileVisuals && <div className="bg-blob blob-1"></div>}
      {showDecorations && !simplifyMobileVisuals && <div className="bg-blob blob-2"></div>}
      
      {showDecorations && showParticles && !simplifyMobileVisuals && <HeartParticles />}
      
      <MainElement {...mainProps} className="flex-grow pt-24">
        {children}
      </MainElement>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
