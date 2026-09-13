import { type CSSProperties, type FormEvent, useCallback, useEffect, useRef, useState } from "react";

const BASE = import.meta.env.BASE_URL;
const asset = (path: string) => `${BASE}${path.replace(/^\//, "")}`;
const WHATSAPP = "https://api.whatsapp.com/send?phone=5511968825299";

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

const journey = [
  { number: "01", title: "Primeiro contato e escuta", text: "Uma conversa atenta para compreender você e suas necessidades." },
  { number: "02", title: "Avaliação e planejamento", text: "Cada detalhe é considerado para construir um cuidado coerente, seguro e personalizado." },
  { number: "03", title: "Tratamento personalizado", text: "A condução acontece com clareza, delicadeza e respeito à sua individualidade." },
  { number: "04", title: "Acompanhamento", text: "O cuidado continua com atenção próxima à saúde, ao conforto e ao bem-estar." },
];

const heroImages = [
  { src: "/assets/hero/1b.jpg", alt: "Dra. Verônica Assis sorrindo na VA Dental Clinic", position: "50% 28%" },
  { src: "/assets/hero/2b.jpg", alt: "Sala de espera da VA Dental Clinic", position: "50% 52%" },
  { src: "/assets/hero/3b.jpg", alt: "Cadeira e equipamentos do consultório odontológico", position: "50% 48%" },
  { src: "/assets/hero/4b.jpg", alt: "Consultório da VA Dental Clinic", position: "50% 48%" },
  { src: "/assets/hero/5b.jpg", alt: "Sala clínica preparada para atendimento", position: "50% 50%" },
  { src: "/assets/hero/6b.jpg", alt: "Recepção da VA Dental Clinic", position: "50% 48%" },
];

const clinicImages = [
  { src: "/assets/clinic/clinica1.jpg", alt: "Consultório azul e madeira da VA Dental Clinic", position: "50% 48%" },
  { src: "/assets/clinic/clinica2.jpg", alt: "Consultório iluminado da VA Dental Clinic", position: "50% 46%" },
  { src: "/assets/clinic/clinica3.jpg", alt: "Lavabo da VA Dental Clinic", position: "50% 50%" },
  { src: "/assets/clinic/clinica4.jpg", alt: "Sala de atendimento odontológico da VA Dental Clinic", position: "50% 45%" },
];

const doctorImages = [
  { src: "/assets/doctor/1.jpg", alt: "Dra. Verônica Assis atendendo uma paciente", position: "50% 36%" },
  { src: "/assets/doctor/2.jpg", alt: "Dra. Verônica Assis apresentando alinhadores transparentes", position: "50% 25%" },
  { src: "/assets/doctor/3.jpg", alt: "Retrato da Dra. Verônica Assis na clínica", position: "50% 24%" },
  { src: "/assets/doctor/4.jpg", alt: "Dra. Verônica Assis preparando o consultório", position: "50% 35%" },
  { src: "/assets/doctor/5.jpg", alt: "Dra. Verônica Assis em um ambiente de acolhimento", position: "50% 25%" },
];

type CarouselImage = { src: string; alt: string; position: string };

function useCarousel(images: readonly CarouselImage[], interval = 4800) {
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
      if (!media.matches && !document.hidden) timer = window.setInterval(() => show(index + 1), interval);
    };
    start();
    document.addEventListener("visibilitychange", start);
    media.addEventListener("change", start);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", start);
      media.removeEventListener("change", start);
    };
  }, [index, interval, show]);

  return { index, previous, show };
}

function PhotoCarousel({ images, className = "", eager = false, label }: { images: readonly CarouselImage[]; className?: string; eager?: boolean; label: string }) {
  const { index, previous, show } = useCarousel(images);
  const visible = previous === null ? [index] : [previous, index];
  return (
    <div className={`photo-carousel ${className}`} role="region" aria-roledescription="carrossel" aria-label={label}>
      <div className="carousel-images">
        {visible.map((imageIndex) => {
          const image = images[imageIndex];
          return <img key={imageIndex} className={imageIndex === index ? "is-current" : "is-leaving"} src={asset(image.src)} alt={imageIndex === index ? image.alt : ""} aria-hidden={imageIndex !== index} loading={eager && imageIndex === 0 ? "eager" : "lazy"} fetchPriority={eager && imageIndex === 0 ? "high" : "auto"} decoding="async" style={{ objectPosition: image.position }} />;
        })}
      </div>
      <div className="carousel-controls">
        <button type="button" onClick={() => show(index - 1)} aria-label="Foto anterior">←</button>
        <span aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => show(index + 1)} aria-label="Próxima foto">→</button>
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
      <img src={asset("/assets/logo.jpg")} alt="VA Dental Clinic — Odontologia" />
    </span>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [specialty, setSpecialty] = useState(0);
  const [journeyStep, setJourneyStep] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { rootMargin: "80px 0px" });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView());
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = rootRef.current;
    if (!root) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible"));
    }, { threshold: 0.14 });
    root.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

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
      const footer = footerRef.current;
      if (footer) setFooterVisible(footer.getBoundingClientRect().top < window.innerHeight + 80);

      const journeyElement = document.querySelector<HTMLElement>(".journey");
      if (journeyElement) {
        const rect = journeyElement.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight * .62 - rect.top) / Math.max(rect.height - window.innerHeight * .45, 1)));
        root.style.setProperty("--journey", String(progress));
        setJourneyStep(Math.min(journey.length - 1, Math.floor(progress * journey.length)));
      }
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
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const contactMessage = String(data.get("message") ?? "").trim();
    if (!name || !phone || !email || !contactMessage) return;
    const message = [
      "Olá, gostaria de agendar uma consulta na VA Dental Clinic.",
      `Nome: ${name}`,
      `WhatsApp: ${phone}`,
      `E-mail: ${email}`,
      `Mensagem: ${contactMessage}`,
    ].join("\n");
    window.open(`${WHATSAPP}&text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site" ref={rootRef}>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header className="header">
        <a href="#inicio" className="brand" aria-label="VA Dental Clinic — início"><Logo light /></a>
        <nav aria-label="Navegação principal">
          {nav.map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}
        </nav>
        <a className="header-cta" href={`${WHATSAPP}&text=${encodeURIComponent("Olá, gostaria de agendar uma consulta na VA Dental Clinic.")}`} target="_blank" rel="noreferrer"><span>Agendar consulta</span><Arrow /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      </header>

      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <Logo light />
        <nav>{nav.map(([label, id], index) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}><small>0{index + 1}</small>{label}<Arrow /></a>)}</nav>
        <a href={`${WHATSAPP}&text=${encodeURIComponent("Olá, gostaria de agendar uma consulta na VA Dental Clinic.")}`} target="_blank" rel="noreferrer">Agendar pelo WhatsApp</a>
      </div>

      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-sticky">
            <PhotoCarousel images={heroImages} className="hero-carousel" eager label="Fotografias da VA Dental Clinic" />
            <div className="hero-wash" />
            <div className="hero-copy">
              <p className="eyebrow"><span>VA Dental Clinic</span><span>Saúde &amp; estética</span></p>
              <h1><span>Seja bem-vindo(a)</span><em>ao meu universo.</em></h1>
              <p className="hero-intro">Aqui, cada sorriso é cuidado com alma.</p>
              <a className="hero-cta" href={`${WHATSAPP}&text=${encodeURIComponent("Olá, gostaria de agendar uma consulta na VA Dental Clinic.")}`} target="_blank" rel="noreferrer">Agendar pelo WhatsApp <Arrow /></a>
            </div>
            <div className="tooth-stage" aria-hidden="true"><div className="tooth-orbit" /><div className="tooth-object"><Tooth /></div></div>
            <div className="hero-index"><span>VA</span><i /><span>01</span></div>
          </div>
        </section>

        <section className="manifesto" id="clinica">
          <div className="section-label"><span>01</span><p>A VA Dental</p></div>
          <div className="clinic-copy" data-reveal>
            <h2>Seja bem-vindo à<br />VA Dental Clinic</h2>
            <div><p>Onde excelência clínica, estética e acolhimento caminham lado a lado.</p><p>Sob o cuidado da Dra. Verônica Assis, cirurgiã-dentista com sólida formação clínica e olhar estético refinado, a VA Dental Clinic foi criada para oferecer mais do que tratamentos odontológicos: oferecemos experiências transformadoras.</p><p>A VA Dental Clinic é um espaço íntimo, onde você será acolhido com discrição e cuidado, em uma jornada odontológica leve e sofisticada.</p></div>
          </div>
          <div className="manifesto-foot" data-reveal><p>Sorrisos têm o poder de transformar. Esse é o nosso compromisso com você.</p><a href="#especialidades">Conheça as especialidades <Arrow /></a></div>
        </section>

        <section className="clinic-gallery" aria-label="Ambientes da clínica">
          <div className="gallery-lead" data-reveal><span>A clínica</span><h2>Conheça nossos<br /><em>ambientes</em></h2></div>
          <PhotoCarousel images={clinicImages} className="clinic-carousel" label="Ambientes da VA Dental Clinic" />
        </section>

        <section className="doctor" id="dentista">
          <PhotoCarousel images={doctorImages} className="doctor-carousel" label="Fotografias da Dra. Verônica Assis" />
          <div className="doctor-copy">
            <div className="section-label"><span>02</span><p>Quem sou eu?</p></div>
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
            <div className="section-label"><span>03</span><p>Especialidades</p></div>
            <h2 data-reveal>Nossas<br /><em>Especialidades</em></h2>
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

        <section className="journey" id="jornada">
          <div className="journey-sticky">
            <div className="journey-heading">
              <div className="section-label"><span>04</span><p>Sua jornada</p></div>
              <h2>Como funciona<br />o <em>atendimento</em></h2>
              <div className="journey-photo"><img src={asset("/assets/hero/molde2.jpg")} alt="Consultórios e recepção da VA Dental Clinic" loading="lazy" /></div>
            </div>
            <div className="journey-steps">
              <div className="journey-line"><i /></div>
              {journey.map((step, index) => (
                <article key={step.number} className={index <= journeyStep ? "is-active" : ""}>
                  <span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="contact" id="contato">
          <div className="contact-intro">
            <div className="section-label"><span>05</span><p>Entre em contato</p></div>
            <h2 data-reveal>Agende sua<br /><em>consulta</em></h2>
            <p>Preencha seus dados para iniciar o atendimento diretamente pelo WhatsApp.</p>
            <a href="tel:+5511968825299">(11) 96882-5299</a>
            <a href="mailto:contato@vadentalclinic.com.br">contato@vadentalclinic.com.br</a>
          </div>
          <form onSubmit={submitContact}>
            <label><span>Seu nome</span><input name="name" type="text" autoComplete="name" required placeholder="Como podemos chamar você?" /></label>
            <div className="form-row"><label><span>WhatsApp com DDD</span><input name="phone" type="tel" autoComplete="tel" required minLength={10} pattern="[0-9() +\-]{10,}" placeholder="(11) 99999-9999" /></label><label><span>Seu e-mail</span><input name="email" type="email" autoComplete="email" required placeholder="voce@email.com" /></label></div>
            <label><span>Mensagem</span><textarea name="message" rows={3} required minLength={3} placeholder="Como podemos ajudar?" /></label>
            <button type="submit"><span>Enviar pelo WhatsApp</span><Arrow /></button>
          </form>
        </section>

        <section className="locations">
          <article><span>Clínica 01 · Bela Vista</span><h3>Rua Maestro Cardim, 1251<br />Sala 15 · São Paulo/SP</h3><a href="https://www.google.com/maps/search/?api=1&query=Rua+Maestro+Cardim+1251+Sao+Paulo" target="_blank" rel="noreferrer">Abrir no mapa <Arrow /></a></article>
          <article><span>Clínica 02 · Bela Vista</span><h3>Rua Bom Pastor, 2100<br />Conjunto 305 · São Paulo/SP</h3><a href="https://www.google.com/maps/search/?api=1&query=Rua+Bom+Pastor+2100+Sao+Paulo" target="_blank" rel="noreferrer">Abrir no mapa <Arrow /></a></article>
        </section>
      </main>

      <a className={`whatsapp-pill${footerVisible ? " is-hidden" : ""}`} href={`${WHATSAPP}&text=${encodeURIComponent("Olá, gostaria de saber mais sobre a VA Dental Clinic.")}`} target="_blank" rel="noreferrer" aria-label="Falar com a VA Dental Clinic pelo WhatsApp"><span>Falar pelo WhatsApp</span><i>↗</i></a>

      <footer ref={footerRef}>
        <Logo light />
        <div><p>Clínica Integrada de Saúde e Estética Ltda.<br />CNPJ: 49.797.526/0001-33</p><nav>{nav.map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VA Dental Clinic</span><span>Todos os direitos reservados</span><a href="#inicio">Voltar ao topo ↑</a></div>
      </footer>
    </div>
  );
}
