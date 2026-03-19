import React from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  Truck, 
  ArrowLeft,
  MapPin,
  Phone,
  CreditCard
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingProps {
  order: Order;
  onBack: () => void;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onBack }) => {
  const steps = [
    { id: 'received', label: 'Pedido Recebido', icon: <ShoppingBag className="w-5 h-5" />, desc: 'Recebemos o seu pedido.' },
    { id: 'preparing', label: 'Preparando', icon: <ChefHat className="w-5 h-5" />, desc: 'Nossos chefs estão preparando sua refeição.' },
    { id: 'ready', label: 'Pronto', icon: <CheckCircle2 className="w-5 h-5" />, desc: 'Seu pedido está pronto para levantamento/entrega.' },
    { id: 'delivering', label: 'A Caminho', icon: <Truck className="w-5 h-5" />, desc: 'Nosso parceiro de entrega está a caminho.' },
    { id: 'delivered', label: 'Entregue', icon: <CheckCircle2 className="w-5 h-5" />, desc: 'Aproveite o seu Papa\'s Chicken!' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === order.status);
  const isDelivery = order.type === 'delivery';
  
  // Filter steps for pickup
  const displaySteps = isDelivery ? steps : steps.filter(s => s.id !== 'delivering');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-gold-400 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Voltar ao Painel
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Tracker */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 border-white/5">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h2 className="text-3xl font-serif font-bold gold-text mb-2">Rastrear Pedido</h2>
                <p className="text-xs text-white/40 font-mono uppercase tracking-widest">Pedido #{order.id.slice(0, 12)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Tempo Estimado</p>
                <p className="text-xl font-serif font-bold gold-text">25-35 Min</p>
              </div>
            </div>

            <div className="relative space-y-12">
              {/* Vertical Progress Line */}
              <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-white/5">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(currentStepIndex / (displaySteps.length - 1)) * 100}%` }}
                  className="w-full bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                />
              </div>

              {displaySteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.id} className="relative flex items-start gap-8">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted ? 'bg-gold-500 border-gold-500 text-black shadow-lg shadow-gold-500/20' : 'bg-black border-white/10 text-white/20'
                    }`}>
                      {step.icon}
                      {isCurrent && (
                        <motion.div 
                          layoutId="active-glow"
                          className="absolute inset-0 rounded-full bg-gold-500/40 blur-md -z-10"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <h4 className={`font-bold transition-colors ${isCompleted ? 'text-white' : 'text-white/20'}`}>
                        {step.label}
                      </h4>
                      <p className={`text-xs transition-colors ${isCompleted ? 'text-white/40' : 'text-white/10'}`}>
                        {step.desc}
                      </p>
                      {isCurrent && (
                        <p className="text-[10px] gold-text font-bold uppercase tracking-widest mt-2 animate-pulse">
                          Status Atual
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card p-8 border-white/5">
            <h3 className="text-xl font-serif font-bold mb-6">Detalhes do Pedido</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-white/5 rounded flex items-center justify-center text-xs font-bold gold-text">
                      {item.quantity}x
                    </span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">MT {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm text-white/40">
                  <span>Subtotal</span>
                  <span>MT {(order.total - (order.type === 'delivery' ? 150 : 0)).toLocaleString()}</span>
                </div>
                {order.type === 'delivery' && (
                  <div className="flex justify-between text-sm text-white/40">
                    <span>Taxa de Entrega</span>
                    <span>MT 150</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-serif font-bold gold-text pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>MT {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-white/5">
            <h4 className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-4">Informações de Entrega</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-1" />
                <div>
                  <p className="text-xs font-bold mb-1">Endereço</p>
                  <p className="text-xs text-white/40 leading-relaxed">{order.address || 'Levantamento no Restaurante'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-400 mt-1" />
                <div>
                  <p className="text-xs font-bold mb-1">Contacto</p>
                  <p className="text-xs text-white/40">+258 86 767 4675</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-white/5">
            <h4 className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-4">Método de Pagamento</h4>
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-gold-400" />
              <div>
                <p className="text-xs font-bold uppercase">{order.paymentMethod}</p>
                <p className="text-[10px] text-white/40">ID da Transação: {order.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border-white/5 bg-gold-500/5">
            <h4 className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-4">Precisa de Ajuda?</h4>
            <p className="text-xs text-white/60 mb-4 leading-relaxed">
              Se tiver algum problema com o seu pedido, contacte a nossa equipa de suporte ou utilize o Chatbot de IA.
            </p>
            <button className="w-full py-3 rounded-xl border border-gold-500/20 text-gold-400 text-xs font-bold hover:bg-gold-500/10 transition-all">
              Contactar Suporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
