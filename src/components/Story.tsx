import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Award, Star, Heart, Utensils, Flame } from 'lucide-react';

export const Story: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="relative h-[60vh] rounded-3xl overflow-hidden mb-24">
        <img 
          src="https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/1" 
          alt="Nossa História" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Um Legado de <span className="gold-shimmer italic">Sabor</span> & Paixão
            </h1>
            <p className="text-xl text-white/70 font-light leading-relaxed">
              De uma pequena cozinha familiar ao principal destino gastronómico de Chimoio.
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 rounded-full border border-gold-500/20">
            <ChefHat className="w-4 h-4 text-gold-400" />
            <span className="text-[10px] font-bold gold-text uppercase tracking-widest">Os Nossos Começos Humildes</span>
          </div>
          <h2 className="text-4xl font-serif font-bold">A <span className="gold-text">Tradição</span> do A Fornalha</h2>
          <p className="text-white/60 leading-relaxed">
            Fundado em 2015, o A Fornalha começou com uma missão simples: trazer os sabores autênticos da pizza e grelhados para o coração de Chimoio. O que começou como uma pequena banca cresceu para um restaurante amado, conhecido pela nossa qualidade intransigente e hospitalidade calorosa.
          </p>
          <p className="text-white/60 leading-relaxed">
            O nosso segredo reside nos detalhes. Utilizamos apenas os ingredientes locais mais frescos, e o nosso molho peri-peri de assinatura é feito a partir de uma receita de família passada de geração em geração. Cada frango é grelhado na brasa na perfeição, garantindo que cada dentada seja uma celebração de sabor.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div>
              <p className="text-4xl font-serif font-bold gold-text mb-2">10+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Anos de Excelência</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold gold-text mb-2">50k+</p>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Clientes Felizes</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
            <img 
              src="https://ais-dev-o62llfdmw4j3tjxhf4cekv-136858374245.asia-east1.run.app/api/attachments/c281f284-babb-46fa-bd1b-5008d92ad84e/4" 
              alt="Cozinha" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gold-500 rounded-3xl p-8 flex flex-col justify-center shadow-2xl shadow-gold-500/20 hidden md:flex">
            <Award className="text-black w-12 h-12 mb-4" />
            <h4 className="text-black text-xl font-serif font-bold mb-2">Melhor Fast Food</h4>
            <p className="text-black/60 text-xs font-medium uppercase tracking-widest">Província de Manica 2024</p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <section className="py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold gold-text mb-4">Os Nossos Valores Fundamentais</h2>
          <p className="text-white/40 max-w-xl mx-auto">Os princípios que guiam cada prato que servimos e cada convidado que recebemos.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Qualidade em Primeiro Lugar', icon: <Star />, desc: 'Nunca comprometemos a qualidade dos nossos ingredientes ou os nossos métodos de preparação.' },
            { title: 'Sabor Autêntico', icon: <Flame />, desc: 'As nossas receitas estão enraizadas na tradição, trazendo-lhe o verdadeiro sabor de Moçambique.' },
            { title: 'Coração da Comunidade', icon: <Heart />, desc: 'Temos orgulho em fazer parte de Chimoio e esforçamo-nos por retribuir à nossa comunidade.' },
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 border-white/5 text-center"
            >
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold-500/20">
                {React.cloneElement(value.icon as React.ReactElement<any>, { className: 'text-gold-400 w-8 h-8' })}
              </div>
              <h3 className="text-xl font-serif font-bold mb-4">{value.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-serif font-bold gold-text mb-4">Conheça os Mestres</h2>
            <p className="text-white/40 max-w-md">Os indivíduos talentosos por trás dos sabores do A Fornalha.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Chef Antonio', role: 'Chef Executivo', img: 'https://i.pravatar.cc/300?u=antonio' },
            { name: 'Maria Silva', role: 'Gerente de Cozinha', img: 'https://i.pravatar.cc/300?u=maria' },
            { name: 'Lucas Bento', role: 'Mestre da Grelha', img: 'https://i.pravatar.cc/300?u=lucas' },
            { name: 'Sofia Costa', role: 'Chef de Pastelaria', img: 'https://i.pravatar.cc/300?u=sofia' },
          ].map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 border border-white/10">
                <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gold-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <h4 className="text-lg font-serif font-bold mb-1">{member.name}</h4>
              <p className="text-[10px] text-gold-400 font-bold uppercase tracking-widest">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
