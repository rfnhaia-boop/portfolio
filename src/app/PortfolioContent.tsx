'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Cpu, Layers, Server, Code2, Sparkles, 
  ArrowUpRight, Send, MessageSquare, Mail, 
  MapPin, CheckCircle2, ChevronRight, X, ExternalLink, Globe,
  Loader2, ShieldCheck, Users, TrendingUp, Zap, ChevronDown,
  Activity
} from 'lucide-react';

// Custom SVG Github Icon
const Github = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

// Tipagem para os Cases de Portfólio
interface ProjectCase {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  metrics: string[];
  stack: string[];
  url: string;
  architectureDiagram: {
    steps: { title: string; desc: string }[];
  };
}

export default function PortfolioContent() {
  const [activeModal, setActiveModal] = useState<ProjectCase | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', challenge: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [activeProject, setActiveProject] = useState<ProjectCase | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Lista de cases com links e descrições reais
  const cases: ProjectCase[] = [
    {
      id: 'lari-logistica',
      title: 'Lari Logística (New Flow)',
      subtitle: 'Painel e Monitoramento de Entregas & YMS',
      category: 'Logística & Gestão Industrial',
      description: 'Sistema desenhado para a alta pressão de gerenciamento operacional. Otimiza processos industriais com foco em automação, controle rígido de perdas e visibilidade completa em tempo real.',
      metrics: ['Rastreamento de pátio automatizado', 'Painéis corporativos de alta performance', 'Redução drástica em tempos de espera'],
      stack: ['Next.js', 'React', 'Tailwind CSS', 'Docker', 'Supabase'],
      url: 'https://lari.newflowsys.cloud/',
      architectureDiagram: {
        steps: [
          { title: 'Entrada e Triagem de Frotas', desc: 'Identificação e direcionamento automatizado de veículos no pátio logístico.' },
          { title: 'Dashboard de Monitoramento', desc: 'Status operacional updated em tempo real via WebSockets para a gerência de tráfego.' },
          { title: 'Histórico & Relatórios', desc: 'Modelagem analítica estruturada gerando métricas instantâneas de produtividade por doca.' }
        ]
      }
    },
    {
      id: 'fidelix',
      title: 'Fidelix — Fidelidade Digital 3D',
      subtitle: 'SaaS de Fidelização com Experiência Imersiva',
      category: 'SaaS / Web App 3D',
      description: 'Plataforma completa de cartão fidelidade digital. Substitui cartões de papel por QR Codes dinâmicos com fidelização gamificada em 3D direta no navegador do cliente, sem necessidade de download de aplicativos.',
      metrics: ['+45% de retorno de clientes recorrentes', 'Autenticação rápida sem atritos', 'Interface 3D com alta retenção'],
      stack: ['Next.js', 'React 19', 'Supabase', 'Tailwind CSS', 'Prisma', 'NextAuth'],
      url: 'https://fidelix.newflowsys.cloud/',
      architectureDiagram: {
        steps: [
          { title: 'Painel do Lojista', desc: 'Interface administrativa Next.js para gerenciamento de campanhas de selos e prêmios.' },
          { title: 'Checkin por QR Code', desc: 'Cliente escaneia o QR Code físico no balcão e acessa instantaneamente seu cartão fidelidade.' },
          { title: 'Gamificação & Banco Real-Time', desc: 'Transação validada de forma segura e síncrona via Supabase PostgreSQL, com proteção contra fraudes.' }
        ]
      }
    },
    {
      id: 'new-flow',
      title: 'New Flow: Inteligência Logística & YMS',
      subtitle: 'Sistemas Industriais e de Alta Criticidade',
      category: 'Logística & Infraestrutura',
      description: 'Ecossistema voltado ao controle e agendamento de frotas, pesagem e logística pesada comercial. Oferece soluções robustas tolerantes a falhas físicas de rede e integração automatizada de dados em tempo real.',
      metrics: ['+30% de eficiência operacional no pátio', 'Resiliência offline-first para checkout', 'Orquestração de pátio YMS inteligente'],
      stack: ['Next.js', 'Docker', 'SQLite Edge Sync', 'Coolify', 'FastAPI'],
      url: 'https://sitenewflow.vercel.app/',
      architectureDiagram: {
        steps: [
          { title: 'Mapeamento & Agendamento YMS', desc: 'Motoristas e transportadoras reservam horários de descarga via interface otimizada.' },
          { title: 'Integração de Balança (Edge)', desc: 'Conexão direta com balanças físicas e banco de dados local tolerante a quedas de internet.' },
          { title: 'Sincronização no Servidor Nuvem', desc: 'Dados consolidados via containers Docker gerenciados no Coolify para painel gerencial centralizado.' }
        ]
      }
    },
    {
      id: 'isabela-balbo',
      title: 'Isabela Balbo: Arquitetura Premium',
      subtitle: 'Portfólio de Luxo & Design System',
      category: 'Branding & UI/UX de Elite',
      description: 'Criação de identidade visual digital e plataforma de portfólio para escritório de arquitetura premium. Focado em transições refinadas, altíssima velocidade no carregamento de imagens em alta resolução e SEO cirúrgico.',
      metrics: ['Score 100/100 de performance (Lighthouse)', 'Estética minimalista sofisticada', '+60% de novos contatos PJ em Jundiaí'],
      stack: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'UI/UX Design'],
      url: 'https://isabelabalbo.vercel.app/',
      architectureDiagram: {
        steps: [
          { title: 'Design System Exclusivo', desc: 'Concepção visual baseada em tons suaves e tipografia moderna sem serifa.' },
          { title: 'Otimização de Assets', desc: 'Imagens comprimidas no Next.js Image com entrega global via Vercel Edge Network.' },
          { title: 'Conversão PJ Otimizada', desc: 'Gargalos de contato removidos com formulário direto de proposta integrado ao WhatsApp.' }
        ]
      }
    },
    {
      id: 'morada-acai',
      title: 'Morada do Açaí: Cardápio & Delivery',
      subtitle: 'Menu Interativo & Experiência de Compra',
      category: 'E-Commerce / FoodTech',
      description: 'Plataforma intuitiva e ultra-rápida de pedidos online focada na conversão mobile. Reduz o ciclo de compra a apenas 3 cliques, com carrinho persistente e geração dinâmica de pedidos.',
      metrics: ['Aumento nas taxas de checkout em um clique', 'Design focado em conversão móvel', 'Integração de pedidos automatizada'],
      stack: ['HTML5', 'Tailwind CSS', 'JavaScript ES6', 'Integração WhatsApp'],
      url: 'https://nwn-site-ten.vercel.app/projects/morada-do-acai/index.html',
      architectureDiagram: {
        steps: [
          { title: 'Navegação de Cardápio', desc: 'Itens carregados de forma assíncrona com filtros rápidos por categorias.' },
          { title: 'Carrinho no LocalStorage', desc: 'Armazenamento seguro das escolhas do cliente localmente para evitar perda de dados.' },
          { title: 'Exportação para WhatsApp', desc: 'Comanda final compilada e enviada via link estruturado direto para a linha de produção.' }
        ]
      }
    }
  ];

  // Set default active project
  useEffect(() => {
    setActiveProject(cases[0]);
  }, []);

  // Monitorar mudança do projeto para resetar o loader do iframe
  useEffect(() => {
    setIframeLoading(true);
  }, [activeProject]);

  // Terminal Typing Simulation effect
  useEffect(() => {
    const scripts = [
      "root@newcompany:~$ npm init --y && npm run deploy",
      "Initializing AI agent loops...",
      "Connecting DB pool: PostgreSQL dynamic cluster...",
      "DB pool connection status: SUCCESS (3ms latency)",
      "Syncing vectors with Supabase Vector Store...",
      "Optimizing Frontend cache tags (Vercel Edge Network)...",
      "Status: ALL SYSTEMS ONLINE // READY FOR ENTERPRISE"
    ];
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < scripts.length) {
        setTerminalLines((prev) => [...prev, scripts[currentIdx]]);
        currentIdx++;
      } else {
        setTerminalLines([]);
        currentIdx = 0;
      }
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', budget: '', challenge: '' });
    }, 4000);
  };

  // Animation variants
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative scroll-smooth select-text">
      
      {/* Background Texture & Grid (Global no Fundo da página) */}
      <div className="fixed inset-0 bg-[url('/new_company_bg.png')] bg-cover bg-center opacity-25 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* 1. Header/Navbar */}
      <nav className="sticky top-0 z-45 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/5 px-6 py-4 select-none">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              NEW COMPANY
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-medium uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Divisão Enterprise & IA
            </span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-zinc-400 font-medium items-center">
            <a href="#company" className="hover:text-white transition">A Empresa</a>
            <a href="#stack" className="hover:text-white transition">Expertise</a>
            <a href="#showcase" className="hover:text-white transition">Projetos Ativos</a>
            <a href="/cupons" className="text-orange-400 hover:text-orange-300 font-semibold transition flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
              <Sparkles className="w-3 h-3 text-orange-400" /> Demo Cupons 3D
            </a>
            <a href="#contact" className="hover:text-white transition">Contato</a>
          </div>
          <a 
            href="#contact" 
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/15"
          >
            Falar com a Equipe
          </a>
        </div>
      </nav>

      {/* 2. Hero Section (Apresentação Corporativa da New Company com painel interativo) */}
      <section id="company" className="max-w-6xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Lado Esquerdo: Pitch & CTAs */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:col-span-7 space-y-8"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase"
          >
            <Layers className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} /> Engenharia Corporativa & IA PJ
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-white"
          >
            Construindo software de alta complexidade e{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              motores de IA
            </span>{" "}
            corporativos.
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-zinc-400 text-base md:text-lg font-light leading-relaxed max-w-2xl"
          >
            Nós somos a **New Company**. Expandimos nossa fábrica de software avançado e agentes autônomos para ajudar empresas a automatizar gargalos de dados, reduzir erros operacionais e lançar sistemas sob medida com performance de elite.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-4 pt-2"
          >
            <a href="#showcase" className="px-7 py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-extrabold text-xs transition flex items-center gap-2 shadow-xl hover:-translate-y-0.5 duration-200">
              Ver Projetos Ativos <ArrowUpRight className="w-4 h-4" />
            </a>
            <a href="#contact" className="px-7 py-4 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 font-semibold text-xs transition hover:-translate-y-0.5 duration-200">
              Falar no WhatsApp
            </a>
          </motion.div>
        </motion.div>
        
        {/* Lado Direito: Simulador de Console & Status de IA Interativo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-5 flex flex-col gap-4 relative justify-center select-none"
        >
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl filter blur-3xl pointer-events-none" />

          {/* Painel Status da IA (Glassmorphic) */}
          <div className="absolute top-[-30px] right-[-10px] z-20 px-4 py-2.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md shadow-2xl flex items-center gap-2.5 animate-bounce" style={{ animationDuration: '4s' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="text-[10px] font-mono">
              <p className="text-zinc-500 leading-none">STATUS AGENTE</p>
              <p className="font-bold text-emerald-400 mt-0.5">ACTIVE & LEARNING</p>
            </div>
          </div>

          {/* Terminal Mockup */}
          <div className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl p-4 shadow-2xl font-mono text-[10px] text-zinc-400 relative overflow-hidden backdrop-blur-md min-h-[220px] flex flex-col justify-between">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[8px] text-zinc-600 font-mono tracking-wider">AI_ORCHESTRATOR.SH</span>
            </div>

            {/* Inner lines */}
            <div className="flex-1 space-y-2 text-zinc-500 select-none">
              <p className="text-zinc-400">root@newcompany:~$ deploy --production --engine=ai</p>
              {terminalLines.map((line, idx) => (
                <motion.p 
                  key={idx} 
                  initial={{ opacity: 0, x: -5 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className={idx === terminalLines.length - 1 ? 'text-indigo-400 font-bold' : ''}
                >
                  <span className="text-zinc-700 mr-1.5">&gt;</span> {line}
                </motion.p>
              ))}
            </div>

            <div className="flex justify-between items-center text-[8px] text-zinc-600 pt-3 border-t border-white/5 mt-4">
              <span>LATENCY: 4.8ms</span>
              <span>VECTORS: OK</span>
            </div>
          </div>

          {/* Painel Secundário: Métricas de Fluxo */}
          <div className="w-full bg-zinc-900/30 border border-white/5 rounded-2xl p-4 backdrop-blur-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">Carga Operacional</p>
                <p className="text-xs font-bold text-white mt-0.5">Sincronização Ativa</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded-md font-mono">
                99.9% uptime
              </span>
            </div>
          </div>

        </motion.div>
      </section>

      {/* 3. Stats Bar / Métricas Globais da Empresa */}
      <section className="border-y border-white/5 bg-zinc-950/40 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Estrutura Tecnológica', value: 'New Company', desc: 'Arquitetura & IA corporativa' },
            { label: 'Sistemas Entregues', value: '+30 Projetos', desc: 'Ativos em escala de produção' },
            { label: 'Experiência Acumulada', value: '+8 Anos', desc: 'Liderança técnica e ROI' },
            { label: 'Foco da Abertura', value: 'Alocação PJ', desc: 'Aceleração de caixa rápido' }
          ].map((stat, i) => (
            <div key={i} className="space-y-1.5 p-3 rounded-2xl hover:bg-zinc-900/20 border border-transparent hover:border-white/5 transition group">
              <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">{stat.label}</span>
              <p className="text-xl md:text-2xl font-extrabold text-white group-hover:text-indigo-400 transition">{stat.value}</p>
              <p className="text-zinc-500 text-[10px] font-light">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Por que a New Company? (Posicionamento Corporativo com cards interativos) */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10 space-y-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-6 h-6" />,
              title: "Não é um Desenvolvedor Solo",
              desc: "Trabalhamos como uma equipe de engenharia e UI/UX estruturada. Sua empresa contrata uma estrutura ágil completa capaz de desenhar, programar e implantar ecossistemas inteiros sem gargalos de comunicação."
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Geração de Caixa & Aceleração",
              desc: "Decidimos abrir nossa agenda para novos contratos de software factory para capitalizar e expandir nossos produtos internos. Você obtém tecnologia state-of-the-art por taxas competitivas de parceria."
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Soberania Técnica Estrita",
              desc: "Nossos sistemas operam de forma isolada e portável usando Coolify e Docker em servidores próprios. Você fica 100% livre de lock-ins de nuvens hiper-faturadas ou provedores terceirizados proprietários."
            }
          ].map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-indigo-500/20 transition-all duration-300 shadow-lg hover:shadow-indigo-500/5 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{card.title}</h3>
                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. Core Stack Geral */}
      <section id="stack" className="max-w-6xl mx-auto px-6 py-16 relative z-10 border-t border-white/5 space-y-12">
        <div className="text-center md:text-left space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Domínio & Expertise Técnica</h2>
          <p className="text-zinc-400 max-w-xl">Nosso ferramental de infraestrutura e inteligência selecionado para a máxima robustez.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Categoria 1 */}
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 space-y-6 hover:border-indigo-500/10 transition-colors duration-350 shadow-inner">
            <div className="flex items-center gap-3 text-indigo-400">
              <Layers className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Full-stack & Infraestrutura</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {['Next.js (App Router)', 'React 19 & Client state', 'Tailwind CSS v4', 'Supabase (Auth & Realtime)', 'Docker & Containers', 'Coolify (GitOps Admin)'].map((tech, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 text-zinc-300 hover:border-indigo-500/30 transition duration-300">
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Categoria 2 */}
          <div className="p-8 rounded-3xl bg-zinc-900/30 border border-white/5 space-y-6 hover:border-purple-500/10 transition-colors duration-350 shadow-inner">
            <div className="flex items-center gap-3 text-purple-400">
              <Database className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Inteligência de Dados & IA</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {['Python (FastAPI & Scripts)', 'SQL & PostgreSQL indexado', 'Automações n8n Nativas', 'Agentes Autônomos (LLMs)', 'Bancos Vetoriais (RAG)', 'Design de Bancos Relacionais'].map((tech, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-zinc-950/60 border border-white/5 text-zinc-300 hover:border-purple-500/30 transition duration-300">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Portfolio Cases & Live Interactive Showcase (LADO A LADO - BROWSER & OPÇÕES/DETALHES) */}
      <section id="showcase" className="max-w-[1600px] mx-auto px-6 md:px-12 py-24 relative z-10 border-t border-white/5 space-y-12">
        <div className="text-center md:text-left space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Demonstração Interativa</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Nossos Sistemas & Sites Ativos</h2>
          <p className="text-zinc-400 max-w-xl text-sm">
            Selecione e interaja com os sites reais diretamente no simulador de navegador.
          </p>
        </div>

        {/* MOCKUP SHOWCASE CONTAINER - LADO A LADO */}
        {activeProject && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LADO ESQUERDO: Browser de Iframe (Ocupa 9 colunas de 12 no desktop com altura ultra ampliada) */}
            <div className="lg:col-span-9 flex flex-col rounded-3xl bg-zinc-950 border border-white/10 overflow-hidden shadow-2xl h-[420px] md:h-[620px] lg:h-[800px] w-full relative">
              {/* Browser Bar */}
              <div className="h-10 bg-zinc-900/60 border-b border-white/5 px-4 flex items-center gap-2 select-none shrink-0">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 max-w-sm mx-auto bg-zinc-950 border border-white/5 rounded-md px-3 py-1 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 font-mono truncate">
                  <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span className="truncate">{activeProject.url.replace('https://', '')}</span>
                </div>
              </div>

              {/* Iframe content */}
              <div className="flex-1 relative overflow-hidden bg-zinc-950 flex items-center justify-center">
                <AnimatePresence>
                  {iframeLoading && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-zinc-950 flex flex-col items-center justify-center gap-3 text-zinc-400"
                    >
                      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                      <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Conectando ao servidor...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <iframe 
                  src={activeProject.url} 
                  className="w-full h-full border-none bg-zinc-950 z-10"
                  title={activeProject.title}
                  onLoad={() => setIframeLoading(false)}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>

            {/* LADO DIREITO: Painel de Informações & Cardzinhos Flutuantes (Ocupa 3 colunas de 12) */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Cardzinhos Flutuantes de Seleção de Sites */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Escolha o sistema para rodar:
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {cases.map((project) => {
                    const isSelected = activeProject.id === project.id;
                    return (
                      <button
                        key={project.id}
                        onClick={() => setActiveProject(project)}
                        className={`p-3 rounded-xl border text-left flex justify-between items-center hover:border-white/10 transition-all cursor-pointer relative ${
                          isSelected ? 'bg-zinc-900/80 border-indigo-500/50 shadow-md ring-2 ring-indigo-500/5' : 'bg-zinc-900/20 border-white/5'
                        }`}
                      >
                        <div className="truncate">
                          <span className={`text-[8px] font-bold tracking-wider uppercase block ${
                            isSelected ? 'text-indigo-400' : 'text-zinc-500'
                          }`}>
                            {project.category.split('/')[0]}
                          </span>
                          <h4 className="font-bold text-xs text-white truncate">
                            {project.title.split('—')[0].split(':')[0]}
                          </h4>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition ${
                          isSelected ? 'text-indigo-400 translate-x-0.5' : 'text-zinc-600'
                        }`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explicação e Métricas do Site Ativo */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`details-right-${activeProject.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-4 shadow-lg backdrop-blur-sm"
                >
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{activeProject.title}</h3>
                    <p className="text-zinc-500 text-[10px] font-medium mt-0.5">{activeProject.subtitle}</p>
                  </div>

                  <p className="text-zinc-400 text-xs font-light leading-relaxed">
                    {activeProject.description}
                  </p>

                  {/* Métricas */}
                  <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                    <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">Resultados Obtidos:</p>
                    <ul className="text-[11px] text-zinc-400 space-y-1.5">
                      {activeProject.metrics.map((metric, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" /> 
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags de Stacks */}
                  <div className="flex flex-wrap gap-1">
                    {activeProject.stack.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-[9px] rounded bg-zinc-950 text-zinc-400 border border-white/5 font-mono">
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2 pt-2">
                    {activeProject.id === 'fidelix' && (
                      <a 
                        href="/cupons"
                        className="w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-black font-extrabold text-[10px] flex items-center justify-center gap-1.5 transition shadow-lg shadow-orange-500/15"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Experimentar Demo Cupons 3D <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setActiveModal(activeProject)}
                        className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-[10px] border border-white/5 flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Server className="w-3.5 h-3.5" /> Arquitetura
                      </button>
                      <a 
                        href={activeProject.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-[10px] flex items-center justify-center gap-1.5 transition"
                      >
                        <Globe className="w-3.5 h-3.5" /> Abrir Site <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

          </div>
        )}

        {/* 7. FORMULÁRIO DE CAPTAÇÃO PJ (CONTATO DIRETO ANTES DE ENCERRAR A PÁGINA) */}
        <div id="contact" className="grid md:grid-cols-5 gap-12 pt-16 border-t border-white/5">
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">Pronto para elevar sua infraestrutura técnica?</h2>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                A **New Company** está aceitando novos contratos selecionados para MVPs de alta fidelidade, automação de processos via IA e sistemas de alto tráfego. Entre em contato direto com nosso squad comercial.
              </p>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>rfnhaia@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <span>(11) 95387-8155</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Jundiaí, SP</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a href="mailto:rfnhaia@gmail.com" className="p-3 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://wa.me/5511953878155" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition flex items-center justify-center">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <form onSubmit={handleFormSubmit} className="p-8 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-6">
              <h3 className="text-lg font-bold text-white">Descreva o gargalo operacional ou tecnológico</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Nome Comercial / Empresa</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome ou empresa" 
                    className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">E-mail de Contato</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nome@empresa.com" 
                    className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Orçamento Estimado para o Projeto</label>
                <select 
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-zinc-400 outline-none transition"
                >
                  <option value="">Selecione a faixa de investimento</option>
                  <option value="low">Até R$ 15k</option>
                  <option value="medium">De R$ 15k a R$ 50k</option>
                  <option value="high">Acima de R$ 50k / Contrato Recorrente</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Qual o principal desafio ou produto a ser desenvolvido?</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="Ex: Integração de APIs legadas, criação de motor inteligente para WhatsApp, painéis logísticos." 
                  className="w-full bg-zinc-950 border border-white/5 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white outline-none transition resize-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 transition font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Enviar Solicitação Comercial <Send className="w-4 h-4" />
              </button>

              {formSubmitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center font-medium"
                >
                  Mensagem recebida com sucesso! Retornaremos o contato comercial em até 24h.
                </motion.div>
              )}
            </form>
          </div>
        </div>

        {/* Linha final discreta para demarcar o fim da página (Sem Footer) */}
        <div className="pt-16 border-t border-white/5 text-center text-[10px] text-zinc-600 font-mono select-none">
          NEW COMPANY // ENTERPRISE SOFTWARE FACTORY & AUTOMATION SQUAD // JUNDIAÍ, SP
        </div>

      </section>

      {/* Modal Interativo de Arquitetura */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl z-55"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/40">
                <div>
                  <h4 className="font-bold text-white text-lg">{activeModal.title}</h4>
                  <p className="text-zinc-500 text-xs">Visão Geral da Arquitetura do Sistema</p>
                </div>
                <button onClick={() => setActiveModal(null)} className="text-zinc-400 hover:text-white transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  {activeModal.architectureDiagram.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start relative">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                          {idx + 1}
                        </div>
                        {idx < activeModal.architectureDiagram.steps.length - 1 && (
                          <div className="w-px h-12 bg-zinc-800 my-1" />
                        )}
                      </div>
                      <div className="space-y-1 pt-0.5">
                        <h5 className="text-sm font-semibold text-zinc-200">{step.title}</h5>
                        <p className="text-xs text-zinc-400">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                  <p className="text-xs font-semibold text-indigo-300">Resultados Práticos Obtidos:</p>
                  <ul className="text-xs text-zinc-400 space-y-1">
                    {activeModal.metrics.map((metric, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                <button 
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-300 text-xs font-medium hover:bg-zinc-850 transition cursor-pointer"
                >
                  Fechar Diagrama
                </button>
                <a 
                  href={activeModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-555 transition flex items-center gap-1.5"
                >
                  Acessar Demonstração
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
