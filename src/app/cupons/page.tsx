'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, ArrowLeft, Plus, Trash2, Check, Sparkles, 
  Settings, Layers, Copy, CheckCircle, DollarSign, Globe
} from 'lucide-react';
import Link from 'next/link';

// Tipagem dos Cupons
interface Coupon {
  id: string;
  code: string;
  brand: string;
  brandLogo: string;
  title: string;
  discount: string;
  expiry: string;
  gradient: string;
  glowColor: string;
  claimedAt?: string;
  status: 'active' | 'used' | 'expired';
}

// Configurações de Marcas pré-definidas para o gerador
const BRANDS_POOL = [
  { name: 'Amazon', logo: 'AMZ', discount: 'R$ 50 OFF', title: 'Em Eletrônicos e Livros', gradient: 'from-amber-500 to-orange-600', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { name: 'Mercado Livre', logo: 'MELI', discount: '15% OFF', title: 'Frete Grátis acima de R$ 79', gradient: 'from-yellow-400 to-amber-500', glowColor: 'rgba(234, 179, 8, 0.4)' },
  { name: 'Shopee', logo: 'SHP', discount: 'R$ 20 OFF', title: 'Sem valor mínimo de compra', gradient: 'from-orange-500 to-red-600', glowColor: 'rgba(249, 115, 22, 0.4)' },
  { name: 'AliExpress', logo: 'ALI', discount: '30% OFF', title: 'Seleção Choice com entrega rápida', gradient: 'from-red-500 to-rose-700', glowColor: 'rgba(239, 68, 68, 0.4)' },
  { name: 'Magalu', logo: 'MGL', discount: '10% OFF', title: 'Válido em todo o departamento de móveis', gradient: 'from-blue-500 to-indigo-600', glowColor: 'rgba(59, 130, 246, 0.4)' }
];

export default function CuponsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterBrand, setFilterBrand] = useState('all');
  
  // Estados do Gerador
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<Coupon | null>(null);
  
  // Formulário do Admin para novo tipo de cupom
  const [newCouponForm, setNewCouponForm] = useState({
    brand: 'Amazon',
    discount: '15% OFF',
    title: 'Cupom Especial New Company',
    gradient: 'from-indigo-500 to-purple-600',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    expiry: '31/12/2026'
  });

  // Carregar dados iniciais e persistência
  useEffect(() => {
    const savedCoupons = localStorage.getItem('fidelix_demo_coupons');
    if (savedCoupons) {
      setCoupons(JSON.parse(savedCoupons));
    } else {
      // Iniciar com alguns cupons padrão
      const defaultCoupons: Coupon[] = [
        {
          id: 'cp-1',
          code: 'AMAZON50NEW',
          brand: 'Amazon',
          brandLogo: 'AMZ',
          title: 'Em Eletrônicos e Livros',
          discount: 'R$ 50 OFF',
          expiry: '30/08/2026',
          gradient: 'from-amber-500 to-orange-600',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          status: 'active',
          claimedAt: new Date().toLocaleDateString('pt-BR')
        },
        {
          id: 'cp-2',
          code: 'SHOPEE20OFF',
          brand: 'Shopee',
          brandLogo: 'SHP',
          title: 'Sem valor mínimo de compra',
          discount: 'R$ 20 OFF',
          expiry: '15/09/2026',
          gradient: 'from-orange-500 to-red-600',
          glowColor: 'rgba(249, 115, 22, 0.4)',
          status: 'active',
          claimedAt: new Date().toLocaleDateString('pt-BR')
        }
      ];
      setCoupons(defaultCoupons);
      localStorage.setItem('fidelix_demo_coupons', JSON.stringify(defaultCoupons));
    }
  }, []);

  const saveToLocalStorage = (updatedCoupons: Coupon[]) => {
    setCoupons(updatedCoupons);
    localStorage.setItem('fidelix_demo_coupons', JSON.stringify(updatedCoupons));
  };

  // Copiar código
  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Gerar Cupom Aleatório no Fluxo do Cliente
  const handleGenerateCoupon = () => {
    setIsGenerating(true);
    setGeneratedCoupon(null);
    
    setTimeout(() => {
      // Seleciona marca aleatória
      const randomBrand = BRANDS_POOL[Math.floor(Math.random() * BRANDS_POOL.length)];
      const uniqueCode = `${randomBrand.name.substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}FLOW`;
      
      const newCoupon: Coupon = {
        id: `cp-${Date.now()}`,
        code: uniqueCode,
        brand: randomBrand.name,
        brandLogo: randomBrand.logo,
        title: randomBrand.title,
        discount: randomBrand.discount,
        expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        gradient: randomBrand.gradient,
        glowColor: randomBrand.glowColor,
        status: 'active',
        claimedAt: new Date().toLocaleDateString('pt-BR')
      };

      const updated = [newCoupon, ...coupons];
      saveToLocalStorage(updated);
      setGeneratedCoupon(newCoupon);
      setIsGenerating(false);
    }, 1800); // tempo para o efeito visual de carregamento
  };

  // Criar cupom personalizado via Admin Panel
  const handleCreateAdminCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueCode = `${newCouponForm.brand.substring(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}ADM`;
    
    const logoMap: Record<string, string> = {
      'Amazon': 'AMZ', 'Mercado Livre': 'MELI', 'Shopee': 'SHP', 
      'AliExpress': 'ALI', 'Magalu': 'MGL'
    };

    const newCoupon: Coupon = {
      id: `cp-${Date.now()}`,
      code: uniqueCode,
      brand: newCouponForm.brand,
      brandLogo: logoMap[newCouponForm.brand] || 'BRAND',
      title: newCouponForm.title,
      discount: newCouponForm.discount,
      expiry: newCouponForm.expiry || '31/12/2026',
      gradient: newCouponForm.gradient,
      glowColor: newCouponForm.glowColor,
      status: 'active',
      claimedAt: new Date().toLocaleDateString('pt-BR')
    };

    const updated = [newCoupon, ...coupons];
    saveToLocalStorage(updated);
    
    // Reset form or success feedback
    alert('Novo tipo de cupom cadastrado com sucesso no sistema!');
  };

  // Deletar ou revogar cupom
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

  // Estatísticas para o Dashboard do Administrador
  const totalClaimed = coupons.length;
  const activeCount = coupons.filter(c => c.status === 'active').length;
  const usedCount = coupons.filter(c => c.status === 'used').length;
  const estimatedSavings = coupons.reduce((acc, c) => {
    const value = c.discount.includes('R$') ? parseInt(c.discount.replace(/\D/g, '')) : 35; // default R$ 35 para porcentagens
    return acc + (c.status === 'used' ? value : 0);
  }, 0);

  // Efeito do card 3D (tilt)
  const [tiltStyle, setTiltStyle] = useState<Record<string, string>>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const angleX = (yc - y) / 10; // Rotação X
    const angleY = (x - xc) / 10; // Rotação Y
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-orange-500/30 overflow-x-hidden relative scroll-smooth">
      {/* Background Texture & Grid */}
      <div className="fixed inset-0 bg-[url('/new_company_bg.png')] bg-cover bg-center opacity-10 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      
      {/* Glow Effects */}
      <div className="absolute top-[10%] right-[10%] w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white transition">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                FIDELIX COUPO-VERSE
              </span>
              <p className="text-[10px] text-zinc-500 font-mono">LAB / DEMONSTRAÇÃO 3D LIQUID GLASS</p>
            </div>
          </div>

          {/* Toggle Modo Administrador / Cliente */}
          <div className="bg-zinc-900/80 border border-white/5 p-1 rounded-xl flex items-center gap-1">
            <button 
              onClick={() => setIsAdmin(false)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
                !isAdmin ? 'bg-orange-500 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" /> Cliente
            </button>
            <button 
              onClick={() => setIsAdmin(true)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
                isAdmin ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Settings className="w-3.5 h-3.5" /> Admin Panel
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        
        {/* VIEW DO CLIENTE (GERADOR & CARTEIRA) */}
        {!isAdmin ? (
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LADO ESQUERDO: O GERADOR DE CUPOM */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Gerador Inteligente
                </span>
                <h1 className="text-3xl font-extrabold text-white">Gere Cupons Exclusivos em 3D</h1>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  Clique no gerador para rodar o algoritmo de resgate instantâneo. A sua conta receberá um cupom premium com tecnologia 3D Liquid Glass para as melhores lojas do e-commerce brasileiro.
                </p>
              </div>

              {/* Botão de Ação / Gerador */}
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 pointer-events-none" />
                
                {/* Visual Placeholder do Gerador */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
                  <motion.div 
                    animate={isGenerating ? { rotate: 360, scale: [1, 1.1, 1] } : {}}
                    transition={isGenerating ? { repeat: Infinity, duration: 1.5, ease: "linear" } : {}}
                    className={`w-20 h-20 rounded-2xl border flex items-center justify-center shadow-lg transition duration-500 ${
                      isGenerating ? 'bg-orange-500/20 border-orange-400/40 text-orange-400' : 'bg-zinc-950 border-white/10 text-zinc-500'
                    }`}
                  >
                    <Ticket className="w-8 h-8" />
                  </motion.div>
                </div>

                <div className="space-y-2 relative z-10">
                  <h3 className="font-bold text-sm text-white">Sorteador Automático Fidelix</h3>
                  <p className="text-zinc-500 text-[11px] max-w-xs">Gera cupons de 10% a 30% de desconto ou até R$ 50 OFF</p>
                </div>

                <button
                  onClick={handleGenerateCoupon}
                  disabled={isGenerating}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black hover:from-orange-400 hover:to-yellow-400 transition font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processando Resgate...
                    </>
                  ) : (
                    <>
                      Girar Roleta & Gerar Cupom <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* CUPOM ATIVO GERADO (TELA DE REVELAÇÃO 3D LIQUID GLASS) */}
              <AnimatePresence>
                {generatedCoupon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Adicionado à sua carteira
                      </span>
                      <button 
                        onClick={() => setGeneratedCoupon(null)}
                        className="text-zinc-500 hover:text-white text-[10px] cursor-pointer"
                      >
                        Fechar Visualização
                      </button>
                    </div>

                    {/* LIQUID GLASS 3D TICKET */}
                    <div 
                      ref={cardRef}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        ...tiltStyle,
                        boxShadow: `0 20px 40px -15px ${generatedCoupon.glowColor}`,
                      }}
                      className="w-full h-44 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex select-none backdrop-blur-md cursor-grab active:cursor-grabbing transition duration-300"
                    >
                      {/* Reflexo / Glow Interno */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none z-10" />
                      
                      {/* Corte Lateral Circular Esquerdo */}
                      <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#0A0A0A] -translate-y-1/2 border-r border-white/10 z-20" />
                      
                      {/* Corte Lateral Circular Direito */}
                      <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#0A0A0A] -translate-y-1/2 border-l border-white/10 z-20" />

                      {/* CORPO DO TICKET - LADO ESQUERDO (DADOS DO CUPOM) */}
                      <div className="flex-1 p-5 flex flex-col justify-between relative z-10 pr-6">
                        {/* Top: Logo & Expiry */}
                        <div className="flex justify-between items-start">
                          <div className={`px-3 py-1.5 rounded-lg bg-gradient-to-r ${generatedCoupon.gradient} text-white font-extrabold text-[10px] tracking-wider shadow-sm`}>
                            {generatedCoupon.brand}
                          </div>
                          <span className="text-[9px] text-zinc-500 font-mono uppercase">Expira em {generatedCoupon.expiry}</span>
                        </div>

                        {/* Middle: Title & Discount */}
                        <div className="space-y-1 my-2">
                          <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-white block">
                            {generatedCoupon.discount}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-light line-clamp-1">
                            {generatedCoupon.title}
                          </span>
                        </div>

                        {/* Bottom: Instruções */}
                        <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          PRONTO PARA USO
                        </div>
                      </div>

                      {/* LINHA SEPARADORA (PONTILHADA) */}
                      <div className="w-px border-l border-dashed border-white/20 h-full relative z-10 flex flex-col justify-between items-center py-2 shrink-0">
                        <div className="w-1 h-1 bg-[#0A0A0A] rounded-full" />
                        <div className="w-1 h-1 bg-[#0A0A0A] rounded-full" />
                      </div>

                      {/* CORPO DO TICKET - LADO DIREITO (BARCODE / AÇÃO) */}
                      <div className="w-28 bg-white/5 flex flex-col justify-between items-center p-4 relative z-10 shrink-0 select-none">
                        {/* Label */}
                        <span className="text-[8px] font-bold text-zinc-500 tracking-widest uppercase">CÓDIGO</span>
                        
                        {/* Barcode Mockup */}
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-end gap-[2px] h-10">
                            {[2,4,1,3,2,1,4,2,3,1,2,4,1,2,3].map((val, idx) => (
                              <div 
                                key={idx} 
                                style={{ width: `${val === 4 ? 3 : val === 3 ? 2.2 : val === 2 ? 1.5 : 1}px` }} 
                                className="h-full bg-zinc-300" 
                              />
                            ))}
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400 tracking-wider">
                            {generatedCoupon.code}
                          </span>
                        </div>

                        {/* Ação rápida */}
                        <button
                          onClick={() => handleCopyCode(generatedCoupon.id, generatedCoupon.code)}
                          className="w-full py-1 px-2 rounded bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-[8px] tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          {copiedId === generatedCoupon.id ? (
                            <>
                              <Check className="w-2.5 h-2.5" /> Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" /> Copiar
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* LADO DIREITO: CARTEIRA DE CUPONS SALVOS */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-orange-400" /> Meus Cupons
                  </h2>
                  <p className="text-zinc-500 text-xs mt-0.5">Sua coleção de cupons de descontos resgatados</p>
                </div>

                {/* Filtro por Marca */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Filtrar:</span>
                  <select
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="bg-zinc-900 border border-white/5 text-zinc-400 rounded-lg py-1 px-2 text-xs outline-none focus:border-orange-500 transition animate-none"
                  >
                    <option value="all">Todas as marcas</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Mercado Livre">Mercado Livre</option>
                    <option value="Shopee">Shopee</option>
                    <option value="AliExpress">AliExpress</option>
                    <option value="Magalu">Magalu</option>
                  </select>
                </div>
              </div>

              {/* Lista de Cupons da Carteira */}
              <div className="grid gap-4">
                {coupons.filter(c => filterBrand === 'all' || c.brand === filterBrand).length === 0 ? (
                  <div className="p-12 rounded-2xl bg-zinc-900/10 border border-dashed border-white/5 text-center text-zinc-500">
                    <Ticket className="w-8 h-8 mx-auto text-zinc-700 mb-2" />
                    <p className="text-xs">Nenhum cupom ativo encontrado na carteira.</p>
                  </div>
                ) : (
                  coupons
                    .filter(c => filterBrand === 'all' || c.brand === filterBrand)
                    .map((coupon) => (
                      <div
                        key={coupon.id}
                        className={`rounded-2xl border transition-all relative flex flex-col md:flex-row items-stretch select-none overflow-hidden ${
                          coupon.status === 'used' 
                            ? 'bg-zinc-950/40 border-white/5 opacity-60' 
                            : 'bg-zinc-900/30 border-white/5 hover:border-white/10'
                        }`}
                      >
                        {/* Tag de Usado */}
                        {coupon.status === 'used' && (
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[8px] font-bold uppercase tracking-wider border border-white/5">
                            Resgatado / Usado
                          </div>
                        )}

                        {/* Corpo Principal */}
                        <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono">Fidelix Club</span>
                            {coupon.status !== 'used' && (
                              <span className="text-[9px] text-zinc-500 font-mono">Expira: {coupon.expiry}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${coupon.gradient} flex items-center justify-center text-white font-extrabold text-[11px] tracking-wider shrink-0`}>
                              {coupon.brandLogo}
                            </div>
                            <div>
                              <h4 className="text-lg font-extrabold text-white leading-tight">{coupon.discount}</h4>
                              <p className="text-zinc-400 text-xs font-light">{coupon.brand} - {coupon.title}</p>
                            </div>
                          </div>

                          {/* Rodapé Ações */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-[9px] text-zinc-500">Adicionado em {coupon.claimedAt}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleUsed(coupon.id)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded transition cursor-pointer ${
                                  coupon.status === 'used'
                                    ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                    : 'bg-zinc-950 text-zinc-400 border border-white/5 hover:border-white/10 hover:text-white'
                                }`}
                              >
                                {coupon.status === 'used' ? 'Reativar' : 'Marcar como Usado'}
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                className="p-1 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Painel lateral de cupom/código */}
                        <div className="w-full md:w-44 bg-zinc-950/60 border-t md:border-t-0 md:border-l border-white/5 flex flex-row md:flex-col justify-between items-center p-4 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[8px] font-semibold text-zinc-500 uppercase tracking-widest">Código</span>
                            <span className="text-xs font-mono font-bold text-white tracking-wider mt-0.5">{coupon.code}</span>
                          </div>
                          
                          <button
                            onClick={() => handleCopyCode(coupon.id, coupon.code)}
                            disabled={coupon.status === 'used'}
                            className="py-1.5 px-3 rounded bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-[9px] tracking-wider uppercase transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                          >
                            {copiedId === coupon.id ? (
                              <>
                                <Check className="w-3 h-3" /> Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copiar
                              </>
                            )}
                          </button>
                        </div>

                      </div>
                    ))
                )}
              </div>
            </div>

          </div>
        ) : (
          
          /* PAINEL DO ADMINISTRADOR (ABA DE CUPONS E ESTATÍSTICAS) */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Admin */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                  <Settings className="w-3 h-3" /> Administrativo Fidelix
                </span>
                <h1 className="text-2xl font-bold text-white mt-1">Painel do Administrador — Gestão de Cupons</h1>
                <p className="text-zinc-400 text-xs font-light">Monitore o desempenho, taxas de resgate e crie novas campanhas de incentivo.</p>
              </div>
            </div>

            {/* Grid Estatísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Gerado', value: totalClaimed, icon: <Ticket className="w-5 h-5 text-indigo-400" />, desc: 'Cupons emitidos no simulador' },
                { label: 'Cupons Ativos', value: activeCount, icon: <Layers className="w-5 h-5 text-emerald-400" />, desc: 'Aguardando utilização' },
                { label: 'Cupons Resgatados', value: usedCount, icon: <CheckCircle className="w-5 h-5 text-purple-400" />, desc: 'Marcados como usados' },
                { label: 'Economia Gerada', value: `R$ ${estimatedSavings},00`, icon: <DollarSign className="w-5 h-5 text-amber-400" />, desc: 'Simulada pelo uso' }
              ].map((stat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">{stat.label}</span>
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{stat.value}</h3>
                    <p className="text-[9px] text-zinc-500 mt-1">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Seções Lado a Lado: Criar Novo Cupom & Feed de Atividade */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* LADO ESQUERDO: Formulário para criar nova campanha */}
              <div className="lg:col-span-5 space-y-6">
                <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white">Criar Nova Campanha de Cupom</h3>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Configure os parâmetros do cupom Liquid Glass</p>
                  </div>

                  <form onSubmit={handleCreateAdminCoupon} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-zinc-400 uppercase">Marca / E-commerce</label>
                      <select 
                        value={newCouponForm.brand}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, brand: e.target.value })}
                        className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                      >
                        <option value="Amazon">Amazon</option>
                        <option value="Mercado Livre">Mercado Livre</option>
                        <option value="Shopee">Shopee</option>
                        <option value="AliExpress">AliExpress</option>
                        <option value="Magalu">Magalu</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-zinc-400 uppercase">Valor de Desconto</label>
                      <input 
                        type="text" 
                        required
                        value={newCouponForm.discount}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, discount: e.target.value })}
                        placeholder="Ex: R$ 50 OFF ou 20% OFF" 
                        className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-semibold text-zinc-400 uppercase">Título da Campanha</label>
                      <input 
                        type="text" 
                        required
                        value={newCouponForm.title}
                        onChange={(e) => setNewCouponForm({ ...newCouponForm, title: e.target.value })}
                        placeholder="Ex: Em todo o site sem mínimo" 
                        className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-semibold text-zinc-400 uppercase">Tema Gradiente</label>
                        <select 
                          value={newCouponForm.gradient}
                          onChange={(e) => {
                            const val = e.target.value;
                            let glow = 'rgba(99, 102, 241, 0.4)';
                            if (val.includes('amber')) glow = 'rgba(245, 158, 11, 0.4)';
                            if (val.includes('orange')) glow = 'rgba(249, 115, 22, 0.4)';
                            if (val.includes('red')) glow = 'rgba(239, 68, 68, 0.4)';
                            if (val.includes('blue')) glow = 'rgba(59, 130, 246, 0.4)';
                            setNewCouponForm({ ...newCouponForm, gradient: val, glowColor: glow });
                          }}
                          className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition animate-none"
                        >
                          <option value="from-indigo-500 to-purple-600">Indigo (Padrão)</option>
                          <option value="from-amber-500 to-orange-600">Laranja Amazon</option>
                          <option value="from-orange-500 to-red-600">Laranja Shopee</option>
                          <option value="from-red-500 to-rose-700">Vermelho Aliexpress</option>
                          <option value="from-blue-500 to-indigo-600">Azul Magalu</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-semibold text-zinc-400 uppercase">Data de Expiração</label>
                        <input 
                          type="text" 
                          required
                          value={newCouponForm.expiry}
                          onChange={(e) => setNewCouponForm({ ...newCouponForm, expiry: e.target.value })}
                          placeholder="Ex: 31/12/2026" 
                          className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white outline-none transition"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                    >
                      <Plus className="w-4 h-4" /> Cadastrar Campanha
                    </button>
                  </form>
                </div>
              </div>

              {/* LADO DIREITO: Feed e Tabela de Todos os Cupons no Sistema */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Histórico Geral de Emissões</h3>
                      <p className="text-[10px] text-zinc-500">Listagem de todas as instâncias ativas no localStorage</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (confirm('Deseja limpar todos os cupons salvos?')) {
                          saveToLocalStorage([]);
                        }
                      }}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Limpar Banco
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-mono">
                      <thead>
                        <tr className="border-b border-white/5 text-zinc-500 text-[10px]">
                          <th className="py-2.5">Código</th>
                          <th className="py-2.5">Marca</th>
                          <th className="py-2.5">Desconto</th>
                          <th className="py-2.5">Data Emissão</th>
                          <th className="py-2.5">Status</th>
                          <th className="py-2.5 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300">
                        {coupons.map((coupon) => (
                          <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-3 font-bold text-white">{coupon.code}</td>
                            <td className="py-3">{coupon.brand}</td>
                            <td className="py-3">{coupon.discount}</td>
                            <td className="py-3 text-[10px] text-zinc-500">{coupon.claimedAt}</td>
                            <td className="py-3">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                coupon.status === 'active' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                {coupon.status === 'active' ? 'Ativo' : 'Usado'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                className="p-1 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {coupons.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-zinc-500">Nenhum cupom gerado no sistema.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer minimalista de créditos */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5 text-center text-[10px] text-zinc-600 font-mono select-none">
        FIDELIX CARD SYSTEM & NEW COMPANY DESIGNS // TODOS OS DIREITOS RESERVADOS
      </footer>
    </div>
  );
}
