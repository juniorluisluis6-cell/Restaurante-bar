import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabase';
import { UserProfile } from '../types';

interface ReservationsProps {
  userProfile: UserProfile | null;
  onSuccess: () => void;
}

export const Reservations: React.FC<ReservationsProps> = ({ userProfile, onSuccess }) => {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [guests, setGuests] = React.useState(2);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('reservations').insert([{
        customer_id: userProfile.uid,
        customer_name: userProfile.name,
        date,
        time,
        guests,
        status: 'pending'
      }]);
      
      if (insertError) throw insertError;
      onSuccess();
    } catch (err) {
      setError('Falha ao reservar. Por favor, tente novamente.');
      console.error('Reservation failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gold-text">Reserve Sua Mesa</h2>
        <p className="text-white/60">Garanta o seu lugar para uma experiência gastronómica inesquecível no Papa's Chicken.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Info */}
        <div className="space-y-8">
          <div className="glass-card p-8 border-white/5 space-y-6">
            <h3 className="text-2xl font-serif font-bold gold-text">Jantar Premium</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Seja uma reunião de família, um encontro de negócios ou um jantar romântico, oferecemos o ambiente e o serviço perfeitos.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20">
                  <CheckCircle2 className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Assento Prioritário</p>
                  <p className="text-xs text-white/40">Evite a fila com uma reserva confirmada.</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold-500/10 rounded-full flex items-center justify-center border border-gold-500/20">
                  <Clock className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Horário Flexível</p>
                  <p className="text-xs text-white/40">Escolha o horário que melhor se adapta à sua agenda.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gold-500/5 border border-gold-500/10 rounded-2xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-gold-400 flex-shrink-0" />
            <p className="text-xs text-gold-400/80 leading-relaxed italic">
              * As reservas são mantidas por 15 minutos. Por favor, contacte-nos se estiver atrasado. Para grupos superiores a 20 pessoas, por favor ligue-nos diretamente.
            </p>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 border-white/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Selecionar Data
              </label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Selecionar Hora
              </label>
              <input 
                type="time" 
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold-400 outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold flex items-center gap-1">
                <Users className="w-3 h-3" /> Número de Convidados
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="flex-grow accent-gold-500"
                />
                <span className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center font-bold text-gold-400">
                  {guests}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting || !userProfile}
              className="gold-button w-full !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Reservando...' : userProfile ? 'Confirmar Reserva' : 'Entrar para Reservar'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
