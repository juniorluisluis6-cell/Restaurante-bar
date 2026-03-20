import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

const INITIAL_REVIEWS: Review[] = [
  { id: '1', author: 'João M.', rating: 5, comment: 'Melhor pizza de Chimoio! Massa crocante e ingredientes frescos.', date: 'Há 2 dias', likes: 12 },
  { id: '2', author: 'Maria S.', rating: 4, comment: 'Ambiente moderno e limpo. Ótimo para jantar em família.', date: 'Há 1 semana', likes: 8 },
  { id: '3', author: 'Carlos B.', rating: 5, comment: 'Boa comida e ótimo atendimento. O frango peri-peri é sensacional.', date: 'Há 2 semanas', likes: 15 },
  { id: '4', author: 'Ana L.', rating: 4, comment: 'Pizzas muito saborosas, mas o tempo de espera foi um pouco longo.', date: 'Há 3 semanas', likes: 5 },
];

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const review: Review = {
      id: Date.now().toString(),
      author: 'Você',
      rating: newRating,
      comment: newComment,
      date: 'Agora mesmo',
      likes: 0,
    };
    setReviews([review, ...reviews]);
    setIsAddingReview(false);
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gold-text">Críticas & Avaliações</h2>
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-1 text-gold-400">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`w-6 h-6 ${i <= 4 ? 'fill-current' : 'text-white/20'}`} />
            ))}
          </div>
          <span className="text-2xl font-bold">4.2</span>
          <span className="text-white/40">|</span>
          <span className="text-white/60">322 críticas totais</span>
        </div>
        <button 
          onClick={() => setIsAddingReview(true)}
          className="gold-button flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" /> Adicionar Crítica
        </button>
      </div>

      <AnimatePresence>
        {isAddingReview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="glass-card w-full max-w-md p-8">
              <h3 className="text-2xl font-serif font-bold mb-6">Sua Avaliação</h3>
              <form onSubmit={handleAddReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-white/60">Nota</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNewRating(i)}
                        className={`p-2 rounded-full transition-colors ${i <= newRating ? 'text-gold-400' : 'text-white/20'}`}
                      >
                        <Star className={`w-8 h-8 ${i <= newRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-widest text-white/60">Comentário</label>
                  <textarea
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-gold-400 outline-none transition-colors min-h-[120px]"
                    placeholder="Conte-nos sua experiência..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingReview(false)}
                    className="flex-1 px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 gold-button"
                  >
                    Publicar
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20">
                  <User className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <h4 className="font-bold">{review.author}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gold-400">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-current' : 'text-white/20'}`} />
                ))}
              </div>
            </div>
            <p className="text-white/70 leading-relaxed mb-6 italic">"{review.comment}"</p>
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <button className="flex items-center gap-2 text-xs text-white/40 hover:text-gold-400 transition-colors">
                <ThumbsUp className="w-4 h-4" /> {review.likes} Útil
              </button>
              <button className="flex items-center gap-2 text-xs text-white/40 hover:text-gold-400 transition-colors">
                <MessageSquare className="w-4 h-4" /> Responder
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
