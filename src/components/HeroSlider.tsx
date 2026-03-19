/**
 * HeroSlider — Codegrid-style never-ending scroll carousel
 * Slide 0 preserves the original hero (video + buttons).
 * Slides 1-3 are image-based with clip-path reveal + text wipe.
 */
import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { CheckCircle2, ArrowRight } from 'lucide-react';

/* ── slide data ──────────────────────────────────────────────── */
interface Slide {
  type: 'video' | 'image';
  src: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta?: { label: string; action: 'estimator' | 'scroll' };
}

const SLIDES: Slide[] = [
  {
    type:     'video',
    src:      '/Luxury_villa_infinity_202603180642.mp4',
    eyebrow:  'Marrakech · Prestige',
    title:    'Construisez la\nVilla de vos Rêves',
    subtitle: 'Du gros œuvre à la finition, un interlocuteur unique pour votre projet de villa à Marrakech.',
    cta:      { label: 'Demander un devis', action: 'estimator' },
  },
  {
    type:     'image',
    src:      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85',
    eyebrow:  'Architecture · Design',
    title:    'Architecture\nHaut de Gamme',
    subtitle: 'Chaque villa est conçue sur-mesure — volumes, matériaux et âme marocaine fusionnent en une œuvre unique.',
    cta:      { label: 'Découvrir nos réalisations', action: 'scroll' },
  },
  {
    type:     'image',
    src:      '/est-villa.png',
    eyebrow:  'Piscine · Jardin',
    title:    'L\'Art de\nVivre Dehors',
    subtitle: 'Piscines à débordement, jardins paysagés, clôtures architecturales — l\'extérieur aussi mérite le luxe.',
    cta:      { label: 'Estimer mon projet', action: 'estimator' },
  },
  {
    type:     'image',
    src:      '/est-jardin.png',
    eyebrow:  'Finitions · Prestige',
    title:    'Chaque Détail\nRaconté',
    subtitle: 'Marbre importé, domotique intégrée, luminaires sur-mesure — le luxe se cache dans les finitions.',
    cta:      { label: 'Demander un devis', action: 'estimator' },
  },
];

const TRUST = ['Devis gratuit', 'Clé en main', '100% garanti', 'Délais respectés'];

/* ── component ───────────────────────────────────────────────── */
interface Props {
  onOpenEstimator: () => void;
}

export function HeroSlider({ onOpenEstimator }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentRef   = useRef(0);
  const animating    = useRef(false);
  const touchStartY  = useRef(0);

  /* refs for each slide's bg and text */
  const bgRefs   = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── dot state helper ── */
  const updateDots = useCallback((idx: number) => {
    const dots = containerRef.current?.querySelectorAll<HTMLElement>('.hero-dot');
    dots?.forEach((d, i) => {
      d.style.opacity    = i === idx ? '1' : '0.35';
      d.style.width      = i === idx ? '2rem' : '0.5rem';
    });
  }, []);

  /* ── goto(next) ── */
  const goto = useCallback((next: number) => {
    if (animating.current) return;
    const total   = SLIDES.length;
    const current = currentRef.current;
    if (next === current) return;

    animating.current = true;

    const outBg  = bgRefs.current[current];
    const inBg   = bgRefs.current[next];
    const outTxt = textRefs.current[current];
    const inTxt  = textRefs.current[next];
    const dir    = next > current ? 1 : -1;   // 1 = forward, -1 = backward

    // Bring incoming slide on top
    if (inBg)  gsap.set(inBg.parentElement,  { zIndex: 1 });
    if (outBg) gsap.set(outBg.parentElement, { zIndex: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        currentRef.current = next;
        animating.current  = false;
        updateDots(next);
        // reset outgoing slide
        if (outBg) {
          gsap.set(outBg, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
          gsap.set(outBg.parentElement, { zIndex: 0 });
        }
        outTxt?.querySelectorAll<HTMLElement>('.slide-line').forEach(el => gsap.set(el, { yPercent: 0 }));
      },
    });

    /* incoming bg: clip-path wipe from bottom → reveal */
    gsap.set(inBg, { clipPath: dir === 1 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', scale: 1.08 });
    tl.to(inBg, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: 'expo.inOut' }, 0);

    /* outgoing bg: slow scale zoom while covered */
    tl.to(outBg, { scale: 1.06, duration: 1.1, ease: 'expo.inOut' }, 0);

    /* outgoing text: wipe out upward */
    if (outTxt) {
      outTxt.querySelectorAll<HTMLElement>('.slide-line').forEach((el, i) => {
        tl.to(el, { yPercent: dir === 1 ? -110 : 110, duration: 0.55, ease: 'power3.in', delay: i * 0.04 }, 0);
      });
    }

    /* incoming text: staggered wipe in from below */
    if (inTxt) {
      inTxt.querySelectorAll<HTMLElement>('.slide-line').forEach((el, i) => {
        gsap.set(el, { yPercent: dir === 1 ? 110 : -110 });
        tl.to(el, { yPercent: 0, duration: 0.75, ease: 'power3.out' }, 0.55 + i * 0.08);
      });
    }

    void total; // suppress unused warning
  }, [updateDots]);

  /* ── wheel handler ── */
  const onWheel = useCallback((e: WheelEvent) => {
    const next = e.deltaY > 0
      ? (currentRef.current + 1) % SLIDES.length
      : (currentRef.current - 1 + SLIDES.length) % SLIDES.length;
    goto(next);
  }, [goto]);

  /* ── touch handlers ── */
  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    const delta = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(delta) < 40) return;
    const next = delta > 0
      ? (currentRef.current + 1) % SLIDES.length
      : (currentRef.current - 1 + SLIDES.length) % SLIDES.length;
    goto(next);
  }, [goto]);

  /* ── setup ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // init: show slide 0 text, hide others
    textRefs.current.forEach((t, i) => {
      if (!t) return;
      t.querySelectorAll<HTMLElement>('.slide-line').forEach(line => {
        gsap.set(line, { yPercent: i === 0 ? 0 : 100 });
      });
    });
    // clip-path: only slide 0 fully visible
    bgRefs.current.forEach((bg, i) => {
      if (!bg) return;
      gsap.set(bg, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1 });
      gsap.set(bg.parentElement, { zIndex: i === 0 ? 1 : 0 });
    });
    updateDots(0);

    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend',   onTouchEnd);
    };
  }, [onWheel, onTouchStart, onTouchEnd, updateDots]);

  /* ── render ── */
  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden select-none">

      {/* ── Slides ── */}
      {SLIDES.map((slide, idx) => (
        <div key={idx} className="absolute inset-0" style={{ zIndex: idx === 0 ? 1 : 0 }}>

          {/* background media */}
          {slide.type === 'video' ? (
            <video
              ref={el => { bgRefs.current[idx] = el; }}
              src={slide.src}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transformOrigin: 'center center' }}
            />
          ) : (
            <img
              ref={el => { bgRefs.current[idx] = el; }}
              src={slide.src}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transformOrigin: 'center center' }}
            />
          )}

          {/* dark overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/65 pointer-events-none" />

          {/* slide zero: trust badges row */}
          {idx === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 flex flex-wrap justify-center gap-3 z-10 pointer-events-none">
              {TRUST.map(t => (
                <span key={t} className="flex items-center gap-1.5 text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm bg-white/5">
                  <CheckCircle2 size={12} /> {t}
                </span>
              ))}
            </div>
          )}

          {/* text content */}
          <div
            ref={el => { textRefs.current[idx] = el; }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none"
          >
            {/* eyebrow */}
            <div className="overflow-hidden mb-4">
              <p className="slide-line text-xs uppercase tracking-[0.3em] text-white/50 font-light">
                {slide.eyebrow}
              </p>
            </div>

            {/* title — each word line wrapped */}
            {slide.title.split('\n').map((line, li) => (
              <div key={li} className="overflow-hidden">
                <h1 className="slide-line font-serif text-5xl md:text-7xl font-light text-white leading-tight tracking-tight">
                  {line}
                </h1>
              </div>
            ))}

            {/* subtitle */}
            <div className="overflow-hidden mt-6 max-w-xl">
              <p className="slide-line text-sm md:text-base text-white/65 leading-relaxed font-light">
                {slide.subtitle}
              </p>
            </div>

            {/* CTA */}
            {slide.cta && (
              <div className="overflow-hidden mt-9 pointer-events-auto">
                <button
                  className="slide-line flex items-center gap-2 px-8 py-4 bg-white/10 text-white text-sm font-medium border border-white/30 rounded-full backdrop-blur-sm hover:bg-white/20 hover:border-white/50 transition-all duration-300 tracking-wide"
                  onClick={slide.cta.action === 'estimator'
                    ? onOpenEstimator
                    : () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {slide.cta.label} <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* ── slide counter (top right) ── */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-2 text-white/40 text-xs font-mono tracking-widest pointer-events-none">
        <span className="text-white text-sm font-light">{String(1).padStart(2, '0')}</span>
        <span>/</span>
        <span>{String(SLIDES.length).padStart(2, '0')}</span>
      </div>

      {/* ── vertical dot nav (right side) ── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 items-center">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className="hero-dot h-0.5 bg-white rounded-full transition-all duration-500 cursor-pointer"
            style={{ width: i === 0 ? '2rem' : '0.5rem', opacity: i === 0 ? 1 : 0.35 }}
            onClick={() => goto(i)}
          />
        ))}
      </div>

      {/* ── scroll hint (bottom center) ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-white/30 text-xs uppercase tracking-[0.25em]">Scroll</span>
        <div className="w-px h-10 bg-linear-to-b from-white/30 to-transparent" />
      </div>
    </div>
  );
}
