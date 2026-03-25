import React from 'react';
import { motion } from 'motion/react';
import { Camera, ArrowRight, Star, Users, Briefcase } from 'lucide-react';

interface HeroProps {
  onViewChange: (view: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewChange }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-matte-black">
      {/* Background Parallax Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1920" 
          alt="Photography Background" 
          className="w-full h-full object-cover opacity-30 scale-105 animate-slow-zoom"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-matte-black via-matte-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-3xl space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gold-500/10 rounded-full border border-gold-500/20 mb-10">
              <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
              <span className="text-[10px] font-bold gold-text uppercase tracking-[0.3em]">Agência de Fotografia Premium</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] mb-8">
              Elicha Photograph <span className="gold-shimmer italic">O Inconfundível</span>
            </h1>
            
            <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl">
              Capturando momentos únicos com excelência e sofisticação. HC Fotógrafo transforma sua visão em arte eterna com um olhar moderno e criativo.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-wrap gap-6"
          >
            <button 
              onClick={() => onViewChange('portfolio')}
              className="gold-button flex items-center gap-3 group"
            >
              Ver Portfólio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onViewChange('booking')}
              className="outline-button"
            >
              Agendar Sessão
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="grid grid-cols-3 gap-12 pt-12 border-t border-white/5"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gold-400">
                <Users className="w-4 h-4" />
                <span className="text-2xl font-serif font-bold tracking-tighter text-white">5.7k+</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">Seguidores</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gold-400">
                <Camera className="w-4 h-4" />
                <span className="text-2xl font-serif font-bold tracking-tighter text-white">568+</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">Trabalhos</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gold-400">
                <Briefcase className="w-4 h-4" />
                <span className="text-2xl font-serif font-bold tracking-tighter text-white">100%</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">Satisfação</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 hidden lg:block opacity-50">
        <div className="relative w-full h-full">
          <div className="absolute top-10 right-10 w-64 h-80 rounded-3xl overflow-hidden border border-white/10 rotate-6 hover:rotate-0 transition-transform duration-700">
            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600" alt="Wedding" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-10 right-40 w-64 h-80 rounded-3xl overflow-hidden border border-white/10 -rotate-12 hover:rotate-0 transition-transform duration-700">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" alt="Event" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};
