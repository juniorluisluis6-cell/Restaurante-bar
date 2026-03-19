import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard, Wallet, MapPin } from 'lucide-react';
import { MenuItem, OrderItem, OrderType, PaymentMethod } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: (type: OrderType, payment: PaymentMethod, address?: string, paymentPhone?: string) => void;
}

export const Cart: React.FC<CartProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout
}) => {
  const [orderType, setOrderType] = React.useState<OrderType>('delivery');
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('cash');
  const [address, setAddress] = React.useState('');
  const [mpesaPhone, setMpesaPhone] = React.useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? 150 : 0;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 gold-text" />
                <h2 className="text-xl font-serif font-bold">Sua Seleção</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-white/40 font-serif italic">Sua seleção está vazia no momento.</p>
                  <button 
                    onClick={onClose}
                    className="text-gold-400 text-sm font-medium hover:underline"
                  >
                    Explore o nosso menu
                  </button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.itemId} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img 
                        src={`https://picsum.photos/seed/${item.name}/100/100`} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-serif font-bold text-sm">{item.name}</h3>
                        <button 
                          onClick={() => onRemoveItem(item.itemId)}
                          className="text-white/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gold-400 text-xs font-bold mb-3">MT {item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10 p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.itemId, -1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.itemId, 1)}
                            className="p-1 hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs text-white/40 font-medium">MT {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Section */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white/5 border-t border-white/10 space-y-6">
                {/* Order Type */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-black rounded-xl border border-white/10">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      orderType === 'delivery' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Entrega
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      orderType === 'pickup' ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Levantamento
                  </button>
                </div>

                {/* Delivery Address */}
                {orderType === 'delivery' && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Endereço de Entrega
                    </label>
                    <input 
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Insira sua localização em Chimoio..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none transition-colors"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Método de Pagamento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        paymentMethod === 'cash' ? 'bg-white/10 border-gold-400 text-gold-400' : 'bg-black border-white/10 text-white/40'
                      }`}
                    >
                      <Wallet className="w-4 h-4" />
                      <span className="text-xs font-bold">Dinheiro</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        paymentMethod === 'mpesa' ? 'bg-white/10 border-gold-400 text-gold-400' : 'bg-black border-white/10 text-white/40'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs font-bold">M-Pesa</span>
                    </button>
                  </div>
                </div>

                {/* M-Pesa Phone Input */}
                {paymentMethod === 'mpesa' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Número de Telefone M-Pesa</label>
                    <input 
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="+258 84/85 ..."
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none transition-colors"
                    />
                    <p className="text-[10px] text-white/30 italic">Você receberá um aviso de pagamento no seu telefone.</p>
                  </motion.div>
                )}

                {/* Totals */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Subtotal</span>
                    <span className="text-white font-medium">MT {subtotal.toLocaleString()}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Taxa de Entrega</span>
                      <span className="text-white font-medium">MT {deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-end pt-2 border-t border-white/10">
                    <span className="text-lg font-serif font-bold gold-text">Total</span>
                    <span className="text-2xl font-serif font-bold">MT {total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onCheckout(orderType, paymentMethod, address, mpesaPhone)}
                  className="gold-button w-full !py-4"
                >
                  Confirmar Pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
