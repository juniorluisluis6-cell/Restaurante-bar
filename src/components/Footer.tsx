import React from 'react';
import { Camera, Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

interface FooterProps {
  onViewChange: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  return (
    <footer className="bg-matte-black border-t border-white/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center shadow-lg shadow-gold-500/20">
                <Camera className="text-black w-6 h-6" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-serif font-bold tracking-tighter gold-shimmer">ELICHA PHOTOGRAPH</span>
                <span className="text-[8px] uppercase tracking-[0.3em] text-white/40 font-bold">O Inconfundível</span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed font-light">
              Capturando momentos únicos com excelência e sofisticação. Especialistas em fotografia premium para casamentos, eventos e ensaios corporativos.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all duration-500 border border-white/5 hover:border-gold-500/50">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-gold-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-10">Explorar</h4>
            <ul className="space-y-4 text-sm text-white/40 font-light">
              <li><button onClick={() => onViewChange('home')} className="hover:text-gold-400 transition-colors">Início</button></li>
              <li><button onClick={() => onViewChange('portfolio')} className="hover:text-gold-400 transition-colors">Portfólio</button></li>
              <li><button onClick={() => onViewChange('packages')} className="hover:text-gold-400 transition-colors">Pacotes Luxuosos</button></li>
              <li><button onClick={() => onViewChange('booking')} className="hover:text-gold-400 transition-colors">Agendamento VIP</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-10">Contato</h4>
            <ul className="space-y-6 text-sm text-white/40 font-light">
              <li className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-gold-400 mt-1" />
                <span>Chimoio, Manica<br />Moçambique</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-gold-400" />
                <span>+258 84 000 0000</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-gold-400" />
                <span>contato@elichaphoto.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-gold-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-10">Newsletter VIP</h4>
            <p className="text-white/40 text-sm mb-8 font-light leading-relaxed">
              Receba convites exclusivos para ensaios temáticos e ofertas premium.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Seu e-mail de luxo"
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-sm focus:border-gold-400 outline-none transition-all duration-500 group-hover:border-white/20"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold-500 text-black p-2.5 rounded-full hover:bg-gold-600 transition-all duration-300 shadow-lg shadow-gold-500/20">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">
          <p>© 2026 Elicha Photograph O Inconfundível. Todos os Direitos Reservados.</p>
          <div className="flex gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
