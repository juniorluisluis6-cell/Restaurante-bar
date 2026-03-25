import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, Heart, Share2, Filter, Loader2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

interface Photo {
  id: string;
  url: string;
  category: 'Casamentos' | 'Eventos' | 'Ensaios' | 'Moda' | 'Corporativo';
  title: string;
}

const DEFAULT_PHOTOS: Photo[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', category: 'Casamentos', title: 'Amor Eterno' },
  { id: '2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', category: 'Eventos', title: 'Noite de Gala' },
  { id: '3', url: 'https://images.unsplash.com/photo-1520850832685-fc05206b8f4e?auto=format&fit=crop&q=80&w=800', category: 'Ensaios', title: 'Retrato Urbano' },
  { id: '4', url: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?auto=format&fit=crop&q=80&w=800', category: 'Moda', title: 'Vogue Style' },
  { id: '5', url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800', category: 'Corporativo', title: 'Liderança' },
  { id: '6', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800', category: 'Casamentos', title: 'O Sim' },
  { id: '7', url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=800', category: 'Eventos', title: 'Celebração' },
  { id: '8', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800', category: 'Ensaios', title: 'Olhar Profundo' },
  { id: '9', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800', category: 'Moda', title: 'Editorial' },
];

export const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<string>('Todos');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPhotos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Photo[];
      
      if (fetchedPhotos.length === 0) {
        setPhotos(DEFAULT_PHOTOS);
      } else {
        setPhotos(fetchedPhotos);
      }
      setLoading(false);
    }, (error) => {
      console.error('Portfolio fetch error:', error);
      setPhotos(DEFAULT_PHOTOS);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['Todos', 'Casamentos', 'Eventos', 'Ensaios', 'Moda', 'Corporativo'];

  const filteredPhotos = filter === 'Todos' 
    ? photos 
    : photos.filter(p => p.category === filter);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <section className="py-32 bg-matte-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12">
          <div className="max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-6xl font-serif font-bold gold-shimmer">Portfólio Inteligente</h2>
            <p className="text-white/40 font-light leading-relaxed">
              Uma curadoria exclusiva dos nossos trabalhos mais impactantes. Explore a arte da fotografia em alta resolução.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-4 h-4 text-gold-400 mr-2" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                  filter === cat 
                    ? 'bg-gold-500 border-gold-500 text-black shadow-lg shadow-gold-500/20' 
                    : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gold-400 font-bold uppercase tracking-[0.2em]">{photo.category}</p>
                      <h4 className="text-xl font-serif font-bold">{photo.title}</h4>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => toggleFavorite(photo.id, e)}
                        className={`w-10 h-10 rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
                          favorites.includes(photo.id) ? 'bg-gold-500 text-black border-gold-500' : 'bg-white/5 text-white hover:bg-white/20'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(photo.id) ? 'fill-current' : ''}`} />
                      </button>
                      <div className="w-10 h-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-matte-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-20"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title} 
                className="w-full h-full object-contain bg-black"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black to-transparent">
                <p className="text-gold-400 font-bold uppercase tracking-[0.3em] text-xs mb-4">{selectedPhoto.category}</p>
                <h3 className="text-4xl font-serif font-bold mb-6">{selectedPhoto.title}</h3>
                <div className="flex gap-6">
                  <button className="gold-button">Solicitar Orçamento</button>
                  <button className="outline-button flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Compartilhar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
