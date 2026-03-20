import React, { useState } from 'react';
import { Camera, Plus, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Photo {
  id: string;
  url: string;
  category: 'Comida' | 'Ambiente' | 'Bebidas';
  author: string;
}

const INITIAL_PHOTOS: Photo[] = [
  { id: '1', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/0', category: 'Ambiente', author: 'A Fornalha' },
  { id: '2', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/1', category: 'Bebidas', author: 'A Fornalha' },
  { id: '3', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/2', category: 'Comida', author: 'A Fornalha' },
  { id: '4', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/3', category: 'Comida', author: 'A Fornalha' },
  { id: '5', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/4', category: 'Comida', author: 'A Fornalha' },
  { id: '6', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/5', category: 'Comida', author: 'A Fornalha' },
  { id: '7', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/6', category: 'Comida', author: 'A Fornalha' },
  { id: '8', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/7', category: 'Comida', author: 'A Fornalha' },
  { id: '9', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/8', category: 'Comida', author: 'A Fornalha' },
  { id: '10', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/9', category: 'Comida', author: 'A Fornalha' },
  { id: '11', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/0', category: 'Comida', author: 'A Fornalha' },
  { id: '12', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/1', category: 'Ambiente', author: 'A Fornalha' },
  { id: '13', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/2', category: 'Comida', author: 'A Fornalha' },
  { id: '14', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/3', category: 'Bebidas', author: 'A Fornalha' },
  { id: '15', url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/4', category: 'Ambiente', author: 'A Fornalha' },
];

export const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [filter, setFilter] = useState<'Todos' | 'Comida' | 'Ambiente' | 'Bebidas'>('Todos');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos = filter === 'Todos' ? photos : photos.filter(p => p.category === filter);

  const handleUpload = () => {
    alert('Funcionalidade de upload em breve! Por favor, use o WhatsApp para nos enviar suas fotos.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gold-text">Nossa Galeria</h2>
          <p className="text-white/40 max-w-md">Explore os sabores, o ambiente e os momentos especiais d'A Fornalha.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {['Todos', 'Comida', 'Ambiente', 'Bebidas'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2 rounded-full border border-white/10 text-sm font-bold transition-all ${
                filter === cat ? 'bg-gold-500 text-black border-gold-500' : 'hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
          <button 
            onClick={handleUpload}
            className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-black transition-all"
            title="Adicionar Foto"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo, i) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative aspect-square rounded-3xl overflow-hidden border border-white/10 cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img 
              src={photo.url} 
              alt={photo.category} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-1">{photo.category}</p>
                  <p className="font-serif font-bold">Por {photo.author}</p>
                </div>
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedPhoto(null)}
          >
            <button 
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.category} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                <p className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-2">{selectedPhoto.category}</p>
                <h4 className="text-2xl font-serif font-bold">Foto por {selectedPhoto.author}</h4>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
