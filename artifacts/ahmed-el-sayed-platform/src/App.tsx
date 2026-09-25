import { type ReactNode, useEffect, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BarChart3, BookOpen, Bot, Check, Code2, Compass, Database, Globe2, Instagram, Layers3, Linkedin, LineChart, Menu, MessageCircle, Music2, Play, Send, Sparkles, Video, Workflow, X, Youtube } from 'lucide-react';
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
  { label: 'Ecosystem', ar: 'المنظومة', href: '#ecosystem' },
  { label: 'Growth systems', ar: 'أنظمة النمو', href: '#systems' },
  { label: 'Integrations', ar: 'التكاملات', href: '#integrations' },
  { label: 'Social studio', ar: 'استوديو السوشيال', href: '#social' },
  { label: 'Knowledge', ar: 'المعرفة', href: '#knowledge' },
  { label: 'About Ahmed', ar: 'عن أحمد', href: '#about' },
];

const pillars = [
  { number: '01', icon: Compass, title: 'Opportunity', ar: 'الفرص', ru: 'Возможности', text: 'Real estate and investment pathways assessed with a wider view of context, timing, and human fit.', arText: 'مسارات العقارات والاستثمار برؤية أوسع للسياق والتوقيت والملاءمة.', ruText: 'Направления в недвижимости и инвестициях с учётом контекста, времени и реальных целей человека.' },
  { number: '02', icon: LineChart, title: 'Growth', ar: 'النمو', ru: 'Рост', text: 'Practical acquisition and conversion systems that turn attention into a clearer commercial next step.', arText: 'أنظمة عملية للاكتساب والتحويل تنقل الانتباه إلى خطوة تجارية أوضح.', ruText: 'Практические системы привлечения и конверсии, превращающие внимание в понятный коммерческий следующий шаг.' },
  { number: '03', icon: Workflow, title: 'Digital systems', ar: 'الأنظمة الرقمية', ru: 'Цифровые системы', text: 'Automation, WhatsApp workflows, software, SaaS, and AI designed to reduce the distance between intent and action.', arText: 'أتمتة وتدفقات واتساب وبرمجيات ومنتجات SaaS وذكاء اصطناعي تقلل المسافة بين النية والتنفيذ.', ruText: 'Автоматизация, сценарии WhatsApp, программное обеспечение, SaaS и AI, сокращающие путь от намерения к действию.' },
  { number: '04', icon: BookOpen, title: 'Knowledge', ar: 'المعرفة', ru: 'Знания', text: 'Practical material for people who want to understand the mechanism, not just hear the promise.', arText: 'محتوى عملي لمن يريد فهم الآلية، وليس سماع الوعود فقط.', ruText: 'Практические материалы для тех, кто хочет понять механизм, а не просто услышать обещание.' },
];

const systemSteps = [
  { tag: '01 / DIAGNOSE', arTag: '01 / تشخيص', ruTag: '01 / ДИАГНОСТИКА', title: 'Find the leverage', ar: 'نحدد نقطة التأثير', ru: 'Найти точку влияния', text: 'Map the opportunity, audience, offer, current workflow, and the constraint holding momentum back.', arText: 'نرسم الفرصة والجمهور والعرض وسير العمل والقيد الذي يبطئ التقدم.', ruText: 'Определить возможности, аудиторию, предложение, текущий процесс и ограничение, которое замедляет движение.' },
  { tag: '02 / DESIGN', arTag: '02 / تصميم', ruTag: '02 / ДИЗАЙН', title: 'Build the engine', ar: 'نبني المحرك', ru: 'Построить двигатель', text: 'Shape the journey, message, automation layer, and measurement points around a real business context.', arText: 'نصمم رحلة العميل والرسالة وطبقة الأتمتة ونقاط القياس حول سياق تجاري حقيقي.', ruText: 'Сформировать путь клиента, сообщение, слой автоматизации и точки измерения вокруг реального бизнеса.' },
  { tag: '03 / DEPLOY', arTag: '03 / تشغيل', ruTag: '03 / ЗАПУСК', title: 'Make it usable', ar: 'نجعلها قابلة للتشغيل', ru: 'Сделать систему рабочей', text: 'Turn the strategy into a working operating rhythm your team can understand, run, and improve.', arText: 'نحوّل الاستراتيجية إلى إيقاع عمل يفهمه فريقك ويشغله ويطوره.', ruText: 'Превратить стратегию в рабочий ритм, который команда понимает, запускает и улучшает.' },
];

const knowledgeItems = [
  { type: 'FIELD NOTE', arType: 'ملاحظة ميدانية', ruType: 'ЗАМЕТКА С ПОЛЯ', title: 'The difference between a lead and a conversation', ar: 'الفرق بين العميل المحتمل والمحادثة', ru: 'Разница между лидом и разговором', icon: MessageCircle },
  { type: 'SYSTEM NOTE', arType: 'ملاحظة نظام', ruType: 'СИСТЕМНАЯ ЗАМЕТКА', title: 'Where automation should stop and people should start', ar: 'أين تتوقف الأتمتة ويبدأ دور الإنسان', ru: 'Где заканчивается автоматизация и начинается человек', icon: Workflow },
  { type: 'PERSPECTIVE', arType: 'رؤية', ruType: 'ПЕРСПЕКТИВА', title: 'Opportunity is a system of connected decisions', ar: 'الفرصة منظومة من القرارات المترابطة', ru: 'Возможность — это система связанных решений', icon: Globe2 },
];

const platforms = ['WhatsApp Business', 'Meta', 'Google Analytics', 'LinkedIn', 'HubSpot', 'n8n', 'Make', 'OpenAI', 'CRM', 'Webhooks'];

const socialChannels = [
  { name: 'Instagram', ar: 'إنستغرام', ru: 'Instagram', icon: Instagram, detail: 'Visual stories / reels / carousels', arDetail: 'قصص بصرية / ريلز / كاروسيل', ruDetail: 'Визуальные истории / reels / карусели', href: import.meta.env.VITE_INSTAGRAM_URL as string | undefined },
  { name: 'YouTube', ar: 'يوتيوب', ru: 'YouTube', icon: Youtube, detail: 'Video catalog / long-form', arDetail: 'كتالوج فيديو / محتوى طويل', ruDetail: 'Каталог видео / длинный формат', href: import.meta.env.VITE_YOUTUBE_URL as string | undefined },
  { name: 'LinkedIn', ar: 'لينكدإن', ru: 'LinkedIn', icon: Linkedin, detail: 'B2B insights / systems', arDetail: 'رؤى B2B / أنظمة', ruDetail: 'B2B-идеи / системы', href: import.meta.env.VITE_LINKEDIN_URL as string | undefined },
  { name: 'TikTok', ar: 'تيك توك', ru: 'TikTok', icon: Music2, detail: 'Short-form education', arDetail: 'تعليم سريع', ruDetail: 'Короткое образовательное видео', href: import.meta.env.VITE_TIKTOK_URL as string | undefined },
];

const videoCatalogUrl = import.meta.env.VITE_VIDEO_CATALOG_URL as string | undefined;

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'AR' | 'RU'>(() => {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang')?.toUpperCase();
    return requestedLanguage === 'AR' || requestedLanguage === 'RU' ? requestedLanguage : 'EN';
  });
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isArabic = language === 'AR';
  const isRussian = language === 'RU';

  useEffect(() => {
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'AR' ? 'ar' : language === 'RU' ? 'ru' : 'en';
  }, [language]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConsultationOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal-on-scroll'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [language]);

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
                {isArabic ? item.ar : isRussian ? item.label === 'Ecosystem' ? 'Экосистема' : item.label === 'Growth systems' ? 'Системы роста' : item.label === 'Integrations' ? 'Интеграции' : item.label === 'Social studio' ? 'Социальная студия' : item.label === 'Knowledge' ? 'Знания' : 'Об Ахмеде' : item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-1 border-r border-border pr-4" aria-label={isArabic ? 'اختيار اللغة' : isRussian ? 'Выбор языка' : 'Language switcher'}>
              {[{ code: 'EN', label: 'EN' }, { code: 'AR', label: 'عربي' }, { code: 'RU', label: 'RU' }].map((item) => (
                <button key={item.code} type="button" onClick={() => setLanguage(item.code as 'EN' | 'AR' | 'RU')} className={`px-1.5 py-1 text-[10px] font-bold tracking-[.12em] transition-colors ${language === item.code ? 'text-secondary' : 'text-muted-foreground hover:text-primary'}`} data-testid={`button-language-${item.code.toLowerCase()}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={openConsultation} className="group flex items-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.13em] text-primary-foreground transition-all hover:bg-accent" data-testid="button-header-consultation">
              {isArabic ? 'ابدأ محادثة' : isRussian ? 'Начать разговор' : 'Start a conversation'} <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
                  {isArabic ? item.ar : isRussian ? item.label === 'Ecosystem' ? 'Экосистема' : item.label === 'Growth systems' ? 'Системы роста' : item.label === 'Integrations' ? 'Интеграции' : item.label === 'Social studio' ? 'Социальная студия' : item.label === 'Knowledge' ? 'Знания' : 'Об Ахмеде' : item.label}<ArrowUpRight size={14} className="text-secondary" />
                </a>
              ))}
            </nav>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {[{ code: 'EN', label: 'EN' }, { code: 'AR', label: 'عربي' }, { code: 'RU', label: 'RU' }].map((item) => (
                  <button key={item.code} type="button" onClick={() => setLanguage(item.code as 'EN' | 'AR' | 'RU')} className={`border px-2.5 py-1.5 text-[10px] font-bold tracking-[.12em] ${language === item.code ? 'border-secondary bg-secondary text-primary' : 'border-border text-muted-foreground'}`} data-testid={`button-mobile-language-${item.code.toLowerCase()}`}>{item.label}</button>
                ))}
              </div>
              <button type="button" onClick={openConsultation} className="bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-[.11em] text-primary-foreground" data-testid="button-mobile-consultation">{isArabic ? 'ابدأ محادثة' : isRussian ? 'Начать разговор' : 'Start a conversation'}</button>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative border-b border-border pt-[72px]">
        <div className="mx-auto grid min-h-[700px] max-w-[1360px] grid-cols-1 items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:py-28">
          <div className="relative z-10">
            <div className="reveal mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-secondary" />
              <span className="mono text-[10px] font-medium tracking-[.2em] text-secondary">{isArabic ? 'منصة رقمية استراتيجية' : isRussian ? 'СТРАТЕГИЧЕСКАЯ ЦИФРОВАЯ ПЛАТФОРМА' : 'A STRATEGIC DIGITAL PLATFORM'}</span>
            </div>
            <h1 className="display reveal reveal-delay-1 max-w-[820px] text-[clamp(3.8rem,8vw,7.9rem)] font-extrabold leading-[.88] text-primary">
              {isArabic ? (
                <>نبني <span className="text-accent">الفرص.</span><br />محركات النمو.<br /><span className="text-secondary">الأنظمة الرقمية.</span><br />والمعرفة.</>
              ) : isRussian ? (
                <>Создаём <span className="text-accent">возможности.</span><br />Двигатели роста.<br /><span className="text-secondary">Цифровые системы.</span><br />Знания.</>
              ) : (
                <>Building <span className="text-accent">opportunities.</span><br />Growth engines.<br /><span className="text-secondary">Digital systems.</span><br />Knowledge.</>
              )}
            </h1>
            <p className="reveal reveal-delay-2 mt-9 max-w-[510px] text-[15px] leading-7 text-muted-foreground">
              {isArabic ? 'رؤية مترابطة لما يحرك الأشخاص والشركات والأفكار إلى الأمام — من مسارات الاستثمار إلى الأنظمة التي تجعل النمو قابلاً للتكرار.' : isRussian ? 'Связанный взгляд на то, что двигает людей, бизнес и идеи вперёд — от инвестиционных направлений до систем, делающих рост повторяемым.' : 'A connected view of what moves people, businesses, and ideas forward — from investment pathways to the systems that make growth repeatable.'}
            </p>
            <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={openConsultation} className="group flex items-center justify-center gap-3 bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-all hover:bg-accent" data-testid="button-hero-consultation">
                {isArabic ? 'اطلب نظام نمو' : isRussian ? 'Запросить систему роста' : 'Request a growth system'} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <a href="#ecosystem" className="group flex items-center justify-center gap-3 border border-primary/20 px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary transition-colors hover:border-secondary" data-testid="link-hero-ecosystem">
                {isArabic ? 'استكشف المنظومة' : isRussian ? 'Изучить экосистему' : 'Explore the ecosystem'} <ArrowDownRight size={16} className="transition-transform group-hover:translate-y-1" />
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
                <span className="mono block text-[9px] tracking-[.22em] text-secondary">{isArabic ? 'نقطة' : isRussian ? 'ТОЧКА' : 'THE CONNECTING'}</span>
                <span className="display mt-2 block text-3xl font-extrabold tracking-[-.07em] text-primary-foreground">{isArabic ? 'الربط' : isRussian ? 'СВЯЗИ' : 'POINT'}</span>
                <span className="mx-auto mt-3 block h-px w-9 bg-secondary" />
              </div>
            </div>
            <div className="network-line absolute left-[1%] top-[41%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-secondary" /><span className="mono text-[9px] tracking-[.08em] text-primary">{isArabic ? 'الأشخاص' : isRussian ? 'ЛЮДИ' : 'PEOPLE'}</span>
            </div>
            <div className="network-line absolute right-[2%] top-[26%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-accent" /><span className="mono text-[9px] tracking-[.08em] text-primary">{isArabic ? 'التقنية' : isRussian ? 'ТЕХНОЛОГИИ' : 'TECHNOLOGY'}</span>
            </div>
            <div className="network-line absolute bottom-[24%] left-[8%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-accent" /><span className="mono text-[9px] tracking-[.08em] text-primary">{isArabic ? 'المعرفة' : isRussian ? 'ЗНАНИЯ' : 'KNOWLEDGE'}</span>
            </div>
            <div className="network-line absolute bottom-[9%] right-[13%] flex items-center gap-2 bg-background px-2 py-1">
              <span className="h-2 w-2 rounded-full bg-secondary" /><span className="mono text-[9px] tracking-[.08em] text-primary">{isArabic ? 'النمو' : isRussian ? 'РОСТ' : 'GROWTH'}</span>
            </div>
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 500 500" fill="none" aria-hidden="true">
              <path d="M55 250H180M320 195L430 130M115 370L190 320M315 340L400 390" stroke="hsl(var(--secondary) / .42)" strokeDasharray="3 8" />
            </svg>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto grid max-w-[1360px] grid-cols-2 px-5 sm:px-8 md:grid-cols-4 lg:px-12">
            {['Real estate', 'Investment', 'Digital growth', 'Knowledge'].map((item, index) => (
              <div key={item} className={`reveal-on-scroll flex items-center gap-3 py-5 ${index < 3 ? 'border-r border-border' : ''} ${index > 0 ? 'pl-4 sm:pl-7' : ''}`}>
                <span className="mono text-[10px] text-secondary">0{index + 1}</span>
                <span className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">{isArabic ? ['العقارات', 'الاستثمار', 'النمو الرقمي', 'المعرفة'][index] : isRussian ? ['Недвижимость', 'Инвестиции', 'Цифровой рост', 'Знания'][index] : item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[.75fr_1.25fr]">
            <div className="reveal-on-scroll">
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '01 / المنظومة' : isRussian ? '01 / ЭКОСИСТЕМА' : '01 / THE ECOSYSTEM'}</span>
              <h2 className="display mt-6 max-w-[430px] text-5xl font-extrabold leading-[.93] tracking-[-.06em] sm:text-6xl">{isArabic ? <>رؤية واحدة.<br /><span className="text-secondary">محركات متعددة.</span></> : isRussian ? <>Одна перспектива.<br /><span className="text-secondary">Много двигателей.</span></> : <>One perspective.<br /><span className="text-secondary">Many engines.</span></>}</h2>
              <p className="mt-7 max-w-[360px] text-sm leading-7 text-primary-foreground/65">{isArabic ? 'العمل لا ينتمي إلى فئة واحدة. إنه يعيش حيث تلتقي الفرصة والتقنية والفعل الواعي.' : isRussian ? 'Работа не ограничивается одной категорией. Она живёт там, где встречаются возможности, технологии и осознанное действие.' : 'The work does not sit in one category. It lives where opportunity, technology, and informed action meet.'}</p>
              <div className="mt-10 flex items-center gap-3 border-t border-primary-foreground/15 pt-5">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                <span className="mono text-[9px] tracking-[.14em] text-primary-foreground/55">{isArabic ? 'إمكانات / قابلة للتخصيص حسب السياق' : isRussian ? 'ВОЗМОЖНОСТИ / НАСТРАИВАЮТСЯ ПОД КОНТЕКСТ' : 'CAPABILITIES / CONFIGURABLE TO CONTEXT'}</span>
              </div>
            </div>
            <div className="grid border-l border-primary-foreground/15 sm:grid-cols-2">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <article key={pillar.number} className="reveal-on-scroll group border-b border-primary-foreground/15 p-7 transition-colors hover:bg-primary-foreground/[.06] sm:nth-[odd]:border-r">
                    <div className="flex items-start justify-between">
                      <span className="mono text-[10px] text-secondary">{pillar.number}</span>
                      <Icon size={20} strokeWidth={1.3} className="text-secondary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                    <h3 className="display mt-12 text-2xl font-extrabold tracking-[-.04em]">{isArabic ? pillar.ar : isRussian ? pillar.ru : pillar.title}</h3>
                    <p className="mt-4 text-[13px] leading-6 text-primary-foreground/60">{isArabic ? pillar.arText : isRussian ? pillar.ruText : pillar.text}</p>
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
            <div className="reveal-on-scroll">
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '02 / أنظمة النمو' : isRussian ? '02 / СИСТЕМЫ РОСТА' : '02 / GROWTH SYSTEMS'}</span>
              <h2 className="display mt-5 max-w-[660px] text-5xl font-extrabold leading-[.95] tracking-[-.06em] text-primary sm:text-7xl">{isArabic ? <>استراتيجية<br /><span className="text-accent">تصل إلى أرض الواقع.</span></> : isRussian ? <>Стратегия, которая<br /><span className="text-accent">работает в реальности.</span></> : <>Strategy that can<br /><span className="text-accent">touch the ground.</span></>}</h2>
            </div>
            <p className="reveal-on-scroll max-w-[305px] text-sm leading-6 text-muted-foreground">{isArabic ? 'النظام المفيد ليس عرضاً تقديمياً. إنه سلسلة من القرارات والأدوات والخطوات الواضحة المبنية لبيئة العمل الحقيقية.' : isRussian ? 'Полезная система — это не презентация. Это последовательность решений, инструментов и действий для реальной рабочей среды.' : 'A useful system is not a slide deck. It is a sequence of clear decisions, tools, and actions built for the real operating environment.'}</p>
          </div>
          <div className="mt-20 grid gap-px bg-border md:grid-cols-3">
            {systemSteps.map((step, index) => (
              <article key={step.tag} className="reveal-on-scroll group relative bg-background p-7 pb-9 transition-colors hover:bg-card sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] tracking-[.16em] text-secondary">{isArabic ? step.arTag : isRussian ? step.ruTag : step.tag}</span>
                  <span className="display text-5xl font-extrabold text-primary/10 transition-colors group-hover:text-secondary/35">0{index + 1}</span>
                </div>
                <h3 className="display mt-16 text-3xl font-extrabold tracking-[-.05em] text-primary">{isArabic ? step.ar : isRussian ? step.ru : step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{isArabic ? step.arText : isRussian ? step.ruText : step.text}</p>
                <div className="mt-10 h-px w-10 bg-secondary transition-all group-hover:w-24" />
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-[1.4fr_.6fr]">
            <div className="reveal-on-scroll flex min-h-[190px] flex-col justify-between bg-accent p-7 text-primary-foreground sm:p-9">
              <div className="flex items-center justify-between">
                <Bot size={22} strokeWidth={1.4} />
                 <span className="mono text-[9px] tracking-[.18em] text-primary-foreground/60">{isArabic ? 'طبقة النظام / مثال' : isRussian ? 'СИСТЕМНЫЙ СЛОЙ / ПРИМЕР' : 'SYSTEM LAYER / EXAMPLE'}</span>
              </div>
              <div>
                 <h3 className="display text-3xl font-extrabold tracking-[-.05em]">{isArabic ? 'محادثة تستمر في التقدم.' : isRussian ? 'Разговор, который движется вперёд.' : 'A conversation that keeps moving.'}</h3>
                 <p className="mt-3 max-w-[500px] text-[13px] leading-6 text-primary-foreground/70">{isArabic ? 'التقاط العملاء وتأهيلهم وتدفقات واتساب والانتقال إلى الإنسان — تجربة واحدة مترابطة.' : isRussian ? 'Захват лида, квалификация, сценарии WhatsApp и передача человеку — единый связанный опыт.' : 'Lead capture, qualification, WhatsApp workflows, and human handoff — considered as one connected experience.'}</p>
              </div>
            </div>
            <div className="reveal-on-scroll flex min-h-[190px] flex-col justify-between border border-border bg-card p-7 sm:p-9">
              <Layers3 size={22} strokeWidth={1.4} className="text-secondary" />
              <div>
                  <span className="mono text-[9px] tracking-[.18em] text-muted-foreground">{isArabic ? 'العدسة' : isRussian ? 'ВЗГЛЯД' : 'THE LENS'}</span>
                  <p className="display mt-2 text-2xl font-extrabold leading-tight tracking-[-.04em] text-primary">{isArabic ? <>وضوح إنساني،<br />قوة رقمية.</> : isRussian ? <>Человеческая ясность,<br />цифровой рычаг.</> : <>Human clarity,<br />digital leverage.</>}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="knowledge" className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[.85fr_1.15fr]">
            <div className="reveal-on-scroll">
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '04 / المعرفة' : isRussian ? '04 / ЗНАНИЯ' : '04 / KNOWLEDGE'}</span>
              <h2 className="display mt-5 text-5xl font-extrabold leading-[.94] tracking-[-.06em] text-primary sm:text-6xl">{isArabic ? <>أفكار مفيدة<br /><span className="text-accent">للخطوة القادمة.</span></> : isRussian ? <>Полезные идеи<br /><span className="text-accent">для следующего шага.</span></> : <>Useful thinking<br /><span className="text-accent">for the next move.</span></>}</h2>
              <p className="mt-7 max-w-[365px] text-sm leading-7 text-muted-foreground">{isArabic ? 'محتوى قصير وعملي عن الفرص والتسويق والأتمتة والذكاء الاصطناعي والاختيارات التشغيلية خلف النمو المستدام.' : isRussian ? 'Короткие практические материалы о возможностях, маркетинге, автоматизации, AI и операционных решениях для устойчивого роста.' : 'Short, practical material on opportunity, marketing, automation, AI, and the operating choices behind sustainable growth.'}</p>
              <button type="button" onClick={() => document.getElementById('knowledge-library')?.scrollIntoView({ behavior: 'smooth' })} className="group mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[.12em] text-primary" data-testid="button-explore-material">
                {isArabic ? 'استكشف المكتبة' : isRussian ? 'Открыть библиотеку' : 'Explore the library'} <ArrowUpRight size={15} className="text-secondary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </div>
            <div id="knowledge-library" className="grid gap-4">
              {knowledgeItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button type="button" key={item.title} className="reveal-on-scroll group flex w-full items-center gap-5 border-b border-border py-5 text-left transition-colors hover:border-secondary" onClick={() => document.getElementById('connect')?.scrollIntoView({ behavior: 'smooth' })} data-testid={`button-knowledge-item-${index + 1}`}>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-border text-secondary transition-colors group-hover:border-secondary group-hover:bg-secondary group-hover:text-primary"><Icon size={18} strokeWidth={1.4} /></span>
                    <span className="flex-1">
                      <span className="mono block text-[9px] tracking-[.16em] text-secondary">{isArabic ? item.arType : isRussian ? item.ruType : item.type}</span>
                      <span className="mt-1 block text-[15px] font-bold leading-6 text-primary">{isArabic ? item.ar : isRussian ? item.ru : item.title}</span>
                    </span>
                    <ArrowUpRight size={17} className="text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-secondary" />
                  </button>
                );
              })}
              <div className="reveal-on-scroll mt-3 flex items-center gap-3 border border-dashed border-border p-4">
                <Sparkles size={17} className="text-secondary" />
                <span className="text-xs leading-5 text-muted-foreground">{isArabic ? 'يتم إعداد محتوى جديد حول الأسئلة التي تهم العمل الحقيقي.' : isRussian ? 'Новые материалы создаются вокруг вопросов, важных для реальной работы.' : 'New material is being shaped around questions that matter in the field.'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="integrations" className="overflow-hidden border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1360px] px-5 pb-20 pt-24 sm:px-8 lg:px-12 lg:pb-28 lg:pt-32">
          <div className="reveal-on-scroll flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '05 / التكاملات' : isRussian ? '05 / ИНТЕГРАЦИИ' : '05 / INTEGRATIONS'}</span>
              <h2 className="display mt-5 max-w-[690px] text-5xl font-extrabold leading-[.92] tracking-[-.06em] sm:text-7xl">{isArabic ? <>منصة واحدة.<br /><span className="text-secondary">أدوات متصلة.</span></> : isRussian ? <>Одна платформа.<br /><span className="text-secondary">Связанные инструменты.</span></> : <>One platform.<br /><span className="text-secondary">Connected tools.</span></>}</h2>
            </div>
            <p className="max-w-[340px] text-sm leading-7 text-primary-foreground/60">{isArabic ? 'طبقة تكاملات قابلة للتوسّع تربط التسويق والمبيعات وCRM والأتمتة والتحليلات — كأمثلة تقنية محتملة وليست شراكات رسمية.' : isRussian ? 'Модульный слой интеграций для маркетинга, продаж, CRM, автоматизации и аналитики — возможные технологические примеры, а не официальные партнёрства.' : 'A modular integration layer connecting marketing, sales, CRM, automation, and analytics — possible technology examples, not official partnerships.'}</p>
          </div>
        </div>
        <div className="platform-marquee border-y border-primary-foreground/15" aria-label={isArabic ? 'منصات وتكاملات محتملة' : isRussian ? 'Возможные платформы и интеграции' : 'Possible platforms and integrations'}>
          <div className="platform-track">
            {[...platforms, ...platforms].map((platform, index) => (
              <span key={`${platform}-${index}`} className="platform-chip">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                {platform}
              </span>
            ))}
          </div>
        </div>
        <div className="mx-auto grid max-w-[1360px] gap-4 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-12">
          {[
            { icon: Database, title: isArabic ? 'بيانات مترابطة' : isRussian ? 'Связанные данные' : 'Connected data', text: isArabic ? 'مصادر وCRM وتحليلات ضمن طبقة قابلة للفهم.' : isRussian ? 'Источники, CRM и аналитика в понятном едином слое.' : 'Sources, CRM, and analytics within an understandable layer.' },
            { icon: Code2, title: isArabic ? 'واجهات مرنة' : isRussian ? 'Гибкие API' : 'Flexible APIs', text: isArabic ? 'Webhooks وواجهات API للأتمتة المخصصة.' : isRussian ? 'Webhooks и API для индивидуальной автоматизации.' : 'Webhooks and APIs for custom automation.' },
            { icon: BarChart3, title: isArabic ? 'قياس واضح' : isRussian ? 'Понятные измерения' : 'Clear measurement', text: isArabic ? 'من الزيارة إلى العميل إلى الإجراء التالي.' : isRussian ? 'От визита до лида и следующего полезного действия.' : 'From visit to lead to the next useful action.' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="reveal-on-scroll border border-primary-foreground/15 p-6 transition-colors hover:border-secondary/70 hover:bg-primary-foreground/[.05]">
                <Icon size={20} className="text-secondary" strokeWidth={1.3} />
                <h3 className="display mt-12 text-2xl font-extrabold tracking-[-.04em]">{item.title}</h3>
                <p className="mt-3 text-[13px] leading-6 text-primary-foreground/60">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="social" className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="reveal-on-scroll grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '06 / استوديو السوشيال' : isRussian ? '06 / СОЦИАЛЬНАЯ СТУДИЯ' : '06 / SOCIAL STUDIO'}</span>
              <h2 className="display mt-5 max-w-[500px] text-5xl font-extrabold leading-[.93] tracking-[-.06em] text-primary sm:text-6xl">{isArabic ? <>قنواتك.<br /><span className="text-accent">قصتك.</span></> : isRussian ? <>Ваши каналы.<br /><span className="text-accent">Ваша история.</span></> : <>Your channels.<br /><span className="text-accent">Your story.</span></>}</h2>
              <p className="mt-7 max-w-[370px] text-sm leading-7 text-muted-foreground">{isArabic ? 'مساحة منظمة لإضافة روابط السوشيال وكتالوج الفيديوهات وقوالب المحتوى عند تجهيز المواد الخاصة بك.' : isRussian ? 'Структурированное пространство для ваших ссылок, каталога видео и шаблонов контента после добавления оригинальных материалов.' : 'A structured place for your social links, video catalog, and content templates once your own materials are supplied.'}</p>
              <div className="mt-8 flex items-center gap-3 border-t border-border pt-5">
                <Video size={17} className="text-secondary" />
                <span className="mono text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'المواد القادمة / روابط وملفات أصلية' : isRussian ? 'ВХОДЯЩИЕ МАТЕРИАЛЫ / ОРИГИНАЛЬНЫЕ ССЫЛКИ И ФАЙЛЫ' : 'INCOMING ASSETS / ORIGINAL LINKS & FILES'}</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {socialChannels.map((channel) => {
                const Icon = channel.icon;
                const cardClassName = 'reveal-on-scroll group min-h-[190px] border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-secondary hover:shadow-[0_16px_35px_hsl(var(--primary)/.08)]';
                const cardContent = (
                  <>
                    <div className="flex items-start justify-between">
                      <Icon size={22} className="text-secondary" strokeWidth={1.4} />
                      <span className="mono text-[9px] tracking-[.16em] text-muted-foreground">{channel.href ? (isArabic ? 'رابط مباشر' : isRussian ? 'ПРЯМАЯ ССЫЛКА' : 'LIVE LINK') : (isArabic ? 'بانتظار الرابط' : isRussian ? 'ССЫЛКА ОЖИДАЕТСЯ' : 'LINK PENDING')}</span>
                    </div>
                    <h3 className="display mt-14 text-2xl font-extrabold tracking-[-.04em] text-primary">{isArabic ? channel.ar : isRussian ? channel.ru : channel.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{channel.href ? (isArabic ? 'افتح القناة' : isRussian ? 'Открыть канал' : 'Open channel') : (isArabic ? 'جاهز لإضافة الرابط' : isRussian ? 'Добавьте оригинальную ссылку' : 'Ready for your link')}</p>
                    <p className="mt-5 text-[11px] uppercase tracking-[.08em] text-secondary">{isArabic ? channel.arDetail : isRussian ? channel.ruDetail : channel.detail}</p>
                  </>
                );
                return channel.href ? (
                  <a key={channel.name} href={channel.href} target="_blank" rel="noreferrer" className={cardClassName} data-testid={`link-social-${channel.name.toLowerCase()}`}>
                    {cardContent}
                  </a>
                ) : (
                  <article key={channel.name} className={cardClassName} data-testid={`card-social-${channel.name.toLowerCase()}`}>
                    {cardContent}
                  </article>
                );
              })}
            </div>
          </div>
          <div className="mt-16 border-t border-border pt-12">
            <div className="reveal-on-scroll flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? 'قوالب السوشيال' : isRussian ? 'ШАБЛОНЫ ДЛЯ СОЦСЕТЕЙ' : 'SOCIAL TEMPLATES'}</span>
                <h3 className="display mt-4 text-4xl font-extrabold tracking-[-.06em] text-primary">{isArabic ? 'نظام محتوى جاهز للتوسّع.' : isRussian ? 'Контентная система, готовая к масштабированию.' : 'A content system ready to scale.'}</h3>
              </div>
              <span className="text-sm text-muted-foreground">{isArabic ? 'معاينة أولية / سيتم استبدالها بموادك' : isRussian ? 'Предпросмотр / замените своими материалами' : 'Preview set / replace with your assets'}</span>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { label: isArabic ? 'إعلان' : isRussian ? 'АНОНС' : 'ANNOUNCEMENT', title: isArabic ? 'إطلاق فكرة جديدة' : isRussian ? 'Запуск новой идеи' : 'Launch a new idea', className: 'template-sand' },
                { label: isArabic ? 'تعليمي' : isRussian ? 'ОБУЧЕНИЕ' : 'EDUCATIONAL', title: isArabic ? 'كاروسيل يشرح النظام' : isRussian ? 'Карусель, объясняющая систему' : 'Carousel that explains the system', className: 'template-navy' },
                { label: isArabic ? 'فيديو' : isRussian ? 'ОБЛОЖКА ВИДЕО' : 'VIDEO COVER', title: isArabic ? 'كتالوج الفيديوهات' : isRussian ? 'Каталог видео' : 'Video catalog', className: 'template-gold' },
              ].map((template) => (
                <article key={template.label} className={`reveal-on-scroll social-template ${template.className}`}>
                  <span className="mono text-[9px] tracking-[.18em] opacity-70">{template.label}</span>
                  <span className="display mt-16 max-w-[180px] text-2xl font-extrabold leading-[.95] tracking-[-.05em]">{template.title}</span>
                   <span className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em]"><Play size={13} /> {isArabic ? 'قالب قابل للتعديل' : isRussian ? 'Редактируемый шаблон' : 'Editable template'}</span>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="mono text-[9px] tracking-[.16em] text-secondary">{isArabic ? 'كتالوج الفيديو' : isRussian ? 'КАТАЛОГ ВИДЕО' : 'VIDEO CATALOG'}</span>
                <p className="mt-2 text-sm text-muted-foreground">{videoCatalogUrl ? (isArabic ? 'الكتالوج الأصلي متاح للفتح.' : isRussian ? 'Оригинальный каталог доступен для просмотра.' : 'The original catalog is ready to open.') : (isArabic ? 'بانتظار رابط الكتالوج الأصلي أو ملفات الفيديو.' : isRussian ? 'Ожидается оригинальная ссылка или файлы видео.' : 'Waiting for the original catalog link or video files.')}</p>
              </div>
              {videoCatalogUrl ? (
                <a href={videoCatalogUrl} target="_blank" rel="noreferrer" className="group flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-primary" data-testid="link-video-catalog">
                  {isArabic ? 'افتح الكتالوج' : isRussian ? 'Открыть каталог' : 'Open catalog'} <ArrowUpRight size={15} className="text-secondary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              ) : (
                <span className="mono shrink-0 text-[9px] tracking-[.12em] text-muted-foreground">{isArabic ? 'رابط غير مضاف' : isRussian ? 'ССЫЛКА НЕ ДОБАВЛЕНА' : 'LINK NOT ADDED'}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[.6fr_1.4fr] lg:px-12 lg:py-28">
          <div className="reveal-on-scroll">
            <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '07 / التوقيع' : isRussian ? '07 / ПОДПИСЬ' : '07 / THE SIGNATURE'}</span>
            <div className="mt-8 h-px w-20 bg-secondary" />
          </div>
          <div className="reveal-on-scroll">
            <blockquote className="display max-w-[850px] text-4xl font-extrabold leading-[1.04] tracking-[-.055em] text-primary sm:text-6xl">
              {isArabic ? <>“نربط الناس والفرص والتكنولوجيا والمعرفة <span className="text-secondary">والنمو.</span>”</> : isRussian ? <>«Соединяем людей, возможности, технологии, знания <span className="text-secondary">и рост.»</span></> : <>“Connecting people, opportunities, technology, knowledge <span className="text-secondary">&amp; growth.</span>”</>}
            </blockquote>
            <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
              <p className="text-sm leading-7 text-muted-foreground">{isArabic ? 'يعمل أحمد السيد في المساحات بين التخصصات — حيث تحتاج الفرصة التجارية إلى رسالة أوضح أو نظام أفضل أو محادثة أكثر فائدة.' : isRussian ? 'Ахмед Эль-Сайед работает на пересечении дисциплин — там, где коммерческой возможности нужны более точное сообщение, лучшая система или просто более полезный разговор.' : 'Ahmed El Sayed works across the spaces between disciplines — where commercial opportunity needs a sharper message, a better system, or simply a more useful conversation.'}</p>
              <p className="text-sm leading-7 text-muted-foreground">{isArabic ? 'المنصة تتطور بشكل مستمر. تُعرض الإمكانات كمسارات قابلة للتخصيص، بينما يتم تأكيد تفاصيل العمل والنتائج والتوافر من خلال محادثة مباشرة.' : isRussian ? 'Платформа развивается постепенно. Возможности представлены как настраиваемые направления, а детали работы, результаты и доступность подтверждаются в прямом разговоре.' : 'The platform is intentionally evolving. Capabilities are presented as configurable pathways; specific engagements, outcomes, and availability are confirmed through a direct conversation.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="connect" className="bg-secondary text-primary">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12 lg:py-24">
          <div className="reveal-on-scroll">
            <span className="mono text-[10px] tracking-[.2em] text-primary/60">{isArabic ? '08 / الخطوة التالية' : isRussian ? '08 / СЛЕДУЮЩИЙ ШАГ' : '08 / NEXT MOVE'}</span>
            <h2 className="display mt-5 max-w-[720px] text-5xl font-extrabold leading-[.9] tracking-[-.065em] sm:text-7xl">{isArabic ? <>أحضر سؤالك.<br />وابنِ النظام التالي.</> : isRussian ? <>Принесите вопрос.<br />Постройте следующую систему.</> : <>Bring the question.<br />Build the next system.</>}</h2>
            <p className="mt-7 max-w-[470px] text-sm leading-6 text-primary/70">{isArabic ? 'أخبرنا بما تحاول ربطه أو توضيحه أو تطويره. الخطوة الأولى محادثة مفيدة — وليست التزاماً.' : isRussian ? 'Расскажите, что вы хотите связать, прояснить или развить. Первый шаг — полезный разговор, а не обязательство.' : 'Tell us what you are trying to connect, clarify, or grow. The first step is a useful conversation — not a commitment.'}</p>
          </div>
          <div className="reveal-on-scroll flex flex-col gap-3 sm:flex-row md:flex-col">
            <button type="button" onClick={openConsultation} className="group flex items-center justify-between gap-8 bg-primary px-5 py-4 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-colors hover:bg-accent" data-testid="button-connect-consultation">
              {isArabic ? 'اطلب استشارة' : isRussian ? 'Запросить консультацию' : 'Request a consultation'} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            <a href={whatsappHref} target={WHATSAPP_NUMBER ? '_blank' : undefined} rel={WHATSAPP_NUMBER ? 'noreferrer' : undefined} className="group flex items-center justify-between gap-8 border border-primary/30 px-5 py-4 text-xs font-bold uppercase tracking-[.12em] transition-colors hover:border-primary" data-testid="link-connect-whatsapp">
              <span className="flex items-center gap-2"><MessageCircle size={15} /> {isArabic ? 'تواصل عبر واتساب' : isRussian ? 'Связаться в WhatsApp' : 'WhatsApp contact'}</span><ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
              <p className="mt-4 max-w-[310px] text-[11px] leading-5 text-primary-foreground/50">{isArabic ? 'نربط الناس والفرص والتكنولوجيا والمعرفة والنمو.' : isRussian ? 'Соединяем людей, возможности, технологии, знания и рост.' : 'Connecting People, Opportunities, Technology, Knowledge &amp; Growth.'}</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
              <span className="mono text-[9px] tracking-[.14em] text-primary-foreground/40">{isArabic ? 'حالة المنصة / قابلة للتخصيص' : isRussian ? 'СТАТУС ПЛАТФОРМЫ / НАСТРАИВАЕМАЯ' : 'PLATFORM STATUS / CONFIGURABLE'}</span>
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
                  <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? 'محادثة أولى مفيدة' : isRussian ? 'ПЕРВЫЙ ПОЛЕЗНЫЙ РАЗГОВОР' : 'A USEFUL FIRST CONVERSATION'}</span>
                  <h2 id="consultation-title" className="display mt-5 max-w-[440px] text-4xl font-extrabold leading-[.95] tracking-[-.06em] text-primary">{isArabic ? 'ما الذي تحاول ربطه أو تطويره؟' : isRussian ? 'Что вы хотите связать или развить?' : 'What are you trying to connect or grow?'}</h2>
                  <p className="mt-4 max-w-[440px] text-sm leading-6 text-muted-foreground">{isArabic ? 'هذه تجربة عرض فقط. لا يتم إرسال أي بيانات إلى خادم حالياً.' : isRussian ? 'Это демонстрационная форма. Данные пока не отправляются на сервер.' : 'This form is a presentation interaction only. Nothing is sent to a backend yet.'}</p>
                <form onSubmit={handleConsultationSubmit} className="mt-8 space-y-4">
                    <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'الاسم' : isRussian ? 'ВАШЕ ИМЯ' : 'YOUR NAME'}</span><input required name="name" className="w-full border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder={isArabic ? 'الاسم' : isRussian ? 'Имя' : 'Name'} data-testid="input-consultation-name" /></label>
                    <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'وسيلة التواصل' : isRussian ? 'КАНАЛ СВЯЗИ' : 'CONTACT CHANNEL'}</span><input required name="contact" className="w-full border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder={isArabic ? 'البريد الإلكتروني أو واتساب' : isRussian ? 'Email или WhatsApp' : 'Email or WhatsApp'} data-testid="input-consultation-contact" /></label>
                    <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'السؤال' : isRussian ? 'ВОПРОС' : 'THE QUESTION'}</span><textarea required name="question" rows={4} className="w-full resize-none border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder={isArabic ? 'اكتب نبذة عن الفرصة أو النظام...' : isRussian ? 'Несколько слов о возможности или системе...' : 'A few words about the opportunity or system...'} data-testid="input-consultation-question" /></label>
                    <button type="submit" className="group flex w-full items-center justify-center gap-3 bg-primary px-4 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-colors hover:bg-accent" data-testid="button-submit-consultation">{isArabic ? 'تابع المحادثة' : isRussian ? 'Продолжить разговор' : 'Keep the conversation moving'} <Send size={15} className="transition-transform group-hover:translate-x-1" /></button>
                </form>
              </>
            ) : (
              <div className="py-10">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary text-primary"><Check size={23} /></div>
                  <h2 className="display mt-7 text-4xl font-extrabold leading-none tracking-[-.06em] text-primary">{isArabic ? 'تم حفظ السؤال.' : isRussian ? 'Вопрос принят.' : 'The question is captured.'}</h2>
                  <p className="mt-4 max-w-[400px] text-sm leading-6 text-muted-foreground">{isArabic ? 'هذه النسخة التجريبية لا ترسل البيانات. عند تجهيز طبقة الاتصال، يمكن توجيه الخطوة إلى المحادثة المناسبة.' : isRussian ? 'Эта демонстрационная версия никуда не отправляет данные. После настройки слоя связи запрос можно направить в нужный канал.' : 'This demo does not send data anywhere. When the connection layer is configured, this step can be routed to the right conversation.'}</p>
                  <button type="button" onClick={() => setConsultationOpen(false)} className="mt-8 border border-primary px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground" data-testid="button-close-confirmation">{isArabic ? 'العودة إلى المنصة' : isRussian ? 'Вернуться на платформу' : 'Return to platform'}</button>
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