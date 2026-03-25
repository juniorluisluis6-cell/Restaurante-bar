import React from 'react';
import { motion } from 'motion/react';
import { Check, Star, Zap, Award, Diamond } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: string;
  features: string[];
  recommended?: boolean;
}

const PACKAGES: Package[] = [
  {
    id: 'bronze',
    name: 'Pacote Bronze',
    icon: <Zap className="w-6 h-6" />,
    price: 'MT 5.000',
    features: [
      '20 Fotos Editadas',
      '1 Hora de Cobertura',
      'Entrega Digital em 7 dias',
      '1 Localização',
      'Galeria Online Privada'
    ]
  },
  {
    id: 'silver',
    name: 'Pacote Silver',
    icon: <Award className="w-6 h-6" />,
    price: 'MT 12.000',
    features: [
      '50 Fotos Editadas',
      '3 Horas de Cobertura',
      'Entrega Digital em 5 dias',
      '2 Localizações',
      'Retoque Profissional VIP'
    ]
  },
  {
    id: 'gold',
    name: 'Pacote Gold',
    icon: <Star className="w-6 h-6" />,
    price: 'MT 25.000',
    recommended: true,
    features: [
      '100 Fotos Editadas',
      '6 Horas de Cobertura',
      'Entrega Digital em 3 dias',
      'Álbum Digital Premium',
      'Vídeo Teaser de 1 min',
      'Atendimento Prioritário'
    ]
  },
  {
    id: 'diamond',
    name: 'Pacote Diamond (VIP)',
    icon: <Diamond className="w-6 h-6" />,
    price: 'MT 50.000+',
    features: [
      'Fotos Ilimitadas (Editadas)',
      'Cobertura Dia Inteiro',
      'Entrega em 48 Horas',
      'Álbum Físico Luxuoso',
      'Vídeo Completo do Evento',
      'Suporte VIP 24/7',
      'HC Fotógrafo Exclusivo'
    ]
  }
];

export const Packages: React.FC = () => {
  return (
    <section className="py-32 bg-matte-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
          <h2 className="text-4xl md:text-6xl font-serif font-bold gold-shimmer">Planos e Pacotes Luxuosos</h2>
          <p className="text-white/40 font-light leading-relaxed">
            Escolha o nível de excelência que seu momento merece. Cada pacote foi desenhado para oferecer a máxima sofisticação e qualidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`glass-card p-10 flex flex-col h-full relative group transition-all duration-500 ${
                pkg.recommended ? 'border-gold-500/50 shadow-2xl shadow-gold-500/10 scale-105 z-10' : 'hover:border-white/20'
              }`}
            >
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-500 text-black text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
                  Mais Popular
                </div>
              )}

              <div className="w-16 h-16 bg-gold-500/10 rounded-2xl flex items-center justify-center mb-10 border border-gold-500/20 group-hover:scale-110 transition-transform duration-500">
                <div className="text-gold-400">{pkg.icon}</div>
              </div>

              <h3 className="text-2xl font-serif font-bold mb-4">{pkg.name}</h3>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-4xl font-serif font-bold gold-text">{pkg.price}</span>
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Base</span>
              </div>

              <ul className="space-y-6 mb-12 flex-grow">
                {pkg.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-4 text-sm text-white/40 font-light group-hover:text-white/60 transition-colors">
                    <Check className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                pkg.recommended ? 'bg-gold-500 text-black hover:bg-gold-600' : 'border border-white/10 text-white/60 hover:border-gold-500 hover:text-gold-400'
              }`}>
                Selecionar Plano
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
