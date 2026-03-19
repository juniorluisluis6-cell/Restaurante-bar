import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck,
  ChefHat,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { Order, Reservation, MenuItem, UserProfile } from '../types';
import { supabase } from '../supabase';

interface DashboardProps {
  orders: Order[];
  reservations: Reservation[];
  menuItems: MenuItem[];
  profile: UserProfile | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ orders, reservations, menuItems, profile }) => {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'reservations' | 'menu' | 'stats'>('orders');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newItem, setNewItem] = React.useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    category: 'Chicken',
    description: '',
    available: true
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from('menu').insert([{
        name: newItem.name,
        price: newItem.price,
        category: newItem.category,
        description: newItem.description,
        available: newItem.available,
        image_url: `https://picsum.photos/seed/${newItem.name}/400/300`
      }]);
      setShowAddModal(false);
      setNewItem({ name: '', price: 0, category: 'Chicken', description: '', available: true });
    } catch (error) {
      console.error('Failed to add item', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status'], customerId?: string, total?: number) => {
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      
      // Award loyalty points if delivered (1 point per 10 MT)
      if (newStatus === 'delivered' && customerId && total) {
        const pointsEarned = Math.floor(total / 10);
        const { data: user } = await supabase.from('users').select('points').eq('id', customerId).single();
        if (user) {
          await supabase.from('users').update({ points: (user.points || 0) + pointsEarned }).eq('id', customerId);
        }
      }
    } catch (error) {
      console.error('Failed to update order status', error);
    }
  };

  const updateReservationStatus = async (resId: string, newStatus: Reservation['status']) => {
    try {
      await supabase.from('reservations').update({ status: newStatus }).eq('id', resId);
    } catch (error) {
      console.error('Failed to update reservation status', error);
    }
  };

  const toggleMenuAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      await supabase.from('menu').update({ available: !currentStatus }).eq('id', itemId);
    } catch (error) {
      console.error('Failed to toggle availability', error);
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    if (!window.confirm('Tem certeza de que deseja excluir este item do menu?')) return;
    try {
      await supabase.from('menu').delete().eq('id', itemId);
    } catch (error) {
      console.error('Failed to delete item', error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'received': return 'recebido';
      case 'preparing': return 'preparando';
      case 'ready': return 'pronto';
      case 'delivering': return 'entregando';
      case 'delivered': return 'entregue';
      case 'cancelled': return 'cancelado';
      case 'pending': return 'pendente';
      case 'confirmed': return 'confirmado';
      default: return status;
    }
  };

  const stats = [
    { label: 'Pedidos Totais', value: orders.length, icon: <ShoppingBag className="w-5 h-5 text-blue-400" /> },
    { label: 'Reservas Pendentes', value: reservations.filter(r => r.status === 'pending').length, icon: <Calendar className="w-5 h-5 text-gold-400" /> },
    { label: 'Pedidos Ativos', value: orders.filter(o => ['received', 'preparing', 'ready', 'delivering'].includes(o.status)).length, icon: <Clock className="w-5 h-5 text-emerald-400" /> },
    { label: 'Receita Diária', value: `MT ${orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0).toLocaleString()}`, icon: <BarChart3 className="w-5 h-5 text-purple-400" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-serif font-bold gold-text mb-2 tracking-tight">Painel de Gestão</h2>
          <p className="text-white/50 text-sm">Bem-vindo de volta, {profile?.name}. Aqui está o que está acontecendo hoje.</p>
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {[
            { id: 'orders', label: 'Pedidos', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'reservations', label: 'Reservas', icon: <Calendar className="w-4 h-4" /> },
            { id: 'menu', label: 'Menu', icon: <ChefHat className="w-4 h-4" /> },
            { id: 'stats', label: 'Análises', icon: <BarChart3 className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                {stat.icon}
              </div>
              <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Hoje</span>
            </div>
            <p className="text-2xl font-serif font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-white/40 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Content Area */}
      <div className="glass-card overflow-hidden border-white/5">
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">ID do Pedido</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Itens</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Total</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Tipo</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-xs font-mono text-white/60">#{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-white/30">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {order.items.map((item, i) => (
                          <span key={i} className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold gold-text">MT {order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                        {order.type === 'delivery' ? <Truck className="w-3 h-3" /> : <ShoppingBag className="w-3 h-3" />}
                        {order.type === 'delivery' ? 'Entrega' : 'Levantamento'}
                      </div>
                      {order.paymentMethod === 'mpesa' && (
                        <p className="text-[10px] text-gold-400 font-mono mt-1">M-Pesa: {order.paymentPhone}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gold-500/10 text-gold-400 border-gold-500/20'
                      }`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {order.status === 'received' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                            title="Começar Preparação"
                          >
                            <ChefHat className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="p-2 hover:bg-white/10 rounded-lg text-gold-400 transition-colors"
                            title="Marcar como Pronto"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {order.status === 'ready' && order.type === 'delivery' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'delivering')}
                            className="p-2 hover:bg-white/10 rounded-lg text-purple-400 transition-colors"
                            title="Começar Entrega"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                        {(order.status === 'ready' && order.type === 'pickup') || order.status === 'delivering' ? (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'delivered', order.customerId, order.total)}
                            className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors"
                            title="Marcar como Entregue"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Convidado</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Data e Hora</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Convidados</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Status</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(res => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold">{res.customerName}</p>
                      <p className="text-[10px] text-white/30">ID: {res.customerId.slice(0, 8)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{res.date}</p>
                      <p className="text-xs text-gold-400">{res.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-white/40" />
                        <span className="text-sm font-bold">{res.guests}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                        res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        res.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-gold-500/10 text-gold-400 border-gold-500/20'
                      }`}>
                        {getStatusLabel(res.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {res.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateReservationStatus(res.id, 'confirmed')}
                              className="p-2 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors"
                              title="Confirmar"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateReservationStatus(res.id, 'cancelled')}
                              className="p-2 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                              title="Cancelar"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-bold">Inventário do Menu</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="gold-button !py-2 !px-4 text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Adicionar Item
              </button>
            </div>

            {showAddModal && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-8 border-gold-400/20 max-w-md w-full"
                >
                  <h3 className="text-2xl font-serif font-bold gold-text mb-6">Adicionar Novo Item</h3>
                  <form onSubmit={handleAddItem} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Nome</label>
                      <input 
                        type="text" 
                        required
                        value={newItem.name}
                        onChange={e => setNewItem({...newItem, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold-400 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Preço (MT)</label>
                        <input 
                          type="number" 
                          required
                          value={newItem.price}
                          onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold-400 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Categoria</label>
                        <select 
                          value={newItem.category}
                          onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold-400 outline-none"
                        >
                          <option value="Chicken">Frango</option>
                          <option value="Burgers">Hambúrgueres</option>
                          <option value="Pizzas">Pizzas</option>
                          <option value="Sides">Acompanhamentos</option>
                          <option value="Drinks">Bebidas</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Descrição</label>
                      <textarea 
                        value={newItem.description}
                        onChange={e => setNewItem({...newItem, description: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-gold-400 outline-none h-24 resize-none"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 px-6 py-3 rounded-full border border-white/10 text-sm font-bold hover:bg-white/5 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 gold-button !py-3"
                      >
                        Criar Item
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={item.imageUrl || `https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold">{item.name}</h4>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => toggleMenuAvailability(item.id, item.available)}
                          className={`p-1 hover:bg-white/10 rounded transition-colors ${item.available ? 'text-emerald-400' : 'text-red-400'}`}
                          title={item.available ? 'Marcar como Esgotado' : 'Marcar em Stock'}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteMenuItem(item.id)}
                          className="p-1 hover:bg-white/10 rounded text-white/40 hover:text-red-400 transition-colors"
                          title="Excluir Item"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/40 mb-2">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold gold-text">MT {item.price.toLocaleString()}</span>
                      <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                        item.available ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {item.available ? 'Em Stock' : 'Esgotado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="p-12 text-center space-y-4">
            <BarChart3 className="w-16 h-16 text-gold-400/20 mx-auto" />
            <h3 className="text-xl font-serif font-bold">Análises Avançadas</h3>
            <p className="text-white/40 max-w-md mx-auto text-sm">Relatórios de vendas detalhados, tendências de clientes e previsão de inventário estarão disponíveis na próxima atualização.</p>
          </div>
        )}
      </div>
    </div>
  );
};
