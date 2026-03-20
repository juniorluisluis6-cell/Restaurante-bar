import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Flame, 
  Utensils as Burger, 
  Pizza, 
  Utensils, 
  Coffee, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Twitter,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  AlertCircle,
  MessageCircle,
  Share2,
  Heart,
  Send,
  Navigation,
  Camera,
  Info,
  Home,
  ShoppingCart
} from 'lucide-react';
import { supabase, SupabaseUserProfile, SupabaseMenuItem, SupabaseOrder, SupabaseReservation } from './supabase';
import { UserProfile, MenuItem, Order, Reservation, OrderItem, OrderType, PaymentMethod } from './types';
import { Navbar } from './components/Navbar';
import { Menu } from './components/Menu';
import { Cart } from './components/Cart';
import { Dashboard as AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { OrderTracking } from './components/OrderTracking';
import { Story } from './components/Story';
import { Location } from './components/Location';
import { Reviews } from './components/Reviews';
import { Gallery } from './components/Gallery';
import { ChatBot } from './components/ChatBot';
import { LoginModal } from './components/LoginModal';
import { Footer } from './components/Footer';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, errorInfo: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, errorInfo: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
          <div className="glass-card p-8 max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="text-red-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold">Algo deu errado</h2>
            <p className="text-white/60 text-sm">
              Encontramos um erro inesperado. Por favor, tente atualizar a página.
            </p>
            {this.state.errorInfo && (
              <pre className="bg-black/50 p-4 rounded-xl text-[10px] text-red-400/70 overflow-x-auto text-left font-mono">
                {this.state.errorInfo}
              </pre>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="gold-button w-full"
            >
              Atualizar Página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Auth Listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const supabaseUser = session?.user || null;
      setUser(supabaseUser);
      
      if (supabaseUser) {
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (userProfile) {
          setProfile({
            uid: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            role: userProfile.role,
            points: userProfile.points,
            createdAt: { toDate: () => new Date(userProfile.created_at), toMillis: () => new Date(userProfile.created_at).getTime() } as any
          });
        } else {
          // Create new profile
          const newProfileData = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata.full_name || 'Convidado',
            email: supabaseUser.email || '',
            role: 'customer',
            points: 0
          };
          const { data: createdProfile, error: createError } = await supabase
            .from('users')
            .insert([newProfileData])
            .select()
            .single();
          
          if (createdProfile) {
            setProfile({
              uid: createdProfile.id,
              name: createdProfile.name,
              email: createdProfile.email,
              role: createdProfile.role,
              points: createdProfile.points,
              createdAt: { toDate: () => new Date(createdProfile.created_at), toMillis: () => new Date(createdProfile.created_at).getTime() } as any
            });
          }
        }
      } else {
        setProfile(null);
      }
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data Fetching & Realtime
  useEffect(() => {
    if (!isAuthReady) return;

    const fetchMenu = async () => {
      const { data, error } = await supabase.from('menu').select('*');
      if (data) {
        const items = data.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          available: item.available,
          prepTime: item.prep_time,
          imageUrl: item.image_url
        } as MenuItem));
        setMenuItems(items);
        if (items.length === 0 && profile?.role === 'admin') {
          seedMenu();
        }
      }
    };

    const fetchOrders = async () => {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (profile?.role !== 'staff' && profile?.role !== 'admin' && user) {
        query = query.eq('customer_id', user.id);
      }
      const { data, error } = await query;
      if (data) {
        setOrders(data.map(o => ({
          id: o.id,
          customerId: o.customer_id,
          items: o.items,
          total: o.total,
          status: o.status,
          type: o.type,
          address: o.address,
          paymentMethod: o.payment_method,
          paymentPhone: o.payment_phone,
          createdAt: { toDate: () => new Date(o.created_at), toMillis: () => new Date(o.created_at).getTime() } as any
        } as Order)));
      }
    };

    const fetchReservations = async () => {
      let query = supabase.from('reservations').select('*').order('created_at', { ascending: false });
      if (profile?.role !== 'staff' && profile?.role !== 'admin' && user) {
        query = query.eq('customer_id', user.id);
      }
      const { data, error } = await query;
      if (data) {
        setReservations(data.map(r => ({
          id: r.id,
          customerId: r.customer_id,
          customerName: r.customer_name,
          date: r.date,
          time: r.time,
          guests: r.guests,
          status: r.status,
          createdAt: { toDate: () => new Date(r.created_at), toMillis: () => new Date(r.created_at).getTime() } as any
        } as Reservation)));
      }
    };

    fetchMenu();
    fetchOrders();
    fetchReservations();

    // Set up Realtime subscriptions
    const menuChannel = supabase.channel('menu-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'menu' }, fetchMenu).subscribe();
    const ordersChannel = supabase.channel('orders-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders).subscribe();
    const resChannel = supabase.channel('res-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchReservations).subscribe();

    return () => {
      supabase.removeChannel(menuChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(resChannel);
    };
  }, [isAuthReady, user, profile]);

  const seedMenu = async () => {
    const initialMenu = [
      { name: 'Pizza A Fornalha', description: 'Nossa pizza assinatura com ingredientes frescos, massa artesanal e segredo da casa.', price: 650, category: 'Pizzas', available: true, prep_time: 25, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/0' },
      { name: 'Frango Grelhado Especial', description: 'Frango suculento grelhado na brasa com nosso molho peri-peri artesanal.', price: 450, category: 'Chicken', available: true, prep_time: 30, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/2' },
      { name: 'Hambúrguer Gourmet', description: 'Carne bovina premium, queijo derretido, alface crocante e molho especial no pão brioche.', price: 400, category: 'Burgers', available: true, prep_time: 15, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/2' },
      { name: 'Cocktail Tropical', description: 'Uma mistura refrescante de frutas tropicais e destilados premium.', price: 350, category: 'Drinks', available: true, prep_time: 10, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/3' },
      { name: 'Pizza Margherita', description: 'Clássica pizza italiana com molho de tomate, mozzarella fresca e manjericão.', price: 500, category: 'Pizzas', available: true, prep_time: 20, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/3' },
      { name: 'Batata Frita Especial', description: 'Porção generosa de batatas crocantes temperadas com sal marinho e ervas.', price: 200, category: 'Sides', available: true, prep_time: 15, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/4' },
      { name: 'Salada da Casa', description: 'Mix de folhas verdes, tomate cereja, pepino e molho vinagrete.', price: 250, category: 'Sides', available: true, prep_time: 10, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/5' },
      { name: 'Sumo Natural', description: 'Sumo de fruta da época espremido na hora.', price: 150, category: 'Drinks', available: true, prep_time: 5, image_url: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/6' },
    ];

    await supabase.from('menu').insert(initialMenu);
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.id);
      if (existing) {
        return prev.map(i => i.itemId === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.itemId === itemId) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.itemId !== itemId));
  };

  const handleCheckout = async (type: OrderType, payment: PaymentMethod, address?: string, paymentPhone?: string) => {
    if (!user) {
      handleLogin();
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = type === 'delivery' ? 150 : 0;
    const total = subtotal + deliveryFee;

    try {
      await supabase.from('orders').insert([{
        customer_id: user.id,
        items: cart,
        total,
        status: 'received',
        type,
        address: address || '',
        payment_method: payment,
        payment_phone: paymentPhone || ''
      }]);
      setCart([]);
      setIsCartOpen(false);
      setCurrentView('home');
      alert('Pedido realizado com sucesso! Acompanhe no seu painel.');
    } catch (err) {
      console.error('Checkout failed', err);
    }
  };

  const handleLogin = async () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentView('home');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('order-tracking');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen luxury-gradient">
        <Navbar 
          user={user} 
          profile={profile} 
          cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
          onLoginClick={handleLogin}
          onViewChange={setCurrentView}
          currentView={currentView}
        />

        <main className="pt-20">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Hero Section */}
                <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/40a0279c-091a-4284-9640-39403d516246/0" 
                      alt="A Fornalha" 
                      className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                  </div>

                  <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
                    <div className="max-w-2xl space-y-8">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-gold-500/20 rotate-3 group-hover:rotate-6 transition-transform">
                          <ChefHat className="w-12 h-12 text-black" />
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 rounded-full border border-gold-500/20 mb-6">
                          <Star className="w-4 h-4 text-gold-400 fill-current" />
                          <span className="text-[10px] font-bold gold-text uppercase tracking-widest">⭐ 4.2 (322 críticas)</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight">
                          A <span className="gold-shimmer italic">Fornalha</span>
                        </h1>
                        <p className="text-xl text-white/70 font-light leading-relaxed mt-6">
                          A melhor pizza e grelhados de Chimoio. Uma experiência gastronómica moderna, elegante e acolhedora.
                        </p>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap gap-4"
                      >
                        <button 
                          onClick={() => setCurrentView('menu')}
                          className="gold-button flex items-center gap-2"
                        >
                          <Utensils className="w-5 h-5" /> Ver Menu
                        </button>
                        <button 
                          onClick={() => setCurrentView('menu')}
                          className="red-button flex items-center gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" /> Fazer Pedido
                        </button>
                        <button 
                          onClick={() => setCurrentView('location')}
                          className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                          <MapPin className="w-5 h-5" /> Localização
                        </button>
                        <button 
                          onClick={() => setCurrentView('reviews')}
                          className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                          <Star className="w-5 h-5" /> Críticas
                        </button>
                      </motion.div>

                      <div className="flex items-center gap-4 pt-8">
                        <div className="flex -space-x-3">
                          {[1,2,3,4].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-black" referrerPolicy="no-referrer" />
                          ))}
                        </div>
                        <p className="text-xs text-white/60"><span className="text-white font-bold">2k+</span> Clientes Felizes</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Featured Categories */}
                <section className="py-24 bg-white/[0.02]">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                      <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold gold-text mb-4">Nossas Especialidades</h2>
                        <p className="text-white/50 max-w-md">Seleções cuidadosamente curadas que representam o coração d'A Fornalha.</p>
                      </div>
                      <button 
                        onClick={() => setCurrentView('menu')}
                        className="text-gold-400 font-bold flex items-center gap-2 hover:underline"
                      >
                        Ver Menu Completo <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { title: 'Pizzas Artesanais', icon: <Pizza />, img: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/0', desc: 'Massa fina assada na pedra com os ingredientes locais mais frescos.' },
                        { title: 'Grelhados & Carnes', icon: <Flame />, img: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/2', desc: 'Grelhados na brasa com perfeição com nossa mistura secreta de temperos.' },
                        { title: 'Bebidas Selecionadas', icon: <Coffee />, img: 'https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/3', desc: 'Vinhos, refrigerantes e cocktails para acompanhar sua refeição.' },
                      ].map((cat, i) => (
                        <motion.div
                          key={cat.title}
                          whileHover={{ y: -10 }}
                          className="glass-card group overflow-hidden cursor-pointer"
                          onClick={() => setCurrentView('menu')}
                        >
                          <div className="relative h-96">
                            <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8">
                              <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20">
                                {React.cloneElement(cat.icon as React.ReactElement<any>, { className: 'text-black w-6 h-6' })}
                              </div>
                              <h3 className="text-2xl font-serif font-bold mb-2">{cat.title}</h3>
                              <p className="text-white/60 text-sm leading-relaxed">{cat.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Info Section */}
                <section className="py-24">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="glass-card p-8 flex flex-col items-center text-center">
                        <Clock className="w-10 h-10 text-gold-400 mb-4" />
                        <h4 className="font-bold mb-2">Horário</h4>
                        <p className="text-white/50 text-sm">09:00 - 22:00</p>
                      </div>
                      <div className="glass-card p-8 flex flex-col items-center text-center">
                        <MapPin className="w-10 h-10 text-gold-400 mb-4" />
                        <h4 className="font-bold mb-2">Localização</h4>
                        <p className="text-white/50 text-sm">Chimoio, Moçambique</p>
                      </div>
                      <div className="glass-card p-8 flex flex-col items-center text-center">
                        <Phone className="w-10 h-10 text-gold-400 mb-4" />
                        <h4 className="font-bold mb-2">Contato</h4>
                        <p className="text-white/50 text-sm">+258 86 767 4675</p>
                      </div>
                      <div className="glass-card p-8 flex flex-col items-center text-center">
                        <Star className="w-10 h-10 text-gold-400 mb-4" />
                        <h4 className="font-bold mb-2">Avaliação</h4>
                        <p className="text-white/50 text-sm">4.2 (322 críticas)</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="bg-black border-t border-white/5 pt-24 pb-12">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                            <ChefHat className="text-black w-6 h-6" />
                          </div>
                          <span className="text-2xl font-serif font-bold gold-text">A FORNALHA</span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">
                          A melhor pizza e grelhados de Chimoio. Uma experiência gastronómica moderna, elegante e acolhedora.
                        </p>
                        <div className="flex gap-4">
                          {[Instagram, Facebook, Twitter].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all">
                              <Icon className="w-5 h-5" />
                            </a>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-8">Links Rápidos</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                          <li><button onClick={() => setCurrentView('menu')} className="hover:text-gold-400 transition-colors">Nosso Menu</button></li>
                          <li><button onClick={() => setCurrentView('location')} className="hover:text-gold-400 transition-colors">Localização</button></li>
                          <li><button onClick={() => setCurrentView('story')} className="hover:text-gold-400 transition-colors">Nossa História</button></li>
                          <li><button onClick={() => setCurrentView('reviews')} className="hover:text-gold-400 transition-colors">Críticas</button></li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-8">Informações</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                          <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gold-400" /> WF4J+RV, Chimoio</li>
                          <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-gold-400" /> +258 86 767 4675</li>
                          <li className="flex items-center gap-3"><Clock className="w-4 h-4 text-gold-400" /> Seg - Dom: 09:00 - 22:00</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-8">Boletim Informativo</h4>
                        <p className="text-white/40 text-sm mb-6">Inscreva-se para ofertas exclusivas e atualizações premium.</p>
                        <div className="relative">
                          <input 
                            type="email" 
                            placeholder="Seu endereço de e-mail"
                            className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:border-gold-400 outline-none transition-colors"
                          />
                          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gold-500 text-black p-2 rounded-full hover:bg-gold-600 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Support Button */}
                    <div className="flex justify-center mb-12">
                      <a 
                        href="https://wa.me/258867674675" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105"
                      >
                        <MessageCircle className="w-6 h-6" />
                        Suporte via WhatsApp
                      </a>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                      <p>© 2026 A Fornalha. Todos os Direitos Reservados.</p>
                      <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
                        <a href="#" className="hover:text-white transition-colors">Termos de Serviço</a>
                      </div>
                    </div>
                  </div>
                </footer>
              </motion.div>
            )}

            {currentView === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Menu items={menuItems} onAddToCart={handleAddToCart} />
              </motion.div>
            )}

            {currentView === 'location' && (
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Location />
              </motion.div>
            )}

            {currentView === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Reviews />
              </motion.div>
            )}

            {currentView === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Gallery />
              </motion.div>
            )}

            {currentView === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Story />
              </motion.div>
            )}

            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {profile?.role === 'admin' || profile?.role === 'staff' ? (
                  <AdminDashboard 
                    orders={orders} 
                    reservations={reservations} 
                    menuItems={menuItems}
                    profile={profile}
                  />
                ) : (
                  <UserDashboard 
                    orders={orders} 
                    reservations={reservations} 
                    profile={profile}
                    onLogout={handleLogout}
                    onViewOrder={handleViewOrder}
                  />
                )}
              </motion.div>
            )}

            {currentView === 'order-tracking' && selectedOrderId && (
              <motion.div
                key="order-tracking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {orders.find(o => o.id === selectedOrderId) ? (
                  <OrderTracking 
                    order={orders.find(o => o.id === selectedOrderId)!} 
                    onBack={() => setCurrentView('dashboard')}
                  />
                ) : (
                  <div className="text-center py-24">
                    <p className="text-white/40">Pedido não encontrado.</p>
                    <button onClick={() => setCurrentView('dashboard')} className="gold-button mt-4">Voltar ao Painel</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Cart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />

        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

        <Footer onViewChange={setCurrentView} />

        <ChatBot />
      </div>
    </ErrorBoundary>
  );
}
