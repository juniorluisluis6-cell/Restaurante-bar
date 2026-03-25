import React, { useState, useEffect } from 'react';
import { Camera, Menu, X, User, Instagram, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  user: any;
  profile: any;
  onLoginClick: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ user, profile, onLoginClick, onViewChange, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Início' },
    { id: 'portfolio', label: 'Portfólio' },
    { id: 'packages', label: 'Pacotes' },
    { id: 'booking', label: 'Agendamento' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-matte-black/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onViewChange('home')}
          className="flex items-center gap-3 group"
        >
          <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/20 group-hover:scale-110 transition-transform duration-500">
            <Camera className="text-black w-6 h-6" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xl font-serif font-bold tracking-tighter gold-shimmer">ELICHA PHOTOGRAPH</span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/40 font-bold">O Inconfundível</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => onViewChange(link.id)}
              className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 relative group ${
                currentView === link.id ? 'text-gold-400' : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-2 left-0 h-[1px] bg-gold-400 transition-all duration-500 ${
                currentView === link.id ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 border-r border-white/10 pr-6 mr-2">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="text-white/40 hover:text-gold-400 transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          
          <button 
            onClick={user ? () => onViewChange('dashboard') : onLoginClick}
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-gold-400 transition-colors">
                {user ? 'Minha Área' : 'Acesso VIP'}
              </p>
              <p className="text-xs font-serif font-bold">
                {user ? (profile?.name || 'Cliente') : 'Entrar'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold-500/50 transition-colors overflow-hidden">
              {user ? (
                <img src={`https://i.pravatar.cc/100?u=${user.id}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-gold-400" />
              )}
            </div>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-matte-black/95 backdrop-blur-2xl border-b border-white/5 p-8 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => {
                    onViewChange(link.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm uppercase tracking-[0.2em] font-bold ${
                    currentView === link.id ? 'text-gold-400' : 'text-white/60'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
