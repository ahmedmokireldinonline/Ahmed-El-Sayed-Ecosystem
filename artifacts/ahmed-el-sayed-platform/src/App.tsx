import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, BarChart3, BookOpen, Bot, Check, ChevronLeft, ChevronRight, Code2, Compass, Database, Globe2, Instagram, Layers3, Linkedin, LineChart, Menu, MessageCircle, Music2, Pause, Play, Send, Sparkles, Video, Workflow, X, Youtube } from 'lucide-react';
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
const SHOW_DEMO_REVIEWS = import.meta.env.VITE_SHOW_DEMO_REVIEWS === 'true';
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
  { label: 'Ecosystem', ar: 'المنظومة', href: '#ecosystem' },
  { label: 'Growth systems', ar: 'أنظمة النمو', href: '#systems' },
  { label: 'Knowledge', ar: 'المعرفة', href: '#knowledge' },
  { label: 'Integrations', ar: 'التكاملات', href: '#integrations' },
  { label: 'Social studio', ar: 'استوديو السوشيال', href: '#social' },
  { label: 'About Ahmed', ar: 'عن أحمد', href: '#about' },
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

const videoCatalogUrl = import.meta.env.VITE_VIDEO_CATALOG_URL as string | undefined;

const demoReviewCopy = [
  { en: 'Demo feedback: the first step feels clearer and easier to act on.', ar: 'تقييم تجريبي: الخطوة الأولى أصبحت أوضح وأسهل في التنفيذ.', ru: 'Демо-отзыв: первый шаг стал понятнее и проще для действия.' },
  { en: 'Demo feedback: a useful bridge between the idea and the operating system.', ar: 'تقييم تجريبي: جسر عملي بين الفكرة ونظام التشغيل.', ru: 'Демо-отзыв: полезный мост между идеей и рабочей системой.' },
  { en: 'Demo feedback: the message is easier to understand without losing depth.', ar: 'تقييم تجريبي: الرسالة أسهل في الفهم من دون فقدان العمق.', ru: 'Демо-отзыв: сообщение стало понятнее без потери глубины.' },
  { en: 'Demo feedback: the conversation moves from interest to a useful next step.', ar: 'تقييم تجريبي: تنتقل المحادثة من الاهتمام إلى خطوة تالية مفيدة.', ru: 'Демо-отзыв: разговор переходит от интереса к полезному следующему шагу.' },
  { en: 'Demo feedback: the structure makes a complex opportunity feel more manageable.', ar: 'تقييم تجريبي: التنظيم يجعل الفرصة المعقدة أسهل في التعامل.', ru: 'Демо-отзыв: структура делает сложную возможность более управляемой.' },
  { en: 'Demo feedback: the system connects people, tools, and decisions in one view.', ar: 'تقييم تجريبي: النظام يربط الأشخاص والأدوات والقرارات في رؤية واحدة.', ru: 'Демо-отзыв: система объединяет людей, инструменты и решения в одном представлении.' },
  { en: 'Demo feedback: practical language turns the strategy into something usable.', ar: 'تقييم تجريبي: اللغة العملية تحول الاستراتيجية إلى شيء قابل للاستخدام.', ru: 'Демо-отзыв: практичный язык превращает стратегию в рабочий инструмент.' },
  { en: 'Demo feedback: the framework leaves room for context instead of forcing a template.', ar: 'تقييم تجريبي: الإطار يترك مساحة للسياق بدلاً من فرض قالب واحد.', ru: 'Демо-отзыв: фреймворк учитывает контекст, а не навязывает один шаблон.' },
  { en: 'Demo feedback: the digital layer supports the human conversation instead of replacing it.', ar: 'تقييم تجريبي: الطبقة الرقمية تدعم الحوار الإنساني ولا تستبدله.', ru: 'Демо-отзыв: цифровой слой поддерживает человеческий разговор, а не заменяет его.' },
  { en: 'Demo feedback: the next action is visible, measurable, and easier to share with a team.', ar: 'تقييم تجريبي: الإجراء التالي واضح وقابل للقياس وأسهل في المشاركة مع الفريق.', ru: 'Демо-отзыв: следующий шаг виден, измерим и им проще поделиться с командой.' },
  { en: 'Demo feedback: the system makes room for better questions before bigger promises.', ar: 'تقييم تجريبي: النظام يتيح أسئلة أفضل قبل الوعود الكبيرة.', ru: 'Демо-отзыв: система оставляет место для лучших вопросов до больших обещаний.' },
  { en: 'Demo feedback: the experience feels focused, calm, and ready to evolve.', ar: 'تقييم تجريبي: التجربة مركزة وهادئة وجاهزة للتطور.', ru: 'Демо-отзыв: опыт выглядит сфокусированным, спокойным и готовым к развитию.' },
];

const demoReviewAuthors = [
  ['Olivia Carter', '🇺🇸', 'United States', 'women/44.jpg'],
  ['Youssef Hassan', '🇪🇬', 'Egypt', 'men/32.jpg'],
  ['Sofia Rossi', '🇮🇹', 'Italy', 'women/65.jpg'],
  ['Daniel Kim', '🇰🇷', 'South Korea', 'men/75.jpg'],
  ['Maya Patel', '🇮🇳', 'India', 'women/47.jpg'],
  ['Liam Wilson', '🇬🇧', 'United Kingdom', 'men/41.jpg'],
  ['Nour El Din', '🇦🇪', 'United Arab Emirates', 'men/22.jpg'],
  ['Amelia Garcia', '🇪🇸', 'Spain', 'women/68.jpg'],
  ['Alexander Petrov', '🇷🇺', 'Russia', 'men/52.jpg'],
  ['Hana Suzuki', '🇯🇵', 'Japan', 'women/24.jpg'],
  ['Marcus Brown', '🇨🇦', 'Canada', 'men/11.jpg'],
  ['Layla Haddad', '🇱🇧', 'Lebanon', 'women/12.jpg'],
  ['Ethan Miller', '🇦🇺', 'Australia', 'men/14.jpg'],
  ['Clara Müller', '🇩🇪', 'Germany', 'women/32.jpg'],
  ['Omar Rahman', '🇶🇦', 'Qatar', 'men/29.jpg'],
  ['Ines Martins', '🇵🇹', 'Portugal', 'women/43.jpg'],
  ['Noah Cohen', '🇮🇱', 'Israel', 'men/36.jpg'],
  ['Amina Okafor', '🇳🇬', 'Nigeria', 'women/79.jpg'],
  ['Lucas Silva', '🇧🇷', 'Brazil', 'men/63.jpg'],
  ['Emma Johnson', '🇺🇸', 'United States', 'women/50.jpg'],
  ['Karim Adel', '🇪🇬', 'Egypt', 'men/45.jpg'],
  ['Giulia Bianchi', '🇮🇹', 'Italy', 'women/9.jpg'],
  ['Min-jun Lee', '🇰🇷', 'South Korea', 'men/3.jpg'],
  ['Ananya Shah', '🇮🇳', 'India', 'women/26.jpg'],
  ['James Taylor', '🇬🇧', 'United Kingdom', 'men/68.jpg'],
  ['Salma Nasser', '🇦🇪', 'United Arab Emirates', 'women/72.jpg'],
  ['Mateo Torres', '🇪🇸', 'Spain', 'men/19.jpg'],
  ['Daria Volkova', '🇷🇺', 'Russia', 'women/49.jpg'],
  ['Kenji Ito', '🇯🇵', 'Japan', 'men/61.jpg'],
  ['Ava Smith', '🇨🇦', 'Canada', 'women/57.jpg'],
  ['Rami Khoury', '🇱🇧', 'Lebanon', 'men/80.jpg'],
  ['Chloe Martin', '🇦🇺', 'Australia', 'women/21.jpg'],
  ['Jonas Weber', '🇩🇪', 'Germany', 'men/25.jpg'],
  ['Huda Al Mansoori', '🇶🇦', 'Qatar', 'women/90.jpg'],
  ['Tiago Costa', '🇵🇹', 'Portugal', 'men/71.jpg'],
  ['Fatima Bello', '🇳🇬', 'Nigeria', 'women/85.jpg'],
].map(([name, flag, country, photo], index) => ({
  id: `demo-review-${index + 1}`,
  name,
  flag,
  country,
  photo: `https://randomuser.me/api/portraits/${photo}`,
  copyIndex: index % demoReviewCopy.length,
}));

const reviewSlides = Array.from({ length: Math.ceil(demoReviewAuthors.length / 3) }, (_, index) => demoReviewAuthors.slice(index * 3, index * 3 + 3));

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'AR' | 'RU'>(() => {
    const requestedLanguage = new URLSearchParams(window.location.search).get('lang')?.toUpperCase();
    if (requestedLanguage === 'AR' || requestedLanguage === 'RU') return requestedLanguage;
    try {
      const savedLanguage = window.localStorage.getItem('ahmed-platform-language')?.toUpperCase();
      return savedLanguage === 'AR' || savedLanguage === 'RU' ? savedLanguage : 'EN';
    } catch {
      return 'EN';
    }
  });
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [reviewSlide, setReviewSlide] = useState(0);
  const [reviewsPaused, setReviewsPaused] = useState(false);
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

  useEffect(() => {
    if (reviewsPaused) return;
    const interval = window.setInterval(() => {
      setReviewSlide((current) => (current + 1) % reviewSlides.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [reviewsPaused]);

  const openConsultation = () => {
    setSubmitted(false);
    setSubmissionError('');
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
                  {isArabic ? item.ar : isRussian ? item.label === 'Ecosystem' ? 'Экосистема' : item.label === 'Growth systems' ? 'Системы роста' : item.label === 'Integrations' ? 'Интеграции' : item.label === 'Social studio' ? 'Социальная студия' : item.label === 'Knowledge' ? 'Знания' : item.label === 'Reviews' ? 'Отзывы' : 'Об Ахмеде' : item.label}<ArrowUpRight size={14} className="text-secondary" />
                </a>
              ))}
              <a href="/courses" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-border pb-3 text-xs font-bold uppercase tracking-[.13em] text-secondary">{isArabic ? 'الكورسات' : isRussian ? 'Курсы' : 'Courses'}<ArrowUpRight size={14} /></a>
              <a href="/register" onClick={() => setMenuOpen(false)} className="flex items-center justify-between border-b border-border pb-3 text-xs font-bold uppercase tracking-[.13em] text-primary">{isArabic ? 'التسجيل' : isRussian ? 'Регистрация' : 'Register'}<ArrowUpRight size={14} /></a>
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
            <h1 className="hero-title display reveal reveal-delay-1 max-w-full text-[clamp(3.2rem,8vw,7.9rem)] font-extrabold leading-[.88] text-primary">
              {isArabic ? (
                <>نبني <span className="text-accent">التسويق.</span><br />نبيع البيانات.<br /><span className="text-secondary">نؤتمت النمو.</span><br />ونعلّم.</>
              ) : isRussian ? (
                <>Маркетинг.<br /><span className="text-accent">Данные.</span><br /><span className="text-secondary">Автоматизация.</span><br />Обучение.</>
              ) : (
                <>Marketing.<br /><span className="text-accent">Data products.</span><br /><span className="text-secondary">Automation.</span><br />Courses.</>
              )}
            </h1>
            <p className="reveal reveal-delay-2 mt-9 max-w-[510px] text-[15px] leading-7 text-muted-foreground">
              {isArabic ? 'نحوّل الانتباه إلى طلب، والبيانات إلى منتج، والعمل المتكرر إلى أتمتة، والخبرة إلى كورسات قابلة للتطبيق.' : isRussian ? 'Превращаем внимание в спрос, данные в продукт, повторяющиеся задачи в автоматизацию, а опыт в практические курсы.' : 'Turn attention into demand, data into a product, repeated work into automation, and experience into practical courses.'}
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
            <img src="/official-growth-map.jpg" alt="Growth and data visual from Ahmed El Sayed's official social content" className="absolute inset-[27%] z-0 h-[46%] w-[46%] rounded-full object-cover opacity-80 mix-blend-multiply" />
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
              <h2 className="display mt-6 max-w-[430px] text-5xl font-extrabold leading-[.93] tracking-[-.06em] sm:text-6xl">{isArabic ? <>رؤية واحدة.<br /><span className="text-secondary">محركات متعددة.</span></> : isRussian ? <>Одна перспектива.<br /><span className="text-secondary">Много двигателей.</span></> : <>One perspective.<br /><span className="text-secondary">Many engines.</span></>}</h2>
              <p className="mt-7 max-w-[360px] text-sm leading-7 text-primary-foreground/65">{isArabic ? 'العمل يتحرك بين التسويق والبيانات والأتمتة والتعليم، حيث تحتاج كل خطوة تجارية إلى رسالة ومسار ونظام متابعة.' : isRussian ? 'Работа движется между маркетингом, данными, автоматизацией и обучением, где каждому коммерческому шагу нужны сообщение, путь и follow-up.' : 'The work moves between marketing, data, automation, and education, where every commercial step needs a message, a path, and reliable follow-up.'}</p>
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

      <section id="reviews" className={`border-b border-border bg-card ${SHOW_DEMO_REVIEWS ? '' : 'hidden'}`} aria-hidden={!SHOW_DEMO_REVIEWS}>
        <div className="mx-auto max-w-[1360px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="reveal-on-scroll flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="mono text-[10px] tracking-[.2em] text-secondary">{isArabic ? '07 / تقييمات تجريبية' : isRussian ? '07 / ДЕМО-ОТЗЫВЫ' : '07 / DEMO REVIEWS'}</span>
              <h2 className="display mt-5 max-w-[700px] text-5xl font-extrabold leading-[.92] tracking-[-.06em] text-primary sm:text-7xl">
                {isArabic ? <>انطباعات<br /><span className="text-accent">تتحرك معك.</span></> : isRussian ? <>Впечатления,<br /><span className="text-accent">которые движутся вместе с вами.</span></> : <>Feedback<br /><span className="text-accent">that moves with you.</span></>}
              </h2>
            </div>
            <div className="max-w-[360px]">
              <p className="text-sm leading-7 text-muted-foreground">{isArabic ? 'هذه 36 بطاقة تجريبية لتوضيح شكل القسم والحركة. سيتم استبدالها بتقييمات موثقة عند تزويد النصوص والصور الأصلية.' : isRussian ? 'Это 36 демонстрационных карточек для показа структуры и движения. После получения оригинальных текстов и фотографий они будут заменены подтверждёнными отзывами.' : 'These 36 cards are clearly marked demo content to show the section structure and motion. They should be replaced with confirmed reviews and original photos before publishing.'}</p>
              <span className="mono mt-5 inline-flex border border-secondary/50 px-2.5 py-1.5 text-[9px] tracking-[.14em] text-secondary">{isArabic ? 'بيانات تجريبية / ليست شهادات عملاء' : isRussian ? 'ДЕМО-ДАННЫЕ / НЕ ОТЗЫВЫ КЛИЕНТОВ' : 'DEMO DATA / NOT CLIENT TESTIMONIALS'}</span>
            </div>
          </div>

          <div
            className="mt-14 overflow-hidden"
            onMouseEnter={() => setReviewsPaused(true)}
            onMouseLeave={() => setReviewsPaused(false)}
            onFocus={() => setReviewsPaused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setReviewsPaused(false);
            }}
          >
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${reviewSlide * 100}%)` }}>
              {reviewSlides.map((slide, slideIndex) => (
                <div key={`review-slide-${slideIndex}`} className="grid min-w-full grid-cols-1 gap-4 md:grid-cols-3" aria-hidden={reviewSlide !== slideIndex}>
                  {slide.map((review) => {
                    const copy = demoReviewCopy[review.copyIndex];
                    return (
                      <article key={review.id} className="group flex min-h-[285px] flex-col border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-[0_16px_35px_hsl(var(--primary)/.08)]">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={review.photo} alt={`${review.name} demo profile`} className="h-12 w-12 rounded-full border border-border object-cover grayscale transition-all duration-300 group-hover:grayscale-0" loading="lazy" />
                            <div>
                              <h3 className="text-sm font-bold text-primary">{review.name}</h3>
                            <p className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground"><span className="inline-flex h-5 min-w-5 items-center justify-center border border-border px-1 font-mono text-[9px] font-bold text-primary" aria-hidden="true">{review.country.slice(0, 2).toUpperCase()}</span>{review.country}</p>
                            </div>
                          </div>
                          <span className="mono shrink-0 text-[9px] tracking-[.12em] text-secondary">DEMO</span>
                        </div>
                        <div className="mt-7 flex items-center gap-1 text-secondary" aria-label={isArabic ? 'تقييم تجريبي من خمس نجوم' : isRussian ? 'Демонстрационная оценка пять из пяти' : 'Demo rating five out of five'}>
                          {Array.from({ length: 5 }).map((_, index) => <span key={index} className="text-sm">★</span>)}
                        </div>
                        <blockquote className="mt-4 text-[15px] leading-7 text-primary">{isArabic ? copy.ar : isRussian ? copy.ru : copy.en}</blockquote>
                        <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                          <span className="mono text-[9px] tracking-[.12em] text-muted-foreground">{isArabic ? 'هوية تجريبية' : isRussian ? 'ДЕМО-ПРОФИЛЬ' : 'DEMO PROFILE'}</span>
                          <span className="h-px w-8 bg-secondary transition-all duration-300 group-hover:w-16" />
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-5 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setReviewSlide((current) => (current - 1 + reviewSlides.length) % reviewSlides.length)} className="flex h-10 w-10 items-center justify-center border border-border text-primary transition-colors hover:border-secondary hover:text-secondary" aria-label={isArabic ? 'التقييمات السابقة' : isRussian ? 'Предыдущие отзывы' : 'Previous reviews'} data-testid="button-reviews-previous"><ChevronLeft size={17} /></button>
              <button type="button" onClick={() => setReviewSlide((current) => (current + 1) % reviewSlides.length)} className="flex h-10 w-10 items-center justify-center border border-border text-primary transition-colors hover:border-secondary hover:text-secondary" aria-label={isArabic ? 'التقييمات التالية' : isRussian ? 'Следующие отзывы' : 'Next reviews'} data-testid="button-reviews-next"><ChevronRight size={17} /></button>
              <button type="button" onClick={() => setReviewsPaused((paused) => !paused)} className="flex h-10 w-10 items-center justify-center border border-border text-primary transition-colors hover:border-secondary hover:text-secondary" aria-label={reviewsPaused ? (isArabic ? 'تشغيل الحركة' : isRussian ? 'Запустить слайд-шоу' : 'Play slideshow') : (isArabic ? 'إيقاف الحركة' : isRussian ? 'Поставить слайд-шоу на паузу' : 'Pause slideshow')} data-testid="button-reviews-toggle">
                {reviewsPaused ? <Play size={15} /> : <Pause size={15} />}
              </button>
            </div>
            <div className="flex items-center gap-2" aria-label={isArabic ? 'اختيار شريحة التقييمات' : isRussian ? 'Выбор слайда отзывов' : 'Review slide selector'}>
              {reviewSlides.map((_, index) => (
                <button key={`review-dot-${index}`} type="button" onClick={() => setReviewSlide(index)} className={`inline-flex h-11 min-w-11 items-center justify-center transition-all after:block after:h-1.5 ${reviewSlide === index ? 'after:w-8 after:bg-secondary' : 'after:w-3 after:bg-border hover:after:bg-secondary/60'}`} aria-label={`${isArabic ? 'الشريحة' : isRussian ? 'Слайд' : 'Slide'} ${index + 1}`} aria-current={reviewSlide === index ? 'true' : undefined} data-testid={`button-reviews-slide-${index + 1}`} />
              ))}
            </div>
            <span className="mono text-[9px] tracking-[.14em] text-muted-foreground">{reviewsPaused ? (isArabic ? 'متوقف مؤقتاً' : isRussian ? 'ПАУЗА' : 'PAUSED') : (isArabic ? 'تشغيل تلقائي / 12 شرائح' : isRussian ? 'АВТОПРОКРУТКА / 12 СЛАЙДОВ' : 'AUTO PLAY / 12 SLIDES')}</span>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[.6fr_1.4fr] lg:px-12 lg:py-28">
          <div className="reveal-on-scroll">
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
            <button type="button" onClick={openConsultation} className="group flex items-center justify-between gap-8 bg-primary px-5 py-4 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground transition-colors hover:bg-accent" data-testid="button-connect-consultation">
              {isArabic ? 'اطلب استشارة' : isRussian ? 'Запросить консультацию' : 'Request a consultation'} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>
            {WHATSAPP_NUMBER ? (
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-8 border border-primary/30 px-5 py-4 text-xs font-bold uppercase tracking-[.12em] transition-colors hover:border-primary" data-testid="link-connect-whatsapp">
                <span className="flex items-center gap-2"><MessageCircle size={15} /> {isArabic ? 'تواصل عبر واتساب' : isRussian ? 'Связаться в WhatsApp' : 'WhatsApp contact'}</span><ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            ) : (
              <button type="button" onClick={openConsultation} className="group flex items-center justify-between gap-8 border border-primary/30 px-5 py-4 text-left text-xs font-bold uppercase tracking-[.12em] transition-colors hover:border-primary" data-testid="button-connect-whatsapp-fallback">
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
                  <form onSubmit={handleConsultationSubmit} className="mt-8 space-y-4">
                    <input type="hidden" name="formType" value="consultation" />
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
  return <main className="min-h-[100dvh] bg-background text-primary"><header className="border-b border-border bg-background"><div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8"><a href="/" className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center border border-secondary bg-primary text-secondary"><span className="display text-lg font-extrabold">A</span></span><span className="text-[13px] font-extrabold tracking-[.18em]">AHMED EL SAYED</span></a><nav className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-[.13em]"><a href="/courses" className="text-secondary">Courses</a><a href="/register" className="text-muted-foreground hover:text-primary">Register</a></nav></div></header>{children}<footer className="border-t border-border bg-primary px-5 py-8 text-[11px] text-primary-foreground/60 sm:px-8"><div className="mx-auto flex max-w-[1180px] justify-between"><span>AHMED EL SAYED</span><a href="/">Back to platform</a></div></footer></main>;
}

function CoursesPage() {
  return <PageShell><section className="mx-auto max-w-[1180px] px-5 pb-16 pt-20 sm:px-8 sm:pt-28"><span className="mono text-[10px] tracking-[.2em] text-secondary">LEARNING PATH / مسار التعلم</span><h1 className="display mt-5 max-w-[780px] text-6xl font-extrabold leading-[.9] tracking-[-.07em] sm:text-8xl">Learn the mechanism.<br /><span className="text-secondary">Build the system.</span></h1><p className="mt-8 max-w-[620px] text-base leading-7 text-muted-foreground">الكورسات هنا ليست مكتبة وعود؛ كل مسار يحول فكرة أو مشكلة حقيقية إلى نظام قابل للتشغيل والقياس.</p><div className="mt-14 grid gap-5 lg:grid-cols-3">{courses.map((course, index) => <article key={course.slug} className="flex flex-col border border-border bg-card p-6"><span className="mono text-[10px] tracking-[.18em] text-secondary">0{index + 1} / {course.type.toUpperCase()}</span><h2 className="display mt-8 text-3xl font-extrabold leading-none tracking-[-.05em]">{course.title}<span className="mt-2 block text-base font-medium tracking-normal text-muted-foreground">{course.arTitle}</span></h2><p className="mt-5 text-sm leading-6 text-muted-foreground">{course.description}<br />{course.arDescription}</p><ul className="mt-6 space-y-3 border-t border-border pt-5 text-sm">{course.modules.map((module) => <li key={module} className="flex gap-2"><Check size={15} className="mt-0.5 shrink-0 text-secondary" />{module}</li>)}</ul><a href={`/register?course=${course.slug}`} className="mt-8 flex items-center justify-between bg-primary px-4 py-3 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground hover:bg-accent">Register interest <ArrowUpRight size={15} /></a></article>)}</div></section></PageShell>;
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
  return <PageShell><section className="mx-auto grid max-w-[1180px] gap-12 px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[.9fr_1.1fr]"><div><span className="mono text-[10px] tracking-[.2em] text-secondary">REGISTRATION / التسجيل</span><h1 className="display mt-5 text-6xl font-extrabold leading-[.9] tracking-[-.07em] sm:text-8xl">Choose the next<br /><span className="text-secondary">useful step.</span></h1><p className="mt-8 max-w-[460px] text-base leading-7 text-muted-foreground">سجّل اهتمامك بالكورس أو الورشة. ستصل البيانات إلى فريق المتابعة وقائمة البريد التسويقية عند تفعيل الربط.</p><div className="mt-10 border-l-2 border-secondary pl-5 text-sm leading-6 text-muted-foreground">لا يوجد دفع في هذه المرحلة. التسجيل هنا هو طلب معلومات أو حجز أولوية.</div></div><div className="border border-border bg-card p-6 sm:p-9">{submitted ? <div className="py-10"><div className="flex h-12 w-12 items-center justify-center bg-secondary text-primary"><Check size={23} /></div><h2 className="display mt-7 text-4xl font-extrabold leading-none tracking-[-.06em]">تم استلام التسجيل.</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">سنرسل لك الخطوة التالية على وسيلة التواصل التي أدخلتها.</p><a href="/courses" className="mt-8 inline-flex border border-primary px-5 py-3 text-xs font-bold uppercase tracking-[.12em]">Browse courses</a></div> : <form onSubmit={handleSubmit} className="space-y-5"><input type="hidden" name="formType" value="course_registration" /><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">COURSE / الكورس</span><select name="course" value={course} onChange={(event) => setCourse(event.target.value)} className="w-full border border-border bg-background px-3 py-3 text-sm"><option value="marketing-funnels">Marketing & Funnels / التسويق ومسارات التحويل</option><option value="data-products">Data Products / منتجات البيانات</option><option value="automation-ops">Automation Operations / تشغيل الأتمتة</option></select></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">NAME / الاسم</span><input required name="name" className="w-full border border-border bg-background px-3 py-3 text-sm" /></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">EMAIL / البريد الإلكتروني</span><input required type="email" name="email" className="w-full border border-border bg-background px-3 py-3 text-sm" /></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">WHATSAPP / واتساب</span><input name="contact" className="w-full border border-border bg-background px-3 py-3 text-sm" /></label><label className="block"><span className="mono mb-2 block text-[10px] tracking-[.14em] text-muted-foreground">GOAL / الهدف</span><textarea name="message" rows={4} className="w-full resize-none border border-border bg-background px-3 py-3 text-sm" placeholder="What do you want to be able to do after the course?" /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={submitting} className="flex w-full items-center justify-center gap-3 bg-primary px-4 py-4 text-xs font-bold uppercase tracking-[.12em] text-primary-foreground disabled:opacity-60">{submitting ? 'Saving...' : 'Register interest / سجّل اهتمامك'} <Send size={15} /></button></form>}</div></section></PageShell>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <WouterRoute path="/" component={Home} />
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
