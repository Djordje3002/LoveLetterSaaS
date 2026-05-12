import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const { user } = useAuth();

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Templates', href: '/templates' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'How it works', href: '/#how-it-works', type: 'anchor' },
  ];

  return (
    <nav className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%_-_1.5rem)] max-w-6xl transition-all duration-300 ${
      isScrolled ? 'scale-[0.995]' : 'scale-100'
    }`}>
      <div className="rounded-none border-0 bg-transparent shadow-none px-1 py-1 md:rounded-full md:border md:border-white/80 md:bg-white/78 md:backdrop-blur-2xl md:shadow-[0_18px_50px_rgba(45,16,55,0.12)] md:px-4 md:py-3">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="h-11 w-11 rounded-full bg-[#fff4f8] border border-[#f1d5e1] shadow-sm p-1.5 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="LovePage"
                className="h-full w-full object-contain rounded-full"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#241832] leading-none">LovePage</p>
              <p className="text-[11px] text-secondary leading-none mt-1">Private love pages</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              link.type === 'anchor' ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[#3a2a46] hover:bg-[#fff1f5] hover:text-primary-pink transition-colors"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[#3a2a46] hover:bg-[#fff1f5] hover:text-primary-pink transition-colors"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <span className="max-w-[190px] truncate text-xs text-secondary font-medium px-3 py-2 rounded-full bg-[#fff6f9] border border-[#f2dbe3]">
                {user.email}
              </span>
            ) : (
              <>
                <button onClick={() => openAuth('signin')} className="px-4 py-2 rounded-full text-sm font-semibold text-[#3a2a46] bg-[#fff7fa] border border-[#f3dbe5] hover:border-primary-pink hover:text-primary-pink transition-colors">
                  Sign in
                </button>
                <button onClick={() => openAuth('signup')} className="px-4 py-2 rounded-full text-sm font-semibold bg-[#1a1025] text-white hover:bg-[#261536] transition-colors">
                  Sign up
                </button>
              </>
            )}
            <Link to="/templates" className="inline-flex items-center gap-2 rounded-full bg-pink-gradient px-5 py-2 text-sm font-bold text-white shadow-lg shadow-pink-500/20">
              <Sparkles size={16} />
              Create yours
            </Link>
          </div>

          <button 
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#f1d8e2] bg-white text-[#241832]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[calc(100%+0.65rem)] left-0 right-0 rounded-[28px] border border-[#f1dbe3] bg-white/95 backdrop-blur-2xl p-5 md:hidden shadow-[0_20px_50px_rgba(37,15,45,0.15)]"
          >
            <div className="flex flex-col gap-4 items-stretch text-center">
              {navLinks.map((link) => (
                link.type === 'anchor' ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="rounded-2xl border border-[#f3dbe5] bg-[#fff8fb] py-3 text-base font-medium text-[#3a2a46]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="rounded-2xl border border-[#f3dbe5] bg-[#fff8fb] py-3 text-base font-medium text-[#3a2a46]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                )
              ))}
              {user ? (
                null
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-2xl border border-[#f2dbe3] bg-white py-3 font-semibold text-[#3a2a46]"
                    onClick={() => {
                      openAuth('signin');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl bg-[#1a1025] py-3 font-semibold text-white"
                    onClick={() => {
                      openAuth('signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign up
                  </button>
                </>
              )}
              <Link 
                to="/templates" 
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-pink-gradient py-3 font-bold text-white shadow-lg shadow-pink-500/20"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sparkles size={16} />
                Create yours
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        title={authMode === 'signup' ? 'Create your account' : 'Welcome back'}
      />
    </nav>
  );
};

export default Navbar;
