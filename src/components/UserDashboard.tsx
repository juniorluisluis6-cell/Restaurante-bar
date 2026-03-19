import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ChefHat,
  ChevronRight,
  Star,
  User,
  Settings,
  LogOut,
  Award
} from 'lucide-react';
import { Order, Reservation, UserProfile } from '../types';

interface UserDashboardProps {
  orders: Order[];
  reservations: Reservation[];
  profile: UserProfile | null;
  onLogout: () => void;
  onViewOrder: (orderId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ orders, reservations, profile, onLogout, onViewOrder }) => {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'reservations' | 'profile'>('orders');
  const [ratingOrder, setRatingOrder] = React.useState<string | null>(null);
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState('');

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingOrder) return;
    // In a real app, we'd save this to a 'reviews' collection
    alert('Obrigado pelo seu feedback! A sua avaliação foi enviada.');
    setRatingOrder(null);
    setRating(5);
    setComment('');
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'received': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'preparing': return <ChefHat className="w-4 h-4 text-gold-400" />;
      case 'ready': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'delivering': return <Truck className="w-4 h-4 text-purple-400" />;
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <Clock className="w-4 h-4 text-white/40" />;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'received': return 'recebido';
      case 'preparing': return 'preparando';
      case 'ready': return 'pronto';
      case 'delivering': return 'entregando';
      case 'delivered': return 'entregue';
      case 'cancelled': return 'cancelado';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 text-center border-white/5">
            <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/20">
              <User className="text-black w-10 h-10" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-1">{profile?.name}</h3>
            <p className="text-xs text-white/40 mb-4">{profile?.email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/10 rounded-full border border-gold-500/20">
              <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
              <span className="text-[10px] font-bold gold-text uppercase tracking-widest">{profile?.points || 0} Pontos</span>
            </div>
          </div>

          <div className="glass-card p-2 border-white/5">
            {[
              { id: 'orders', label: 'Meus Pedidos', icon: <ShoppingBag className="w-4 h-4" /> },
              { id: 'reservations', label: 'Minhas Reservas', icon: <Calendar className="w-4 h-4" /> },
              { id: 'profile', label: 'Configurações da Conta', icon: <Settings className="w-4 h-4" /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === item.id ? 'bg-gold-500 text-black' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Loyalty Program Section */}
            <div className="mb-8 glass-card p-8 border-gold-400/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-gold-500/20 transition-colors duration-500" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                    <div className="p-2 bg-gold-500/20 rounded-lg">
                      <Award className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-gold-400">Papa's Gold Club</h3>
                  </div>
                  <p className="text-white/60 mb-6 max-w-md">
                    Você faz parte do nosso programa de fidelidade exclusivo. Ganhe pontos com cada refeição e desbloqueie recompensas premium, itens do menu secreto e reservas prioritárias.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm font-medium">
                      <span className="text-gold-400">5%</span> Cashback em todos os pedidos
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-sm font-medium">
                      <span className="text-gold-400">Entrega Grátis</span> acima de 1000 MT
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-8 bg-black/40 rounded-2xl border border-gold-400/20 min-w-[240px]">
                  <span className="text-sm text-white/40 uppercase tracking-widest mb-2 font-medium">Seu Saldo</span>
                  <div className="text-5xl font-serif font-bold gold-shimmer mb-2">
                    {profile?.points || 0}
                  </div>
                  <span className="text-gold-400/60 text-sm font-medium">Papa Pontos</span>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-6 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gold-600 to-gold-400" 
                      style={{ width: `${Math.min(((profile?.points || 0) % 500) / 5, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-3 uppercase tracking-tighter">
                    {500 - ((profile?.points || 0) % 500)} pontos até a sua próxima recompensa
                  </p>
                </div>
              </div>
            </div>

            {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-serif font-bold gold-text tracking-tight">Histórico de Pedidos</h2>
                <span className="text-xs text-white/30 font-bold uppercase tracking-widest">{orders.length} Pedidos Totais</span>
              </div>

              {orders.length === 0 ? (
                <div className="glass-card p-12 text-center space-y-4 border-white/5">
                  <ShoppingBag className="w-12 h-12 text-white/10 mx-auto" />
                  <p className="text-white/40">Você ainda não fez nenhum pedido.</p>
                  <button className="gold-button !py-2 !px-6 text-xs">Pedir Agora</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card p-6 border-white/5 hover:border-gold-500/30 transition-all cursor-pointer group"
                      onClick={() => onViewOrder(order.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl border ${
                            order.status === 'delivered' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gold-500/10 border-gold-500/20'
                          }`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">Pedido #{order.id.slice(0, 8)}</h4>
                              <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-gold-500/10 text-gold-400 border-gold-500/20'
                              }`}>
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 mb-2">
                              {order.items.length} itens • MT {order.total.toLocaleString()} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {order.type === 'delivery' ? 'Entrega' : 'Levantamento'}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden md:block text-right">
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Status</p>
                            <p className="text-sm font-serif font-bold gold-text capitalize">{getStatusLabel(order.status)}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-gold-400 transition-colors" />
                        </div>
                      </div>
                      {order.status === 'delivered' && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setRatingOrder(order.id);
                            }}
                            className="text-[10px] font-bold uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-2"
                          >
                            <Star className="w-3 h-3" /> Avaliar Pedido
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-serif font-bold gold-text tracking-tight">Minhas Reservas</h2>
                <span className="text-xs text-white/30 font-bold uppercase tracking-widest">{reservations.length} Reservas</span>
              </div>

              {reservations.length === 0 ? (
                <div className="glass-card p-12 text-center space-y-4 border-white/5">
                  <Calendar className="w-12 h-12 text-white/10 mx-auto" />
                  <p className="text-white/40">Nenhuma reserva de mesa encontrada.</p>
                  <button className="gold-button !py-2 !px-6 text-xs">Reservar uma Mesa</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(res => (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card p-6 border-white/5"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-gold-500/10 rounded-lg border border-gold-500/20">
                          <Calendar className="w-5 h-5 text-gold-400" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                          res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          res.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-gold-500/10 text-gold-400 border-gold-500/20'
                        }`}>
                          {res.status === 'confirmed' ? 'confirmado' : res.status === 'cancelled' ? 'cancelado' : 'pendente'}
                        </span>
                      </div>
                      <h4 className="text-lg font-serif font-bold mb-1">{res.date}</h4>
                      <p className="text-gold-400 font-bold mb-4">{res.time}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <User className="w-3 h-3" />
                          {res.guests} Convidados
                        </div>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">#{res.id.slice(0, 6)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-serif font-bold gold-text tracking-tight mb-8">Configurações da Conta</h2>
              <div className="glass-card p-8 border-white/5 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Nome Completo</label>
                    <input 
                      type="text" 
                      defaultValue={profile?.name}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Endereço de Email</label>
                    <input 
                      type="email" 
                      defaultValue={profile?.email}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Número de Telefone</label>
                    <input 
                      type="tel" 
                      placeholder="+258 ..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Endereço Padrão</label>
                    <input 
                      type="text" 
                      placeholder="Rua, Cidade"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <button className="gold-button !py-3 !px-8">Salvar Alterações</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {ratingOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 border-gold-400/20 max-w-md w-full"
          >
            <h3 className="text-2xl font-serif font-bold gold-text mb-2">Avalie Sua Experiência</h3>
            <p className="text-white/40 text-sm mb-8">Como foi o seu pedido #{ratingOrder.slice(0, 8)}?</p>
            
            <form onSubmit={handleSubmitRating} className="space-y-6">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star className={`w-8 h-8 ${star <= rating ? 'text-gold-400 fill-gold-400' : 'text-white/10'}`} />
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Seu Feedback</label>
                <textarea 
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Conte-nos o que você amou ou como podemos melhorar..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none h-32 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setRatingOrder(null)}
                  className="flex-1 px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-white/5 transition-colors"
                >
                  Pular
                </button>
                <button 
                  type="submit"
                  className="flex-1 gold-button !py-3"
                >
                  Enviar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
