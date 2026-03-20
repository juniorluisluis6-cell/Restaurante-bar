import React from 'react';
import { motion } from 'motion/react';
import { MenuItem, MenuCategory } from '../types';
import { Plus, Clock, Star, Flame, Pizza, Utensils as Burger, Utensils, Coffee } from 'lucide-react';

interface MenuProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export const Menu: React.FC<MenuProps> = ({ items, onAddToCart }) => {
  const [activeCategory, setActiveCategory] = React.useState<MenuCategory | 'All'>('All');

  const categories: { id: MenuCategory | 'All', label: string, icon: React.ReactNode }[] = [
    { id: 'All', label: 'Todos', icon: <Utensils className="w-4 h-4" /> },
    { id: 'Chicken', label: 'Frango Grelhado', icon: <Flame className="w-4 h-4" /> },
    { id: 'Burgers', label: 'Hambúrgueres', icon: <Burger className="w-4 h-4" /> },
    { id: 'Pizzas', label: 'Pizzas', icon: <Pizza className="w-4 h-4" /> },
    { id: 'Sides', label: 'Acompanhamentos', icon: <Utensils className="w-4 h-4" /> },
    { id: 'Drinks', label: 'Bebidas', icon: <Coffee className="w-4 h-4" /> },
  ];

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gold-text">O Nosso Menu Requintado</h2>
        <div className="max-w-3xl mx-auto space-y-4 text-white/70 leading-relaxed">
          <p>
            No A Fornalha, o menu oferece uma variedade de pratos elaborados com simplicidade e sabor em mente. 
            Espere encontrar uma seleção de refeições bem preparadas, desde pizzas recém-assadas até pratos 
            substanciosos inspirados na culinária local. O menu equilibra favoritos conhecidos com toques criativos, 
            destacando ingredientes de qualidade e preparações descomplicadas.
          </p>
          <p>
            Entre as especialidades da casa, destacam-se as pizzas assadas em forno a lenha, muito elogiadas pela 
            massa crocante e pelos recheios generosos. Além delas, os clientes encontrarão opções que harmonizam 
            perfeitamente com uma seleção criteriosa de vinhos. O cardápio foi pensado para agradar a diversos 
            paladares, garantindo uma experiência satisfatória, seja para um lanche rápido ou uma refeição completa.
          </p>
          <p className="text-sm italic text-white/50">
            A apresentação é clara, embora algumas traduções possam exigir orientação, o que confere um toque local 
            à experiência gastronômica. No geral, o menu do A Fornalha convida à exploração dos sabores moçambicanos 
            num ambiente moderno.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
              activeCategory === cat.id 
                ? 'bg-gold-500 border-gold-500 text-black shadow-lg shadow-gold-500/20' 
                : 'bg-white/5 border-white/10 text-white/70 hover:border-gold-400/50'
            }`}
          >
            {cat.icon}
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card group overflow-hidden flex flex-col h-full"
          >
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={item.imageUrl || `https://picsum.photos/seed/${item.name}/400/400`} 
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-gold-400 font-bold text-sm">MT {item.price.toLocaleString()}</span>
              </div>
              {item.prepTime && (
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold-400" />
                  <span className="text-white text-[10px]">{item.prepTime} min</span>
                </div>
              )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">
                  {item.category === 'Chicken' ? 'Frango' : 
                   item.category === 'Burgers' ? 'Hambúrgueres' :
                   item.category === 'Pizzas' ? 'Pizzas' :
                   item.category === 'Sides' ? 'Acompanhamentos' :
                   item.category === 'Drinks' ? 'Bebidas' : item.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                  <span className="text-[10px] text-white/60">4.9</span>
                </div>
              </div>
              <h3 className="text-xl font-serif font-bold mb-2 group-hover:gold-text transition-colors">{item.name}</h3>
              <p className="text-white/50 text-xs mb-6 line-clamp-2 flex-grow">{item.description}</p>
              
              <button 
                onClick={() => onAddToCart(item)}
                disabled={!item.available}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                  item.available 
                    ? 'bg-white/10 hover:bg-gold-500 hover:text-black border border-white/10 hover:border-gold-500' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                {item.available ? (
                  <>
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-semibold">Adicionar ao Carrinho</span>
                  </>
                ) : (
                  <span className="text-sm font-semibold">Esgotado</span>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
