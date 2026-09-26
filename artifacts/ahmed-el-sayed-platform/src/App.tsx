import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BarChart3, BookOpen, Bot, Check, Code2, Compass, Database, Globe2, Instagram, Layers3, Linkedin, LineChart, Menu, MessageCircle, Music2, Play, Send, Sparkles, Video, Workflow, X, Youtube } from 'lucide-react';
import { RiDatabase2Fill, RiLinkedinFill, RiOpenaiFill, RiSlackFill, RiWebhookFill } from 'react-icons/ri';
import { SiBuffer, SiFacebook, SiFigma, SiGoogleads, SiGoogleanalytics, SiGooglesearchconsole, SiHootsuite, SiHotjar, SiHubspot, SiMailchimp, SiMake, SiMeta, SiN8N, SiNotion, SiSemrush, SiShopify, SiTiktok, SiWhatsapp, SiWordpress, SiZapier } from 'react-icons/si';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route as WouterRoute, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined;
const whatsappHref = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}` : '#connect';
const PRIMARY_HANDLE = 'ahmedmokireldin';
const OFFICIAL_SITE_URL = 'https://ahmedmokireldin.online';
const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL as string | undefined;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const EMAIL_MARKETING_WEBHOOK_URL = import.meta.env.VITE_EMAIL_MARKETING_WEBHOOK_URL as string | undefined;

async function submitLead(values: Record<string, FormDataEntryValue>) {
  const payload: Record<string, string> = { ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, String(value)])), submittedAt: new Date().toISOString(), source: 'website' };
  const destinations: Promise<Response>[] = [];
  if (GOOGLE_SHEETS_WEBHOOK_URL) {
    destinations.push(fetch(GOOGLE_SHEETS_WEBHOOK_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }));
  }
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    destinations.push(fetch(`${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/form_submissions`, {
      method: 'POST',
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ form_type: payload.formType || 'general', name: payload.name || null, contact: payload.contact || payload.email || null, question: payload.question || null, course: payload.course || null, message: payload.message || null, submitted_at: payload.submittedAt, source: payload.source, raw_data: payload }),
    }));
  }
  if (EMAIL_MARKETING_WEBHOOK_URL) {
    destinations.push(fetch(EMAIL_MARKETING_WEBHOOK_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ...payload, event: 'lead' }) }));
  }
  if (!destinations.length) throw new Error('No storage destination is configured');
  const results = await Promise.allSettled(destinations);
  if (results.every((result) => result.status === 'rejected')) throw new Error('No storage destination accepted the submission');
}

const navItems = [
  { label: 'Services', ar: 'الخدمات', href: '/services' },
  { label: 'Systems', ar: 'الأنظمة', href: '#systems' },
  { label: 'Courses', ar: 'الكورسات', href: '/courses' },
  { label: 'Clients', ar: 'العملاء', href: '#clients' },
  { label: 'Reviews', ar: 'التقييمات', href: '#reviews' },
  { label: 'About', ar: 'عن أحمد', href: '/about' },
];

const pillars = [
  { number: '01', icon: LineChart, title: 'Marketing systems', ar: 'أنظمة التسويق', ru: 'Маркетинговые системы', text: 'Positioning, campaigns, funnels, and conversion journeys that turn attention into qualified demand.', arText: 'تموضع وحملات ومسارات تحويل تحوّل الانتباه إلى طلب مؤهل.', ruText: 'Позиционирование, кампании, воронки и пути конверсии, превращающие внимание в спрос.' },
  { number: '02', icon: Database, title: 'Data products', ar: 'منتجات البيانات', ru: 'Продукты данных', text: 'Lead intelligence and data packages organized for prospecting, targeting, and commercial decisions.', arText: 'بيانات عملاء محتملين وحزم معلومات منظمة للتنقيب والاستهداف والقرارات التجارية.', ruText: 'Данные о лидах и информационные пакеты для поиска, таргетинга и коммерческих решений.' },
  { number: '03', icon: Workflow, title: 'Automation', ar: 'الأتمتة', ru: 'Автоматизация', text: 'WhatsApp, CRM, email, and no-code workflows that keep follow-up moving without losing the human layer.', arText: 'تدفقات واتساب وCRM وإيميل وأدوات بدون كود تحافظ على المتابعة مع بقاء العنصر الإنساني.', ruText: 'Сценарии WhatsApp, CRM, email и no-code, которые поддерживают follow-up без потери человеческого контакта.' },
  { number: '04', icon: BookOpen, title: 'Courses', ar: 'الكورسات', ru: 'Курсы', text: 'Practical learning for people who want to build their own marketing, data, and automation capability.', arText: 'تعلم عملي لمن يريد بناء قدرته في التسويق والبيانات والأتمتة.', ruText: 'Практическое обучение для тех, кто хочет развивать маркетинг, данные и автоматизацию.' },
];

const systemSteps = [
  { tag: '01 / POSITION', arTag: '01 / تموضع', ruTag: '01 / ПОЗИЦИОНИРОВАНИЕ', title: 'Clarify the offer', ar: 'نوضح العرض', ru: 'Уточнить предложение', text: 'Define the audience, message, product, and evidence before buying more attention.', arText: 'نحدد الجمهور والرسالة والمنتج والدليل قبل شراء مزيد من الانتباه.', ruText: 'Определить аудиторию, сообщение, продукт и доказательства до покупки дополнительного внимания.' },
  { tag: '02 / ACTIVATE', arTag: '02 / تشغيل', ruTag: '02 / ЗАПУСК', title: 'Build the funnel', ar: 'نبني المسار', ru: 'Построить воронку', text: 'Connect content, data, landing pages, forms, and follow-up into one measurable journey.', arText: 'نربط المحتوى والبيانات والصفحات والنماذج والمتابعة في رحلة قابلة للقياس.', ruText: 'Связать контент, данные, страницы, формы и follow-up в один измеримый путь.' },
  { tag: '03 / AUTOMATE', arTag: '03 / أتمتة', ruTag: '03 / АВТОМАТИЗАЦИЯ', title: 'Scale the follow-up', ar: 'نوسع المتابعة', ru: 'Масштабировать follow-up', text: 'Use CRM, WhatsApp, email, and no-code automation to make the next action reliable.', arText: 'نستخدم CRM وواتساب وإيميل وأتمتة بدون كود لجعل الخطوة التالية منتظمة.', ruText: 'Использовать CRM, WhatsApp, email и no-code, чтобы следующий шаг был надёжным.' },
];

const knowledgeItems = [
  { type: 'FIELD NOTE', arType: 'ملاحظة ميدانية', ruType: 'ЗАМЕТКА С ПОЛЯ', title: 'The difference between a lead and a conversation', ar: 'الفرق بين العميل المحتمل والمحادثة', ru: 'Разница между лидом и разговором', icon: MessageCircle },
  { type: 'SYSTEM NOTE', arType: 'ملاحظة نظام', ruType: 'СИСТЕМНАЯ ЗАМЕТКА', title: 'Where automation should stop and people should start', ar: 'أين تتوقف الأتمتة ويبدأ دور الإنسان', ru: 'Где заканчивается автоматизация и начинается человек', icon: Workflow },
  { type: 'PERSPECTIVE', arType: 'رؤية', ruType: 'ПЕРСПЕКТИВА', title: 'Opportunity is a system of connected decisions', ar: 'الفرصة منظومة من القرارات المترابطة', ru: 'Возможность — это система связанных решений', icon: Globe2 },
];

const platforms = [
  { name: 'WhatsApp Business', Icon: SiWhatsapp },
  { name: 'Meta', Icon: SiMeta },
  { name: 'Google Analytics', Icon: SiGoogleanalytics },
  { name: 'LinkedIn', Icon: RiLinkedinFill },
  { name: 'HubSpot', Icon: SiHubspot },
  { name: 'n8n', Icon: SiN8N },
  { name: 'Make', Icon: SiMake },
  { name: 'OpenAI', Icon: RiOpenaiFill },
  { name: 'CRM', Icon: RiDatabase2Fill },
  { name: 'Webhooks', Icon: RiWebhookFill },
];

const professionalMarketingStack = [
  { name: 'Google Ads', Icon: SiGoogleads },
  { name: 'Search Console', Icon: SiGooglesearchconsole },
  { name: 'Mailchimp', Icon: SiMailchimp },
  { name: 'Semrush', Icon: SiSemrush },
  { name: 'Hotjar', Icon: SiHotjar },
  { name: 'WordPress', Icon: SiWordpress },
  { name: 'Shopify', Icon: SiShopify },
  { name: 'Zapier', Icon: SiZapier },
  { name: 'Notion', Icon: SiNotion },
  { name: 'Figma', Icon: SiFigma },
  { name: 'Buffer', Icon: SiBuffer },
  { name: 'Hootsuite', Icon: SiHootsuite },
  { name: 'TikTok', Icon: SiTiktok },
  { name: 'Facebook', Icon: SiFacebook },
  { name: 'Slack', Icon: RiSlackFill },
];

const socialChannels = [
  { name: 'Instagram', ar: 'إنستغرام', ru: 'Instagram', icon: Instagram, detail: 'Visual stories / reels / carousels', arDetail: 'قصص بصرية / ريلز / كاروسيل', ruDetail: 'Визуальные истории / reels / карусели', href: (import.meta.env.VITE_INSTAGRAM_URL as string | undefined) || `https://www.instagram.com/${PRIMARY_HANDLE}/` },
  { name: 'YouTube', ar: 'يوتيوب', ru: 'YouTube', icon: Youtube, detail: 'Video catalog / long-form', arDetail: 'كتالوج فيديو / محتوى طويل', ruDetail: 'Каталог видео / длинный формат', href: (import.meta.env.VITE_YOUTUBE_URL as string | undefined) || `https://www.youtube.com/@${PRIMARY_HANDLE}` },
  { name: 'LinkedIn', ar: 'لينكدإن', ru: 'LinkedIn', icon: Linkedin, detail: 'B2B insights / systems', arDetail: 'رؤى B2B / أنظمة', ruDetail: 'B2B-идеи / системы', href: (import.meta.env.VITE_LINKEDIN_URL as string | undefined) || `https://www.linkedin.com/in/${PRIMARY_HANDLE}/` },
  { name: 'TikTok', ar: 'تيك توك', ru: 'TikTok', icon: Music2, detail: 'Short-form education', arDetail: 'تعليم سريع', ruDetail: 'Короткое образовательное видео', href: (import.meta.env.VITE_TIKTOK_URL as string | undefined) || `https://www.tiktok.com/@${PRIMARY_HANDLE}` },
];

const archiveCards = [
  { image: '/archive-dashboard.jpg', label: 'لوحة بيانات', detail: 'Dashboard / data view', tone: 'wide' },
  { image: '/archive-big-database.jpg', label: 'منتج بيانات', detail: 'Big database / lead intelligence', tone: 'square' },
  { image: '/archive-shopify-growth.jpg', label: 'نمو التجارة', detail: 'Shopify / growth workflow', tone: 'square' },
  { image: '/archive-tools-stack.jpg', label: 'أدوات التسويق', detail: 'Tools / campaign stack', tone: 'wide' },
  { image: '/archive-whatsapp-api.jpg', label: 'واتساب وAPI', detail: 'WhatsApp / automation', tone: 'wide' },
  { image: '/archive-crm-dashboard.jpg', label: 'تشغيل CRM', detail: 'CRM / pipeline operations', tone: 'wide' },
  { image: '/archive-data-seller.jpg', label: 'بيع البيانات', detail: 'Data product / offer', tone: 'wide' },
  { image: '/archive-lead-extraction.jpg', label: 'استخراج العملاء', detail: 'Lead extraction / research', tone: 'tall' },
  { image: '/archive-automation-diagram.jpg', label: 'خريطة الأتمتة', detail: 'Automation map', tone: 'wide' },
  { image: '/archive-openai-workflow.jpg', label: 'سير شغل ذكي', detail: 'AI / messaging workflow', tone: 'tall' },
  { image: '/archive-whatsapp-plans.jpg', label: 'خطط المراسلة', detail: 'Messaging plans', tone: 'square' },
  { image: '/archive-chatbot-system.jpg', label: 'نظام محادثة', detail: 'Chatbot / business system', tone: 'wide' },
];

const productCatalog = [
  { image: '/wpfunnels-offer.jpg', name: 'WPFunnels Lifetime License', arName: 'ترخيص WPFunnels مدى الحياة', description: 'بناء مسارات بيع وCheckout وUpsell لمواقع WordPress وWooCommerce.', price: '$249 USD', priceNote: 'السعر الظاهر في المادة المرفقة', tag: 'ترخيص جاهز' },
  { image: '/lead-generation-tool.jpg', name: 'Ultra Facebook Lead Generation', arName: 'أداة استخراج عملاء من فيسبوك', description: 'أداة بحث وتجميع تساعدك تنظم بيانات العملاء المحتملين قبل المتابعة.', price: 'حسب الباقة', priceNote: 'يتحدد حسب الاستخدام والترخيص', tag: 'منتج بيانات' },
  { image: '/archive-big-database.jpg', name: 'Big Database CSV', arName: 'حزمة Big Database CSV', description: 'حزمة بيانات كبيرة للاستخدام في البحث وبناء قوائم الاستهداف، بعد تحديد السوق المطلوب.', price: 'اطلب التسعيرة', priceNote: 'حسب الدولة والحجم ونوع البيانات', tag: 'بيانات' },
  { image: '/archive-whatsapp-api.jpg', name: 'WhatsApp Automation Suite', arName: 'باقة أتمتة واتساب', description: 'تصميم متابعة ورسائل وعمليات تسليم بين واتساب والفريق، حسب السيناريو.', price: 'حسب النطاق', priceNote: 'تسعير بعد فهم الـworkflow', tag: 'أتمتة' },
  { image: '/archive-crm-dashboard.jpg', name: 'CRM & Pipeline Setup', arName: 'تجهيز CRM ومسار متابعة', description: 'ترتيب مراحل العميل، الحقول، المتابعة، والتقارير في نظام واضح للفريق.', price: 'اطلب عرض سعر', priceNote: 'يتحدد حسب الأدوات وعدد المستخدمين', tag: 'تشغيل' },
  { image: '/archive-chatbot-system.jpg', name: 'Chatbot Business System', arName: 'نظام شات بوت للشغل', description: 'تحويل الأسئلة المتكررة وجمع البيانات إلى رحلة محادثة قابلة للقياس.', price: 'حسب السيناريو', priceNote: 'بعد مراجعة القنوات والرسائل', tag: 'نظام' },
];

const videoCatalogUrl = import.meta.env.VITE_VIDEO_CATALOG_URL as string | undefined;

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'AR' | 'RU'>(() => {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang')?.toUpperCase();
    if (requestedLanguage === 'AR' || requestedLanguage === 'RU') return requestedLanguage;
    try {
      const savedLanguage = window.localStorage.getItem('ahmed-platform-language')?.toUpperCase();
      return savedLanguage === 'AR' || savedLanguage === 'RU' ? savedLanguage : 'AR';
    } catch {
      return 'AR';
    }
  });
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isArabic = language === 'AR';
  const isRussian = language === 'RU';

  useEffect(() => {
    document.documentElement.dir = language === 'AR' ? 'rtl' : 'ltr';
    document.documentElement.lang = language === 'AR' ? 'ar' : language === 'RU' ? 'ru' : 'en';
    try {
      window.localStorage.setItem('ahmed-platform-language', language);
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
  }, [language]);

  useEffect(() => {
    if (!consultationOpen) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const getFocusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'));
    getFocusable()[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setConsultationOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const currentFocusable = getFocusable();
      if (!currentFocusable.length) return;
      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener('keydown', trapFocus);
    return () => {
      dialog.removeEventListener('keydown', trapFocus);
      previouslyFocusedRef.current?.focus();
    };
  }, [consultationOpen]);

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

  const openConsultation = (product = '') => {
    setSubmitted(false);
    setSubmissionError('');
    setSelectedProduct(product);
    setConsultationOpen(true);
  };

  const handleConsultationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmissionError('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await submitLead(values);
      setSubmitted(true);
    } catch {
      setSubmissionError(isArabic ? 'تعذر حفظ الطلب حالياً. حاول مرة أخرى أو تواصل مباشرة.' : isRussian ? 'Не удалось сохранить запрос. Попробуйте ещё раз или свяжитесь напрямую.' : 'We could not save your request right now. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
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
              <span className="mono mt-1 block text-[9px] tracking-[.16em] text-muted-foreground">MARKETING / DATA / AUTOMATION</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-primary" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
                {isArabic ? item.ar : isRussian ? item.label === 'Ecosystem' ? 'Экосистема' : item.label === 'Growth systems' ? 'Системы роста' : item.label === 'Integrations' ? 'Интеграции' : item.label === 'Social studio' ? 'Социальная студия' : item.label === 'Knowledge' ? 'Знания' : item.label === 'Reviews' ? 'Отзывы' : 'Об Ахмеде' : item.label}
              </a>
            ))}
            <a href="/courses" className="text-[11px] font-bold uppercase tracking-[.14em] text-secondary transition-colors hover:text-primary">{isArabic ? 'الكورسات' : isRussian ? 'Курсы' : 'Courses'}</a>
            <a href="/register" className="text-[11px] font-bold uppercase tracking-[.14em] text-muted-foreground transition-colors hover:text-primary">{isArabic ? 'التسجيل' : isRussian ? 'Регистрация' : 'Register'}</a>
            <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="text-[11px] font-bold uppercase tracking-[.14em] text-secondary transition-colors hover:text-primary">{isArabic ? 'الموقع الرسمي' : isRussian ? 'Официальный сайт' : 'Official site'}</a>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-1 border-r border-border pr-4" aria-label={isArabic ? 'اختيار اللغة' : isRussian ? 'Выбор языка' : 'Language switcher'}>
              {[{ code: 'EN', label: 'EN' }, { code: 'AR', label: 'عربي' }, { code: 'RU', label: 'RU' }].map((item) => (
                <button key={item.code} type="button" onClick={() => setLanguage(item.code as 'EN' | 'AR' | 'RU')} className={`px-1.5 py-1 text-[10px] font-bold tracking-[.12em] transition-colors ${language === item.code ? 'text-secondary' : 'text-muted-foreground hover:text-primary'}`} data-testid={`button-language-${item.code.toLowerCase()}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => openConsultation()} className="group flex items-center gap-2 bg-primary px-4 py-2.5 text-[10px] font-bold uppercase tracking-[.13em] text-primary-foreground transition-all hover:bg-accent" data-testid="button-header-consultation">
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
                  {isArabic ? item.ar : isRussian ? item.label === 'Ecosystem' ? 'Экосистема' : item.label === 'Growth systems' ? 'Системы роста' : item.label === 'Integrations' ? 'Интеграции' : item.label === 'Social studio' ? 'Социальная студия' : item.label === 'Knowledge' ? 'Знания' : item.label === 'Reviews' ? 'Отзывы' : 'Об Ахмеде' : item.label}<ArrowUpRight size={14} className="text-secondary" />
                </a>
              ))}
              <a href="/courses" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-border pb-3 text-xs font-bold uppercase tracking-[.13em] text-secondary">{isArabic ? 'الكورسات' : isRussian ? 'Курсы' : 'Courses'}<ArrowUpRight size={14} /></a>
              <a href="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-border pb-3 text-xs font-bold uppercase tracking-[.13em] text-primary">{isArabic ? 'التسجيل' : isRussian ? 'Регистрация' : 'Register'}<ArrowUpRight size={14} /></a>
              <a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-border pb-3 text-xs font-bold uppercase tracking-[.13em] text-secondary">{isArabic ? 'الموقع الرسمي' : isRussian ? 'Официальный сайт' : 'Official site'}<ArrowUpRight size={14} /></a>
            </nav>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {[{ code: 'EN', label: 'EN' }, { code: 'AR', label: 'عربي' }, { code: 'RU', label: 'RU' }].map((item) => (
                  <button key={item.code} type="button" onClick={() => setLanguage(item.code as 'EN' | 'AR' | 'RU')} className={`border px-2.5 py-1.5 text-[10px] font-bold tracking-[.12em] ${language === item.code ? 'border-secondary bg-secondary text-primary' : 'border-border text-muted-foreground'}`} data-testid={`button-mobile-language-${item.code.toLowerCase()}`}>{item.label}</button>
                ))}
              </div>
              <button type="button" onClick={() => openConsultation()} className="bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-[.11em] text-primary-foreground" data-testid="button-mobile-consultation">{isArabic ? 'ابدأ محادثة' : isRussian ? 'Начать разговор' : 'Start a conversation'}</button>
            </div>
          </div>
        )}
      </header>

      <section id="top" className="relative border-b border-border pt-[72px]">
        <div className="mx-auto grid min-h-[700px] max-w-[1360px] grid-cols-1 items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:py-28">
          <div className="relative z-10">
            <div className="reveal mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-secondary" />
              <span className="mono text-[10px] font-medium tracking-[.2em] text-secondary">{isArabic ? 'تسويق وبيانات وأتمتة من مكان واحد' : isRussian ? 'СТРАТЕГИЧЕСКАЯ ЦИФРОВАЯ ПЛАТФОРМА' : 'A STRATEGIC DIGITAL PLATFORM'}</span>
            </div>
            <h1 className="hero-title display reveal reveal-delay-1 max-w-full text-[clamp(3.2rem,8vw,7.9rem)] font-extrabold leading-[.88] text-primary">
              {isArabic ? (
                <>نظبط <span className="text-accent">التسويق.</span><br />نبيع البيانات.<br /><span className="text-secondary">نأتمت الشغل.</span><br />ونعلّمك.</>
              ) : isRussian ? (
                <>Маркетинг.<br /><span className="text-accent">Данные.</span><br /><span className="text-secondary">Автоматизация.</span><br />Обучение.</>
              ) : (
                <>Marketing.<br /><span className="text-accent">Data products.</span><br /><span className="text-secondary">Automation.</span><br />Courses.</>
              )}
            </h1>
            <p className="reveal reveal-delay-2 mt-9 max-w-[510px] text-[15px] leading-7 text-muted-foreground">
              {isArabic ? 'بنحوّل اللي شافك لعميل محتمل، والبيانات لمنتج، والشغل المتكرر لأتمتة، والخبرة لكورس تقدر تطبقه.' : isRussian ? 'Превращаем внимание в спрос, данные в продукт, повторяющиеся задачи в автоматизацию, а опыт в практические курсы.' : 'Turn attention into demand, data into a product, repeated work into automation, and experience into practical courses.'}
            </p>
            <div className="reveal reveal-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => openConsultation()} className="group flex items-center justify-center gap-3 bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-all hover:bg-accent" data-testid="button-hero-consultation">
                {isArabic ? 'خلّينا نبني نظامك' : isRussian ? 'Запросить систему роста' : 'Request a growth system'} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
              <a href="#ecosystem" className="group flex items-center justify-center gap-3 border border-primary/20 px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary transition-colors hover:border-secondary" data-testid="link-hero-ecosystem">
                {isArabic ? 'شوف بنشتغل إزاي' : isRussian ? 'Изучить экосистему' : 'Explore the ecosystem'} <ArrowDownRight size={16} className="transition-transform group-hover:translate-y-1" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[560px] lg:justify-self-end">
            <img src="/ahmed-el-sayed-portrait.jpg" alt="Ahmed El Sayed" className="absolute inset-[15%] z-0 h-[70%] w-[70%] rounded-[2rem] object-cover object-center opacity-95 shadow-[0_25px_70px_hsl(var(--primary)/.18)]" />
            <div className="absolute inset-[8%] rounded-full border border-secondary/30" />
            <div className="absolute inset-[20%] rounded-full border border-accent/35" />
            <div className="network-orbit absolute inset-[8%] rounded-full border border-dashed border-secondary/40">
              <span className="absolute left-[13%] top-[3%] h-3 w-3 rounded-full bg-secondary shadow-[0_0_0_7px_hsl(var(--secondary)/.14)]" />
              <span className="absolute bottom-[9%] right-[15%] h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
            <div className="network-orbit-reverse absolute inset-[20%] rounded-full border border-dashed border-accent/35">
              <span className="absolute right-[14%] top-[7%] h-2 w-2 rounded-full bg-secondary" />
            </div>
            <div className="absolute bottom-[8%] left-[8%] z-10 flex items-center gap-3 border border-secondary/50 bg-background/90 px-3 py-2 shadow-[0_12px_28px_hsl(var(--primary)/.12)] backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <div>
                <span className="mono block text-[8px] tracking-[.18em] text-secondary">{isArabic ? 'نظام شغال' : isRussian ? 'РАБОЧАЯ СИСТЕМА' : 'WORKING SYSTEM'}</span>
                <span className="mt-0.5 block text-[11px] font-bold text-primary">{isArabic ? 'تسويق • بيانات • أتمتة' : isRussian ? 'Маркетинг • данные • автоматизация' : 'Marketing • data • automation'}</span>
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
            {['Marketing', 'Data products', 'Automation', 'Courses'].map((item, index) => (
              <div key={item} className={`reveal-on-scroll flex items-center gap-3 py-5 ${index < 3 ? 'border-r border-border' : ''} ${index > 0 ? 'pl-4 sm:pl-7' : ''}`}>
                <span className="mono text-[10px] text-secondary">0{index + 1}</span>
                <span className="text-[10px] font-bold uppercase tracking-[.12em] text-muted-foreground">{isArabic ? ['التسويق', 'منتجات البيانات', 'الأتمتة', 'الكورسات'][index] : isRussian ? ['Маркетинг', 'Продукты данных', 'Автоматизация', 'Курсы'][index] : item}</span>
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
              <h2 className="display mt-6 max-w-[430px] text-5xl font-extrabold leading-[.93] tracking-[-.06em] sm:text-6xl">{isArabic ? <>بصّة واحدة.<br /><span className="text-secondary">كذا حل.</span></> : isRussian ? <>Одна перспектива.<br /><span className="text-secondary">Много двигателей.</span></> : <>One perspective.<br /><span className="text-secondary">Many engines.</span></>}</h2>
              <p className="mt-7 max-w-[360px] text-sm leading-7 text-primary-foreground/65">{isArabic ? 'بنظبط التسويق والبيانات والأتمتة والتعليم مع بعض، عشان كل خطوة في شغلك تبقى واضحة وليها متابعة.' : isRussian ? 'Работа движется между маркетингом, данными, автоматизацией и обучением, где каждому коммерческому шагу нужны сообщение, путь и follow-up.' : 'The work moves between marketing, data, automation, and education, where every commercial step needs a message, a path, and reliable follow-up.'}</p>
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
              <h2 className="display mt-5 max-w-[660px] text-5xl font-extrabold leading-[.95] tracking-[-.06em] text-primary sm:text-7xl">{isArabic ? <>خطة واضحة<br /><span className="text-accent">تشتغل على أرض الواقع.</span></> : isRussian ? <>Стратегия, которая<br /><span className="text-accent">работает в реальности.</span></> : <>Strategy that can<br /><span className="text-accent">touch the ground.</span></>}</h2>
            </div>
            <p className="reveal-on-scroll max-w-[305px] text-sm leading-6 text-muted-foreground">{isArabic ? 'مش كلام حلو وخلاص. بنرتب قرارات وأدوات وخطوات تقدر تشغلها في شغلك من بكرة.' : isRussian ? 'Полезная система — это не презентация. Это последовательность решений, инструментов и действий для реальной рабочей среды.' : 'A useful system is not a slide deck. It is a sequence of clear decisions, tools, and actions built for the real operating environment.'}</p>
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
            {[...platforms, ...platforms].map((platform, index) => {
              const Icon = platform.Icon;
              return (
                <span key={`${platform.name}-${index}`} className="platform-chip">
                  <Icon aria-hidden="true" className="platform-icon" size={19} />
                  <span>{platform.name}</span>
                </span>
              );
            })}
          </div>
        </div>
        <div className="platform-marquee border-b border-primary-foreground/15" aria-label={isArabic ? 'أدوات المسوقين المحترفين' : isRussian ? 'Инструменты профессиональных маркетологов' : 'Professional marketing tools'}>
          <div className="platform-track platform-track--reverse">
            {[...professionalMarketingStack, ...professionalMarketingStack].map((platform, index) => {
              const Icon = platform.Icon;
              return (
                <span key={`${platform.name}-${index}`} className="platform-chip">
                  <Icon aria-hidden="true" className="platform-icon" size={19} />
                  <span>{platform.name}</span>
                </span>
              );
            })}
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
                <span className="mono text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'المواد الجاية / ملفاتك الأصلية' : isRussian ? 'ВХОДЯЩИЕ МАТЕРИАЛЫ / ОРИГИНАЛЬНЫЕ ФАЙЛЫ' : 'INCOMING ASSETS / ORIGINAL FILES'}</span>
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
                      <span className="mono text-[9px] tracking-[.16em] text-muted-foreground">{channel.href ? (isArabic ? 'القناة الرسمية' : isRussian ? 'ОФИЦИАЛЬНЫЙ КАНАЛ' : 'OFFICIAL CHANNEL') : (isArabic ? 'قريباً' : isRussian ? 'СКОРО' : 'COMING SOON')}</span>
                    </div>
                    <h3 className="display mt-14 text-2xl font-extrabold tracking-[-.04em] text-primary">{isArabic ? channel.ar : isRussian ? channel.ru : channel.name}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{channel.href ? (isArabic ? 'شوف المحتوى' : isRussian ? 'Смотреть контент' : 'View content') : (isArabic ? 'هنضيفه قريب' : isRussian ? 'Добавим позже' : 'Coming soon')}</p>
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
          <div className="mt-16 grid gap-8 border-t border-border pt-12 lg:grid-cols-[1.35fr_.65fr] lg:items-start">
            <figure className="overflow-hidden border border-border bg-card shadow-[0_20px_55px_hsl(var(--primary)/.08)]">
              <img src="/ahmed-brand-header.jpg" alt="البانر الرسمي لأحمد السيد عن التسويق والأتمتة" className="pointer-events-none block h-auto w-full select-none" draggable="false" loading="lazy" />
            </figure>
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? 'بانر واحد / استخدام واحد' : isRussian ? 'ОДИН БАННЕР / ОДНО ИСПОЛЬЗОВАНИЕ' : 'ONE BANNER / ONE USE'}</span>
              <h3 className="display mt-4 text-4xl font-extrabold leading-[.95] tracking-[-.06em] text-primary">{isArabic ? <>المحتوى الحقيقي<br /><span className="text-secondary">من شغلك.</span></> : isRussian ? <>Реальный контент<br /><span className="text-secondary">из вашей работы.</span></> : <>Real content<br /><span className="text-secondary">from your work.</span></>}</h3>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{isArabic ? 'استخدمنا البانر مرة واحدة فقط، وباقي المساحة مبنية من لقطات ومواد مختلفة من أرشيفك عشان الصفحة تبقى حية من غير تكرار.' : isRussian ? 'Баннер используется один раз, а остальная страница построена из разных материалов вашего архива без повторений.' : 'The banner appears once; the rest of the page uses distinct archive material without repetition.'}</p>
            </div>
          </div>
          <div id="work-archive" className="mt-16 border-t border-border pt-12">
            <div className="reveal-on-scroll flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? 'أرشيف الشغل الحقيقي' : isRussian ? 'АРХИВ РЕАЛЬНОЙ РАБОТЫ' : 'WORK ARCHIVE'}</span>
                <h3 className="display mt-4 max-w-[720px] text-4xl font-extrabold tracking-[-.06em] text-primary sm:text-5xl">{isArabic ? 'كل صورة مرة واحدة. كل واحدة لها مكان.' : isRussian ? 'Каждый визуал один раз. У каждого своё место.' : 'Every visual once. Every one with a role.'}</h3>
              </div>
              <span className="text-sm text-muted-foreground">{isArabic ? 'لقطات أصلية من ملفاتك' : isRussian ? 'Оригиналы из ваших материалов' : 'Originals from your Drive'}</span>
            </div>
            <div className="mt-8 grid auto-rows-[105px] grid-cols-2 gap-3 sm:grid-cols-4 lg:auto-rows-[120px]">
              {archiveCards.map((card, index) => (
                <figure key={card.image} className={`group relative overflow-hidden border border-border bg-card reveal-on-scroll ${card.tone === 'wide' ? 'col-span-2 row-span-2' : card.tone === 'tall' ? 'row-span-3' : 'row-span-2'}`}>
                  <img src={card.image} alt={card.label} className="pointer-events-none h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]" draggable="false" loading="lazy" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-primary/90 via-primary/55 to-transparent px-4 pb-3 pt-10 text-primary-foreground">
                    <span className="text-sm font-bold">{isArabic ? card.label : card.detail}</span>
                    <span className="mono text-[9px] tracking-[.15em] text-secondary">0{index + 1}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="mono text-[9px] tracking-[.16em] text-secondary">{isArabic ? 'كتالوج الفيديو' : isRussian ? 'КАТАЛОГ ВИДЕО' : 'VIDEO CATALOG'}</span>
                <p className="mt-2 text-sm text-muted-foreground">{videoCatalogUrl ? (isArabic ? 'الكتالوج الأصلي جاهز للمشاهدة.' : isRussian ? 'Оригинальный каталог доступен для просмотра.' : 'The original catalog is ready to open.') : (isArabic ? 'لسه مستنيين الكتالوج أو ملفات الفيديو الأصلية.' : isRussian ? 'Ожидается оригинальная ссылка или файлы видео.' : 'Waiting for the original catalog link or video files.')}</p>
              </div>
              {videoCatalogUrl ? <a href={videoCatalogUrl} target="_blank" rel="noreferrer" className="group flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-primary" data-testid="link-video-catalog">{isArabic ? 'افتح الكتالوج' : isRussian ? 'Открыть каталог' : 'Open catalog'} <ArrowUpRight size={15} className="text-secondary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a> : <span className="mono shrink-0 text-[9px] tracking-[.12em] text-muted-foreground">{isArabic ? 'لسه بيتجهز' : isRussian ? 'В ПОДГОТОВКЕ' : 'IN PREPARATION'}</span>}
            </div>
          </div>
        </div>
      </section>

      <section id="clients" className="border-b border-border bg-background">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="flex flex-col justify-between gap-8 border-b border-border pb-12 lg:flex-row lg:items-end">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '07 / المنتجات والعروض' : isRussian ? '07 / ПРОДУКТЫ И ПРЕДЛОЖЕНИЯ' : '07 / PRODUCTS & OFFERS'}</span>
              <h2 className="display mt-5 max-w-[760px] text-5xl font-extrabold leading-[.92] tracking-[-.06em] text-primary sm:text-7xl">{isArabic ? <>منتجات جاهزة<br /><span className="text-secondary">للطلب والتشغيل.</span></> : isRussian ? <>Готовые продукты<br /><span className="text-secondary">для заказа и запуска.</span></> : <>Products ready<br /><span className="text-secondary">to order and run.</span></>}</h2>
            </div>
            <p className="max-w-[360px] text-sm leading-7 text-muted-foreground">{isArabic ? 'اختار المنتج، شوف السعر أو طريقة التسعير، واضغط اطلب المنتج. الطلب بيتحول مباشرة لنموذج متابعة باسم المنتج.' : isRussian ? 'Выберите продукт, посмотрите цену или модель расчёта и отправьте заказ. Запрос попадёт в форму с названием продукта.' : 'Choose a product, review its price model, and send an order request. The selected product is carried into the follow-up form.'}</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {productCatalog.map((product, index) => (
              <article key={product.name} className="reveal-on-scroll group flex flex-col overflow-hidden border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-secondary hover:shadow-[0_18px_45px_hsl(var(--primary)/.1)]">
                <div className="relative overflow-hidden border-b border-border bg-background">
                  <img src={product.image} alt={product.arName} className="block aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" loading="lazy" draggable="false" />
                  <span className="absolute left-3 top-3 bg-primary px-2.5 py-1.5 text-[10px] font-bold text-primary-foreground">0{index + 1} / {product.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="display text-2xl font-extrabold leading-none tracking-[-.05em] text-primary">{isArabic ? product.arName : product.name}</h3>
                  <p className="mt-4 min-h-[66px] text-sm leading-6 text-muted-foreground">{product.description}</p>
                  <div className="mt-6 border-t border-border pt-5">
                    <span className="mono text-[9px] tracking-[.16em] text-secondary">{isArabic ? 'السعر' : isRussian ? 'ЦЕНА' : 'PRICE'}</span>
                    <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2"><strong className="display text-2xl font-extrabold tracking-[-.04em] text-primary">{product.price}</strong><span className="text-[10px] text-muted-foreground">{product.priceNote}</span></div>
                  </div>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => openConsultation(product.arName)} className="group/btn flex items-center justify-center gap-2 bg-primary px-3 py-3.5 text-[11px] font-bold uppercase tracking-[.1em] text-primary-foreground transition-colors hover:bg-accent">{isArabic ? 'اطلب المنتج' : isRussian ? 'Заказать' : 'Order'} <Send size={14} /></button>
                    <button type="button" onClick={() => openConsultation(product.arName)} className="flex items-center justify-center gap-2 border border-primary px-3 py-3.5 text-[11px] font-bold uppercase tracking-[.1em] text-primary transition-colors hover:border-secondary hover:text-secondary">{isArabic ? 'اسأل عن التفاصيل' : isRussian ? 'Подробнее' : 'Ask details'} <ArrowUpRight size={14} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-border pt-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>{isArabic ? 'الشعارات والعملاء المعتمدين هيتضافوا بعد استلام الملفات الأصلية.' : isRussian ? 'Утверждённые логотипы и клиенты будут добавлены после получения оригинальных материалов.' : 'Approved client logos will be added after the original files are supplied.'}</span><button type="button" onClick={() => openConsultation('طلب منتج أو عرض مخصص')} className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-primary">{isArabic ? 'اطلب عرض مخصص' : isRussian ? 'Запросить индивидуальное предложение' : 'Request a custom offer'} <ArrowUpRight size={15} className="text-secondary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></button></div>
        </div>
      </section>

      <section id="reviews" className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '07 / تقييمات حقيقية' : isRussian ? '07 / ОТЗЫВЫ КЛИЕНТОВ' : '07 / VERIFIED REVIEWS'}</span>
              <h2 className="display mt-5 max-w-[650px] text-5xl font-extrabold leading-[.92] tracking-[-.06em] text-primary sm:text-7xl">{isArabic ? <>كلام العملاء<br /><span className="text-accent">من غير فبركة.</span></> : isRussian ? <>Отзывы<br /><span className="text-accent">без выдумок.</span></> : <>Client proof<br /><span className="text-accent">without fiction.</span></>}</h2>
            </div>
            <div className="border border-secondary/40 bg-background p-7 sm:p-9">
              <span className="mono text-[10px] tracking-[.16em] text-secondary">{isArabic ? 'لسه بنجمع المادة الأصلية' : isRussian ? 'СБИРАЕМ ОРИГИНАЛЬНЫЕ МАТЕРИАЛЫ' : 'ORIGINAL MATERIALS NEEDED'}</span>
              <p className="mt-5 text-base leading-8 text-primary">{isArabic ? 'مش هنحط أسماء أو صور أو نجوم من عندنا. أول ما تبعت نص التقييم، اسم صاحبه، بلده، ومصدره، هننزّله هنا زي ما هو وبشكل محترم.' : isRussian ? 'Мы не будем придумывать имена, фотографии или оценки. После получения текста, имени, страны и источника отзыв будет опубликован здесь прозрачно.' : 'We will not invent names, photos, or star ratings. Send the original text, name, country, and source, and we will publish it here transparently.'}</p>
              <button type="button" onClick={() => openConsultation()} className="group mt-7 flex items-center gap-3 bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground hover:bg-accent">{isArabic ? 'ابعت التقييمات' : isRussian ? 'Отправить отзывы' : 'Send the reviews'} <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[.55fr_1.45fr] lg:px-12 lg:py-28">
          <div className="reveal-on-scroll">
            <div className="relative overflow-hidden border border-border bg-card p-3">
              <img src="/ahmed-el-sayed-portrait.jpg" alt="Ahmed El Sayed in a professional portrait" className="aspect-square w-full object-cover object-center" loading="lazy" />
              <div className="absolute bottom-6 left-6 bg-primary px-3 py-2 text-primary-foreground"><span className="mono text-[9px] tracking-[.16em]">AHMED EL SAYED</span></div>
            </div>
            <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '08 / التوقيع' : isRussian ? '08 / ПОДПИСЬ' : '08 / THE SIGNATURE'}</span>
            <div className="mt-8 h-px w-20 bg-secondary" />
          </div>
          <div className="reveal-on-scroll">
            <blockquote className="display max-w-[850px] text-4xl font-extrabold leading-[1.04] tracking-[-.055em] text-primary sm:text-6xl">
              {isArabic ? <>“نحوّل الانتباه إلى طلب، والبيانات إلى منتج، والعمل المتكرر إلى <span className="text-secondary">أتمتة.</span>”</> : isRussian ? <>«Превращаем внимание в спрос, данные в продукт, а повторяющуюся работу — в <span className="text-secondary">автоматизацию.»</span></> : <>“Turn attention into demand, data into products, and repeated work into <span className="text-secondary">automation.</span>”</>}
            </blockquote>
            <div className="mt-10 grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
              <p className="text-sm leading-7 text-muted-foreground">{isArabic ? 'يعمل أحمد السيد في تقاطع التسويق وبيع منتجات البيانات والأتمتة والتعليم العملي، مع تركيز على تحويل الاهتمام إلى نتائج قابلة للمتابعة.' : isRussian ? 'Ахмед Эль-Сайед работает на пересечении маркетинга, продуктов данных, автоматизации и практического обучения, превращая внимание в измеримый follow-up.' : 'Ahmed El Sayed works across marketing, data products, automation, and practical education, with a focus on turning attention into measurable follow-up.'}</p>
              <p className="text-sm leading-7 text-muted-foreground">{isArabic ? 'كل خدمة تبدأ من احتياج واضح: حملة ومسار تحويل، حزمة بيانات، سير عمل مؤتمت، أو كورس يساعد الفريق على تنفيذ النظام بنفسه.' : isRussian ? 'Каждая услуга начинается с понятной задачи: кампания и воронка, пакет данных, автоматизированный workflow или курс, который помогает команде запустить систему самостоятельно.' : 'Each service starts with a clear need: a campaign and funnel, a data package, an automated workflow, or a course that helps a team operate the system itself.'}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="connect" className="bg-secondary text-primary">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-12 lg:py-24">
          <div className="reveal-on-scroll">
            <span className="mono text-[10px] tracking-[.2em] text-primary/60">{isArabic ? '09 / الخطوة التالية' : isRussian ? '09 / СЛЕДУЮЩИЙ ШАГ' : '09 / NEXT MOVE'}</span>
            <h2 className="display mt-5 max-w-[720px] text-5xl font-extrabold leading-[.9] tracking-[-.065em] sm:text-7xl">{isArabic ? <>أحضر سؤالك.<br />وابنِ النظام التالي.</> : isRussian ? <>Принесите вопрос.<br />Постройте следующую систему.</> : <>Bring the question.<br />Build the next system.</>}</h2>
            <p className="mt-7 max-w-[470px] text-sm leading-6 text-primary/70">{isArabic ? 'أخبرنا بما تحاول ربطه أو توضيحه أو تطويره. الخطوة الأولى محادثة مفيدة — وليست التزاماً.' : isRussian ? 'Расскажите, что вы хотите связать, прояснить или развить. Первый шаг — полезный разговор, а не обязательство.' : 'Tell us what you are trying to connect, clarify, or grow. The first step is a useful conversation — not a commitment.'}</p>
          </div>
          <div className="reveal-on-scroll flex flex-col gap-3 sm:flex-row md:flex-col">
            <button type="button" onClick={() => openConsultation()} className="group flex items-center justify-between gap-8 bg-primary px-5 py-4 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-colors hover:bg-accent" data-testid="button-connect-consultation">
              {isArabic ? 'اطلب استشارة' : isRussian ? 'Запросить консультацию' : 'Request a consultation'} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            {WHATSAPP_NUMBER ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-8 border border-primary/30 px-5 py-4 text-xs font-bold uppercase tracking-[.12em] transition-colors hover:border-primary" data-testid="link-connect-whatsapp">
                <span className="flex items-center gap-2"><MessageCircle size={15} /> {isArabic ? 'تواصل عبر واتساب' : isRussian ? 'Связаться в WhatsApp' : 'WhatsApp contact'}</span><ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            ) : (
              <button type="button" onClick={() => openConsultation()} className="group flex items-center justify-between gap-8 border border-primary/30 px-5 py-4 text-left text-xs font-bold uppercase tracking-[.12em] transition-colors hover:border-primary" data-testid="button-connect-whatsapp-fallback">
                <span className="flex items-center gap-2"><MessageCircle size={15} /> {isArabic ? 'اطلب محادثة' : isRussian ? 'Запросить разговор' : 'Request a conversation'}</span><ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            )}
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
          <div ref={dialogRef} className="relative max-h-[92dvh] w-full max-w-[580px] overflow-auto bg-background p-6 shadow-2xl sm:p-9">
            <button type="button" onClick={() => setConsultationOpen(false)} className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-border text-primary transition-colors hover:border-secondary hover:text-secondary" aria-label="Close consultation form" data-testid="button-close-consultation"><X size={17} /></button>
             {!submitted ? (
              <>
                  <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? 'محادثة أولى مفيدة' : isRussian ? 'ПЕРВЫЙ ПОЛЕЗНЫЙ РАЗГОВОР' : 'A USEFUL FIRST CONVERSATION'}</span>
                  <h2 id="consultation-title" className="display mt-5 max-w-[440px] text-4xl font-extrabold leading-[.95] tracking-[-.06em] text-primary">{isArabic ? 'ما الذي تحاول ربطه أو تطويره؟' : isRussian ? 'Что вы хотите связать или развить?' : 'What are you trying to connect or grow?'}</h2>
                  <p className="mt-4 max-w-[440px] text-sm leading-6 text-muted-foreground">{isArabic ? 'سيتم حفظ طلبك في مساحة المتابعة الخاصة بالمشروع.' : isRussian ? 'Ваш запрос будет сохранён в рабочем пространстве проекта.' : 'Your request will be saved to the project follow-up workspace.'}</p>
                  {selectedProduct && <div className="mt-5 border border-secondary/50 bg-secondary/10 px-4 py-3 text-sm text-primary"><span className="mono block text-[9px] tracking-[.14em] text-secondary">{isArabic ? 'المنتج المطلوب' : isRussian ? 'ВЫБРАННЫЙ ПРОДУКТ' : 'SELECTED PRODUCT'}</span><strong className="mt-1 block">{selectedProduct}</strong></div>}
                  <form onSubmit={handleConsultationSubmit} className="mt-8 space-y-4">
                    <input type="hidden" name="formType" value="consultation" />
                    <input type="hidden" name="product" value={selectedProduct} />
                    <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'الاسم' : isRussian ? 'ВАШЕ ИМЯ' : 'YOUR NAME'}</span><input required name="name" className="w-full border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder={isArabic ? 'الاسم' : isRussian ? 'Имя' : 'Name'} data-testid="input-consultation-name" /></label>
                    <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'وسيلة التواصل' : isRussian ? 'КАНАЛ СВЯЗИ' : 'CONTACT CHANNEL'}</span><input required name="contact" className="w-full border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder={isArabic ? 'البريد الإلكتروني أو واتساب' : isRussian ? 'Email или WhatsApp' : 'Email or WhatsApp'} data-testid="input-consultation-contact" /></label>
                    <label className="block"><span className="mono mb-2 block text-[9px] tracking-[.14em] text-muted-foreground">{isArabic ? 'السؤال' : isRussian ? 'ВОПРОС' : 'THE QUESTION'}</span><textarea required name="question" rows={4} className="w-full resize-none border border-border bg-card px-3 py-3 text-sm outline-none transition-colors focus:border-secondary" placeholder={isArabic ? 'اكتب نبذة عن الفرصة أو النظام...' : isRussian ? 'Несколько слов о возможности или системе...' : 'A few words about the opportunity or system...'} data-testid="input-consultation-question" /></label>
                    {submissionError && <p role="alert" className="text-sm leading-6 text-destructive">{submissionError}</p>}
                    <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-3 bg-primary px-4 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-consultation">{submitting ? (isArabic ? 'جارٍ الحفظ...' : isRussian ? 'Сохранение...' : 'Saving...') : isArabic ? 'تابع المحادثة' : isRussian ? 'Продолжить разговор' : 'Keep the conversation moving'} <Send size={15} className="transition-transform group-hover:translate-x-1" /></button>
                </form>
              </>
            ) : (
              <div className="py-10">
                <div className="flex h-12 w-12 items-center justify-center bg-secondary text-primary"><Check size={23} /></div>
                  <h2 className="display mt-7 text-4xl font-extrabold leading-none tracking-[-.06em] text-primary">{isArabic ? 'تم حفظ السؤال.' : isRussian ? 'Вопрос принят.' : 'The question is captured.'}</h2>
                  <p className="mt-4 max-w-[400px] text-sm leading-6 text-muted-foreground">{isArabic ? 'تم حفظ طلبك في مساحة المتابعة. سنعود إليك بالخطوة المناسبة.' : isRussian ? 'Ваш запрос сохранён. Мы вернёмся к вам со следующим шагом.' : 'Your request is saved. We will follow up with the right next step.'}</p>
                  <button type="button" onClick={() => setConsultationOpen(false)} className="mt-8 border border-primary px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground" data-testid="button-close-confirmation">{isArabic ? 'العودة إلى المنصة' : isRussian ? 'Вернуться на платформу' : 'Return to platform'}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

const courses = [
  { slug: 'marketing-funnels', title: 'Marketing & Funnels', arTitle: 'التسويق ومسارات التحويل', type: 'Cohort course', arType: 'كورس جماعي', description: 'Build a practical acquisition and conversion system around your real offer.', arDescription: 'ابنِ نظام اكتساب وتحويل عملياً حول عرضك الحقيقي.', modules: ['Offer and audience clarity', 'Content-to-conversation journeys', 'Measurement and iteration'] },
  { slug: 'data-products', title: 'Data Products', arTitle: 'منتجات البيانات', type: 'Workshop', arType: 'ورشة عمل', description: 'Package lead intelligence into useful, responsible products for prospecting and sales.', arDescription: 'حوّل بيانات العملاء المحتملين إلى منتجات مفيدة ومسؤولة للتنقيب والمبيعات.', modules: ['Data packaging', 'Targeting and segmentation', 'Quality and use cases'] },
  { slug: 'automation-ops', title: 'Automation Operations', arTitle: 'تشغيل الأتمتة', type: 'Practical lab', arType: 'مختبر عملي', description: 'Connect CRM, WhatsApp, email, and no-code workflows so follow-up keeps moving.', arDescription: 'اربط CRM وواتساب والإيميل والأتمتة بدون كود حتى تستمر المتابعة.', modules: ['Workflow mapping', 'Automation boundaries', 'Operating dashboards'] },
];

function PageShell({ children }: { children: ReactNode }) {
  return <main className="min-h-[100dvh] bg-background text-primary"><header className="border-b border-border bg-background"><div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"><a href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center border border-secondary bg-primary text-secondary"><span className="display text-lg font-extrabold">A</span></span><span className="text-[13px] font-extrabold tracking-[.18em]">AHMED EL SAYED</span></a><nav className="flex flex-wrap items-center gap-4 text-[11px] font-bold uppercase tracking-[.13em]"><a href="/services" className="text-muted-foreground hover:text-primary">الخدمات</a><a href="/data-products" className="text-muted-foreground hover:text-primary">البيانات</a><a href="/automation" className="text-muted-foreground hover:text-primary">الأتمتة</a><a href="/courses" className="text-secondary">الكورسات</a><a href="/register" className="text-muted-foreground hover:text-primary">التسجيل</a><a href={OFFICIAL_SITE_URL} target="_blank" rel="noreferrer" className="text-secondary">الموقع الرسمي</a></nav></div></header>{children}<footer className="border-t border-border bg-primary px-5 py-8 text-[11px] text-primary-foreground/60 sm:px-8"><div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-3"><span>AHMED EL SAYED</span><a href="/" className="hover:text-primary-foreground">الرجوع للمنصة</a></div></footer></main>;
}

const servicePages = {
  services: { eyebrow: 'الخدمات', title: <>خلّي التسويق<br /><span className="text-secondary">يشتغل بجد.</span></>, intro: 'لو عندك عرض كويس بس الناس مش فاهمة قيمته، بنرتب الرسالة والمسار والمتابعة عشان الاهتمام يتحول لفرص حقيقية.', items: ['تحديد العرض والجمهور', 'بناء صفحات ومسارات تحويل', 'تجهيز متابعة على واتساب وCRM', 'قياس النتايج وتحسينها'] },
  data: { eyebrow: 'منتجات البيانات', title: <>بيانات أنضف.<br /><span className="text-secondary">قرارات أسرع.</span></>, intro: 'بننظم بيانات العملاء المحتملين في منتجات مفهومة تساعدك تستهدف الصح وتقلل الوقت الضايع في البحث العشوائي.', items: ['تجميع وتنظيم البيانات', 'تقسيم الجمهور حسب الهدف', 'مراجعة الجودة والاستخدام', 'تسليم ملفات جاهزة للتشغيل'] },
  automation: { eyebrow: 'الأتمتة', title: <>خلّي المتابعة<br /><span className="text-secondary">تمشي لوحدها.</span></>, intro: 'بنربط النماذج وواتساب والإيميل وCRM في سير شغل واضح، مع نقطة تسليم للإنسان وقت ما الموضوع يحتاجه.', items: ['رسم خطوات الشغل', 'ربط الأدوات والـwebhooks', 'رسائل ومتابعات آلية', 'لوحة قياس وتشغيل'] },
  about: { eyebrow: 'عن أحمد', title: <>خبرة عملية<br /><span className="text-secondary">مش كلام تنظير.</span></>, intro: 'أحمد السيد بيشتغل في التسويق وبيع منتجات البيانات والأتمتة والتعليم العملي، وبيحوّل التحدي التجاري لنظام مفهوم قابل للتشغيل.', items: ['Marketing & growth', 'Lead generation & data products', 'CRM وWhatsApp automation', 'كورسات عملية للفرق والأفراد'] },
} as const;

function ServicePage({ page }: { page: keyof typeof servicePages }) {
  const content = servicePages[page];
  return <PageShell><section className="mx-auto max-w-[1180px] px-5 pb-20 pt-20 sm:px-8 sm:pt-28"><span className="mono text-[10px] tracking-[.2em] text-secondary">{content.eyebrow}</span><h1 className="display mt-5 max-w-[780px] text-6xl font-extrabold leading-[.9] tracking-[-.07em] sm:text-8xl">{content.title}</h1><p className="mt-8 max-w-[650px] text-base leading-8 text-muted-foreground">{content.intro}</p><div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">{content.items.map((item, index) => <article key={item} className="bg-background p-6"><span className="mono text-[10px] text-secondary">0{index + 1}</span><h2 className="display mt-12 text-2xl font-extrabold tracking-[-.04em]">{item}</h2><span className="mt-8 block h-px w-10 bg-secondary" /></article>)}</div><div className="mt-14 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-[520px] text-sm leading-7 text-muted-foreground">الصفحة دي معمولة كهيكل نكمله بالتفاصيل، الأسعار، الحالات، والأسئلة الشائعة بعد ما نثبت المحتوى النهائي.</p><a href="/register" className="group flex items-center gap-3 bg-primary px-5 py-3.5 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground hover:bg-accent">ابدأ بسؤالك <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a></div></section></PageShell>;
}

function CoursesPage() {
  return <PageShell><section className="mx-auto max-w-[1180px] px-5 pb-16 pt-20 sm:px-8 sm:pt-28"><span className="mono text-[10px] tracking-[.2em] text-secondary">مسار التعلم / LEARNING PATH</span><h1 className="display mt-5 max-w-[780px] text-6xl font-extrabold leading-[.9] tracking-[-.07em] sm:text-8xl">اتعلم الصح.<br /><span className="text-secondary">وابني نظامك.</span></h1><p className="mt-8 max-w-[620px] text-base leading-8 text-muted-foreground">الكورسات دي مش مكتبة كلام. كل مسار بيحوّل مشكلة حقيقية عندك لخطوات ونظام تقدر تشغله وتقيسه.</p><div className="mt-14 grid gap-5 lg:grid-cols-3">{courses.map((course, index) => <article key={course.slug} className="flex flex-col border border-border bg-card p-6"><span className="mono text-[10px] tracking-[.18em] text-secondary">0{index + 1} / {course.arType}</span><h2 className="display mt-8 text-3xl font-extrabold leading-none tracking-[-.05em]">{course.arTitle}<span className="mt-2 block text-base font-medium tracking-normal text-muted-foreground">{course.title}</span></h2><p className="mt-5 text-sm leading-7 text-muted-foreground">{course.arDescription}</p><ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm">{course.modules.map((module) => <li key={module} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-secondary" />{module}</li>)}</ul><a href={`/register?course=${course.slug}`} className="mt-8 flex items-center justify-between bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground hover:bg-accent">سجّل اهتمامك <ArrowUpRight size={15} /></a></article>)}</div></section></PageShell>;
}

function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [course, setCourse] = useState(() => new URLSearchParams(window.location.search).get('course') || 'marketing-funnels');
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try { await submitLead(Object.fromEntries(new FormData(event.currentTarget).entries())); setSubmitted(true); } catch { setError('تعذر حفظ التسجيل حالياً. تحقق من إعدادات الربط وحاول مرة أخرى.'); } finally { setSubmitting(false); }
  };
  return <PageShell><section className="mx-auto grid max-w-[1180px] gap-12 px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[.9fr_1.1fr]"><div><span className="mono text-[10px] tracking-[.2em] text-secondary">التسجيل / REGISTRATION</span><h1 className="display mt-5 text-6xl font-extrabold leading-[.9] tracking-[-.07em] sm:text-8xl">اختار خطوتك<br /><span className="text-secondary">الجاية.</span></h1><p className="mt-8 max-w-[460px] text-base leading-8 text-muted-foreground">سجّل اهتمامك بالكورس أو الورشة، وفريق المتابعة هيرجعلك بالتفاصيل على وسيلة التواصل اللي تكتبها.</p><div className="mt-10 border-l-2 border-secondary pl-5 text-sm leading-7 text-muted-foreground">مفيش دفع دلوقتي. ده تسجيل اهتمام وطلب معلومات بس.</div></div><div className="border border-border bg-card p-6 sm:p-9">{submitted ? <div className="py-10"><div className="flex h-12 w-12 items-center justify-center bg-secondary text-primary"><Check size={23} /></div><h2 className="display mt-7 text-4xl font-extrabold leading-none tracking-[-.06em]">تمام، استلمنا بياناتك.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">هنبعتلك الخطوة الجاية على وسيلة التواصل اللي كتبتها.</p><a href="/courses" className="mt-8 inline-flex border border-primary px-5 py-3 text-xs font-bold uppercase tracking-[.12em]">شوف الكورسات</a></div> : <form onSubmit={handleSubmit} className="space-y-5"><input type="hidden" name="formType" value="course_registration" /><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">الكورس</span><select name="course" value={course} onChange={(event) => setCourse(event.target.value)} className="w-full border border-border bg-background px-3 py-3 text-sm"><option value="marketing-funnels">التسويق ومسارات التحويل</option><option value="data-products">منتجات البيانات</option><option value="automation-ops">تشغيل الأتمتة</option></select></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">الاسم</span><input required name="name" className="w-full border border-border bg-background px-3 py-3 text-sm" /></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">الإيميل</span><input required type="email" name="email" className="w-full border border-border bg-background px-3 py-3 text-sm" /></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">واتساب</span><input name="contact" className="w-full border border-border bg-background px-3 py-3 text-sm" /></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">إيه اللي عايز توصله؟</span><textarea name="message" rows={4} className="w-full resize-none border border-border bg-background px-3 py-3 text-sm" placeholder="اكتب الهدف أو المشكلة اللي عايز تشتغل عليها..." /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={submitting} className="flex w-full items-center justify-center gap-3 bg-primary px-4 py-4 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground disabled:opacity-60">{submitting ? 'بنحفظ البيانات...' : 'سجّل اهتمامك'} <Send size={15} /></button></form>}</div></section></PageShell>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <WouterRoute path="/" component={Home} />
        <WouterRoute path="/services"><ServicePage page="services" /></WouterRoute>
        <WouterRoute path="/data-products"><ServicePage page="data" /></WouterRoute>
        <WouterRoute path="/automation"><ServicePage page="automation" /></WouterRoute>
        <WouterRoute path="/about"><ServicePage page="about" /></WouterRoute>
        <WouterRoute path="/courses" component={CoursesPage} />
        <WouterRoute path="/register" component={RegisterPage} />
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
