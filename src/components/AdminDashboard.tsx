import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle,
  MoreVertical,
  Search,
  Plus,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qBookings = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubBookings = onSnapshot(qBookings, (snapshot) => {
      const fetchedBookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(fetchedBookings);
    });

    const qUsers = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(fetchedUsers);
      setLoading(false);
    }, (error) => {
      console.error('Admin fetch error:', error);
      setLoading(false);
    });

    return () => {
      unsubBookings();
      unsubUsers();
    };
  }, []);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
    } catch (error) {
      console.error('Update role error:', error);
      alert('Erro ao atualizar cargo: ' + (error as Error).message);
    }
  };

  const stats = [
    { label: 'Receita Total', value: 'MT 450.000', icon: <DollarSign className="w-5 h-5" />, trend: '+12%' },
    { label: 'Novos Clientes', value: users.length.toString(), icon: <Users className="w-5 h-5" />, trend: '+5%' },
    { label: 'Sessões Agendadas', value: bookings.length.toString(), icon: <Calendar className="w-5 h-5" />, trend: '+2%' },
    { label: 'Fotos Entregues', value: '5.2k', icon: <ImageIcon className="w-5 h-5" />, trend: '+18%' }
  ];

  return (
    <section className="min-h-screen bg-matte-black pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-6 h-full flex gap-8">
        {/* Admin Sidebar */}
        <div className="w-72 glass-card p-8 flex flex-col h-[calc(100vh-120px)] sticky top-28">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-gold-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
              <LayoutDashboard className="text-black w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold">Admin Panel</h3>
              <p className="text-[9px] uppercase tracking-widest text-gold-400 font-bold">HC Fotógrafo</p>
            </div>
          </div>

          <nav className="space-y-4 flex-grow">
            {[
              { id: 'overview', label: 'Visão Geral', icon: <TrendingUp className="w-4 h-4" /> },
              { id: 'bookings', label: 'Agendamentos', icon: <Calendar className="w-4 h-4" /> },
              { id: 'clients', label: 'Clientes', icon: <Users className="w-4 h-4" /> },
              { id: 'portfolio', label: 'Gerenciar Portfólio', icon: <ImageIcon className="w-4 h-4" /> },
              { id: 'settings', label: 'Configurações', icon: <Settings className="w-4 h-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${
                  activeTab === item.id ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-white/40 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>

          <button className="flex items-center gap-4 px-6 py-4 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-300 mt-auto">
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Sair do Painel</span>
          </button>
        </div>

        {/* Admin Content */}
        <div className="flex-grow space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-4xl font-serif font-bold gold-shimmer">Dashboard Administrativo</h2>
              <p className="text-white/40 font-light text-sm">Bem-vindo de volta, HC Fotógrafo.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-gold-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..."
                  className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:border-gold-500 outline-none transition-all w-64"
                />
              </div>
              <button className="gold-button flex items-center gap-3 py-3 px-6 text-[10px]">
                <Plus className="w-4 h-4" /> Novo Agendamento
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 group hover:border-gold-500/20 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 group-hover:border-gold-500/20 transition-colors">
                    <div className="text-gold-400">{stat.icon}</div>
                  </div>
                  <span className="text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full">{stat.trend}</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">{stat.label}</p>
                <h4 className="text-3xl font-serif font-bold">{stat.value}</h4>
              </motion.div>
            ))}
          </div>

          {/* Recent Bookings Table */}
          {activeTab === 'overview' || activeTab === 'bookings' ? (
            <div className="glass-card p-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-serif font-bold">
                  {activeTab === 'overview' ? 'Agendamentos Recentes' : 'Todos os Agendamentos'}
                </h3>
                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors">
                  <Filter className="w-4 h-4" /> Filtrar Lista
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/5">
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">ID</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Cliente</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Tipo</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Data</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Status</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Valor</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(activeTab === 'overview' ? bookings.slice(0, 5) : bookings).map((booking, i) => (
                      <tr key={i} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 text-xs font-bold text-white/40">#{booking.id.slice(0, 6)}</td>
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-[10px] font-bold text-gold-400">
                              {booking.type?.charAt(0).toUpperCase() || 'S'}
                            </div>
                            <span className="text-sm font-bold">{booking.type || 'Sessão'}</span>
                          </div>
                        </td>
                        <td className="py-6 text-sm text-white/60">{booking.type}</td>
                        <td className="py-6 text-sm text-white/60">{booking.date}</td>
                        <td className="py-6">
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${
                            booking.status === 'confirmed' ? 'bg-green-400/10 border-green-400/20 text-green-400' : 
                            booking.status === 'pending' ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400' :
                            'bg-red-400/10 border-red-400/20 text-red-400'
                          }`}>
                            {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {booking.status}
                          </div>
                        </td>
                        <td className="py-6 text-sm font-bold gold-text">MT {booking.budget || '---'}</td>
                        <td className="py-6">
                          <div className="flex gap-2">
                            {booking.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-400/10 text-green-400 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                              <MoreVertical className="w-4 h-4 text-white/20" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'clients' ? (
            <div className="glass-card p-10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-serif font-bold">Gestão de Clientes</h3>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold-400 transition-colors">
                    <Download className="w-4 h-4" /> Exportar CSV
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-white/5">
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Cliente</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Email</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Cargo</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold">Registro</th>
                      <th className="pb-6 text-[10px] uppercase tracking-widest text-white/20 font-bold text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((user, i) => (
                      <tr key={i} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-400">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{user.name || 'Sem Nome'}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">ID: {user.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-sm text-white/60">{user.email}</td>
                        <td className="py-6">
                          <select 
                            value={user.role || 'client'}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-400 outline-none focus:border-gold-500 transition-colors"
                          >
                            <option value="client" className="bg-matte-black">Cliente</option>
                            <option value="admin" className="bg-matte-black">Admin</option>
                          </select>
                        </td>
                        <td className="py-6 text-sm text-white/60">
                          {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : '---'}
                        </td>
                        <td className="py-6 text-right">
                          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors ml-auto">
                            <MoreVertical className="w-4 h-4 text-white/20" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-card p-20 text-center">
              <h3 className="text-2xl font-serif font-bold mb-4">Em Desenvolvimento</h3>
              <p className="text-white/40 text-sm">Esta funcionalidade estará disponível em breve.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
