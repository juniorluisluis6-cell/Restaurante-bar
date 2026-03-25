import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users, Info, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const Booking: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    people: '',
    location: '',
    date: '',
    duration: '',
    coverage: 'both',
    urgency: 'normal',
    budget: '',
    terms: false
  });

  const sessionTypes = [
    { id: 'wedding', label: 'Casamento', icon: <Users className="w-5 h-5" /> },
    { id: 'event', label: 'Evento Social', icon: <Calendar className="w-5 h-5" /> },
    { id: 'personal', label: 'Ensaio Pessoal', icon: <Users className="w-5 h-5" /> },
    { id: 'corporate', label: 'Corporativo', icon: <Briefcase className="w-5 h-5" /> }
  ];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      alert('Por favor, faça login para realizar um agendamento.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        customerId: auth.currentUser.uid,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error: any) {
      console.error('Booking error:', error);
      alert('Erro ao realizar agendamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-32 bg-matte-black min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-md w-full text-center space-y-8"
        >
          <div className="w-20 h-20 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-gold-400 w-10 h-10" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif font-bold">Pedido Recebido!</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Seu agendamento foi registrado com sucesso. Nossa equipe entrará em contato em até 24 horas para confirmar os detalhes.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="gold-button w-full"
          >
            Voltar ao Início
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-matte-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-4xl md:text-6xl font-serif font-bold gold-shimmer">Agendamento Premium</h2>
          <p className="text-white/40 font-light leading-relaxed">
            Reserve sua data com exclusividade. Preencha os detalhes abaixo para que possamos planejar sua experiência inconfundível.
          </p>
        </div>

        <div className="glass-card p-12 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-gold-500 transition-all duration-700" style={{ width: `${(step / 3) * 100}%` }} />

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold">Qual o tipo de sessão?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sessionTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`p-6 rounded-2xl border flex items-center gap-6 transition-all duration-500 ${
                        formData.type === type.id 
                          ? 'bg-gold-500/10 border-gold-500 text-gold-400' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        formData.type === type.id ? 'bg-gold-500 text-black' : 'bg-white/5'
                      }`}>
                        {type.icon}
                      </div>
                      <span className="font-bold uppercase tracking-widest text-[10px]">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Número de Pessoas</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                    <input 
                      type="number" 
                      placeholder="Ex: 50"
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-sm focus:border-gold-500 outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Local do Evento</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                    <input 
                      type="text" 
                      placeholder="Ex: Chimoio, Hotel VIP"
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-sm focus:border-gold-500 outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNext}
                disabled={!formData.type || !formData.people || !formData.location}
                className="gold-button w-full disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Próximo Passo
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Data Preferencial</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                    <input 
                      type="date" 
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-sm focus:border-gold-500 outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Duração (Horas)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
                    <input 
                      type="number" 
                      placeholder="Ex: 4"
                      className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-6 py-4 text-sm focus:border-gold-500 outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold">Tipo de Cobertura</h3>
                <div className="flex flex-wrap gap-4">
                  {['Foto', 'Vídeo', 'Ambos'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFormData({ ...formData, coverage: opt.toLowerCase() })}
                      className={`px-8 py-3 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                        formData.coverage === opt.toLowerCase() 
                          ? 'bg-gold-500 border-gold-500 text-black' 
                          : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="outline-button flex-1">Voltar</button>
                <button onClick={handleNext} className="gold-button flex-1">Próximo</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Orçamento Estimado (MT)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 15.000"
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-6 py-4 text-sm focus:border-gold-500 outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>

                <div className="p-6 bg-gold-500/5 border border-gold-500/20 rounded-2xl flex items-start gap-4">
                  <Info className="w-5 h-5 text-gold-400 shrink-0 mt-1" />
                  <p className="text-xs text-white/60 leading-relaxed font-light">
                    Ao confirmar este pedido, você está solicitando uma reserva formal. Nossa equipe entrará em contato em até 24 horas para confirmar a disponibilidade e detalhes do contrato.
                  </p>
                </div>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 ${
                    formData.terms ? 'bg-gold-500 border-gold-500' : 'bg-white/5 border-white/10 group-hover:border-gold-500/50'
                  }`}>
                    {formData.terms && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  />
                  <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Aceito os termos de compromisso formal e política de reserva.</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={handleBack} className="outline-button flex-1" disabled={loading}>Voltar</button>
                <button 
                  disabled={!formData.terms || loading}
                  onClick={handleSubmit}
                  className="gold-button flex-1 flex items-center justify-center gap-3 disabled:opacity-30"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>Confirmar Pedido <Send className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
