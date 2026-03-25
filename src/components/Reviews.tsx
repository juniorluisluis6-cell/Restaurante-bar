import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    id: '1',
    name: 'Ana Paula',
    role: 'Noiva',
    content: 'O trabalho do HC Fotógrafo é simplesmente inconfundível. Ele capturou cada detalhe do nosso casamento com uma elegância que nunca vi antes. As fotos parecem saídas de uma revista de luxo.',
    rating: 5,
    date: '15 Jan 2026'
  },
  {
    id: '2',
    name: 'Carlos Alberto',
    role: 'CEO, TechManica',
    content: 'Profissionalismo impecável. Precisávamos de fotos corporativas que transmitissem autoridade e modernidade, e o resultado superou todas as expectativas. Recomendo fortemente.',
    rating: 5,
    date: '02 Fev 2026'
  },
  {
    id: '3',
    name: 'Isabel Bento',
    role: 'Modelo',
    content: 'Trabalhar com a Elicha Photograph é uma experiência premium. O olhar criativo e a direção durante o ensaio fazem toda a diferença. Inconfundível em cada clique!',
    rating: 5,
    date: '20 Mar 2026'
  }
];

export const Reviews: React.FC = () => {
  return (
    <section className="py-32 bg-matte-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif font-bold gold-shimmer">Avaliações e Reputação</h2>
            <p className="text-white/40 font-light leading-relaxed">
              O que nossos clientes VIP dizem sobre a experiência inconfundível de ser fotografado por nossa agência.
            </p>
          </div>
          
          <div className="glass-card p-8 flex items-center gap-8 border-gold-500/20">
            <div className="text-center">
              <p className="text-4xl font-serif font-bold gold-text">4.9</p>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-gold-400 fill-gold-400" />)}
              </div>
            </div>
            <div className="h-12 w-[1px] bg-white/10" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Baseado em</p>
              <p className="text-sm font-bold">322 Avaliações</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="glass-card p-10 relative group hover:border-gold-500/30 transition-all duration-500"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-gold-500/5 group-hover:text-gold-500/10 transition-colors" />
              
              <div className="flex gap-1 mb-8">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gold-400 fill-gold-400" />
                ))}
              </div>

              <p className="text-white/60 font-light leading-relaxed mb-10 italic">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 pt-8 border-t border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                  <img src={`https://i.pravatar.cc/100?u=${review.id}`} alt={review.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold">{review.name}</h4>
                    <CheckCircle className="w-3 h-3 text-gold-400" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
