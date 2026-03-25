import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Clock, CheckCircle, Package, MessageSquare, LogOut, User, Loader2, Edit2, Save, X, Settings } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, where, orderBy, updateDoc, doc } from 'firebase/firestore';

interface ClientAreaProps {
  user: any;
  profile: any;
  onLogout: () => void;
}

export const ClientArea: React.FC<ClientAreaProps> = ({ user, profile, onLogout }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || ''
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        name: profile.name || '',
        phone: profile.phone || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), editData);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Erro ao atualizar perfil: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'bookings'), 
      where('customerId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(fetchedBookings);
      setLoading(false);
    }, (error) => {
      console.error('Client fetch error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-matte-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
      </div>
    );
  }

  const downloads = [
    { id: 'DL-001', name: 'Ensaio_HC_Foto_Final.zip', size: '1.2 GB', date: '15 Fev 2026' },
    { id: 'DL-002', name: 'Evento_Tech_Manica.zip', size: '4.5 GB', date: '12 Fev 2026' }
  ];

  return (
    <section className="py-32 bg-matte-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-8">
            <div className="glass-card p-10 text-center space-y-6">
              <div className="w-24 h-24 rounded-full border-2 border-gold-500/30 p-1 mx-auto relative group">
                <img src={`https://i.pravatar.cc/200?u=${user.id}`} alt="Profile" className="w-full h-full rounded-full object-cover" />
                <div className="absolute inset-0 bg-gold-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold">{profile?.name || 'Cliente VIP'}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gold-400 font-bold mt-2">Membro Premium</p>
              </div>
              <div className="pt-8 border-t border-white/5 space-y-4">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'orders' ? 'bg-gold-500 text-black' : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Pedidos</span>
                </button>
                <button 
                  onClick={() => setActiveTab('downloads')}
                  className={`w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'downloads' ? 'bg-gold-500 text-black' : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Downloads</span>
                </button>
                <button 
                  onClick={() => setActiveTab('contracts')}
                  className={`w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'contracts' ? 'bg-gold-500 text-black' : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Contratos</span>
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-4 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === 'profile' ? 'bg-gold-500 text-black' : 'text-white/40 hover:bg-white/5'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Perfil</span>
                </button>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-4 px-6 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Sair</span>
                </button>
              </div>
            </div>

            <div className="glass-card p-8 bg-gold-500/5 border-gold-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20">
                  <MessageSquare className="w-4 h-4 text-gold-400" />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest">Suporte VIP</h4>
              </div>
              <p className="text-xs text-white/40 font-light leading-relaxed mb-6">
                Como cliente premium, você tem acesso direto ao HC Fotógrafo.
              </p>
              <button className="outline-button w-full py-3 text-[9px]">Iniciar Chat</button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-3/4 space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-serif font-bold gold-shimmer">
                {activeTab === 'orders' ? 'Meus Pedidos' : 
                 activeTab === 'downloads' ? 'Meus Downloads' : 
                 activeTab === 'profile' ? 'Meu Perfil' : 'Contratos Digitais'}
              </h2>
              <div className="flex gap-4">
                <div className="glass-card px-6 py-3 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Status: Ativo</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {activeTab === 'orders' && bookings.map(booking => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-gold-500/20 transition-all duration-500"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-gold-500/20 transition-colors">
                      <Package className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold">{booking.type}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">#{booking.id.slice(0, 8)} • {booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total</p>
                      <p className="text-lg font-serif font-bold gold-text">MT {booking.budget || '---'}</p>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
                      booking.status === 'confirmed' ? 'bg-green-400/10 border-green-400/20 text-green-400' : 
                      booking.status === 'pending' ? 'bg-gold-500/10 border-gold-500/20 text-gold-400' :
                      'bg-red-400/10 border-red-400/20 text-red-400'
                    }`}>
                      {booking.status === 'confirmed' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">{booking.status}</span>
                    </div>
                    <button className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold-500 hover:text-black transition-all duration-500">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {activeTab === 'downloads' && downloads.map(dl => (
                <motion.div
                  key={dl.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-gold-500/20 transition-all duration-500"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-gold-500/20 transition-colors">
                      <Download className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold">{dl.name}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">{dl.size} • {dl.date}</p>
                    </div>
                  </div>
                  <button className="gold-button flex items-center gap-3">
                    Baixar Agora <Download className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-12 space-y-12"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif font-bold">Informações Pessoais</h3>
                      <p className="text-white/40 text-xs font-light">Mantenha seus dados atualizados para uma melhor experiência.</p>
                    </div>
                    {!isEditingProfile ? (
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="gold-button flex items-center gap-3 py-3 px-6 text-[10px]"
                      >
                        <Edit2 className="w-4 h-4" /> Editar Perfil
                      </button>
                    ) : (
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsEditingProfile(false)}
                          className="outline-button flex items-center gap-3 py-3 px-6 text-[10px]"
                        >
                          <X className="w-4 h-4" /> Cancelar
                        </button>
                        <button 
                          onClick={handleUpdateProfile}
                          className="gold-button flex items-center gap-3 py-3 px-6 text-[10px]"
                        >
                          <Save className="w-4 h-4" /> Salvar Alterações
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Nome Completo</label>
                      <input 
                        type="text" 
                        value={editData.name}
                        disabled={!isEditingProfile}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:border-gold-500 outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email (Não editável)</label>
                      <input 
                        type="email" 
                        value={user.email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm opacity-50 outline-none"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Telefone</label>
                      <input 
                        type="tel" 
                        value={editData.phone}
                        disabled={!isEditingProfile}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:border-gold-500 outline-none transition-all disabled:opacity-50"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Biografia / Notas</label>
                      <textarea 
                        value={editData.bio}
                        disabled={!isEditingProfile}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm focus:border-gold-500 outline-none transition-all disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
