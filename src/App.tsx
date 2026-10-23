import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Instagram,
  Lightbulb,
  MessageCircle,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  ShoppingCart,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";
import "./masterclass.css";

import slide1 from "./assets/slide-1.webp";
import slide2 from "./assets/slide-2.webp";
import slide3 from "./assets/slide-3.webp";
import slide4 from "./assets/slide-4.webp";
import slide5 from "./assets/slide-5.webp";
import slide6 from "./assets/slide-6.webp";
import slide7 from "./assets/slide-7.webp";
import slide8 from "./assets/slide-8.webp";
import slide9 from "./assets/slide-9.webp";

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSegrEjMlKJ9ynZe41kQURsvDF2y_mQGBjJ0M6ulg9m-6JAb9Q/viewform";
const FORM_EMBED_URL = `${FORM_URL}?embedded=true`;
// 22 nov 2026, 17:00 Chile (UTC-3) = 20:00 UTC
const EVENT_START = new Date("2026-11-22T20:00:00Z");
const EVENT_END = new Date("2026-11-22T22:00:00Z");

const CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Masterclass: Tu negocio desde casa") +
  "&dates=20261122T200000Z/20261122T220000Z" +
  "&details=" + encodeURIComponent("Masterclass online de Homeschool Cristiano Chile junto a Maura Abarcia. Duración: 120 minutos.");

const SLIDES = [
  { src: slide1, title: "¿Y si la idea de negocio que tanto buscas… ya está en tus manos?", text: "Y todavía no te has dado cuenta." },
  { src: slide2, title: "Piénsalo un momento…", text: "Llevas años aprendiendo, desarrollando habilidades, criando a tus hijos y ayudando a otros. Has aprendido mucho más de lo que imaginas." },
  { src: slide3, title: "¿Y si eso que haces tan bien también pudiera generar ingresos?", text: "Hay algo que quizás nunca te has preguntado." },
  { src: slide4, title: "No necesitas miles de seguidores", text: "Ni convertirte en influencer para comenzar. Necesitas descubrir qué puedes ofrecer y a quién puedes ayudar." },
  { src: slide5, title: "Imagina transformar lo que sabes en algo que ayude a otras personas", text: "Y que, al mismo tiempo, pueda convertirse en tu propio negocio desde casa." },
  { src: slide6, title: "¿Y cómo se empieza?", text: "Descubriendo una oportunidad de negocio, aprendiendo a comunicar tu valor y utilizando las redes sociales estratégicamente para vender." },
  { src: slide7, title: "22 de noviembre: Tu negocio desde casa", text: "Un espacio para descubrir cómo dar tus primeros pasos en el emprendimiento digital." },
  { src: slide8, title: "Junto a Maura Abarcia", text: "Emprendedora digital con 8 años de experiencia construyendo y monetizando su marca personal." },
  { src: slide9, title: "Mamá, lo que sabes podría ser el comienzo de algo mucho más grande.", text: "Reserva tu lugar en «Tu negocio desde casa»." },
];

const STEPS = [
  { icon: Lightbulb, title: "Descubriendo una oportunidad de negocio", text: "Mirando con nuevos ojos lo que ya sabes hacer: tus conocimientos, tu experiencia como mamá y las habilidades que has desarrollado por años." },
  { icon: MessageCircle, title: "Aprendiendo a comunicar tu valor", text: "Poniendo en palabras qué puedes ofrecer y a quién puedes ayudar, para que otras personas lo entiendan y lo valoren." },
  { icon: ShoppingCart, title: "Usando las redes sociales estratégicamente para vender", text: "Sin necesidad de miles de seguidores ni de convertirte en influencer: con estrategia y propósito." },
];

const FAQS = [
  { q: "¿Cuándo es la masterclass?", a: "El domingo 22 de noviembre de 2026 a las 17:00 (Chile), 14:00 (México) y 15:00 (Colombia y Ecuador). Dura 120 minutos." },
  { q: "¿Y si no puedo conectarme en vivo?", a: "No te preocupes: tendrás acceso a la grabación online del workshop durante una semana para verla a tu ritmo." },
  { q: "¿Qué material voy a recibir?", a: "Un libro digital imprimible para trabajar durante la sesión, así aplicas lo aprendido mientras avanzamos juntas." },
  { q: "¿Necesito tener seguidores o experiencia en redes?", a: "No. No necesitas miles de seguidores ni convertirte en influencer para comenzar. Necesitas descubrir qué puedes ofrecer y a quién puedes ayudar." },
  { q: "¿Cuánto cuesta y cómo reservo?", a: "El valor es $10.000 CLP o 10 USD. Completa el formulario de inscripción en esta página y te escribiremos para reservar tu lugar." },
];

const MARQUEE = ["Tu negocio desde casa", "Emprendimiento digital", "Comunica tu valor", "Redes sociales con estrategia", "Todo comienza con lo que ya sabes", "22 de noviembre"];

/* ---------------- hooks ---------------- */

const useReveal = (root: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>("[data-reveal], .underline");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root]);
};

const getRemaining = () => {
  const diff = Math.max(0, EVENT_START.getTime() - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- small components ---------------- */

const FlagChile = () => (
  <svg viewBox="0 0 30 20" aria-hidden="true">
    <rect width="30" height="20" fill="#d52b1e" />
    <rect width="30" height="10" fill="#fff" />
    <rect width="10" height="10" fill="#0039a6" />
    <polygon points="5,2.2 5.9,4.9 8.7,4.9 6.4,6.5 7.3,9.1 5,7.5 2.7,9.1 3.6,6.5 1.3,4.9 4.1,4.9" fill="#fff" />
  </svg>
);
const FlagMexico = () => (
  <svg viewBox="0 0 30 20" aria-hidden="true">
    <rect width="10" height="20" fill="#006847" />
    <rect x="10" width="10" height="20" fill="#fff" />
    <rect x="20" width="10" height="20" fill="#ce1126" />
    <circle cx="15" cy="10" r="2.6" fill="#8c5a2b" />
  </svg>
);
const FlagColombia = () => (
  <svg viewBox="0 0 30 20" aria-hidden="true">
    <rect width="30" height="20" fill="#ce1126" />
    <rect width="30" height="15" fill="#003893" />
    <rect width="30" height="10" fill="#fcd116" />
  </svg>
);
const FlagEcuador = () => (
  <svg viewBox="0 0 30 20" aria-hidden="true">
    <rect width="30" height="20" fill="#ce1126" />
    <rect width="30" height="15" fill="#034ea2" />
    <rect width="30" height="10" fill="#ffdd00" />
    <circle cx="15" cy="10" r="3" fill="#7a5c2e" stroke="#fff" strokeWidth="0.6" />
  </svg>
);

const Tilt = ({ children, className = "", max = 10 }: { children: React.ReactNode; className?: string; max?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.classList.add("active");
    ref.current.style.setProperty("--ry", `${x * max}deg`);
    ref.current.style.setProperty("--rx", `${-y * max}deg`);
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.classList.remove("active");
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.style.setProperty("--rx", "0deg");
  };
  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
};

const Countdown = () => {
  const [t, setT] = useState(getRemaining);
  useEffect(() => {
    const id = window.setInterval(() => setT(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const cells: [number, string][] = [[t.d, "días"], [t.h, "horas"], [t.m, "min"], [t.s, "seg"]];
  return (
    <div className="countdown glass" role="timer" aria-label="Cuenta regresiva para la masterclass">
      <span className="label"><Clock size={16} /> La masterclass comienza en</span>
      <div className="cd-row">
        {cells.map(([v, l]) => (
          <div className="cd-cell" key={l}>
            <b key={v} className="tick">{String(v).padStart(2, "0")}</b>
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- page ---------------- */

const App = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(prefersReducedMotion);
  const [hovering, setHovering] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dragX = useRef<number | null>(null);

  const [flipped, setFlipped] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [usd, setUsd] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [formLoaded, setFormLoaded] = useState(false);

  useReveal(rootRef);

  // scroll progress, nav state and sticky CTA
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        rootRef.current?.style.setProperty("--p", String(max > 0 ? window.scrollY / max : 0));
        setScrolled(window.scrollY > 30);
        const heroH = heroRef.current?.offsetHeight ?? 600;
        const signup = document.getElementById("inscripcion");
        const inSignup = signup ? signup.getBoundingClientRect().top < window.innerHeight && signup.getBoundingClientRect().bottom > 0 : false;
        setShowSticky(window.scrollY > heroH * 0.7 && !inSignup);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const go = useCallback((i: number) => setSlide((i + SLIDES.length) % SLIDES.length), []);

  // keyboard for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % SLIDES.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + SLIDES.length) % SLIDES.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lightbox]);

  const onHeroMove = (e: ReactPointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onCardGlow = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--gx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = EVENT_START.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", hour12: false });
  const localDate = EVENT_START.toLocaleDateString("es", { day: "numeric", month: "long" });
  const coveredTz = ["America/Santiago", "America/Mexico_City", "America/Bogota", "America/Guayaquil"];
  const showLocal = !coveredTz.includes(localTz);

  const stackStyle = (i: number): React.CSSProperties => {
    const offset = (i - slide + SLIDES.length) % SLIDES.length;
    if (offset === 0) return { transform: "none", zIndex: 10, opacity: 1 };
    if (offset === 1) return { transform: "translate(26px, 14px) rotate(5deg) scale(0.95)", zIndex: 9, opacity: 1, filter: "brightness(0.96)" };
    if (offset === 2) return { transform: "translate(48px, 26px) rotate(9deg) scale(0.9)", zIndex: 8, opacity: 0.85, filter: "brightness(0.92)" };
    if (offset === SLIDES.length - 1) return { transform: "translate(-120%, 20px) rotate(-14deg)", zIndex: 11, opacity: 0, pointerEvents: "none" };
    return { transform: "translate(48px, 26px) rotate(9deg) scale(0.88)", zIndex: 1, opacity: 0, pointerEvents: "none" };
  };

  return (
    <div className="mc" ref={rootRef}>
      <div className="progress" aria-hidden="true" />

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} aria-label="Principal">
        <a href="#top" className="brand">
          <span className="brand-logo"><Users size={20} /></span>
          <span>Homeschool<br />Cristiano Chile</span>
        </a>
        <div className="nav-links">
          <a href="#historia">Historia</a>
          <a href="#como">Qué aprenderás</a>
          <a href="#mentora">Mentora</a>
          <a href="#detalles">Detalles</a>
          <a href="#preguntas">Preguntas</a>
        </div>
        <a href="#inscripcion" className="btn small">Reservar <ArrowRight size={16} /></a>
      </nav>

      {/* HERO */}
      <section className="hero" id="top" ref={heroRef} onPointerMove={onHeroMove}>
        <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
        <div className="wrap hero-grid">
          <div>
            <span className="chip" data-reveal><span className="dot" /> Masterclass online · 22 de noviembre 2026</span>
            <h1 data-reveal style={{ "--d": "0.1s" } as React.CSSProperties}>
              ¿Y si la idea de negocio que tanto buscas…{" "}
              <span className="hl">ya está</span>{" "}
              <span className="hl y">en tus manos?</span>
            </h1>
            <p className="lead" data-reveal style={{ "--d": "0.2s" } as React.CSSProperties}>
              <b>Tu negocio desde casa</b> es una masterclass para mamás que quieren descubrir cómo convertir
              lo que ya saben en una <span className="underline">oportunidad de negocio</span> y dar sus primeros pasos en el emprendimiento digital.
            </p>
            <div className="hero-ctas" data-reveal style={{ "--d": "0.3s" } as React.CSSProperties}>
              <a href="#inscripcion" className="btn pulse">Quiero reservar mi lugar <ArrowRight size={20} /></a>
              <a href="#detalles" className="btn ghost">Ver detalles</a>
            </div>
            <div data-reveal style={{ "--d": "0.4s" } as React.CSSProperties}>
              <Countdown />
            </div>
            <div className="hero-mini" data-reveal style={{ "--d": "0.5s", marginTop: 20 } as React.CSSProperties}>
              <span><Clock size={16} /> 120 minutos en vivo</span>
              <span><Video size={16} /> Grabación por 1 semana</span>
              <span><BookOpen size={16} /> Libro digital imprimible</span>
            </div>
          </div>

          <div className="hero-visual" data-reveal="zoom" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <Tilt max={12}>
              <div className="photo"><img src={slide1} alt="Mamá pensando en su idea de negocio" width={900} height={1125} fetchPriority="high" /></div>
              <div className="float-badge fb1 glass">
                <span className="ico" style={{ background: "var(--pink)" }}><CalendarDays size={20} /></span>
                <span>22 de noviembre<small>Domingo · 17:00 Chile</small></span>
              </div>
              <div className="float-badge fb2 glass">
                <span className="ico" style={{ background: "var(--purple)" }}><Sparkles size={20} /></span>
                <span>$10.000 CLP<small>o 10 USD</small></span>
              </div>
              <div className="float-badge fb3 glass">
                <span className="ico" style={{ background: "var(--yellow)", color: "var(--ink)" }}><Heart size={20} /></span>
                <span>Con Maura Abarcia<small>Emprendedora digital</small></span>
              </div>
            </Tilt>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i}>{m} <i>✦</i></span>
          ))}
        </div>
      </div>

      {/* STORY CAROUSEL */}
      <section className="story" id="historia">
        <div className="wrap story-grid">
          <div data-reveal="left">
            <span className="eyebrow">Desliza la historia</span>
            <h2 className="section-title">Una pregunta que puede <span className="hl y">cambiarlo todo</span></h2>
            <div className="story-caption" aria-live="polite">
              <span className="num">{String(slide + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}</span>
              <h3 key={`t${slide}`}>{SLIDES[slide].title}</h3>
              <p key={`p${slide}`} className="lead">{SLIDES[slide].text}</p>
            </div>
            <div className="story-nav">
              <button className="round-btn" onClick={() => go(slide - 1)} aria-label="Anterior"><ChevronLeft /></button>
              <button className="round-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Reproducir" : "Pausar"}>
                {paused ? <Play size={20} /> : <Pause size={20} />}
              </button>
              <button className="round-btn" onClick={() => go(slide + 1)} aria-label="Siguiente"><ChevronRight /></button>
            </div>
            <div className="thumbs">
              {SLIDES.map((s, i) => (
                <button key={i} className={i === slide ? "on" : ""} onClick={() => go(i)} aria-label={`Ver imagen ${i + 1}`}>
                  <img src={s.src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div data-reveal="right">
            <div
              className={`story-stage ${paused || hovering ? "paused" : ""}`}
              style={{ "--dur": "6s" } as React.CSSProperties}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
              onPointerLeave={() => setHovering(false)}
              onPointerDown={(e) => { dragX.current = e.clientX; }}
              onPointerUp={(e) => {
                if (dragX.current === null) return;
                const dx = e.clientX - dragX.current;
                dragX.current = null;
                if (Math.abs(dx) > 40) go(slide + (dx < 0 ? 1 : -1));
                else setLightbox(slide);
              }}
              onPointerCancel={() => { dragX.current = null; }}
            >
              <div className="story-bars">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    className={i < slide ? "done" : i === slide ? "current" : ""}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    onClick={() => go(i)}
                    aria-label={`Ir a la imagen ${i + 1}`}
                  >
                    <i key={i === slide ? `on-${slide}` : i} onAnimationEnd={() => i === slide && go(slide + 1)} />
                  </button>
                ))}
              </div>
              {SLIDES.map((s, i) => (
                <div className="story-card" key={i} style={stackStyle(i)} aria-hidden={i !== slide}>
                  <img src={s.src} alt={s.title} loading={i < 2 ? "eager" : "lazy"} draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THINK */}
      <section className="think">
        <div className="wrap">
          <div className="think-grid">
            <div data-reveal="left">
              <Tilt max={8}>
                <div className="photo"><img src={slide2} alt="Mamá acompañando a su hija en sus tareas" loading="lazy" /></div>
              </Tilt>
            </div>
            <div data-reveal="right">
              <span className="eyebrow">Piénsalo un momento…</span>
              <h2 className="section-title">Has aprendido <span className="hl">mucho más</span> de lo que imaginas.</h2>
              <p className="lead">
                Llevas años aprendiendo, desarrollando habilidades, criando a tus hijos y ayudando a otros.
                Todo eso que haces cada día tiene un valor enorme.
              </p>
              <div className="quote-card glass">
                <span className="hand">“</span>
                <p className="lead" style={{ color: "var(--ink)", fontWeight: 700 }}>
                  Imagina transformar lo que sabes en algo que ayude a otras personas… y que, al mismo tiempo,
                  pueda convertirse en <span className="underline">tu propio negocio desde casa</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="flip-grid">
            {[
              { q: "¿Y si eso que haces tan bien pudiera generar ingresos?", a: "Hay algo que quizás nunca te has preguntado: tus conocimientos y tu experiencia pueden ser el punto de partida de tu emprendimiento.", icon: Lightbulb, c: "c1", bg: "var(--yellow-soft)", col: "#d68a00" },
              { q: "¿Necesito miles de seguidores?", a: "No, mamá. No necesitas miles de seguidores ni convertirte en influencer para comenzar. Necesitas descubrir qué puedes ofrecer y a quién puedes ayudar.", icon: Users, c: "c2", bg: "var(--lavender)", col: "var(--purple)" },
              { q: "¿Puedo hacerlo desde casa?", a: "Sí. Se trata de dar tus primeros pasos en el emprendimiento digital, a tu ritmo, acompañando a tu familia.", icon: Heart, c: "c3", bg: "var(--pink-soft)", col: "var(--pink)" },
            ].map((f, i) => (
              <button
                key={i}
                className={`flip ${flipped === i ? "on" : ""}`}
                onClick={() => setFlipped(flipped === i ? null : i)}
                data-reveal
                style={{ "--d": `${i * 0.12}s` } as React.CSSProperties}
                aria-pressed={flipped === i}
              >
                <div className="flip-inner">
                  <div className="flip-face flip-front">
                    <span className="flip-icon" style={{ background: f.bg, color: f.col }}><f.icon size={26} /></span>
                    <h3>{f.q}</h3>
                    <span className="hint"><MousePointerClick size={15} /> Toca para descubrir</span>
                  </div>
                  <div className={`flip-face flip-back ${f.c}`}>
                    <Sparkles size={26} />
                    <p>{f.a}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="steps" id="como">
        <div className="wrap steps-grid">
          <div data-reveal="left">
            <span className="eyebrow">¿Y cómo se empieza?</span>
            <h2 className="section-title">Tres pasos para dar el <span className="hl p">primer paso</span></h2>
            <p className="lead">En la masterclass recorreremos juntas el camino para convertir tus conocimientos en una oportunidad real.</p>
            <div className="step-list">
              <div className="step-line"><i style={{ height: `${(step / (STEPS.length - 1)) * 100}%` }} /></div>
              {STEPS.map((s, i) => (
                <button key={i} className={`step ${step === i ? "on" : ""}`} onClick={() => setStep(i)} onPointerEnter={(e) => e.pointerType === "mouse" && setStep(i)}>
                  <span className="step-ico"><s.icon size={22} /></span>
                  <span>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </span>
                </button>
              ))}
            </div>
            <span className="closing-line" data-reveal="zoom">Todo comienza con lo que ya sabes.</span>
          </div>
          <div className="photo-col" data-reveal="right">
            <Tilt max={8}>
              <div className="photo"><img src={slide6} alt="¿Y cómo se empieza? Descubriendo, comunicando y vendiendo" loading="lazy" /></div>
            </Tilt>
          </div>
        </div>
      </section>

      {/* SPEAKER */}
      <section className="speaker" id="mentora">
        <div className="wrap">
          <div className="speaker-card glass" data-reveal>
            <Tilt max={10}>
              <div className="photo"><img src={slide8} alt="Maura Abarcia, emprendedora digital" loading="lazy" /></div>
            </Tilt>
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="eyebrow">Junto a</span>
              <h2>Maura <span className="hl">Abarcia</span></h2>
              <p className="lead">
                Emprendedora digital con <b>8 años de experiencia</b> construyendo y monetizando su marca personal.
                En esta masterclass aprenderás cómo convertir tus conocimientos en una oportunidad de negocio.
              </p>
              <div className="stat-row">
                <div className="stat"><b>8 años</b><span>emprendiendo en digital</span></div>
                <div className="stat"><b>120 min</b><span>de masterclass en vivo</span></div>
              </div>
              <div className="ig-links">
                <a className="ig" href="https://www.instagram.com/mauraabarcia/" target="_blank" rel="noopener noreferrer">
                  <span className="ig-ico"><Instagram size={18} /></span>@mauraabarcia
                </a>
                <a className="ig" href="https://www.instagram.com/mauraemprende/" target="_blank" rel="noopener noreferrer">
                  <span className="ig-ico"><Instagram size={18} /></span>@mauraemprende
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="details" id="detalles">
        <div className="blob b1" /><div className="blob b3" />
        <div className="wrap">
          <div style={{ maxWidth: 720 }} data-reveal>
            <span className="eyebrow" style={{ color: "var(--yellow)" }}>Detalles del evento</span>
            <h2 className="section-title">Masterclass <span className="hl">Tu negocio desde casa</span></h2>
            <p className="lead">Un espacio para descubrir cómo dar tus primeros pasos en el emprendimiento digital, organizado por Homeschool Cristiano Chile.</p>
          </div>

          <div className="details-grid">
            <div className="dcard span-5" onPointerMove={onCardGlow} data-reveal>
              <span className="ico" style={{ background: "var(--pink)" }}><CalendarDays size={26} /></span>
              <div className="big-date">22 nov<small>Domingo · 2026</small></div>
              <a className="cal-btn" href={CALENDAR_URL} target="_blank" rel="noopener noreferrer"><CalendarPlus size={18} /> Agregar a mi calendario</a>
            </div>

            <div className="dcard span-7" onPointerMove={onCardGlow} data-reveal style={{ "--d": "0.1s" } as React.CSSProperties}>
              <span className="ico" style={{ background: "var(--purple)" }}><Clock size={26} /></span>
              <h3>Horario según tu país</h3>
              <div className="tz-list">
                <div className="tz"><span className="who"><span className="flags"><FlagChile /></span>Chile</span><b>17:00 hrs</b></div>
                <div className="tz"><span className="who"><span className="flags"><FlagMexico /></span>México</span><b>14:00 hrs</b></div>
                <div className="tz"><span className="who"><span className="flags"><FlagColombia /><FlagEcuador /></span>Colombia y Ecuador</span><b>15:00 hrs</b></div>
                {showLocal && (
                  <div className="tz local"><span className="who">Tu hora local ({localDate})</span><b>{localTime} hrs</b></div>
                )}
              </div>
            </div>

            <div className="dcard span-4" onPointerMove={onCardGlow} data-reveal>
              <span className="ico" style={{ background: "var(--yellow)", color: "var(--ink)" }}><Clock size={26} /></span>
              <h3>120 minutos</h3>
              <p>Dos horas de masterclass en vivo para aprender, reflexionar y trabajar sobre tu propia idea.</p>
            </div>
            <div className="dcard span-4" onPointerMove={onCardGlow} data-reveal style={{ "--d": "0.1s" } as React.CSSProperties}>
              <span className="ico" style={{ background: "var(--pink)" }}><Video size={26} /></span>
              <h3>Grabación por 1 semana</h3>
              <p>Acceso a la grabación online del workshop durante una semana, para repasar cuando quieras.</p>
            </div>
            <div className="dcard span-4" onPointerMove={onCardGlow} data-reveal style={{ "--d": "0.2s" } as React.CSSProperties}>
              <span className="ico" style={{ background: "var(--purple)" }}><BookOpen size={26} /></span>
              <h3>Libro digital imprimible</h3>
              <p>Material de trabajo para usar durante la sesión y aterrizar lo aprendido en tu propio proyecto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="valor">
        <div className="wrap">
          <div className="price-card glass" data-reveal="zoom">
            <span className="eyebrow">Inversión</span>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Reserva tu lugar</h2>
            <div className={`toggle ${usd ? "usd" : ""}`} role="group" aria-label="Moneda">
              <span className="knob" />
              <button className={!usd ? "on" : ""} onClick={() => setUsd(false)} aria-pressed={!usd}>CLP</button>
              <button className={usd ? "on" : ""} onClick={() => setUsd(true)} aria-pressed={usd}>USD</button>
            </div>
            <div className="price">
              <span className="price-swap" key={usd ? "usd" : "clp"}>
                {usd ? "$10" : "$10.000"}<span className="cur">{usd ? "USD" : "CLP"}</span>
              </span>
            </div>
            <p className="lead" style={{ fontSize: "1rem" }}>Pago único · Masterclass online</p>
            <ul className="incl">
              {[
                "Masterclass en vivo de 120 minutos",
                "Acceso a la grabación online por una semana",
                "Libro digital imprimible para trabajar en la sesión",
                "Junto a Maura Abarcia, emprendedora digital",
              ].map((t) => (
                <li key={t}><span className="ck"><Check size={16} strokeWidth={3} /></span>{t}</li>
              ))}
            </ul>
            <a href="#inscripcion" className="btn pulse">Quiero inscribirme <ArrowRight size={20} /></a>
          </div>
        </div>
      </section>

      {/* SIGNUP FORM */}
      <section className="signup" id="inscripcion">
        <div className="wrap">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }} data-reveal>
            <span className="eyebrow">Inscripción</span>
            <h2 className="section-title">Completa el formulario y <span className="hl y">reserva tu lugar</span></h2>
            <p className="lead">Déjanos tus datos y te escribiremos para confirmar tu inscripción en «Tu negocio desde casa».</p>
          </div>
          <div className="form-shell glass" data-reveal="zoom">
            <div className="form-head">
              <span className="dots"><i /><i /><i /></span>
              <a className="btn small ghost" href={FORM_URL} target="_blank" rel="noopener noreferrer">Abrir en pestaña nueva <ArrowRight size={14} /></a>
            </div>
            <div className={`form-frame ${formLoaded ? "loaded" : ""}`}>
              <div className="skeleton" aria-hidden="true">
                <i style={{ width: "60%" }} className="tall" /><i style={{ width: "85%" }} /><i style={{ width: "40%" }} />
                <i className="tall" /><i style={{ width: "50%" }} /><i className="tall" /><i style={{ width: "70%" }} /><i className="tall" />
              </div>
              <iframe
                src={FORM_EMBED_URL}
                title="Formulario de inscripción a la masterclass Tu negocio desde casa"
                loading="lazy"
                onLoad={() => setFormLoaded(true)}
              >
                Cargando…
              </iframe>
            </div>
          </div>
          <p className="form-alt">¿No ves el formulario? <a href={FORM_URL} target="_blank" rel="noopener noreferrer">Haz clic aquí para abrirlo</a>.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="preguntas">
        <div className="wrap">
          <div style={{ textAlign: "center" }} data-reveal>
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 className="section-title">Resolvemos tus <span className="hl p">dudas</span></h2>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item ${faq === i ? "on" : ""}`} data-reveal style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}>
                <button className="faq-q" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                  {f.q}
                  <span className="pm"><Plus size={18} /></span>
                </button>
                <div className="faq-a"><div><p>{f.a}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <div className="wrap">
          <div className="final-card" data-reveal="zoom">
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="eyebrow" style={{ color: "var(--yellow)" }}>22 de noviembre · 17:00 Chile</span>
              <h2>Mamá, lo que sabes podría ser el comienzo de algo mucho más grande.</h2>
              <p className="lead" style={{ color: "rgba(255,255,255,0.85)", marginBottom: 28 }}>
                Da tu primer paso en el emprendimiento digital junto a Maura Abarcia y Homeschool Cristiano Chile.
              </p>
              <a href="#inscripcion" className="btn">Reservar mi lugar · $10.000 CLP <ArrowRight size={20} /></a>
            </div>
            <Tilt max={10}>
              <div className="photo"><img src={slide9} alt="Mamá, lo que sabes podría ser el comienzo de algo mucho más grande" loading="lazy" /></div>
            </Tilt>
          </div>
        </div>
      </section>

      <footer>
        © 2026 Homeschool Cristiano Chile · Masterclass «Tu negocio desde casa»
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className={`sticky-cta ${showSticky ? "show" : ""}`}>
        <span><b>Tu negocio desde casa</b><small>22 nov · $10.000 CLP / 10 USD</small></span>
        <a href="#inscripcion" className="btn small">Reservar</a>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Imagen ampliada" onClick={() => setLightbox(null)}>
          <img src={SLIDES[lightbox].src} alt={SLIDES[lightbox].title} key={lightbox} onClick={(e) => e.stopPropagation()} />
          <button className="round-btn lb-close" onClick={() => setLightbox(null)} aria-label="Cerrar"><X /></button>
          <button className="round-btn lb-prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + SLIDES.length) % SLIDES.length); }} aria-label="Anterior"><ChevronLeft /></button>
          <button className="round-btn lb-next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % SLIDES.length); }} aria-label="Siguiente"><ChevronRight /></button>
        </div>
      )}
    </div>
  );
};

export default App;
