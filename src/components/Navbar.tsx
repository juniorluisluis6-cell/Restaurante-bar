import React from 'react';
import { ShoppingCart, User, LogOut, Menu as MenuIcon, X, ChefHat, LayoutDashboard, MapPin, Star, Camera, Info, Home, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';

interface NavbarProps {
  user: any | null;
  profile: UserProfile | null;
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onViewChange: (view: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  profile, 
  cartCount, 
  onCartClick, 
  onLoginClick, 
  onViewChange,
  currentView
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: <Home className="w-4 h-4" /> },
    { id: 'menu', label: 'Menu', icon: <Utensils className="w-4 h-4" /> },
    { id: 'location', label: 'Localização', icon: <MapPin className="w-4 h-4" /> },
    { id: 'reviews', label: 'Críticas', icon: <Star className="w-4 h-4" /> },
    { id: 'gallery', label: 'Galeria', icon: <Camera className="w-4 h-4" /> },
    { id: 'story', label: 'História', icon: <Info className="w-4 h-4" /> },
  ];

  if (user) {
    navItems.push({ id: 'dashboard', label: profile?.role === 'customer' ? 'Minha Conta' : 'Painel', icon: <LayoutDashboard className="w-4 h-4" /> });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onViewChange('home')}
        >
          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/20">
            <ChefHat className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tighter gold-text">
            A <span className="text-white">FORNALHA</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`text-sm font-medium transition-colors hover:text-gold-400 flex items-center gap-1 ${
                currentView === item.id ? 'text-gold-400' : 'text-white/70'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onCartClick}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-white">{profile?.name || user.user_metadata?.full_name}</p>
                <p className="text-[10px] text-gold-400 uppercase tracking-widest">{profile?.role === 'admin' ? 'Administrador' : profile?.role === 'staff' ? 'Funcionário' : 'Cliente'}</p>
              </div>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-red-400"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="gold-button !py-2 !px-4 text-sm"
            >
              Entrar
            </button>
          )}

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-b border-white/10 p-4"
          >
            <div className="flex flex-col gap-4">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-lg font-serif ${
                    currentView === item.id ? 'text-gold-400' : 'text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
