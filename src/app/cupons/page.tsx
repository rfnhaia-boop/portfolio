'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, ArrowLeft, Plus, Trash2, Check, Sparkles, 
  Settings, Layers, Copy, CheckCircle, DollarSign, Gift, Scissors
} from 'lucide-react';
import Link from 'next/link';

// Tipagem dos Cupons baseados no layout do Clube Flow
interface Coupon {
  id: string;
  code: string;
  category: string; // Ex: 'CLUBE DE VANTAGENS'
  title: string;    // Ex: '1º CORTE GRÁTIS'
  description: string; // Ex: 'Válido na primeira reserva'
  badgeText: string;  // Ex: 'FREE OFF', '10% OFF'
  validity: string;   // Ex: 'VÁLIDO PARA HOJE'
  ringColor: string;  // Classe CSS para borda do anel (ex: border-cyan-400, text-cyan-400)
  ringGlow: string;   // Sombra de brilho neon para o anel
  status: 'active' | 'used';
  claimedAt: string;
}

// Modelos pré-configurados do Clube Flow
const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'flow-1',
    code: 'PRIMEIROFREE',
    category: 'CLUBE DE VANTAGENS',
    title: '1º CORTE GRÁTIS',
    description: 'Válido na primeira reserva',
    badgeText: 'FREE OFF',
    validity: 'VÁLIDO PARA HOJE',
    ringColor: 'border-[#00E5FF] text-[#00E5FF]',
    ringGlow: '0 0 15px rgba(0, 229, 255, 0.5)',
    status: 'active',
    claimedAt: new Date().toLocaleDateString('pt-BR')
  },
  {
    id: 'flow-2',
    code: 'BARBA10',
    category: 'CLUBE DE VANTAGENS',
    title: '10% OFF BARBA',
    description: 'Qualquer barbearia',
    badgeText: '10% OFF',
    validity: 'VÁLIDO PARA HOJE',
    ringColor: 'border-[#FFD54F] text-[#FFD54F]',
    ringGlow: '0 0 15px rgba(255, 213, 79, 0.5)',
    status: 'active',
    claimedAt: new Date().toLocaleDateString('pt-BR')
  },
  {
    id: 'flow-3',
    code: 'VIPFLOW',
    category: 'CLUBE DE VANTAGENS',
    title: 'COMBO VIP',
    description: 'Desconto em serviços combinados',
    badgeText: 'COMBO OFF',
    validity: 'VÁLIDO PARA HOJE',
    ringColor: 'border-[#FF4081] text-[#FF4081]',
    ringGlow: '0 0 15px rgba(255, 64, 129, 0.5)',
    status: 'active',
    claimedAt: new Date().toLocaleDateString('pt-BR')
  }
];

export default function CuponsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Estado do Gerador
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<Coupon | null>(null);
  
  // Formulário do Admin para novos cupons do Clube Flow
  const [newCouponForm, setNewCouponForm] = useState({
    title: 'CORTE + BARBA VIP',
    description: 'Serviço completo com bebida inclusa',
    badgeText: '20% OFF',
    validity: 'VÁLIDO PARA HOJE',
    ringColor: '#00E5FF' // Cor hexadecimal para mapear
  });

  useEffect(() => {
    const saved = localStorage.getItem('flow_club_coupons');
    if (saved) {
      setCoupons(JSON.parse(saved));
    } else {
      setCoupons(DEFAULT_COUPONS);
      localStorage.setItem('flow_club_coupons', JSON.stringify(DEFAULT_COUPONS));
    }
  }, []);

  const saveToLocalStorage = (updated: Coupon[]) => {
    setCoupons(updated);
    localStorage.setItem('flow_club_coupons', JSON.stringify(updated));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Gerar novo cupom aleatório do Clube Flow
  const handleGenerateCoupon = () => {
    setIsGenerating(true);
    setGeneratedCoupon(null);
    
    setTimeout(() => {
      const templates = [
        { title: 'BEBIDA GRÁTIS', desc: 'Na compra de qualquer serviço', badge: 'BEER FREE', color: 'border-[#00E5FF] text-[#00E5FF]', glow: '0 0 15px rgba(0, 229, 255, 0.5)', code: 'DRINKFREE' },
        { title: '15% OFF SÁBADO', desc: 'Válido apenas aos sábados', badge: '15% OFF', color: 'border-[#FFD54F] text-[#FFD54F]', glow: '0 0 15px rgba(255, 213, 79, 0.5)', code: 'SABADO15' },
        { title: 'SOBRANCELHA FREE', desc: 'Cortando cabelo e barba', badge: 'VIP FREE', color: 'border-[#FF4081] text-[#FF4081]', glow: '0 0 15px rgba(255, 64, 129, 0.5)', code: 'BROWFREE' }
      ];
      
      const selected = templates[Math.floor(Math.random() * templates.length)];
      const uniqueCode = `${selected.code}${Math.floor(10 + Math.random() * 90)}`;

      const newCoupon: Coupon = {
        id: `flow-${Date.now()}`,
        code: uniqueCode,
        category: 'CLUBE DE VANTAGENS',
        title: selected.title,
        description: selected.desc,
        badgeText: selected.badge,
        validity: 'VÁLIDO PARA HOJE',
        ringColor: selected.color,
        ringGlow: selected.glow,
        status: 'active',
        claimedAt: new Date().toLocaleDateString('pt-BR')
      };

      const updated = [newCoupon, ...coupons];
      saveToLocalStorage(updated);
      setGeneratedCoupon(newCoupon);
      setIsGenerating(false);
    }, 1500);
  };

  // Cadastrar no painel Admin
  const handleCreateAdminCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponForm.title.replace(/\s+/g, '').substring(0, 8).toUpperCase() + Math.floor(10 + Math.random() * 90);
    
    // Mapeamento de cores
    let ringColorClass = 'border-[#00E5FF] text-[#00E5FF]';
    let ringGlowVal = '0 0 15px rgba(0, 229, 255, 0.5)';
    if (newCouponForm.ringColor === '#FFD54F') {
      ringColorClass = 'border-[#FFD54F] text-[#FFD54F]';
      ringGlowVal = '0 0 15px rgba(255, 213, 79, 0.5)';
    } else if (newCouponForm.ringColor === '#FF4081') {
      ringColorClass = 'border-[#FF4081] text-[#FF4081]';
      ringGlowVal = '0 0 15px rgba(255, 64, 129, 0.5)';
    }

    const newCoupon: Coupon = {
      id: `flow-${Date.now()}`,
      code: cleanCode,
      category: 'CLUBE DE VANTAGENS',
      title: newCouponForm.title.toUpperCase(),
      description: newCouponForm.description,
      badgeText: newCouponForm.badgeText.toUpperCase(),
      validity: newCouponForm.validity.toUpperCase(),
      ringColor: ringColorClass,
      ringGlow: ringGlowVal,
      status: 'active',
      claimedAt: new Date().toLocaleDateString('pt-BR')
    };

    const updated = [newCoupon, ...coupons];
    saveToLocalStorage(updated);
    alert('Cupom cadastrado com sucesso no Clube Flow!');
  };

  const handleDeleteCoupon = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    saveToLocalStorage(updated);
  };

  const handleToggleUsed = (id: string) => {
    const updated = coupons.map((c): Coupon => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'used' : 'active' };
      }
      return c;
    });
    saveToLocalStorage(updated);
  };

  // Efeito 3D Tilt individual
  const [tiltStyles, setTiltStyles] = useState<Record<string, string>>({});
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 12;
    const angleY = (x - xc) / 12;
    
    setTiltStyles(prev => ({
      ...prev,
      [id]: `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`
    }));
  };

  const handleMouseLeave = (id: string) => {
    setTiltStyles(prev => ({
      ...prev,
      [id]: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }));
  };

  // Estatísticas Admin
  const totalCount = coupons.length;
  const activeCount = coupons.filter(c => c.status === 'active').length;
  const usedCount = coupons.filter(c => c.status === 'used').length;

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative scroll-smooth">
      {/* Background Barber Shop decorativo desaturado */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-[0.06] pointer-events-none z-0"
        style={{ backgroundImage: "url('/new_company_bg.png')" }} 
      />
      {/* Grid Overlay sutil */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      
      {/* Glow do Cabeçalho */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#070708]/90 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-xs font-bold tracking-wider text-zinc-400 flex items-center gap-1">
                <Scissors className="w-3.5 h-3.5 text-cyan-400" /> CLUBE FLOW
              </span>
              <p className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase">Visual Fidelity Prototype</p>
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/5 p-1 rounded-xl flex items-center gap-1">
            <button 
              onClick={() => setIsAdmin(false)}
              className={`px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                !isAdmin ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Meus Cupons
            </button>
            <button 
              onClick={() => setIsAdmin(true)}
              className={`px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                isAdmin ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Painel Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">

        {!isAdmin ? (
          <div className="space-y-12">
            
            {/* Seção Principal: Seus Cupons (Clube Flow) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Seus Cupons (Clube Flow)
                </h1>
              </div>

              {/* Grid Horizontal de Tickets */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    onMouseMove={(e) => handleMouseMove(e, coupon.id)}
                    onMouseLeave={() => handleMouseLeave(coupon.id)}
                    style={{
                      transform: tiltStyles[coupon.id] || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                      transition: 'transform 0.1s ease-out',
                    }}
                    className={`h-40 rounded-xl bg-black/40 border border-white/10 relative overflow-hidden flex select-none backdrop-blur-md transition-opacity duration-300 ${
                      coupon.status === 'used' ? 'opacity-40' : 'opacity-100 hover:border-white/20'
                    }`}
                  >
                    {/* Meio Círculo Recortado Esquerdo */}
                    <div className="absolute top-1/2 -left-2.5 w-5 h-5 rounded-full bg-[#070708] -translate-y-1/2 border-r border-white/10 z-20" />
                    {/* Meio Círculo Recortado Direito */}
                    <div className="absolute top-1/2 -right-2.5 w-5 h-5 rounded-full bg-[#070708] -translate-y-1/2 border-l border-white/10 z-20" />

                    {/* Picote rip-off no topo do pontilhado */}
                    <div className="absolute top-[-7px] left-[84px] w-3.5 h-3.5 rounded-full bg-[#070708] border-b border-white/10 z-20" />
                    {/* Picote rip-off na base do pontilhado */}
                    <div className="absolute bottom-[-7px] left-[84px] w-3.5 h-3.5 rounded-full bg-[#070708] border-t border-white/10 z-20" />

                    {/* LADO ESQUERDO: BARCODE & CÓDIGO */}
                    <div className="w-[92px] py-4 px-3 flex flex-col justify-between items-center border-r border-dashed border-white/10 relative shrink-0">
                      <span className="text-[7px] text-zinc-500 font-mono tracking-widest">FLOW TICKET</span>
                      
                      {/* Barcode */}
                      <div className="flex gap-[1.5px] items-end h-10 w-full px-1">
                        {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2].map((w, i) => (
                          <div 
                            key={i} 
                            style={{ width: `${w * 0.8}px` }} 
                            className="h-full bg-zinc-400 shrink-0" 
                          />
                        ))}
                      </div>

                      {/* Código Copiável */}
                      <button
                        onClick={() => handleCopyCode(coupon.id, coupon.code)}
                        disabled={coupon.status === 'used'}
                        className="w-full py-1 bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-white font-mono text-[8px] font-bold rounded truncate tracking-tighter uppercase transition cursor-pointer flex items-center justify-center"
                      >
                        {copiedId === coupon.id ? 'COPIADO' : coupon.code}
                      </button>
                    </div>

                    {/* LADO DIREITO: DADOS DO PRODUTO & ANEL NEON */}
                    <div className="flex-1 p-4 flex items-center justify-between gap-2 relative">
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <span className="text-[8px] text-zinc-500 font-bold tracking-wider uppercase block">
                            {coupon.category}
                          </span>
                          <h3 className="text-base font-extrabold text-white tracking-tight mt-1 leading-tight">
                            {coupon.title}
                          </h3>
                          <p className="text-[10px] text-zinc-400 font-light mt-0.5 leading-snug max-w-[130px] line-clamp-2">
                            {coupon.description}
                          </p>
                        </div>
                        
                        <span className="text-[8px] text-zinc-500 font-bold font-mono tracking-wider block">
                          {coupon.validity}
                        </span>
                      </div>

                      {/* Anel de Destaque Neon 3D */}
                      <div className="flex flex-col items-center justify-center shrink-0 pr-2">
                        <div 
                          style={{ boxShadow: coupon.ringGlow }}
                          className={`w-14 h-14 rounded-full border-2 bg-black/65 flex flex-col items-center justify-center text-center shrink-0 ${coupon.ringColor}`}
                        >
                          <span className="text-[9px] font-extrabold leading-none tracking-tighter uppercase">
                            {coupon.badgeText.split(' ')[0]}
                          </span>
                          {coupon.badgeText.split(' ')[1] && (
                            <span className="text-[7px] font-bold leading-none tracking-wider uppercase mt-0.5">
                              {coupon.badgeText.split(' ')[1]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Opção Rápida de Administrador (Usar Cupom) */}
                      {coupon.status === 'active' && (
                        <button
                          onClick={() => handleToggleUsed(coupon.id)}
                          className="absolute top-2 right-2 p-1 hover:bg-white/5 rounded text-[8px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                          title="Marcar como usado"
                        >
                          Usar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gerador de Cupons (Simulação) */}
            <div className="border-t border-white/5 pt-12 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" /> Resgatar Novos Cupons
                </h2>
                <p className="text-zinc-500 text-xs mt-0.5">Participe das nossas promoções e ganhe cupons com visual exclusivo Clube Flow.</p>
              </div>

              <div className="max-w-xl mx-auto p-8 rounded-2xl bg-zinc-950 border border-white/5 text-center space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Roleta de Benefícios Clube Flow</h3>
                  <p className="text-zinc-500 text-xs max-w-sm mx-auto">Sorteie aleatoriamente um novo cupom e adicione na sua lista acima.</p>
                </div>

                <button
                  onClick={handleGenerateCoupon}
                  disabled={isGenerating}
                  className="w-full max-w-xs mx-auto py-3 px-6 rounded-xl bg-cyan-400 text-black hover:bg-cyan-300 font-extrabold text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Emitindo Cupom...
                    </>
                  ) : (
                    <>
                      Sortear Novo Cupom <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

                {generatedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold"
                  >
                    Sucesso! O cupom <span className="font-mono text-white bg-zinc-900 px-1.5 py-0.5 rounded">{generatedCoupon.code}</span> foi gerado e adicionado à sua carteira.
                  </motion.div>
                )}
              </div>
            </div>

          </div>
        ) : (
          
          /* PAINEL ADMINISTRATIVO */
          <div className="space-y-8 animate-fadeIn">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                <Settings className="w-3 h-3" /> Gerenciador de Campanhas
              </span>
              <h1 className="text-xl font-bold text-white mt-1">Configuração do Clube de Vantagens</h1>
              <p className="text-zinc-500 text-xs font-light">Adicione cupons que serão listados na página inicial ou gerados na roleta.</p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Cupons Emitidos', value: totalCount },
                { label: 'Ativos / Não Utilizados', value: activeCount },
                { label: 'Cupons Resgatados', value: usedCount }
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-900/30 border border-white/5">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono block">{stat.label}</span>
                  <span className="text-xl font-extrabold text-white tracking-tight mt-1 block">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Criação e Grid */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 p-6 rounded-xl bg-zinc-950 border border-white/5 space-y-6">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Novo Cupom</h3>
                <form onSubmit={handleCreateAdminCoupon} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-semibold text-zinc-400 uppercase">Título (Ex: 10% OFF BARBA)</label>
                    <input 
                      type="text" 
                      required
                      value={newCouponForm.title}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, title: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/5 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-semibold text-zinc-400 uppercase">Descrição (Ex: Qualquer barbearia)</label>
                    <input 
                      type="text" 
                      required
                      value={newCouponForm.description}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/5 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-zinc-400 uppercase">Texto do Anel (Ex: 10% OFF)</label>
                      <input 
                        type="text" 
                        required
                        value={newCouponForm.badgeText}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, badgeText: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/5 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-zinc-400 uppercase">Cor do Anel Neon</label>
                      <select 
                        value={newCouponForm.ringColor}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, ringColor: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/5 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                      >
                        <option value="#00E5FF">Ciano (Free)</option>
                        <option value="#FFD54F">Dourado (10% Off)</option>
                        <option value="#FF4081">Rosa (Combo VIP)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-2.5 rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition font-bold text-xs tracking-wider uppercase cursor-pointer"
                  >
                    Adicionar Cupom
                  </button>
                </form>
              </div>

              {/* Tabela de listagem */}
              <div className="lg:col-span-7 p-6 rounded-xl bg-zinc-950 border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Listagem Geral</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/5 text-zinc-500 text-[10px]">
                        <th className="py-2">Código</th>
                        <th className="py-2">Título</th>
                        <th className="py-2">Status</th>
                        <th className="py-2 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {coupons.map((c) => (
                        <tr key={c.id}>
                          <td className="py-2.5 font-bold text-white">{c.code}</td>
                          <td className="py-2.5">{c.title}</td>
                          <td className="py-2.5">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              c.status === 'active' 
                                ? 'bg-cyan-500/10 text-cyan-400' 
                                : 'bg-zinc-800 text-zinc-500'
                            }`}>
                              {c.status === 'active' ? 'Ativo' : 'Usado'}
                            </span>
                          </td>
                          <td className="py-2.5 text-right space-x-2">
                            <button
                              onClick={() => handleToggleUsed(c.id)}
                              className="text-[10px] text-zinc-500 hover:text-white transition cursor-pointer"
                            >
                              Status
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(c.id)}
                              className="text-[10px] text-red-400 hover:text-red-300 transition cursor-pointer"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 text-center text-[9px] text-zinc-700 font-mono tracking-wider">
        CLUBE FLOW & NEW COMPANY CORE SYSTEM
      </footer>
    </div>
  );
}
