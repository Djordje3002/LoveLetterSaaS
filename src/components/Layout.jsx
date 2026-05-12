import Navbar from './Navbar';
import Footer from './Footer';
import HeartParticles from './HeartParticles';
import { motion } from 'framer-motion';

const Layout = ({ children, showFooter = true, showParticles = true }) => {
  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-[linear-gradient(180deg,#fff9fc_0%,#fffefe_45%,#fff9fc_100%)]">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      
      {showParticles && <HeartParticles />}
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow pt-24"
      >
        {children}
      </motion.main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
