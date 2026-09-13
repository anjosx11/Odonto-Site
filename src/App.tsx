import { type CSSProperties, type FormEvent, useEffect, useRef, useState } from "react";

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
  { number: "01", title: "O primeiro encontro", text: "Uma conversa atenta para compreender você, suas necessidades e o momento do seu sorriso." },
  { number: "02", title: "Avaliação e planejamento", text: "Cada detalhe é considerado para construir um cuidado coerente, seguro e personalizado." },
  { number: "03", title: "Tratamento personalizado", text: "A condução acontece com clareza, delicadeza e respeito à sua individualidade." },
  { number: "04", title: "Acompanhamento e cuidado", text: "O vínculo continua com atenção próxima à saúde, ao conforto e ao bem-estar." },
];

function Arrow() {
  return <svg viewBox="0 0 32 16" aria-hidden="true"><path d="M1 8h28M23 2l6 6-6 6" /></svg>;
}

function Tooth() {
  return (
    <svg className="tooth-svg" viewBox="0 0 360 440" role="img" aria-label="Ilustração abstrata de um dente">
      <defs>
        <linearGradient id="toothFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset=".48" stopColor="#d9e0e9" />
          <stop offset="1" stopColor="#889bb7" />
        </linearGradient>
        <linearGradient id="toothEdge" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#ffffff" stopOpacity=".9" />
          <stop offset="1" stopColor="#8c9bb3" stopOpacity=".1" />
        </linearGradient>
        <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <ellipse cx="180" cy="398" rx="108" ry="20" fill="#06152d" opacity=".3" filter="url(#softShadow)" />
      <path d="M79 48C112 18 153 34 180 46c27-12 68-28 101 2 50 46 17 143-1 187-19 47-19 145-61 145-27 0-22-95-39-95s-12 95-39 95c-42 0-42-98-61-145C62 191 29 94 79 48Z" fill="url(#toothFill)" stroke="url(#toothEdge)" strokeWidth="3" />
      <path d="M94 67c29-23 57-4 86 7 29-11 57-30 86-7" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity=".52" />
      <path d="M114 103c-19 50-7 90 11 127" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".35" />
      <path d="M180 74c-10 58-7 124 0 184" fill="none" stroke="#7387a6" strokeWidth="2" opacity=".22" />
    </svg>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`wordmark${light ? " wordmark--light" : ""}`}>
      <b>VA</b><i>Dental Clinic</i><small>ODONTOLOGIA</small>
    </span>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [specialty, setSpecialty] = useState(0);
  const [journeyStep, setJourneyStep] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

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
    const data = new FormData(event.currentTarget);
    const message = [
      "Olá, gostaria de agendar uma consulta na VA Dental Clinic.",
      `Nome: ${data.get("name")}`,
      `WhatsApp: ${data.get("phone")}`,
      `E-mail: ${data.get("email")}`,
      `Mensagem: ${data.get("message")}`,
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
            <div className="hero-photo hero-photo--one"><img src={asset("/assets/hero/2b.jpg")} alt="Dra. Verônica Assis na VA Dental Clinic" /></div>
            <div className="hero-photo hero-photo--two"><img src={asset("/assets/clinic/clinica2.jpg")} alt="Consultório da VA Dental Clinic" /></div>
            <div className="hero-wash" />
            <div className="hero-copy">
              <p className="eyebrow"><span>Clínica integrada</span><span>Saúde &amp; estética</span></p>
              <h1><span>Seu sorriso,</span><em>cuidado com alma.</em></h1>
              <p className="hero-intro">Excelência clínica, estética e acolhimento caminham lado a lado.</p>
            </div>
            <div className="tooth-stage" aria-hidden="true"><div className="tooth-orbit" /><div className="tooth-object"><Tooth /></div><span>role para descobrir</span></div>
            <div className="hero-index"><span>VA</span><i /><span>01</span></div>
          </div>
        </section>

        <section className="manifesto" id="clinica">
          <div className="section-label"><span>01</span><p>A VA Dental</p></div>
          <p className="manifesto-text" data-reveal>Um espaço íntimo, onde você é acolhido com <em>discrição e cuidado</em>, em uma jornada odontológica leve e sofisticada.</p>
          <div className="manifesto-foot" data-reveal><p>Sorrisos têm o poder de transformar.<br />Esse é o nosso compromisso com você.</p><a href="#jornada">Conheça nossa forma de cuidar <Arrow /></a></div>
        </section>

        <section className="clinic-gallery" aria-label="Ambientes da clínica">
          <div className="gallery-lead" data-reveal><span>Um ambiente pensado para acolher</span><h2>Conforto também<br />faz parte do <em>cuidado.</em></h2></div>
          <div className="gallery-grid">
            {["clinica1.jpg", "clinica2.jpg", "clinica3.jpg", "clinica4.jpg"].map((image, index) => (
              <figure key={image} className={`gallery-image gallery-image--${index + 1}`} data-reveal><img src={asset(`/assets/clinic/${image}`)} alt={`Ambiente da VA Dental Clinic ${index + 1}`} loading="lazy" /><figcaption>VA Dental Clinic · São Paulo</figcaption></figure>
            ))}
          </div>
        </section>

        <section className="doctor" id="dentista">
          <div className="doctor-image" data-reveal><img src={asset("/assets/doctor/1.jpg")} alt="Dra. Verônica Assis atendendo uma paciente" loading="lazy" /><span>Dra. Verônica Assis</span></div>
          <div className="doctor-copy">
            <div className="section-label"><span>02</span><p>Quem sou eu?</p></div>
            <h2 data-reveal>Odontologia é a arte de cuidar de <em>sorrisos e pessoas.</em></h2>
            <div className="doctor-text" data-reveal>
              <p>Sou a Dra. Verônica Assis, especialista em ortodontia e master em alinhadores invisíveis.</p>
              <p>Acredito em um atendimento humano, gentil e respeitoso. Cada paciente é único e merece ser ouvido com atenção e tratado com amor.</p>
              <p>Mais do que alinhar dentes, meu propósito é alinhar autoestima, bem-estar e confiança.</p>
            </div>
            <a className="text-link" href="#contato">Converse comigo <Arrow /></a>
          </div>
        </section>

        <section className="specialties" id="especialidades">
          <div className="specialties-heading">
            <div className="section-label"><span>03</span><p>Especialidades</p></div>
            <h2 data-reveal>Cuidado preciso.<br /><em>Resultado natural.</em></h2>
          </div>
          <div className="specialty-panels" onMouseLeave={() => setSpecialty(0)}>
            {specialties.map((item, index) => (
              <button key={item.title} className={specialty === index ? "is-active" : ""} type="button" onMouseEnter={() => setSpecialty(index)} onFocus={() => setSpecialty(index)} onClick={() => setSpecialty(index)} aria-expanded={specialty === index}>
                <span className="specialty-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="specialty-content"><strong>{item.title}</strong><p>{item.text}</p><i>Conhecer</i></span>
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
              <h2>Do primeiro encontro<br />ao cuidado que <em>continua.</em></h2>
              <div className="journey-photo"><img src={asset("/assets/doctor/3.jpg")} alt="Atendimento cuidadoso na VA Dental Clinic" loading="lazy" /></div>
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

        <section className="closing-image">
          <img src={asset("/assets/hero/5b.jpg")} alt="Dra. Verônica Assis sorrindo" loading="lazy" />
          <div data-reveal><span>VA Dental Clinic</span><h2>Cuidar do sorriso é também cuidar de como você se sente.</h2><a href="#contato">Comece sua jornada <Arrow /></a></div>
        </section>

        <section className="contact" id="contato">
          <div className="contact-intro">
            <div className="section-label"><span>05</span><p>Entre em contato</p></div>
            <h2 data-reveal>Vamos conversar sobre o seu <em>sorriso?</em></h2>
            <p>Conte-nos como podemos cuidar de você. A conversa continua diretamente pelo WhatsApp.</p>
            <a href="tel:+5511968825299">(11) 96882-5299</a>
            <a href="mailto:contato@vadentalclinic.com.br">contato@vadentalclinic.com.br</a>
          </div>
          <form onSubmit={submitContact}>
            <label><span>Seu nome</span><input name="name" type="text" autoComplete="name" required placeholder="Como podemos chamar você?" /></label>
            <div className="form-row"><label><span>WhatsApp com DDD</span><input name="phone" type="tel" autoComplete="tel" required placeholder="(11) 99999-9999" /></label><label><span>Seu e-mail</span><input name="email" type="email" autoComplete="email" placeholder="voce@email.com" /></label></div>
            <label><span>Mensagem</span><textarea name="message" rows={3} placeholder="Como podemos ajudar?" /></label>
            <button type="submit"><span>Enviar pelo WhatsApp</span><Arrow /></button>
          </form>
        </section>

        <section className="locations">
          <article><span>Clínica 01 · Bela Vista</span><h3>Rua Maestro Cardim, 1251<br />Sala 15 · São Paulo/SP</h3><a href="https://www.google.com/maps/search/?api=1&query=Rua+Maestro+Cardim+1251+Sao+Paulo" target="_blank" rel="noreferrer">Abrir no mapa <Arrow /></a></article>
          <article><span>Clínica 02 · Ipiranga</span><h3>Rua Bom Pastor, 2100<br />Conjunto 305 · São Paulo/SP</h3><a href="https://www.google.com/maps/search/?api=1&query=Rua+Bom+Pastor+2100+Sao+Paulo" target="_blank" rel="noreferrer">Abrir no mapa <Arrow /></a></article>
        </section>
      </main>

      <a className="whatsapp-pill" href={`${WHATSAPP}&text=${encodeURIComponent("Olá, gostaria de saber mais sobre a VA Dental Clinic.")}`} target="_blank" rel="noreferrer" aria-label="Falar com a VA Dental Clinic pelo WhatsApp"><span>Falar pelo WhatsApp</span><i>↗</i></a>

      <footer>
        <Logo light />
        <div><p>Clínica Integrada de Saúde e Estética Ltda.<br />CNPJ: 49.797.526/0001-33</p><nav>{nav.map(([label, id]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VA Dental Clinic</span><span>Todos os direitos reservados</span><a href="#inicio">Voltar ao topo ↑</a></div>
      </footer>
    </div>
  );
}
