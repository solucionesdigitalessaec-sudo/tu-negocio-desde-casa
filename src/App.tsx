import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Gift,
  CalendarPlus,
  Check,
  Clock,
  Instagram,
  Video,
} from "lucide-react";
import "./masterclass.css";

import logo from "./assets/logo.webp";
import logoFull from "./assets/logo-full.webp";
import slide1 from "./assets/slide-1.webp";
import slide8 from "./assets/slide-8.webp";
import slide9 from "./assets/slide-9.webp";

const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSegrEjMlKJ9ynZe41kQURsvDF2y_mQGBjJ0M6ulg9m-6JAb9Q/viewform";
const FORM_EMBED_URL = `${FORM_URL}?embedded=true`;
// Mercado Pago payment link. Shown in a panel (opened in a new tab) right after the
// embedded form is submitted, because Mercado Pago refuses to load inside an iframe.
const PAYMENT_URL = "";
// 22 nov 2026, 17:00 Chile (UTC-3) = 20:00 UTC
const EVENT_START = new Date("2026-11-22T20:00:00Z");
const EVENT_END = new Date("2026-11-22T22:00:00Z");

const CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  "&text=" + encodeURIComponent("Masterclass: Tu negocio desde casa") +
  "&dates=20261122T200000Z/20261122T220000Z" +
  "&details=" + encodeURIComponent("Masterclass online de Homeschool Cristiano Chile junto a Maura Abarcia. Duración: 120 minutos.");

/* ---------------- hooks ---------------- */

const useReveal = (root: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>("[data-reveal], .underline");
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          // attribute, not class: React rewrites className when a dynamic class changes
          e.target.setAttribute("data-visible", "");
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


  const [formLoaded, setFormLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const formLoads = useRef(0);
  const formPanelRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="mc" ref={rootRef}>
      <div className="progress" aria-hidden="true" />

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} aria-label="Principal">
        <a href="#top" className="brand">
          <img className="brand-logo" src={logo} alt="" width={44} height={44} />
          <span>Homeschool<br />Cristiano Chile</span>
        </a>
        <div className="nav-links">
          <a href="#mentora">Mentora</a>
          <a href="#detalles">Detalles</a>
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
          </div>

          <div className="hero-visual" data-reveal="zoom" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <Tilt max={12}>
              <div className="photo"><img src={slide1} alt="Mamá pensando en su idea de negocio" width={900} height={1125} fetchPriority="high" /></div>
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
            <div className="host">
              <img src={logo} alt="" width={56} height={56} loading="lazy" />
              <span>Organiza<b>Homeschool Cristiano Chile</b></span>
            </div>
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

            <div className="dcard bonus span-12" onPointerMove={onCardGlow} data-reveal>
              <span className="ico" style={{ background: "var(--yellow)", color: "var(--ink)" }}><Gift size={26} /></span>
              <div>
                <span className="bonus-tag">Bonus exclusivo</span>
                <h3>Sesión de Claridad 1:1 con Maura (30 minutos)</h3>
                <p>Un espacio personalizado donde revisaremos tu idea de negocio o emprendimiento actual, identificaremos oportunidades y definiremos cuál podría ser tu próximo paso para avanzar con claridad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNUP FORM */}
      <section className="signup" id="inscripcion">
        <div className="wrap">
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto" }} data-reveal>
            <span className="eyebrow">Inscripción</span>
            <h2 className="section-title">Completa el formulario y verás en pantalla el <span className="hl y">LINK DE PAGO</span></h2>
            <p className="lead">para confirmar tu inscripción en «Tu negocio desde casa».</p>
          </div>
          <div className="form-shell glass" data-reveal="zoom">
            <div className="form-head">
              <span className="dots"><i /><i /><i /></span>
              <a className="btn small ghost" href={FORM_URL} target="_blank" rel="noopener noreferrer">Abrir en pestaña nueva <ArrowRight size={14} /></a>
            </div>
            {submitted ? (
              <div className="pay-panel" ref={formPanelRef} role="status">
                <span className="pay-check"><Check size={34} strokeWidth={3} /></span>
                <h3>¡Recibimos tu inscripción!</h3>
                <p className="lead">Último paso: realiza tu pago para confirmar tu lugar en «Tu negocio desde casa».</p>
                <a className="btn pulse" href={PAYMENT_URL} target="_blank" rel="noopener noreferrer">Pagar con Mercado Pago <ArrowRight size={20} /></a>
                <p className="pay-price">Valor: $10.000 CLP · 10 USD</p>
                <button
                  type="button"
                  className="pay-again"
                  onClick={() => { formLoads.current = 0; setFormLoaded(false); setSubmitted(false); setFormKey((k) => k + 1); }}
                >
                  Inscribir a otra persona
                </button>
              </div>
            ) : (
              <div className={`form-frame ${formLoaded ? "loaded" : ""}`}>
                <div className="skeleton" aria-hidden="true">
                  <i style={{ width: "60%" }} className="tall" /><i style={{ width: "85%" }} /><i style={{ width: "40%" }} />
                  <i className="tall" /><i style={{ width: "50%" }} /><i className="tall" /><i style={{ width: "70%" }} /><i className="tall" />
                </div>
                <iframe
                  key={formKey}
                  src={FORM_EMBED_URL}
                  title="Formulario de inscripción a la masterclass Tu negocio desde casa"
                  loading="lazy"
                  onLoad={() => {
                    // 1st load = the form; a 2nd load means Google navigated to the confirmation page
                    formLoads.current += 1;
                    setFormLoaded(true);
                    if (formLoads.current >= 2 && PAYMENT_URL) {
                      setSubmitted(true);
                      requestAnimationFrame(() => formPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
                    }
                  }}
                >
                  Cargando…
                </iframe>
              </div>
            )}
          </div>
          <p className="form-alt">¿No ves el formulario? <a href={FORM_URL} target="_blank" rel="noopener noreferrer">Haz clic aquí para abrirlo</a>.</p>
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
        <img className="footer-logo" src={logoFull} alt="Homeschool Cristiano Chile" width={140} height={140} loading="lazy" />
        © 2026 Homeschool Cristiano Chile · Masterclass «Tu negocio desde casa»
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className={`sticky-cta ${showSticky ? "show" : ""}`}>
        <span><b>Tu negocio desde casa</b><small>22 nov · $10.000 CLP / 10 USD</small></span>
        <a href="#inscripcion" className="btn small">Reservar</a>
      </div>

    </div>
  );
};

export default App;
