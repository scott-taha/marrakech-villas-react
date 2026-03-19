import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';
import { ProgressBar } from './ProgressBar';
import { OptionCard, StepContainer } from './StepContainer';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
type Objective =
  | 'villa' | 'gros_oeuvre' | 'finishing' | 'renovation'
  | 'pool' | 'garden' | 'cloture' | 'investment';

interface FormData {
  objective: Objective | '';
  hasLand: 'yes' | 'no' | '';
  surface: string;
  floors: string;
  style: string;
  propertyType: string;
  renovationScope: 'full' | 'partial' | '';
  condition: string;
  timeline: string;
  location: string;
  name: string;
  phone: string;
  email: string;
}

const INITIAL: FormData = {
  objective: '',
  hasLand: '', surface: '', floors: '', style: '',
  propertyType: '', renovationScope: '', condition: '',
  timeline: '', location: '',
  name: '', phone: '', email: '',
};

const TOTAL_STEPS = 5;

/* ─── Helpers ────────────────────────────────────────────────── */
function inputClass(error?: boolean) {
  return `w-full bg-gray-900/60 border text-base ${error ? 'border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]' : 'border-gray-700'} rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 hover:border-gray-500 focus:bg-gray-900/80 focus:border-orange-400 transition-all duration-200`;
}

/* ─── BookingPage ────────────────────────────────────────────── */
export function BookingPage() {
  const navigate = useNavigate();
  const { lang, t, isRtl } = useLang();

  const [step, setStep]       = useState(1);
  const [data, setData]       = useState<FormData>(INITIAL);
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) =>
    setData(d => ({ ...d, [key]: val }));

  /* ── Validation per step ── */
  const validate = (): boolean => {
    const e: typeof errors = {};

    if (step === 1 && !data.objective)       e.objective    = t.errObj;

    if (step === 2) {
      if (data.objective === 'villa') {
        if (!data.hasLand)        e.hasLand   = t.errReq;
        if (!data.surface.trim()) e.surface   = t.errSurface;
        if (!data.floors.trim())  e.floors    = t.errFloors;
        if (!data.style.trim())   e.style     = t.errStyle;
      }
      if (data.objective === 'renovation') {
        if (!data.propertyType.trim())  e.propertyType    = t.errReq;
        if (!data.renovationScope)      e.renovationScope = t.errReq;
        if (!data.condition.trim())     e.condition       = t.errReq;
      }
    }

    if (step === 3 && !data.timeline) e.timeline = t.errTimeline;
    if (step === 4 && !data.location) e.location = t.errLocation;

    if (step === 5) {
      if (!data.name.trim())  e.name  = t.errName;
      if (!data.phone.trim()) e.phone = t.errPhone;
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        e.email = t.errEmail;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    console.log('📋 Booking submission:', data);
    setSubmitted(true);
  };

  const hasStep2 = data.objective === 'villa' || data.objective === 'renovation';
  const effectiveTotal = hasStep2 ? TOTAL_STEPS : TOTAL_STEPS - 1;

  const displayStep = (rawStep: number) => {
    if (!hasStep2 && rawStep >= 3) return rawStep - 1;
    return rawStep;
  };

  const goNext = () => {
    if (!validate()) return;
    if (step === 1 && !hasStep2) { setStep(3); return; }
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
  };

  const goBack = () => {
    setErrors({});
    if (step === 3 && !hasStep2) { setStep(1); return; }
    setStep(s => Math.max(s - 1, 1));
  };

  /* ────────────────────── Success screen ────────────────────── */
  if (submitted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6 ${isRtl ? 'rtl' : 'ltr'}`}>
        <div className="max-w-md w-full text-center relative z-10 animate-fadeInUp">
          <div className="w-24 h-24 rounded-full bg-orange-500/10 border-2 border-orange-400/60 flex flex-col items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(249,115,22,0.25)]">
            <CheckCircle className="text-orange-400 w-12 h-12" />
          </div>
          <h2 className="text-4xl font-semibold text-white mb-4 tracking-wide">{t.successTitle}</h2>
          <p className="text-slate-400 font-light text-lg mb-10 leading-relaxed">
            {t.successThanks} <strong className="text-white font-medium">{data.name}</strong>. {t.successContact} <strong className="text-white font-medium">{data.phone}</strong> {t.successWithin}
          </p>
          <button
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 hover:scale-105 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-[0_12px_40px_rgba(249,115,22,0.4)] transition-all duration-200"
            onClick={() => navigate(`/${lang}`)}
          >
            {isRtl ? 'العودة للموقع ←' : '← ' + t.backToSite}
          </button>
        </div>
      </div>
    );
  }

  const stepLabels: Record<number, string> = {
    1: t.lblObj,
    2: t.lblDet,
    3: t.lblTime,
    4: t.lblLoc,
    5: t.lblInfo,
  };

  /* ─────────────────────── Render ───────────────────────────── */
  return (
    <div className={`min-h-screen relative flex flex-col ${isRtl ? 'rtl' : 'ltr'} bg-gradient-to-br from-black via-gray-900 to-black overflow-x-hidden`}>

      {/* Ambient glow orbs */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.07)_0%,transparent_65%)]"></div>
      <div className="absolute bottom-0 inset-x-0 h-[400px] pointer-events-none z-0 bg-[radial-gradient(ellipse_at_bottom,rgba(234,179,8,0.05)_0%,transparent_65%)]"></div>

      {/* ── Top bar ── */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-lg px-6 py-4 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => navigate(`/${lang}`)}
          className={`flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors text-sm font-medium tracking-wide ${isRtl && 'flex-row-reverse'}`}
        >
          {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />} {t.backToSite}
        </button>
        <div className="flex items-center gap-2 text-white font-semibold tracking-widest uppercase text-sm">
          <img
            src="/LOGO.jpeg"
            alt="JT Travaux"
            className="h-8 w-auto mix-blend-screen"
            style={{ filter: 'invert(1) brightness(2)' }}
          />
        </div>
        <div className="w-28" /> {/* Spacer */}
      </header>

      {/* ── Body ── */}
      <div className="relative z-10 flex-1 flex items-start justify-center p-4 sm:p-8 pt-12">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-2xl shadow-2xl shadow-black/60">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-semibold text-white mb-2 tracking-wide font-heading">
              {t.bookConsultationFree}
            </h1>
            <p className="text-amber-400/80 text-sm font-medium tracking-widest uppercase">
              {t.freeNoCommitment}
            </p>
          </div>

          {/* Progress */}
          <ProgressBar
            current={displayStep(step)}
            total={effectiveTotal}
            label={`${stepLabels[step]} • ${t.step} ${displayStep(step)} ${t.of} ${effectiveTotal}`}
          />

          {/* ── STEP 1 — Objective ── */}
          {step === 1 && (
            <StepContainer title={t.step1Title} subtitle={t.step1Sub}>
              {([
                { value: 'villa',       icon: '🏠', label: t.optVilla,      sub: t.optVillaSub },
                { value: 'gros_oeuvre', icon: '🏗️', label: t.optGrosOeuvre, sub: t.optGrosOeuvreSub },
                { value: 'finishing',   icon: '✨', label: t.optFinishing,  sub: t.optFinishingSub },
                { value: 'renovation',  icon: '🔨', label: t.optRenovation, sub: t.optRenovationSub },
                { value: 'pool',        icon: '🏊', label: t.optPool,       sub: t.optPoolSub },
                { value: 'garden',      icon: '🌿', label: t.optGarden,     sub: t.optGardenSub },
                { value: 'cloture',     icon: '🧱', label: t.optCloture,    sub: t.optClotureSub },
                { value: 'investment',  icon: '📈', label: t.optInvestment, sub: t.optInvestmentSub },
              ] as const).map(opt => (
                <OptionCard
                  key={opt.value} icon={opt.icon} label={opt.label} sublabel={opt.sub}
                  selected={data.objective === opt.value}
                  onClick={() => set('objective', opt.value)}
                />
              ))}
              {errors.objective && <p className="text-red-400 text-sm mt-2">{errors.objective}</p>}
            </StepContainer>
          )}

          {/* ── STEP 2 — Dynamic details ── */}
          {step === 2 && data.objective === 'villa' && (
            <StepContainer title={t.step2VillaTitle}>
              <div className="space-y-6">
                <div>
                  <p className="text-amber-300 text-sm mb-3 font-semibold tracking-wide uppercase">{t.hasLand}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionCard label={t.yesLand} selected={data.hasLand === 'yes'} onClick={() => set('hasLand', 'yes')} />
                    <OptionCard label={t.noLand}  selected={data.hasLand === 'no'}  onClick={() => set('hasLand', 'no')} />
                  </div>
                  {errors.hasLand && <p className="text-red-400 text-sm mt-2">{errors.hasLand}</p>}
                </div>
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.surfaceArea}</label>
                  <input className={inputClass(!!errors.surface)} placeholder={t.surfaceAreaPlace} value={data.surface} onChange={e => set('surface', e.target.value)} />
                  {errors.surface && <p className="text-red-400 text-sm mt-2">{errors.surface}</p>}
                </div>
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.floors}</label>
                  <input className={inputClass(!!errors.floors)} placeholder={t.floorsPlace} value={data.floors} onChange={e => set('floors', e.target.value)} />
                  {errors.floors && <p className="text-red-400 text-sm mt-2">{errors.floors}</p>}
                </div>
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.style}</label>
                  <input className={inputClass(!!errors.style)} placeholder={t.stylePlace} value={data.style} onChange={e => set('style', e.target.value)} />
                  {errors.style && <p className="text-red-400 text-sm mt-2">{errors.style}</p>}
                </div>
              </div>
            </StepContainer>
          )}

          {step === 2 && data.objective === 'renovation' && (
            <StepContainer title={t.step2RenoTitle}>
              <div className="space-y-6">
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.propertyType}</label>
                  <input className={inputClass(!!errors.propertyType)} placeholder={t.propTypePlace} value={data.propertyType} onChange={e => set('propertyType', e.target.value)} />
                  {errors.propertyType && <p className="text-red-400 text-sm mt-2">{errors.propertyType}</p>}
                </div>
                <div>
                  <p className="text-amber-300 text-sm mb-3 font-semibold tracking-wide uppercase">{t.renoScope}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionCard label={t.fullReno}    selected={data.renovationScope === 'full'}    onClick={() => set('renovationScope', 'full')} />
                    <OptionCard label={t.partialReno} selected={data.renovationScope === 'partial'} onClick={() => set('renovationScope', 'partial')} />
                  </div>
                  {errors.renovationScope && <p className="text-red-400 text-sm mt-2">{errors.renovationScope}</p>}
                </div>
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.condition}</label>
                  <input className={inputClass(!!errors.condition)} placeholder={t.conditionPlace} value={data.condition} onChange={e => set('condition', e.target.value)} />
                  {errors.condition && <p className="text-red-400 text-sm mt-2">{errors.condition}</p>}
                </div>
              </div>
            </StepContainer>
          )}

          {/* ── STEP 3 — Timeline ── */}
          {step === 3 && (
            <StepContainer title={t.step4Title}>
              {[
                { value: 'now',       icon: '⚡', label: t.time1, sub: t.time1Sub },
                { value: '1-3m',      icon: '📅', label: t.time2, sub: t.time2Sub },
                { value: '3-6m',      icon: '🗓️', label: t.time3, sub: t.time3Sub },
                { value: 'exploring', icon: '🔍', label: t.time4, sub: t.time4Sub },
              ].map(opt => (
                <OptionCard key={opt.value} icon={opt.icon} label={opt.label} sublabel={opt.sub}
                  selected={data.timeline === opt.value} onClick={() => set('timeline', opt.value)} />
              ))}
              {errors.timeline && <p className="text-red-400 text-sm mt-2">{errors.timeline}</p>}
            </StepContainer>
          )}

          {/* ── STEP 4 — Location ── */}
          {step === 4 && (
            <StepContainer title={t.step5Title}>
              {[
                { value: 'marrakech', icon: '🕌', label: t.loc1, sub: t.loc1Sub },
                { value: 'outside',   icon: '📍', label: t.loc2, sub: t.loc2Sub },
              ].map(opt => (
                <OptionCard key={opt.value} icon={opt.icon} label={opt.label} sublabel={opt.sub}
                  selected={data.location === opt.value} onClick={() => set('location', opt.value)} />
              ))}
              {errors.location && <p className="text-red-400 text-sm mt-2">{errors.location}</p>}
            </StepContainer>
          )}

          {/* ── STEP 5 — Contact ── */}
          {step === 5 && (
            <StepContainer title={t.step6Title} subtitle={t.step6Sub}>
              <div className="space-y-5">
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.fullName}</label>
                  <input className={inputClass(!!errors.name)} placeholder={t.fullNamePlace} value={data.name} onChange={e => set('name', e.target.value)} />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.phoneNum}</label>
                  <input className={inputClass(!!errors.phone)} placeholder={t.phonePlace} type="tel" value={data.phone} onChange={e => set('phone', e.target.value)} />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-amber-300 text-sm mb-2 font-semibold tracking-wide uppercase">{t.emailAdd}</label>
                  <input className={inputClass(!!errors.email)} placeholder={t.emailPlace} type="email" value={data.email} onChange={e => set('email', e.target.value)} />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                {data.objective && (
                  <div className="mt-6 p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-slate-300 space-y-2 backdrop-blur-sm">
                    <p><span className="text-amber-400/80 font-medium uppercase tracking-wider text-xs mr-2">{t.summaryProject}</span> <span className="text-white">{t[`opt${data.objective.charAt(0).toUpperCase() + data.objective.slice(1).replace('_', '')}` as keyof typeof t] || data.objective}</span></p>
                    {data.timeline && <p><span className="text-amber-400/80 font-medium uppercase tracking-wider text-xs mr-2">{t.summaryTimeline}</span> <span className="text-white">{[t.time1, t.time2, t.time3, t.time4][['now', '1-3m', '3-6m', 'exploring'].indexOf(data.timeline)]}</span></p>}
                    {data.location && <p><span className="text-amber-400/80 font-medium uppercase tracking-wider text-xs mr-2">{t.summaryLocation}</span> <span className="text-white">{[t.loc1, t.loc2][['marrakech', 'outside'].indexOf(data.location)]}</span></p>}
                  </div>
                )}
              </div>
            </StepContainer>
          )}

          {/* ── Nav buttons ── */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-700/50">
            {step > 1 && (
              <button
                onClick={goBack}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-400 hover:border-orange-400/50 hover:bg-white/5 hover:text-white transition-all duration-200 text-base sm:w-1/3"
              >
                {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />} {t.backToSite.split(' ')[0]}
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={goNext}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 hover:scale-105 active:scale-95 text-black font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-[0_8px_30px_rgba(249,115,22,0.45)]"
              >
                {t.continueBtn.replace('→', '').trim()} {isRtl ? <ArrowLeft size={22} /> : <ArrowRight size={22} />}
              </button>
            ) : (
              <button
                onClick={submit}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 hover:scale-105 active:scale-95 text-black font-bold text-lg py-4 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-[0_10px_40px_rgba(249,115,22,0.5)]"
              >
                <CheckCircle size={22} /> {t.bookMyConsultationBtn}
              </button>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs tracking-wider uppercase text-gray-600 font-medium mt-10">
            {t.freeConsultation} • {t.noCommitment} • {t.basedInMarrakech}
          </p>
        </div>
      </div>
    </div>
  );
}
