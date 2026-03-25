import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Packages } from './components/Packages';
import { Booking } from './components/Booking';
import { Reviews } from './components/Reviews';
import { Footer } from './components/Footer';
import { ClientArea } from './components/ClientArea';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

// Error Boundary Component
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
        <div className="min-h-screen flex items-center justify-center bg-matte-black p-4">
          <div className="glass-card p-8 max-w-md w-full text-center space-y-6 border-red-500/20">
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
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState<any>(null); 
  const [profile, setProfile] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Listen to profile changes
        const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (doc) => {
          if (doc.exists()) {
            setProfile(doc.data());
          } else {
            setProfile({ name: user.displayName || 'Cliente' });
          }
        });
        return () => unsubProfile();
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView('home');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-matte-black text-white font-sans selection:bg-gold-500 selection:text-black">
        <Navbar 
          onViewChange={handleViewChange} 
          currentView={currentView}
          user={user}
          profile={profile}
          onLoginClick={() => setIsLoginModalOpen(true)}
        />

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />

        <main>
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Hero onViewChange={handleViewChange} />
                
                {/* Featured Section */}
                <section className="py-32 bg-matte-black relative overflow-hidden">
                  <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                      <div className="space-y-12">
                        <div className="space-y-6">
                          <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                            Excelência em <span className="gold-shimmer italic">Cada Detalhe</span>
                          </h2>
                          <p className="text-white/40 font-light leading-relaxed text-lg">
                            Nossa agência não apenas tira fotos; nós criamos legados visuais. Com equipamentos de última geração e um olhar artístico inconfundível, garantimos que seus momentos mais preciosos sejam eternizados com a sofisticação que merecem.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {[
                            { title: 'Alta Resolução', desc: 'Equipamentos 8K para detalhes nítidos.' },
                            { title: 'Edição VIP', desc: 'Retoque artístico personalizado.' },
                            { title: 'Entrega Ágil', desc: 'Seus momentos em tempo recorde.' },
                            { title: 'Suporte 24/7', desc: 'Atendimento exclusivo para clientes.' }
                          ].map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                              <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center border border-gold-500/20 group-hover:bg-gold-500 group-hover:text-black transition-all duration-500 shrink-0">
                                <span className="text-gold-400 group-hover:text-inherit font-bold">0{i+1}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-sm uppercase tracking-widest mb-1">{item.title}</h4>
                                <p className="text-xs text-white/40 font-light leading-relaxed">{item.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative z-10">
                          <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1000" alt="Featured" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -z-10" />
                      </div>
                    </div>
                  </div>
                </section>

                <Portfolio />
                <Packages />
                <Reviews />
              </motion.div>
            )}

            {currentView === 'portfolio' && (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Portfolio />
              </motion.div>
            )}

            {currentView === 'packages' && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Packages />
              </motion.div>
            )}

            {currentView === 'booking' && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Booking />
              </motion.div>
            )}

            {currentView === 'client' && user && (
              <motion.div
                key="client"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ClientArea user={user} profile={profile} onLogout={handleLogout} />
              </motion.div>
            )}

            {currentView === 'admin' && user?.role === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AdminDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <Footer onViewChange={handleViewChange} />
      </div>
    </ErrorBoundary>
  );
}
