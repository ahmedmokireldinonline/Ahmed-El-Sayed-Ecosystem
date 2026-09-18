import { type ReactNode, useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BookOpen, Bot, Check, ChevronDown, Compass, Globe2, Layers3, LineChart, Menu, MessageCircle, Route, Send, Sparkles, Workflow, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route as WouterRoute, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
const whatsappHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}` : '#connect';

const navItems = [
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'Growth systems', href: '#systems' },
  { label: 'Knowledge', href: '#knowledge' },
  { label: 'About Ahmed', href: '#about' },
];

const pillars = [
  { number: '01', icon: Compass, title: 'Opportunity', text: 'Real estate and investment pathways assessed with a wider view of context, timing, and human fit.' },
  { number: '02', icon: LineChart, title: 'Growth', text: 'Practical acquisition and conversion systems that turn attention into a clearer commercial next step.' },
  { number: '03', icon: Workflow, title: 'Digital systems', text: 'Automation, WhatsApp workflows, software, SaaS, and AI designed to reduce the distance between intent and action.' },
  { number: '04', icon: BookOpen, title: 'Knowledge', text: 'Practical material for people who want to understand the mechanism, not just hear the promise.' },
];

const systemSteps = [
  { tag: '01 / DIAGNOSE', title: 'Find the leverage', text: 'Map the opportunity, audience, offer, current workflow, and the constraint holding momentum back.' },
  { tag: '02 / DESIGN', title: 'Build the engine', text: 'Shape the journey, message, automation layer, and measurement points around a real business context.' },
  { tag: '03 / DEPLOY', title: 'Make it usable', text: 'Turn the strategy into a working operating rhythm your team can understand, run, and improve.' },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConsultationOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const openConsultation = () => {
    setSubmitted(false);
    setConsultationOpen(true);
  };

  const handleConsultationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="noise min-h-[100dvh] overflow-hidden bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[hsl(var(--foreground)/.1)] bg-[hsl(var(--background)/.84)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#top" className="group flex items-center gap-3" data-testid="link-brand-home">
            <span className="flex h-9 w-9 items-center justify-center border border-secondary bg-primary text-secondary">
              <span className="display text-lg font-extrabold">A</span>
            </span>
            <span className="leading-none">
              <span className="block text-[13px] font-extrabold tracking-[.18em] text-primary">AHMED EL SAYED</span>
              <span className="mono mt-1 block text-[9px] tracking-[.16em] text-muted-foreground">OPPORTUNITY / SYSTEMS</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-primary" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-1 border-r border-border pr-4" aria-label="Language switcher">
              {['EN', 'AR', 'RU'].map((item) => (
                <button key={item} type="button" onClick={() => setLanguage(item)} className={`px-1.5 py-1 text-[10px] font-bold tracking-[.12em] transition-colors ${language === item ? 'text-secondary' : 'text-muted-foreground hover:text-primary'}`} data-testid={`button-language-${item.toLowerCase()}`}>
                  {item}
                </button>
              ))}
            </div>
            <button type="button" onClick={openConsultation} className="group flex items-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.13em] text-primary-foreground transition-all hover:bg-accent" data-testid="button-header-consultation">
              Start a conversation <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <button type="button" className="flex h-10 w-10 items-center justify-center border border-border text-primary lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-5 lg:hidden">
            <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-border pb-3 text-xs font-bold uppercase tracking-[.13em] text-primary" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                  {item.label}<ArrowUpRight size={14} className="text-secondary" />
                </a>
              ))}
            </nav>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {['EN', 'AR', 'RU'].map((item) => (
                  <button key={item} type="button" onClick={() => setLanguage(item)} className={`border px-2.5 py-1.5 text-[10px] font-bold tracking-[.12em] ${language === item ? 'border-secondary bg-secondary text-primary' : 'border-border text-muted-foreground'}`} data-testid={`button-mobile-language-${item.toLowerCase()}`}>{item}</button>
                ))}
              </div>
              <button type="button" onClick={openConsultation} className="bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-[.11em] text-primary-foreground" data-testid="button-mobile-consultation">Start a conversation</button>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative border-b border-border pt-[72px]">
        <div className="mx-auto grid min-h-[700px] max-w-[1360px] grid-cols-1 items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:py-28">
          <div className="relative z-10">
            <div className="reveal mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-secondary" />
              <span className="mono text-[10px] font-medium tracking-[.2em] text-secondary">A STRATEGIC DIGITAL PLATFORM</span>
            </div>
            <h1 className="display reveal reveal-delay-1 max-w-[820px] text-[clamp(3.8rem,8vw,7.9rem)] font-extrabold leading-[.88] text-primary">
              Building <span className="text-accent">opportunities.</span><br />
              Growth engines.<br />
              <span className="text-secondary">Digital systems.</span><br />
              Knowledge.
            </h1>
            <p className="reveal reveal-delay-2 mt-9 max-w-[510px] text-[15px] leading-7 text-muted-foreground">
              A connected view of what moves people, businesses, and ideas forward — from investment pathways to the systems that make growth repeatable.
            </p>
            <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openConsultation} className="group flex items-center justify-center gap-3 bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-all hover:bg-accent" data-testid="button-hero-consultation">
                Request a growth system <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <a href="#ecosystem" className="group flex items-center justify-center gap-3 border border-primary/20 px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary transition-colors hover:border-secondary" data-testid="link-hero-ecosystem">
                Explore the ecosystem <ArrowDownRight size={16} className="transition-transform group-hover:translate-y-1" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:justify-self-end">
            <div className="absolute inset-[8%] rounded-full border border-secondary/30" />
            <div className="absolute inset-[20%] rounded-full border border-accent/35" />
            <div className="network-orbit absolute inset-[8%] rounded-full border border-dashed border-secondary/40">
              <span className="absolute left-[13%] top-[3%] h-3 w-3 rounded-full bg-secondary shadow-[0_0_0_7px_hsl(var(--secondary)/.14)]" />
              <span className="absolute bottom-[9%] right-[15%] h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
            <div className="network-orbit-reverse absolute inset-[20%] rounded-full border border-dashed border-accent/35">
              <span className="absolute right-[14%] top-[7%] h-2 w-2 rounded-full bg-secondary" />
            </div>
            <div className="absolute inset-[31%] flex items-center justify-center rounded-full bg-primary shadow-[0_25px_70px_hsl(var(--primary)/.22)]">
              <div className="text-center">
                <span className="mono block text-[9px] tracking-[.22em] text-secondary">THE CONNECTING</span>
                <span className="display mt-2 block text-3xl font-extrabold tracking-[-.07em] text-primary-foreground">POINT</span>
                <span className="mx-auto mt-3 block h-px w-9 bg-secondary" />
              </div>
            </div>
            <div className="network-line absolute left-[1%] top-[41%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-secondary" /><span className="mono text-[9px] tracking-[.08em] text-primary">PEOPLE</span>
            </div>
            <div className="network-line absolute right-[2%] top-[26%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-accent" /><span className="mono text-[9px] tracking-[.08em] text-primary">TECHNOLOGY</span>
            </div>
            <div className="network-line absolute bottom-[24%] left-[8%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-accent" /><span className="mono text-[9px] tracking-[.08em] text-primary">KNOWLEDGE</span>
            </div>
            <div className="network-line absolute bottom-[9%] right-[13%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-secondary" /><span className="mono text-[9px] tracking-[.08em] text-primary">GROWTH</span>
            </div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 500 500" fill="none" aria-hidden="true">
              <path d="M55 250H180M320 195L430 130M115 370L190 320M315 340L400 390" stroke="hsl(var(--secondary) / .42)" strokeDasharray="3 8" />
            </svg>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto grid max-w-[1360px] grid-cols-2 px-5 sm:px-8 md:grid-cols-4 lg:px-12">
            {['Real estate', 'Investment', 'Digital growth', 'Knowledge'].map((item, index) => (
              <div key={item} className={`flex items-center gap-3 py-5 ${index < 3 ? 'border-r border-border' : ''} ${index > 0 ? 'pl-4 sm:pl-7' : ''}`}>
                <span className="mono text-[10px] text-secondary">0{index + 1}</span>
                <span className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">01 / THE ECOSYSTEM</span>
              <h2 className="display mt-6 max-w-[430px] text-5xl font-extrabold leading-[.93] tracking-[-.06em] sm:text-6xl">One perspective.<br /><span className="text-secondary">Many engines.</span></h2>
              <p className="mt-7 max-w-[360px] text-sm leading-7 text-primary-foreground/65">The work does not sit in one category. It lives where opportunity, technology, and informed action meet.</p>
              <div className="mt-10 flex items-center gap-3 border-t border-primary-foreground/15 pt-5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="mono text-[9px] tracking-[.14em] text-primary-foreground/55">CAPABILITIES / CONFIGURABLE TO CONTEXT</span>
              </div>
            </div>
            <div className="grid border-l border-primary-foreground/15 sm:grid-cols-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.number} className="group border-b border-primary-foreground/15 p-7 transition-colors hover:bg-primary-foreground/[.06] sm:nth-[odd]:border-r">
                    <div className="flex items-start justify-between">
                      <span className="mono text-[10px] text-secondary">{pillar.number}</span>
                      <Icon size={20} strokeWidth={1.3} className="text-secondary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                    <h3 className="display mt-12 text-2xl font-extrabold tracking-[-.04em]">{pillar.title}</h3>
                    <p className="mt-4 text-[13px] leading-6 text-primary-foreground/60">{pillar.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="systems" className="relative border-b border-border bg-background">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">02 / GROWTH SYSTEMS</span>
              <h2 className="display mt-5 max-w-[660px] text-5xl font-extrabold leading-[.95] tracking-[-.06em] text-primary sm:text-7xl">Strategy that can<br /><span className="text-accent">touch the ground.</span></h2>
            </div>
            <p className="max-w-[305px] text-sm leading-6 text-muted-foreground">A useful system is not a slide deck. It is a sequence of clear decisions, tools, and actions built for the real operating environment.</p>
          </div>
          <div className="mt-20 grid gap-px bg-border md:grid-cols-3">
            {systemSteps.map((step, index) => (
              <article key={step.tag} className="group relative bg-background p-7 pb-9 transition-colors hover:bg-card sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] tracking-[.16em] text-secondary">{step.tag}</span>
                  <span className="display text-5xl font-extrabold text-primary/10 transition-colors group-hover:text-secondary/35">0{index + 1}</span>
                </div>
                <h3 className="display mt-16 text-3xl font-extrabold tracking-[-.05em] text-primary">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{step.text}</p>
                <div className="mt-10 h-px w-10 bg-secondary transition-all group-hover:w-24" />
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-[1.4fr_.6fr]">
            <div className="flex min-h-[190px] flex-col justify-between bg-accent p-7 text-primary-foreground sm:p-9">
              <div className="flex items-center justify-between">
                <Bot size={22} strokeWidth={1.4} />
                <span className="mono text-[9px] tracking-[.18em] text-primary-foreground/60">SYSTEM LAYER / EXAMPLE</span>
              </div>
              <div>
                <h3 className="display text-3xl font-extrabold tracking-[-.05em]">A conversation that keeps moving.</h3>
                <p className="mt-3 max-w-[500px] text-[13px] leading-6 text-primary-foreground/70">Lead capture, qualification, WhatsApp workflows, and human handoff — considered as one connected experience.</p>
              </div>
            </div>
            <div className="flex min-h-[190px] flex-col justify-between border border-border bg-card p-7 sm:p-9">
              <Layers3 size={22} strokeWidth={1.4} className="text-secondary" />
              <div>
                <span className="mono text-[9px] tracking-[.18em] text-muted-foreground">THE LENS</span>
                <p className="display mt-2 text-2xl font-extrabold leading-tight tracking-[-.04em] text-primary">Human clarity,<br />digital leverage.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="knowledge" className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">03 / KNOWLEDGE</span>
              <h2 className="display mt-5 text-5xl font-extrabold leading-[.94] tracking-[-.06em] text-primary sm:text-6xl">Useful thinking<br /><span className="text-accent">for the next move.</span></h2>
              <p className="mt-7 max-w-[365px] text-sm leading-7 text-muted-foreground">Short, practical material on opportunity, marketing, automation, AI, and the operating choices behind sustainable growth.</p>
              <button type="button" onClick={() => document.getElementById('knowledge-library')?.scrollIntoView({ behavior: 'smooth' })} className="group mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[.12em] text-primary" data-testid="button-explore-material">
                Explore the library <ArrowUpRight size={15} className="text-secondary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
            <div id="knowledge-library" className="grid gap-4">
              {[
                { type: 'FIELD NOTE', title: 'The difference between a lead and a conversation', icon: MessageCircle },
                { type: 'SYSTEM NOTE', title: 'Where automation should stop and people should start', icon: Workflow },
                { type: 'PERSPECTIVE', title: 'Opportunity is a system of connected decisions', icon: Globe2 },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button type="button" key={item.title} className="group flex w-full items-center gap-5 border-b border-border py-5 text-left transition-colors hover:border-secondary" onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })} data-testid={`button-knowledge-item-${index + 1}`}>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border text-secondary transition-colors group-hover:border-secondary group-hover:bg-secondary group-hover:text-primary"><Icon size={18} strokeWidth={1.4} /></span>
                    <span className="flex-1">
                      <span className="mono block text-[9px] tracking-[.16em] text-secondary">{item.type}</span>
                      <span className="mt-1 block text-[15px] font-bold leading-6 text-primary">{item.title}</span>
                    </span>
                    <ArrowUpRight size={17} className="text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-secondary" />
                  </button>
                );
              })}
              <div className="mt-3 flex items-center gap-3 border border-dashed border-border p-4">
                <Sparkles size={17} className="text-secondary" />
                <span className="text-xs leading-5 text-muted-foreground">New material is being shaped around questions that matter in the field.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[.6fr_1.4fr] lg:px-12 lg:py-28">
          <div>
            <span className="mono text-[10px] tracking-[.2em] text-secondary">04 / THE SIGNATURE</span>
            <div className="mt-8 h-px w-20 bg-secondary" />
          </div>
          <div>
            <blockquote className="display max-w-[850px] text-4xl font-extrabold leading-[1.04] tracking-[-.055em] text-primary sm:text-6xl">
              “Connecting people, opportunities, technology, knowledge <span className="text-secondary">&amp; growth.</span>”
            </blockquote>
            <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
              <p className="text-sm leading-7 text-muted-foreground">Ahmed El Sayed works across the spaces between disciplines — where commercial opportunity needs a sharper message, a better system, or simply a more useful conversation.</p>
              <p className="text-sm leading-7 text-muted-foreground">The platform is intentionally evolving. Capabilities are presented as configurable pathways; specific engagements, outcomes, and availability are confirmed through a direct conversation.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="connect" className="bg-secondary text-primary">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12 lg:py-24">
          <div>
            <span className="mono text-[10px] tracking-[.2em] text-primary/60">05 / NEXT MOVE</span>
            <h2 className="display mt-5 max-w-[720px] text-5xl font-extrabold leading-[.9] tracking-[-.065em] sm:text-7xl">Bring the question.<br />Build the next system.</h2>
            <p className="mt-7 max-w-[470px] text-sm leading-6 text-primary/70">Tell us what you are trying to connect, clarify, or grow. The first step is a useful conversation — not a commitment.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <button type="button" onClick={openConsultation} className="group flex items-center justify-between gap-8 bg-primary px-5 py-4 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-colors hover:bg-accent" data-testid="button-connect-consultation">
              Request a consultation <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <a href={whatsappHref} target={WHATSAPP_NUMBER ? '_blank' : undefined} rel={WHATSAPP_NUMBER ? 'noreferrer' : undefined} className="group flex items-center justify-between gap-8 border border-primary/30 px-5 py-4 text-xs font-bold uppercase tracking-[.12em] transition-colors hover:border-primary" data-testid="link-connect-whatsapp">
              <span className="flex items-center gap-2"><MessageCircle size={15} /> WhatsApp contact</span><ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border border-secondary text-secondary"><span className="display text-lg font-extrabold">A</span></span>
              <span className="text-[12px] font-extrabold tracking-[.18em]">AHMED EL SAYED</span>
            </div>
            <p className="mt-4 max-w-[310px] text-[11px] leading-5 text-primary-foreground/50">Connecting People, Opportunities, Technology, Knowledge &amp; Growth.</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <span className="mono text-[9px] tracking-[.14em] text-primary-foreground/40">PLATFORM STATUS / CONFIGURABLE</span>
            <span className="text-[11px] text-primary-foreground/60">© {new Date().getFullYear()} Ahmed El Sayed</span>
          </div>
        </div>
      </footer>

      {consultationOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
          <div className="relative max-h-[92dvh] w-full max-w-[580px] overflow-auto bg-background p-6 shadow-2xl sm:p-9">
            <button type="button" onClick={() => setConsultationOpen(false)} className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-border text-primary transition-colors hover:border-secondary hover:text-secondary" aria-label="Close consultation form" data-testid="button-close-consultation"><X size={17} /></button>
            {!submitted ? (
              <>
                <span className="mono text-[10px] tracking-[.2em] text-secondary">A USEFUL FIRST CONVERSATION</span>
                <h2 id="consultation-title" className="display mt-5 max-w-[440px] text-4xl font-extrabold leading-[.95] tracking-[-.06em] text-primary">What are you trying to connect or grow?</h2>
                <p className="mt-4 max-w-[440px] text-sm leading-6 text-muted-foreground">This form is a presentation interaction only. Nothing is sent to a backend yet.</p>
                <form onSubmit={handleConsultationSubmit} className="mt-8 space-y-4">
                  <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">YOUR NAME</span><input required name="name" className="w-full border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder="Name" data-testid="input-consultation-name" /></label>
                  <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">CONTACT CHANNEL</span><input required name="contact" className="w-full border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder="Email or WhatsApp" data-testid="input-consultation-contact" /></label>
                  <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">THE QUESTION</span><textarea required name="question" rows={4} className="w-full resize-none border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder="A few words about the opportunity or system..." data-testid="input-consultation-question" /></label>
                  <button type="submit" className="group flex w-full items-center justify-center gap-3 bg-primary px-4 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-colors hover:bg-accent" data-testid="button-submit-consultation">Keep the conversation moving <Send size={15} className="transition-transform group-hover:translate-x-1" /></button>
                </form>
              </>
            ) : (
              <div className="py-10">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary text-primary"><Check size={23} /></div>
                <h2 className="display mt-7 text-4xl font-extrabold leading-none tracking-[-.06em] text-primary">The question is captured.</h2>
                <p className="mt-4 max-w-[400px] text-sm leading-6 text-muted-foreground">This demo does not send data anywhere. When the connection layer is configured, this step can be routed to the right conversation.</p>
                <button type="button" onClick={() => setConsultationOpen(false)} className="mt-8 border border-primary px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground" data-testid="button-close-confirmation">Return to platform</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <WouterRoute path="/" component={Home} />
        <WouterRoute component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;