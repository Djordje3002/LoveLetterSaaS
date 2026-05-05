import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-primary-light py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="text-primary-pink fill-primary-pink" size={28} />
          <span className="font-playfair text-2xl font-bold text-dark italic">LovePage</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            link.type === 'anchor' ? (
              <a
                key={link.name}
                href={link.href}
                className="text-dark font-medium hover:text-primary-pink transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="text-dark font-medium hover:text-primary-pink transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-secondary font-medium max-w-[160px] truncate">{user.email}</span>
            </>
          ) : (
            <>
              <button onClick={() => openAuth('signin')} className="btn-outline py-2 px-4 text-sm">Sign in</button>
              <button onClick={() => openAuth('signup')} className="btn-primary py-2 px-4 text-sm">Sign up</button>
            </>
          )}
          <Link to="/templates" className="btn-primary">
            Create yours →
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-dark"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-primary-light p-6 md:hidden shadow-lg"
          >
            <div className="flex flex-col gap-6 items-center text-center">
              {navLinks.map((link) => (
                link.type === 'anchor' ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-dark"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-lg font-medium text-dark"
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
                    className="btn-outline w-full"
                    onClick={() => {
                      openAuth('signin');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="btn-primary w-full"
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
                className="btn-primary w-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create yours →
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
