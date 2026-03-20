import React from 'react';
import { ChefHat, MapPin, Phone, Instagram, Facebook, Twitter, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  onViewChange: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  return (
    <footer className="bg-black border-t border-white/10 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/20">
                <ChefHat className="text-black w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tighter gold-text">
                A <span className="text-white">FORNALHA</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Onde a tradição moçambicana encontra a sofisticação moderna. 
              Sabores autênticos de Chimoio preparados com paixão.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all border border-white/10">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all border border-white/10">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all border border-white/10">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 uppercase tracking-widest text-xs">Ir para Onde</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onViewChange('home')} className="text-white/50 hover:text-gold-400 transition-colors text-sm">Início</button>
              </li>
              <li>
                <button onClick={() => onViewChange('menu')} className="text-white/50 hover:text-gold-400 transition-colors text-sm">Menu</button>
              </li>
              <li>
                <button onClick={() => onViewChange('gallery')} className="text-white/50 hover:text-gold-400 transition-colors text-sm">Galeria</button>
              </li>
              <li>
                <button onClick={() => onViewChange('story')} className="text-white/50 hover:text-gold-400 transition-colors text-sm">Sobre nós</button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 uppercase tracking-widest text-xs">Suporte</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contato@afornalha.com" className="text-white/50 hover:text-gold-400 transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contate-nos
                </a>
              </li>
              <li>
                <button className="text-white/50 hover:text-gold-400 transition-colors text-sm">Termos de Serviço</button>
              </li>
              <li>
                <button className="text-white/50 hover:text-gold-400 transition-colors text-sm">Política de Privacidade</button>
              </li>
              <li>
                <button className="text-white/50 hover:text-gold-400 transition-colors text-sm flex items-center gap-2">
                  Faça negócios conosco
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white font-serif font-bold mb-6 uppercase tracking-widest text-xs">Localização</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/50 text-sm">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                <p>Av. 25 de Setembro, Chimoio, Moçambique</p>
              </div>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <Phone className="w-5 h-5 text-gold-400 shrink-0" />
                <p>+258 84 123 4567</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">
            © 2026 A FORNALHA RESTAURANTE. TODOS OS DIREITOS RESERVADOS.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Desenvolvido com Paixão em Chimoio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
