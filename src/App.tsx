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
  AlertCircle
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
import { Reservations } from './components/Reservations';
import { ChatBot } from './components/ChatBot';
import { LoginModal } from './components/LoginModal';

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
      { name: 'Frango Grelhado Peri-Peri', description: 'O nosso frango grelhado na brasa marinado no autêntico molho peri-peri moçambicano.', price: 850, category: 'Chicken', available: true, prep_time: 25 },
      { name: 'The Papa Burger', description: 'Hambúrguer duplo de carne, cheddar derretido, cebolas caramelizadas e o nosso molho secreto gold.', price: 650, category: 'Burgers', available: true, prep_time: 15 },
      { name: 'Pizza Manica Supreme', description: 'Carregada com frango picante, pimentos, cebolas e mozzarella extra.', price: 950, category: 'Pizzas', available: true, prep_time: 20 },
      { name: 'Batatas Fritas Gold', description: 'Batatas cortadas à mão temperadas com a nossa mistura especial de especiarias.', price: 250, category: 'Sides', available: true, prep_time: 10 },
      { name: 'Sumo de Maracujá Fresco', description: 'Sumo refrescante de maracujá local, servido gelado.', price: 150, category: 'Drinks', available: true, prep_time: 5 },
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
                <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src="https://picsum.photos/seed/restaurant/1920/1080?blur=2" 
                      alt="Principal" 
                      className="w-full h-full object-cover opacity-40"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
                  </div>

                  <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-gold-400 font-bold uppercase tracking-[0.3em] text-sm mb-6 block">Experiência de Fast Food Premium</span>
                      <h1 className="text-6xl md:text-8xl font-serif font-bold mb-8 leading-tight tracking-tighter">
                        Sinta a <span className="gold-shimmer italic">Excelência</span> de Chimoio
                      </h1>
                      <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        Do nosso frango grelhado na brasa às pizzas artesanais, cada mordida é uma jornada de sabores premium.
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button 
                          onClick={() => setCurrentView('menu')}
                          className="gold-button flex items-center gap-2 group"
                        >
                          Explorar Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => setCurrentView('reservations')}
                          className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-all font-semibold"
                        >
                          Reservar uma Mesa
                        </button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating Stats */}
                  <div className="absolute bottom-12 left-0 right-0 hidden md:block">
                    <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                      <div className="flex gap-12">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="text-gold-400 w-8 h-8" />
                          <div>
                            <p className="text-white font-bold">100% Higiene</p>
                            <p className="text-white/40 text-xs">Qualidade Certificada</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Zap className="text-gold-400 w-8 h-8" />
                          <div>
                            <p className="text-white font-bold">Entrega Rápida</p>
                            <p className="text-white/40 text-xs">Menos de 30 Min</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="text-gold-400 w-8 h-8" />
                          <div>
                            <p className="text-white font-bold">Sabor Premium</p>
                            <p className="text-white/40 text-xs">Premiado</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
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
                        <p className="text-white/50 max-w-md">Seleções cuidadosamente curadas que representam o coração do Papa's Chicken.</p>
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
                        { title: 'Frango Grelhado', icon: <Flame />, img: 'https://picsum.photos/seed/chicken/600/800', desc: 'Grelhado na brasa com perfeição com nossa mistura secreta de peri-peri.' },
                        { title: 'Hambúrgueres de Assinatura', icon: <Burger />, img: 'https://picsum.photos/seed/burger/600/800', desc: 'Hambúrgueres de carne suculentos com coberturas premium e pães artesanais.' },
                        { title: 'Pizzas Artesanais', icon: <Pizza />, img: 'https://picsum.photos/seed/pizza/600/800', desc: 'Massa fina assada na pedra com os ingredientes locais mais frescos.' },
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

                {/* Footer */}
                <footer className="bg-black border-t border-white/10 pt-24 pb-12">
                  <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
                      <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-8">
                          <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center">
                            <ChefHat className="text-black w-6 h-6" />
                          </div>
                          <span className="text-2xl font-serif font-bold gold-text">PAPA'S</span>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed mb-8">
                          Redefinindo o fast food em Chimoio com um toque de luxo e qualidade intransigente.
                        </p>
                        <div className="flex gap-4">
                          <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all">
                            <Instagram className="w-5 h-5" />
                          </a>
                          <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all">
                            <Facebook className="w-5 h-5" />
                          </a>
                          <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all">
                            <Twitter className="w-5 h-5" />
                          </a>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-8">Links Rápidos</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                          <li><button onClick={() => setCurrentView('menu')} className="hover:text-gold-400 transition-colors">Menu Digital</button></li>
                          <li><button onClick={() => setCurrentView('reservations')} className="hover:text-gold-400 transition-colors">Reservar uma Mesa</button></li>
                          <li><button onClick={() => setCurrentView('story')} className="hover:text-gold-400 transition-colors">Nossa História</button></li>
                          <li><button className="hover:text-gold-400 transition-colors">Contate-nos</button></li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gold-400 font-bold uppercase tracking-widest text-xs mb-8">Informações de Contato</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                          <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gold-400" /> Chimoio, Manica, Moçambique</li>
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

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                      <p>© 2026 Papa's Chicken. Todos os Direitos Reservados.</p>
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

            {currentView === 'reservations' && (
              <motion.div
                key="reservations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Reservations 
                  userProfile={profile} 
                  onSuccess={() => {
                    alert('Reserva solicitada! Confirmaremos em breve.');
                    setCurrentView('home');
                  }} 
                />
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

        <ChatBot />
      </div>
    </ErrorBoundary>
  );
}
