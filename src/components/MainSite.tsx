import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { type LanguageCode } from '../locales';
import { Menu, X, Globe, CheckCircle2, Phone, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { CostEstimator } from './CostEstimator';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── image maps ─────────────────────────────────────────────── */
const SRV_IMGS = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80',
  '/est-jardin.png',
  '/est-cloture.png',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
];
const PACK_IMGS = [
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
  '/est-villa.png',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
];
const GALLERY_IMGS = [
  { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80', label: 'Villa Moderne' },
  { src: '/est-villa.png',                                                                                label: 'Piscine Infinity' },
  { src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80',label: 'Finitions Prestige' },
  { src: '/est-jardin.png',                                                                               label: 'Jardin Paysager' },
];
const PROCESS_BG = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80';

/* ── color tokens ────────────────────────────────────────────── */
// Light sections
const CLR_H  = '#111827'; // heading on white
const CLR_P  = '#374151'; // body on white
const CLR_P2 = '#6B7280'; // secondary on white
// Dark sections
const CLR_DH = '#FFFFFF'; // heading on dark
const CLR_DP = '#D1D5DB'; // body on dark
const CLR_DP2= '#9CA3AF'; // muted on dark
const CLR_ACC= '#dca54c'; // gold accent

export function MainSite() {
  const navigate = useNavigate();
  const { lang, setLang, t, isRtl } = useLang();

  const [menuOpen,       setMenuOpen]      = useState(false);
  const [langOpen,       setLangOpen]      = useState(false);
  const [estimatorOpen,  setEstimatorOpen] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); gsap.ticker.remove(lenis.raf); };
  }, []);

  const switchLanguage = (newLang: LanguageCode) => {
    setLang(newLang); setLangOpen(false); setMenuOpen(false);
    navigate(`/${newLang}`, { replace: true });
  };
  const goToBooking = () => navigate(`/${lang}/booking`);

  const services = [
    { title: t.srv1Title, desc: t.srv1Desc, items: t.srv1Items },
    { title: t.srv2Title, desc: t.srv2Desc, items: t.srv2Items },
    { title: t.srv3Title, desc: t.srv3Desc, items: t.srv3Items },
    { title: t.srv4Title, desc: t.srv4Desc, items: t.srv4Items },
    { title: t.srv5Title, desc: t.srv5Desc, items: t.srv5Items },
    { title: t.srv6Title, desc: t.srv6Desc, items: t.srv6Items },
  ];
  const packages = [
    { name: t.pack1, desc: t.pack1Desc },
    { name: t.pack2, desc: t.pack2Desc },
    { name: t.pack3, desc: t.pack3Desc },
    { name: t.pack4, desc: t.pack4Desc },
  ];

  /* ── GSAP ScrollTrigger ── */
  useGSAP(() => {
    // Staggered text reveals
    gsap.utils.toArray<HTMLElement>('.gs-reveal-parent').forEach(parent => {
      const texts = parent.querySelectorAll<HTMLElement>('.gs-reveal-text');
      if (texts.length > 0) {
        gsap.fromTo(texts, { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', stagger: 0.2,
          scrollTrigger: { trigger: parent, start: 'top 80%', toggleActions: 'play none none none' }
        });
      }
    });
    gsap.utils.toArray<HTMLElement>('.gs-reveal-single').forEach(el => {
      gsap.fromTo(el, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
      });
    });

    // Image clip-path reveal + parallax scrub
    gsap.utils.toArray<HTMLElement>('.img-wrapper').forEach(wrapper => {
      gsap.fromTo(wrapper, { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: wrapper, start: 'top 85%', toggleActions: 'play none none none' }
      });
      const img = wrapper.querySelector<HTMLElement>('.img-parallax');
      if (img) {
        gsap.fromTo(img, { yPercent: -10 }, {
          yPercent: 10, ease: 'none',
          scrollTrigger: { trigger: wrapper, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });
  }, { scope: mainRef });

  return (
    <div ref={mainRef} className={`site-wrapper ${isRtl ? 'rtl' : 'ltr'}`}>

      {/* ── Navbar (transparent over hero) ── */}
      <nav className="navbar" style={{ position:'absolute', top:0, left:0, right:0, background:'transparent', zIndex:50 }}>
        <div className="nav-container">
          <div className="nav-logo" style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <img src="/LOGO.jpeg" alt="JT Travaux"
              style={{ height:'64px', width:'auto', objectFit:'contain', mixBlendMode:'multiply', filter:'contrast(1.05)' }} />
            <span style={{ fontWeight:700, fontSize:'1.05rem', letterSpacing:'0.1em', textTransform:'uppercase',
              color:'#fff', textShadow:'0 1px 4px rgba(0,0,0,0.4)' }}>JT TRAVAUX</span>
          </div>
          <div className="nav-links desktop-only">
            <a href="#services">{t.services}</a>
            <a href="#process">{t.process}</a>
            <a href="#gallery">{t.gallery}</a>
            <a href="#faq">{t.faq}</a>
            <div className="lang-switcher">
              <button className="lang-toggle" onClick={() => setLangOpen(!langOpen)}>
                <Globe size={18} /> {lang.toUpperCase()}
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  <button onClick={() => switchLanguage('en')}>EN – English</button>
                  <button onClick={() => switchLanguage('fr')}>FR – Français</button>
                  <button onClick={() => switchLanguage('ar')}>AR – العربية</button>
                </div>
              )}
            </div>
            <button className="btn-primary-sm" onClick={goToBooking}>{t.bookConsultation}</button>
          </div>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            <a href="#services" onClick={() => setMenuOpen(false)}>{t.services}</a>
            <a href="#process"  onClick={() => setMenuOpen(false)}>{t.process}</a>
            <a href="#gallery"  onClick={() => setMenuOpen(false)}>{t.gallery}</a>
            <a href="#faq"      onClick={() => setMenuOpen(false)}>{t.faq}</a>
            <div className="mobile-lang-options">
              <button onClick={() => switchLanguage('en')}>English</button>
              <button onClick={() => switchLanguage('fr')}>Français</button>
              <button onClick={() => switchLanguage('ar')}>العربية</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <header ref={heroRef} className="hero-section">
        <video className="hero-video" src="/Luxury_villa_infinity_202603180642.mp4" autoPlay loop muted playsInline />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.65) 100%)', pointerEvents:'none' }} />
        <div className="hero-content" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', gap:'1.75rem' }}>
          <p style={{ fontSize:'0.7rem', letterSpacing:'0.35em', color:'rgba(255,255,255,0.45)', textTransform:'uppercase', fontWeight:300 }}>
            Marrakech · Prestige Construction
          </p>
          <h1 style={{ fontFamily:'Georgia,serif', fontWeight:300, fontSize:'clamp(2.4rem,6vw,5rem)', lineHeight:1.15, color:'#fff', letterSpacing:'-0.01em' }}>
            {t.heroTitle}
          </h1>
          <p className="hero-subtitle" style={{ maxWidth:'36rem', color:'rgba(255,255,255,0.65)', fontSize:'1rem', lineHeight:1.8, fontWeight:300 }}>
            {t.heroSubtitle}
          </p>
          <div className="trust-badges" style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'0.6rem' }}>
            <span className="badge"><CheckCircle2 size={14} /> {t.trust1}</span>
            <span className="badge"><CheckCircle2 size={14} /> {t.trust2}</span>
            <span className="badge"><CheckCircle2 size={14} /> {t.trust3}</span>
            <span className="badge"><CheckCircle2 size={14} /> {t.trust4}</span>
          </div>
          <div className="hero-actions" style={{ display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginTop:'0.5rem' }}>
            <button className="btn-primary" onClick={() => setEstimatorOpen(true)} style={{ padding:'1rem 2.2rem', display:'flex', alignItems:'center', gap:'0.6rem', fontSize:'0.9rem' }}>
              {t.requestEstimate} <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={goToBooking} style={{ padding:'1rem 2.2rem', fontSize:'0.9rem' }}>
              {t.bookConsultation}
            </button>
          </div>
        </div>
      </header>

      <main>

        {/* ══════════════════════════════════════════════════════
            WHITE SECTION — "Une Façon Plus Maîtrisée"
            ALL TEXT: dark charcoal
        ══════════════════════════════════════════════════════ */}
        <section className="positioning-section section gs-reveal-parent"
          style={{ background:'#ffffff', paddingTop:'8rem', paddingBottom:'8rem' }}>
          <div className="container">
            <h2 className="section-title gs-reveal-text"
              style={{ color: CLR_H, fontFamily:'Georgia,serif', fontWeight:300 }}>
              {t.posTitle}
            </h2>
            <div className="pos-content">
              <p className="lead gs-reveal-text" style={{ color: CLR_P  }}>{t.posCopy1}</p>
              <p className="gs-reveal-text"       style={{ color: CLR_P2 }}>{t.posCopy2}</p>
              <p className="highlight gs-reveal-text" style={{ color: CLR_P }}>{t.posCopy3}</p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LIGHT BG SECTION — Services
            Section heading: dark | Card content: white (dark overlay)
        ══════════════════════════════════════════════════════ */}
        <section id="services" className="services-section section"
          style={{ background:'#F9FAFB', paddingBottom:'6rem' }}>
          <div className="container gs-reveal-parent">
            <h2 className="section-title gs-reveal-text"
              style={{ color:CLR_H, fontFamily:'Georgia,serif', fontWeight:300, marginBottom:'3rem' }}>
              {t.servicesTitle}
            </h2>
            <div className="services-grid">
              {services.map((srv, idx) => (
                <div key={idx} className="service-card gs-reveal-parent"
                  style={{ position:'relative', padding:0, minHeight:'400px', display:'flex',
                    flexDirection:'column', justifyContent:'flex-end', border:'none', borderRadius:'12px', overflow:'hidden' }}>
                  <div className="img-wrapper absolute inset-0 overflow-hidden" style={{ borderRadius:'12px' }}>
                    <img src={SRV_IMGS[idx]} alt="" className="img-parallax w-full h-full object-cover scale-[1.15]" />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.10) 100%)' }} />
                  </div>
                  <div className="relative z-10 p-7">
                    <h3 className="gs-reveal-text"
                      style={{ color:CLR_DH, fontSize:'1.2rem', fontWeight:600, marginBottom:'0.8rem', fontFamily:'Georgia,serif' }}>
                      {srv.title}
                    </h3>
                    <p className="gs-reveal-text"
                      style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.85rem', lineHeight:1.7, marginBottom:'1rem' }}>
                      {srv.desc}
                    </p>
                    <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:'0.4rem' }}>
                      {srv.items.slice(0,3).map((item,i) => (
                        <li key={i} className="gs-reveal-text"
                          style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', color:'rgba(255,255,255,0.65)', fontSize:'0.8rem' }}>
                          <CheckCircle2 size={12} style={{ color:CLR_ACC, marginTop:'4px', flexShrink:0 }} /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            DARK SECTION — Process (architectural photo)
            ALL TEXT: white / stone-200
        ══════════════════════════════════════════════════════ */}
        <section id="process" className="process-section section gs-reveal-parent"
          style={{ position:'relative', padding:0 }}>
          <div className="img-wrapper absolute inset-0 overflow-hidden">
            <img src={PROCESS_BG} alt="" aria-hidden className="img-parallax w-full h-full object-cover scale-[1.15]" />
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.87)' }} />
          </div>
          <div className="container relative z-10 py-24">
            <h2 className="section-title gs-reveal-text"
              style={{ color:CLR_DH, fontFamily:'Georgia,serif', fontWeight:300 }}>
              {t.processTitle}
            </h2>
            <div className="process-timeline gs-reveal-parent">
              {t.processItems.map((item, idx) => (
                <div key={idx} className="process-step gs-reveal-text">
                  <div className="step-number"
                    style={{ borderColor:'rgba(220,165,76,0.5)', color:CLR_ACC, background:'rgba(0,0,0,0.4)' }}>
                    {idx + 1}
                  </div>
                  <div className="step-text" style={{ color:'#E5E7EB' }}>{item}</div>
                </div>
              ))}
            </div>
            <p className="gs-reveal-single" style={{ color:'rgba(255,255,255,0.55)', marginTop:'3rem', textAlign:'center', fontStyle:'italic' }}>
              {t.processConclude}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            WHITE SECTION — Packs
            Section heading: dark | Card content: white (dark overlay)
        ══════════════════════════════════════════════════════ */}
        <section className="packages-section section" style={{ background:'#ffffff', paddingBottom:'6rem' }}>
          <div className="container gs-reveal-parent">
            <h2 className="section-title gs-reveal-text"
              style={{ color:CLR_H, fontFamily:'Georgia,serif', fontWeight:300, marginBottom:'3rem' }}>
              {t.packTitle}
            </h2>
            <div className="packages-grid">
              {packages.map((pkg, idx) => (
                <div key={idx} className="package-card gs-reveal-parent"
                  style={{ position:'relative', padding:0, minHeight:'320px', display:'flex',
                    flexDirection:'column', justifyContent:'flex-end', border:'none', borderRadius:'12px', overflow:'hidden' }}>
                  <div className="img-wrapper absolute inset-0 overflow-hidden" style={{ borderRadius:'12px' }}>
                    <img src={PACK_IMGS[idx]} alt="" className="img-parallax w-full h-full object-cover scale-[1.15]" />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.08) 100%)' }} />
                  </div>
                  <div className="relative z-10 p-6">
                    <h3 className="gs-reveal-text"
                      style={{ color:CLR_DH, fontFamily:'Georgia,serif', fontWeight:400, fontSize:'1.2rem', marginBottom:'0.6rem' }}>
                      {pkg.name}
                    </h3>
                    <p className="gs-reveal-text"
                      style={{ color:'rgba(255,255,255,0.70)', fontSize:'0.85rem', lineHeight:1.7, margin:0 }}>
                      {pkg.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LIGHT BG SECTION — Why Us
            Heading + kicker: dark | Both cards: explicitly dark bg with white text
        ══════════════════════════════════════════════════════ */}
        <section className="why-section section" style={{ background:'#F9FAFB' }}>
          <div className="container gs-reveal-parent">
            <h2 className="section-title gs-reveal-text"
              style={{ color:CLR_H, fontFamily:'Georgia,serif', fontWeight:300, marginBottom:'3rem' }}>
              {t.whyTitle}
            </h2>
            <div className="why-grid">
              {/* dark card → white text */}
              <div className="card-dark gs-reveal-parent"
                style={{ background:'#1e1e2e', borderRadius:'12px', padding:'3rem', border:'1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="gs-reveal-text" style={{ color:'#FCA5A5', fontSize:'1.4rem', marginBottom:'1.5rem' }}>
                  {t.whyBadTitle}
                </h3>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {t.whyBadItems.map((item,i) => (
                    <li key={i} className="gs-reveal-text"
                      style={{ display:'flex', alignItems:'center', gap:'10px', color:'#D1D5DB', marginBottom:'0.8rem', fontSize:'1rem' }}>
                      <X size={16} style={{ color:'#F87171', flexShrink:0 }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* accent dark card → white text */}
              <div className="card-light gs-reveal-parent"
                style={{ background:'linear-gradient(145deg,rgba(17,24,39,0.97),rgba(30,41,59,0.95))', borderRadius:'12px', padding:'3rem', border:'1px solid rgba(220,165,76,0.35)' }}>
                <h3 className="gs-reveal-text" style={{ color:'#FCD34D', fontSize:'1.4rem', marginBottom:'1.5rem' }}>
                  {t.whyGoodTitle}
                </h3>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {t.whyGoodItems.map((item,i) => (
                    <li key={i} className="gs-reveal-text"
                      style={{ display:'flex', alignItems:'center', gap:'12px', color:'#E5E7EB', marginBottom:'0.8rem', fontSize:'1rem' }}>
                      <CheckCircle2 size={16} style={{ color:CLR_ACC, flexShrink:0 }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="gs-reveal-single"
              style={{ color:CLR_H, fontSize:'2rem', fontFamily:'Georgia,serif', fontWeight:300, textAlign:'center', marginTop:'2.5rem' }}>
              {t.whyConclude}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            DARK SECTION — Trust & Guarantee
            ALL TEXT: white / gray-300
        ══════════════════════════════════════════════════════ */}
        <section className="trust-section section gs-reveal-parent" style={{ background:'#0f172a' }}>
          <div className="container">
            <h2 className="section-title gs-reveal-text" style={{ color:CLR_DH }}>{t.trustSecTitle}</h2>
            <p className="lead gs-reveal-text" style={{ color:CLR_DP  }}>{t.trustSecCopy1}</p>
            <p className="gs-reveal-text"       style={{ color:CLR_DP2 }}>{t.trustSecCopy2}</p>
            <ul className="trust-list gs-reveal-parent">
              {t.trustSecItems.map((item,idx) => (
                <li key={idx} className="gs-reveal-text"
                  style={{ display:'flex', alignItems:'center', gap:'12px', color:CLR_DP, fontSize:'1.1rem', marginBottom:'0.5rem' }}>
                  <CheckCircle2 size={18} style={{ color:CLR_ACC, flexShrink:0 }} /> {item}
                </li>
              ))}
            </ul>
            <p className="gs-reveal-single"
              style={{ color:CLR_DP2, fontStyle:'italic', fontSize:'1.1rem', textAlign:'center', marginTop:'2rem' }}>
              {t.trustSecConclude}
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            WHITE SECTION — Gallery
            Section heading: dark | Image labels on dark gradient: white
        ══════════════════════════════════════════════════════ */}
        <section id="gallery" className="gallery-section section" style={{ background:'#ffffff' }}>
          <div className="container gs-reveal-parent">
            <h2 className="section-title gs-reveal-text"
              style={{ color:CLR_H, fontFamily:'Georgia,serif', fontWeight:300, marginBottom:'3rem' }}>
              {t.galleryTitle}
            </h2>
            <div className="gallery-grid">
              {GALLERY_IMGS.map((img,i) => (
                <div key={i} className="gallery-img"
                  style={{ aspectRatio:'4/3', borderRadius:'10px', display:'flex', alignItems:'flex-end',
                    padding:'1.5rem', position:'relative', border:'none', overflow:'hidden' }}>
                  <div className="img-wrapper absolute inset-0 overflow-hidden" style={{ borderRadius:'10px' }}>
                    <img className="img-parallax w-full h-full object-cover scale-[1.12]" src={img.src} alt="" />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                  </div>
                  <span className="relative z-10 gs-reveal-single"
                    style={{ fontSize:'0.75rem', color:CLR_DH, letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:500 }}>
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            LIGHT BG SECTION — FAQ
            Heading: dark charcoal | Questions: dark gray | Answers: medium gray
        ══════════════════════════════════════════════════════ */}
        <section id="faq" className="faq-section section gs-reveal-parent" style={{ background:'#F9FAFB' }}>
          <div className="container">
            <h2 className="section-title gs-reveal-text"
              style={{ color:CLR_H, fontFamily:'Georgia,serif', fontWeight:300, marginBottom:'3rem' }}>
              {t.faqTitle}
            </h2>
            <div className="faq-list gs-reveal-parent">
              {[
                [t.faq1Q, t.faq1A],
                [t.faq2Q, t.faq2A],
                [t.faq3Q, t.faq3A],
                [t.faq4Q, t.faq4A],
              ].map(([q,a],i) => (
                <div key={i} className="faq-item gs-reveal-text"
                  style={{ borderBottom:'1px solid #E5E7EB', padding:'1.5rem 0' }}>
                  <h4 style={{ color:'#111827', fontSize:'1.15rem', marginBottom:'0.6rem', fontWeight:600 }}>{q}</h4>
                  <p  style={{ color:'#4B5563', lineHeight:1.75, margin:0 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            DARK SECTION — Footer CTA
            ALL TEXT: white
        ══════════════════════════════════════════════════════ */}
        <footer id="contact" className="main-footer section gs-reveal-parent" style={{ background:'#0f172a' }}>
          <div className="container">
            <div className="cta-grid gs-reveal-parent">
              <div className="gs-reveal-text"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:'16px', padding:'3rem', textAlign:'center' }}>
                <h3 style={{ color:CLR_DH, fontSize:'1.8rem', marginBottom:'1rem' }}>{t.consultTitle}</h3>
                <p  style={{ color:CLR_DP2, marginBottom:'1.5rem', fontSize:'1.05rem' }}>{t.consultDesc}</p>
                <button className="btn-primary" onClick={goToBooking}>{t.bookConsultation}</button>
              </div>
              <div className="gs-reveal-text"
                style={{ background:'linear-gradient(135deg,rgba(220,165,76,0.10),rgba(220,165,76,0.03))',
                  border:'1px solid rgba(220,165,76,0.30)', borderRadius:'16px', padding:'3rem', textAlign:'center' }}>
                <h3 style={{ color:CLR_DH, fontSize:'1.8rem', marginBottom:'1rem' }}>{t.estTitle}</h3>
                <p  style={{ color:CLR_DP2, marginBottom:'1.5rem', fontSize:'1.05rem' }}>{t.estDesc}</p>
                <button className="btn-secondary" onClick={() => setEstimatorOpen(true)}>{t.requestEstimate}</button>
              </div>
            </div>
            <div className="footer-bottom gs-reveal-parent"
              style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'3rem', display:'flex',
                justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1.5rem' }}>
              <div className="gs-reveal-text">
                <h2 style={{ color:CLR_DH, fontSize:'2rem', marginBottom:'10px' }}>{t.finalTitle}</h2>
                <p  style={{ color:'#6B7280', maxWidth:'500px' }}>{t.finalDesc}</p>
              </div>
              <div className="gs-reveal-text">
                <button className="btn-whatsapp"><Phone size={18} /> {t.whatsappUs}</button>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Cost Estimator Modal ── */}
      <CostEstimator isOpen={estimatorOpen} onClose={() => setEstimatorOpen(false)} />
    </div>
  );
}
