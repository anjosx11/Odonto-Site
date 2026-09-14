import { type CSSProperties, type FormEvent, type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

const BASE = import.meta.env.BASE_URL;
const asset = (path: string) => `${BASE}${path.replace(/^\//, "")}`;
const OFFICIAL_WHATSAPP = "5511968825299";
const APPOINTMENT_MESSAGE = "Olá, gostaria de agendar uma consulta na VA Dental Clinic.";
const whatsappUrl = (message: string) => {
  const url = new URL("https://api.whatsapp.com/send");
  url.searchParams.set("phone", OFFICIAL_WHATSAPP);
  url.searchParams.set("text", message);
  return url.toString();
};

const nav = [
  ["A clínica", "clinica"],
  ["A dentista", "dentista"],
  ["Especialidades", "especialidades"],
  ["Contato", "contato"],
] as const;

const specialties = [
  { title: "Harmonização orofacial", text: "Procedimentos estéticos que buscam equilíbrio e harmonia facial, respeitando a naturalidade de cada paciente." },
  { title: "Reabilitações dentárias", text: "Tratamentos planejados para recuperar estética, função e qualidade de vida através de soluções personalizadas." },
  { title: "Estética com resinas", text: "Técnicas modernas para transformar o sorriso com naturalidade, beleza e preservação da estrutura dental." },
  { title: "Invisalign", text: "Alinhadores transparentes, confortáveis e discretos para correção do sorriso com tecnologia avançada." },
  { title: "Clareamento", text: "Tratamento estético para deixar o sorriso mais luminoso com segurança e acompanhamento profissional." },
  { title: "Ortodontia", text: "Correção do posicionamento dos dentes, melhorando estética, função e saúde bucal." },
];

const heroImages = [
  { src: "/assets/hero/1b.jpg", webp: "/assets/hero/1b.webp", smallWebp: "/assets/hero/1b-360.webp", alt: "Dra. Verônica Assis sorrindo na VA Dental Clinic", width: 537, height: 659, desktopPosition: "50% 42%", mobilePosition: "50% 34%" },
  { src: "/assets/hero/2b.jpg", webp: "/assets/hero/2b.webp", smallWebp: "/assets/hero/2b-360.webp", alt: "Sala de espera da VA Dental Clinic", width: 537, height: 659, desktopPosition: "50% 50%", mobilePosition: "50% 46%" },
  { src: "/assets/hero/3b.jpg", webp: "/assets/hero/3b.webp", smallWebp: "/assets/hero/3b-360.webp", alt: "Cadeira e equipamentos do consultório odontológico", width: 537, height: 659, desktopPosition: "52% 50%", mobilePosition: "52% 44%" },
  { src: "/assets/hero/4b.jpg", webp: "/assets/hero/4b.webp", smallWebp: "/assets/hero/4b-360.webp", alt: "Consultório da VA Dental Clinic", width: 537, height: 659, desktopPosition: "50% 48%", mobilePosition: "50% 44%" },
  { src: "/assets/hero/5b.jpg", webp: "/assets/hero/5b.webp", smallWebp: "/assets/hero/5b-360.webp", alt: "Sala clínica preparada para atendimento", width: 537, height: 659, desktopPosition: "50% 48%", mobilePosition: "50% 44%" },
  { src: "/assets/hero/6b.jpg", webp: "/assets/hero/6b.webp", smallWebp: "/assets/hero/6b-360.webp", alt: "Recepção da VA Dental Clinic", width: 537, height: 659, desktopPosition: "50% 50%", mobilePosition: "50% 46%" },
];

const clinicImages = [
  { src: "/assets/clinic/clinica1.jpg", webp: "/assets/clinic/clinica1.webp", smallWebp: "/assets/clinic/clinica1-360.webp", alt: "Consultório azul e madeira da VA Dental Clinic", width: 585, height: 675, desktopPosition: "50% 48%", mobilePosition: "50% 48%" },
  { src: "/assets/clinic/clinica2.jpg", webp: "/assets/clinic/clinica2.webp", smallWebp: "/assets/clinic/clinica2-360.webp", alt: "Consultório iluminado da VA Dental Clinic", width: 585, height: 675, desktopPosition: "50% 46%", mobilePosition: "50% 46%" },
  { src: "/assets/clinic/clinica3.jpg", webp: "/assets/clinic/clinica3.webp", smallWebp: "/assets/clinic/clinica3-360.webp", alt: "Lavabo da VA Dental Clinic", width: 585, height: 675, desktopPosition: "50% 50%", mobilePosition: "50% 50%" },
  { src: "/assets/clinic/clinica4.jpg", webp: "/assets/clinic/clinica4.webp", smallWebp: "/assets/clinic/clinica4-360.webp", alt: "Sala de atendimento odontológico da VA Dental Clinic", width: 585, height: 675, desktopPosition: "50% 45%", mobilePosition: "50% 45%" },
];

const doctorImages = [
  { src: "/assets/doctor/1.jpg", webp: "/assets/doctor/1.webp", smallWebp: "/assets/doctor/1-360.webp", alt: "Dra. Verônica Assis atendendo uma paciente", width: 585, height: 675, desktopPosition: "50% 36%", mobilePosition: "50% 36%" },
  { src: "/assets/doctor/2.jpg", webp: "/assets/doctor/2.webp", smallWebp: "/assets/doctor/2-360.webp", alt: "Dra. Verônica Assis apresentando alinhadores transparentes", width: 585, height: 675, desktopPosition: "50% 25%", mobilePosition: "50% 25%" },
  { src: "/assets/doctor/3.jpg", webp: "/assets/doctor/3.webp", smallWebp: "/assets/doctor/3-360.webp", alt: "Retrato da Dra. Verônica Assis na clínica", width: 585, height: 675, desktopPosition: "50% 24%", mobilePosition: "50% 24%" },
  { src: "/assets/doctor/4.jpg", webp: "/assets/doctor/4.webp", smallWebp: "/assets/doctor/4-360.webp", alt: "Dra. Verônica Assis preparando o consultório", width: 585, height: 675, desktopPosition: "50% 35%", mobilePosition: "50% 35%" },
  { src: "/assets/doctor/5.jpg", webp: "/assets/doctor/5.webp", smallWebp: "/assets/doctor/5-360.webp", alt: "Dra. Verônica Assis em um ambiente de acolhimento", width: 585, height: 675, desktopPosition: "50% 25%", mobilePosition: "50% 25%" },
];

type CarouselImage = { src: string; webp: string; smallWebp: string; alt: string; width: number; height: number; desktopPosition: string; mobilePosition: string };

function useCarousel(images: readonly CarouselImage[], paused = false, interval = 4800) {
  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);

  const show = useCallback((nextIndex: number) => {
    setIndex((current) => {
      const normalized = (nextIndex + images.length) % images.length;
      if (normalized !== current) setPrevious(current);
      return normalized;
    });
  }, [images.length]);

  useEffect(() => {
    const next = new Image();
    next.src = asset(images[(index + 1) % images.length].src);
  }, [images, index]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    const start = () => {
      window.clearInterval(timer);
      if (!paused && !media.matches && !document.hidden) timer = window.setInterval(() => show(index + 1), interval);
    };
    start();
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
    };
  }, [index, interval, paused, show]);

  return { index, previous, show };
}

function PhotoCarousel({ images, className = "", eager = false, label }: { images: readonly CarouselImage[]; className?: string; eager?: boolean; label: string }) {
  const [engaged, setEngaged] = useState(false);
  const [interactionPause, setInteractionPause] = useState(false);
  const paused = engaged || interactionPause;
  const { index, previous, show } = useCarousel(images, paused);
  const pointerStart = useRef<number | null>(null);
  const resumeTimer = useRef<number>(0);
  const visible = previous === null ? [index] : [previous, index];

  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  const interact = (nextIndex: number) => {
    window.clearTimeout(resumeTimer.current);
    setInteractionPause(true);
    show(nextIndex);
    resumeTimer.current = window.setTimeout(() => setInteractionPause(false), 9000);
  };

  const finishSwipe = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) > 42) interact(index + (distance < 0 ? 1 : -1));
  };

  return (
    <div className={`photo-carousel ${className}${paused ? " is-paused" : ""}`} role="region" aria-roledescription="carrossel" aria-label={label} onMouseEnter={() => setEngaged(true)} onMouseLeave={() => setEngaged(false)} onFocus={() => setEngaged(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setEngaged(false); }} onPointerDown={(event) => { pointerStart.current = event.clientX; }} onPointerUp={finishSwipe} onPointerCancel={() => { pointerStart.current = null; }}>
      <div className="carousel-images">
        {visible.map((imageIndex) => {
          const image = images[imageIndex];
          const style = { "--desktop-position": image.desktopPosition, "--mobile-position": image.mobilePosition } as CSSProperties;
          return <picture key={imageIndex} className={imageIndex === index ? "is-current" : "is-leaving"} style={style} aria-hidden={imageIndex !== index}>
            <source type="image/webp" srcSet={`${asset(image.smallWebp)} 360w, ${asset(image.webp)} ${image.width}w`} sizes="(max-width: 720px) 100vw, 585px" />
            <img src={asset(image.src)} alt={imageIndex === index ? image.alt : ""} width={image.width} height={image.height} loading={eager && imageIndex === 0 ? "eager" : "lazy"} fetchPriority={eager && imageIndex === 0 ? "high" : "auto"} decoding="async" />
          </picture>;
        })}
      </div>
      <div className="carousel-controls">
        <button type="button" onClick={() => interact(index - 1)} aria-label="Foto anterior">←</button>
        <span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => interact(index + 1)} aria-label="Próxima foto">→</button>
      </div>
    </div>
  );
}

function Arrow() {
  return <svg viewBox="0 0 32 16" aria-hidden="true"><path d="M1 8h28M23 2l6 6-6 6" /></svg>;
}

function Tooth() {
  return (
    <svg className="tooth-svg" viewBox="0 0 360 440" role="img" aria-label="Ilustração abstrata de um dente">
      <defs>
        <radialGradient id="toothFill" cx="35%" cy="22%" r="86%">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset=".32" stopColor="#edf1f5" />
          <stop offset=".7" stopColor="#bac6d5" />
          <stop offset="1" stopColor="#657b9b" />
        </radialGradient>
        <linearGradient id="toothEdge" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#ffffff" stopOpacity=".9" />
          <stop offset="1" stopColor="#8c9bb3" stopOpacity=".1" />
        </linearGradient>
        <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <ellipse cx="180" cy="398" rx="108" ry="20" fill="#06152d" opacity=".3" filter="url(#softShadow)" />
      <path d="M82 48C112 20 151 31 180 45c29-14 68-25 98 3 47 44 22 124 2 181-17 49-20 147-61 151-29 3-24-96-39-96s-10 99-39 96c-41-4-44-102-61-151C60 172 35 92 82 48Z" fill="url(#toothFill)" stroke="url(#toothEdge)" strokeWidth="3" />
      <path d="M91 57c24 7 51 14 89 8 38 6 65-1 89-8-19-25-55-19-89-3-34-16-70-22-89 3Z" fill="#fff" opacity=".38" />
      <path d="M98 70c26-19 53-3 82 8 29-11 56-27 82-8" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity=".6" />
      <path d="M111 100c-14 49-2 96 17 132" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".42" />
      <path d="M180 77c-8 58-5 123 0 179" fill="none" stroke="#526987" strokeWidth="2" opacity=".2" />
      <path d="M244 95c17 42 6 93-9 126" fill="none" stroke="#526987" strokeWidth="4" strokeLinecap="round" opacity=".16" />
    </svg>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`wordmark${light ? " wordmark--light" : ""}`}>
      <img src={asset("/assets/logo-transparent.png")} alt="VA Dental Clinic — Odontologia" width="400" height="227" />
    </span>
  );
}

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [specialty, setSpecialty] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");
  const [footerVisible, setFooterVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const blockers = [document.querySelector(".photo-transition"), document.querySelector(".contact"), footerRef.current].filter((element): element is Element => Boolean(element));
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      setFooterVisible(visible.size > 0);
    }, { rootMargin: "64px 0px" });
    blockers.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    const target = document.getElementById(targetId);
    target?.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
    requestAnimationFrame(() => target?.scrollIntoView({ block: "start" }));
  }, []);

  useEffect(() => {
    const sections = ["inicio", ...nav.map(([, id]) => id)].map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: "-28% 0px -58%", threshold: [0, .1, .35] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.14 });
    root.querySelectorAll("[data-reveal]").forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) element.classList.add("is-visible");
      revealObserver.observe(element);
    });
    root.classList.add("motion-enabled");

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const hero = Math.min(1, scrollY / Math.max(window.innerHeight * 1.25, 1));
      const story = document.querySelector<HTMLElement>(".manifesto");
      const storyRect = story?.getBoundingClientRect();
      const storyProgress = storyRect ? Math.min(1, Math.max(0, 1 - storyRect.bottom / (window.innerHeight + storyRect.height))) : 0;
      root.style.setProperty("--hero", reduceMotion ? "1" : String(hero));
      root.style.setProperty("--story", String(storyProgress));
      root.classList.toggle("is-scrolled", scrollY > 48);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const field = (name: string) => {
      const value = data.get(name);
      return typeof value === "string" ? value.trim() : "";
    };
    const name = field("name");
    const phone = field("phone");
    const email = field("email");
    const contactMessage = field("message");
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement | null;
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneInput && (phoneDigits.length < 10 || phoneDigits.length > 13)) {
      phoneInput.setCustomValidity("Informe um WhatsApp válido, com DDD.");
      phoneInput.reportValidity();
      return;
    }
    phoneInput?.setCustomValidity("");
    if (!name || !phone || !email || !contactMessage) return;
    const message = [
      "Olá, gostaria de agendar uma consulta na VA Dental Clinic.",
      `Nome: ${name}`,
      `WhatsApp: ${phone}`,
      `E-mail: ${email}`,
      `Mensagem: ${contactMessage}`,
    ].join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site" ref={rootRef}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="header">
        <a href="#inicio" className="brand" aria-label="VA Dental Clinic — início"><Logo /></a>
        <nav aria-label="Navegação principal">
          {nav.map(([label, id]) => <a href={`#${id}`} key={id} className={activeSection === id ? "is-active" : ""} aria-current={activeSection === id ? "location" : undefined}>{label}</a>)}
        </nav>
        <a className="header-cta" href={whatsappUrl(APPOINTMENT_MESSAGE)} target="_blank" rel="noopener noreferrer"><span>Agendar consulta</span><Arrow /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </header>

      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <Logo light />
        <nav>{nav.map(([label, id]) => <a href={`#${id}`} key={id} className={activeSection === id ? "is-active" : ""} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}</nav>
        <a href={whatsappUrl(APPOINTMENT_MESSAGE)} target="_blank" rel="noopener noreferrer">Agendar pelo WhatsApp</a>
      </div>

      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-sticky">
            <PhotoCarousel images={heroImages} className="hero-carousel" eager label="Fotografias da VA Dental Clinic" />
            <div className="hero-copy">
              <p className="eyebrow"><span>VA Dental Clinic</span><span>Saúde &amp; estética</span></p>
              <h1><span>Seja bem-vindo(a)</span><em>ao meu universo.</em></h1>
              <p className="hero-intro">Aqui, cada sorriso é cuidado com alma.</p>
              <a className="hero-cta" href={whatsappUrl(APPOINTMENT_MESSAGE)} target="_blank" rel="noopener noreferrer">Agendar pelo WhatsApp <Arrow /></a>
            </div>
            <div className="tooth-stage" aria-hidden="true"><div className="tooth-orbit" /><div className="tooth-object"><Tooth /></div></div>
            <div className="hero-index"><span>VA</span><i /><span>01</span></div>
          </div>
        </section>

        <section className="manifesto" id="clinica">
          <div className="clinic-shell">
            <div className="clinic-heading" data-reveal>
              <p className="section-kicker">A clínica</p>
              <h2>Seja bem-vindo à<br />VA Dental Clinic</h2>
              <p>Onde excelência clínica, estética e acolhimento caminham lado a lado.</p>
            </div>
            <PhotoCarousel images={clinicImages} className="clinic-carousel" label="Ambientes da VA Dental Clinic" />
            <div className="clinic-body" data-reveal>
              <p>Sob o cuidado da Dra. Verônica Assis, cirurgiã-dentista com sólida formação clínica e olhar estético refinado, a VA Dental Clinic foi criada para oferecer mais do que tratamentos odontológicos: oferecemos experiências transformadoras.</p>
              <p>A VA Dental Clinic é um espaço íntimo, onde você será acolhido com discrição e cuidado, em uma jornada odontológica leve e sofisticada.</p>
              <a className="text-link" href="#especialidades">Conheça as especialidades <Arrow /></a>
            </div>
          </div>
        </section>

        <section className="doctor" id="dentista">
          <PhotoCarousel images={doctorImages} className="doctor-carousel" label="Fotografias da Dra. Verônica Assis" />
          <div className="doctor-copy">
            <p className="section-kicker">Quem sou eu?</p>
            <h2 data-reveal>Dra. Verônica Assis</h2>
            <div className="doctor-text" data-reveal>
              <p>Sou a Dra. Verônica Assis, dentista apaixonada pela arte de cuidar de sorrisos e de pessoas.</p>
              <p>Especialista em ortodontia e master em alinhadores invisíveis, encontrei na odontologia uma forma de transformar vidas com leveza e beleza.</p>
              <p>Acredito em um atendimento humano, gentil e respeitoso. Cada paciente é único e merece ser ouvido com atenção e tratado com amor.</p>
              <p>Trabalho com dedicação, carinho e um olhar atento aos detalhes. Para mim, conforto e elegância também fazem parte do tratamento.</p>
              <p>Mais do que alinhar dentes, meu propósito é alinhar autoestima, bem-estar e confiança.</p>
            </div>
            <a className="text-link" href="#contato">Entre em contato <Arrow /></a>
          </div>
        </section>

        <section className="specialties" id="especialidades">
          <div className="specialties-heading">
            <p className="section-kicker">Tratamentos</p>
            <h2 data-reveal>Nossas especialidades</h2>
          </div>
          <div className="specialty-panels" onMouseLeave={() => setSpecialty(0)}>
            {specialties.map((item, index) => (
              <button key={item.title} className={specialty === index ? "is-active" : ""} type="button" onMouseEnter={() => setSpecialty(index)} onFocus={() => setSpecialty(index)} onClick={() => setSpecialty(index)} aria-expanded={specialty === index}>
                <span className="specialty-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="specialty-content"><strong>{item.title}</strong><p>{item.text}</p><i>{specialty === index ? "−" : "+"}</i></span>
                <Arrow />
              </button>
            ))}
          </div>
          <div className="specialties-note"><span>Odontologia personalizada</span><p>Cada plano parte de uma avaliação individual. Indicações e possibilidades são definidas em consulta.</p></div>
        </section>

        <section className="photo-transition" aria-label="Compromisso da VA Dental Clinic">
          <picture className="photo-transition-media" data-reveal><source type="image/webp" srcSet={`${asset("/assets/doctor/3-360.webp")} 360w, ${asset("/assets/doctor/3.webp")} 585w`} sizes="(max-width: 720px) 42vw, 500px" /><img src={asset("/assets/doctor/3.jpg")} alt="Dra. Verônica Assis na VA Dental Clinic" width="585" height="675" loading="lazy" /></picture>
          <div data-reveal><p>Sorrisos têm o poder de transformar. Esse é o nosso compromisso com você.</p><a className="hero-cta" href={whatsappUrl(APPOINTMENT_MESSAGE)} target="_blank" rel="noopener noreferrer">Agendar pelo WhatsApp <Arrow /></a></div>
        </section>

        <section className="contact" id="contato">
          <div className="contact-intro">
            <p className="section-kicker">Entre em contato</p>
            <h2 data-reveal>Agende sua consulta</h2>
            <p>Preencha seus dados para iniciar o atendimento diretamente pelo WhatsApp.</p>
            <a href="tel:+5511968825299">(11) 96882-5299</a>
            <a href="mailto:contato@vadentalclinic.com.br">contato@vadentalclinic.com.br</a>
          </div>
          <form onSubmit={submitContact}>
            <label><span>Seu nome</span><input name="name" type="text" autoComplete="name" required placeholder="Como podemos chamar você?" /></label>
            <div className="form-row"><label><span>WhatsApp com DDD</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={10} onInput={(event) => event.currentTarget.setCustomValidity("")} placeholder="(11) 99999-9999" /></label><label><span>Seu e-mail</span><input name="email" type="email" autoComplete="email" required placeholder="voce@email.com" /></label></div>
            <label><span>Mensagem</span><textarea name="message" rows={3} required minLength={3} placeholder="Como podemos ajudar?" /></label>
            <button type="submit"><span>Enviar pelo WhatsApp</span><Arrow /></button>
          </form>
        </section>

        <section className="locations">
          <article><span>Clínica 01 · Bela Vista</span><h3>Rua Maestro Cardim, 1251<br />Sala 15 · São Paulo/SP</h3><a href="https://www.google.com/maps/search/?api=1&query=Rua%20Maestro%20Cardim%2C%201251%20-%20Sala%2015%2C%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP" target="_blank" rel="noopener noreferrer">Abrir no mapa <Arrow /></a></article>
          <article><span>Clínica 02 · Bela Vista</span><h3>Rua Bom Pastor, 2100<br />Conjunto 305 · São Paulo/SP</h3><a href="https://www.google.com/maps/search/?api=1&query=Rua%20Bom%20Pastor%2C%202100%20-%20Conjunto%20305%2C%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP" target="_blank" rel="noopener noreferrer">Abrir no mapa <Arrow /></a></article>
        </section>
      </main>

      <a className={`whatsapp-float${footerVisible ? " is-hidden" : ""}`} href={whatsappUrl("Olá, gostaria de saber mais sobre a VA Dental Clinic.")} target="_blank" rel="noopener noreferrer" aria-label="Falar com a VA Dental Clinic pelo WhatsApp" title="Falar pelo WhatsApp"><WhatsAppIcon /></a>

      <footer ref={footerRef}>
        <Logo light />
        <div><p>Clínica Integrada de Saúde e Estética Ltda.<br />CNPJ: 49.797.526/0001-33</p><nav>{nav.map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VA Dental Clinic</span><span>Todos os direitos reservados</span><a href="#inicio">Voltar ao topo ↑</a></div>
      </footer>
    </div>
  );
}
