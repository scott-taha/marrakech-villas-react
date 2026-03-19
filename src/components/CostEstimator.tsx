import { useState, useEffect } from 'react';
import {
  X, ArrowRight, ArrowLeft, Building, PaintBucket, Waves,
  Fence, TreeDeciduous, CheckCircle2, Phone, Sparkles,
  Gift, ShieldCheck, RotateCcw, Calendar, Mail,
} from 'lucide-react';

/* ─────────────────── PRICING ─────────────────── */
type FinitionLevel = 'simple' | 'haute-gamme' | 'luxe';
type PiscinePack   = 'gros' | 'second' | 'installation' | 'none';
type CloturePack   = 'gros' | 'second' | 'none';
type JardinPack    = 'simple' | 'haute-gamme' | 'luxe' | 'none';

interface EstData {
  types:        { grosOeuvre: boolean; secondOeuvre: boolean };
  surface:      number;
  etage:        number;
  finition:     FinitionLevel;
  piscine_sur:  number;
  piscine_pack: PiscinePack;
  cloture_lon:  number;
  cloture_pack: CloturePack;
  jardin_sur:   number;
  jardin_pack:  JardinPack;
  contact:      { name: string; email: string; phone: string };
}

const DEFAULT: EstData = {
  types:        { grosOeuvre: false, secondOeuvre: false },
  surface:      200, etage: 1, finition: 'haute-gamme',
  piscine_sur:  40,  piscine_pack: 'none',
  cloture_lon:  60,  cloture_pack: 'none',
  jardin_sur:   200, jardin_pack:  'none',
  contact:      { name: '', email: '', phone: '' },
};

function calcTotal(d: EstData) {
  const grossPrix = d.types.grosOeuvre
    ? (d.surface * 1020) + (d.surface * 1680 * (d.etage + 1))
    : 0;

  const secondPrix = d.types.secondOeuvre
    ? d.surface * (d.finition === 'simple' ? 1500 : d.finition === 'haute-gamme' ? 2500 : 4500) * (d.etage + 1)
    : 0;

  const piscinePrix =
    d.piscine_pack === 'gros'         ? d.piscine_sur * 1200 :
    d.piscine_pack === 'second'       ? d.piscine_sur * 2000 :
    d.piscine_pack === 'installation' ? d.piscine_sur * 2500 : 0;

  const cloturePrix =
    d.cloture_pack === 'gros'   ? d.cloture_lon * 750 :
    d.cloture_pack === 'second' ? d.cloture_lon * 900 : 0;

  const jardinPrix =
    d.jardin_pack === 'simple'      ? d.jardin_sur * 600  :
    d.jardin_pack === 'haute-gamme' ? d.jardin_sur * 1300 :
    d.jardin_pack === 'luxe'        ? d.jardin_sur * 2500 : 0;

  return { grossPrix, secondPrix, piscinePrix, cloturePrix, jardinPrix,
    total: grossPrix + secondPrix + piscinePrix + cloturePrix + jardinPrix };
}

const fmtMAD = (n: number) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n) + ' MAD TTC';

/* ─────────────────── STEP CONFIG ─────────────────── */
type StepId = 'type' | 'specs' | 'piscine' | 'cloture' | 'jardin' | 'contact';
const STEPS: StepId[] = ['type', 'specs', 'piscine', 'cloture', 'jardin', 'contact'];

const STEP_META: Record<StepId, { label: string; tagline: string; img: string }> = {
  type:    { label: 'Type de projet',   tagline: 'Définissez votre vision',      img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80' },
  specs:   { label: 'Votre villa',      tagline: 'Dimensionnez votre projet',    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80' },
  piscine: { label: 'Piscine',          tagline: "Le luxe de l'eau",             img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80' },
  cloture: { label: 'Clôture',          tagline: 'Sécurité & élégance',          img: '/est-cloture.png' },
  jardin:  { label: 'Jardin',           tagline: 'Votre écrin vert',             img: '/est-jardin.png'  },
  contact: { label: 'Vos coordonnées',  tagline: 'Recevez votre devis détaillé', img: '/est-villa.png'   },
};

const REVEAL_IMG = '/est-villa.png';

/* ─────────────────── SHARED UI ─────────────────── */
const inputCls = 'w-full border border-gray-200 rounded px-4 py-3 text-sm text-gray-800 bg-white placeholder-gray-300 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200';

/** Premium dark luxury nav row */
function NavRow({ onBack, onNext, nextLabel = 'Continuer', disabled = false }:
  { onBack?: () => void; onNext?: () => void; nextLabel?: string; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between pt-8 mt-10 border-t border-gray-100">
      {onBack
        ? <button onClick={onBack}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-700 uppercase tracking-widest transition-colors duration-200">
            <ArrowLeft size={13} /> Retour
          </button>
        : <span />}
      {onNext && (
        <button onClick={onNext} disabled={disabled}
          className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white text-xs font-medium rounded-lg tracking-widest uppercase hover:bg-gray-800 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
          {nextLabel} <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

/** Toggleable card for Step 1 (project type) */
function ChoiceCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left rounded-xl border-2 px-6 py-5 transition-all duration-200 ${selected ? 'border-gray-900 bg-stone-100' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      {children}
    </button>
  );
}

function Checkmark({ selected }: { selected: boolean }) {
  return (
    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${selected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`}>
      {selected && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  );
}

/* ─────────────────── STEP COMPONENTS ─────────────────── */

/** Step 1 – Multi-select project type */
function StepType({ d, upd, onNext }: { d: EstData; upd: (u: Partial<EstData>) => void; onNext: () => void }) {
  const tog = (k: 'grosOeuvre' | 'secondOeuvre') => upd({ types: { ...d.types, [k]: !d.types[k] } });
  const ok  = d.types.grosOeuvre || d.types.secondOeuvre;
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium text-gray-900 mb-3">Quel type de projet planifiez-vous ?</h2>
      <p className="text-sm text-gray-400 mb-9">Sélectionnez un ou plusieurs services — vous pouvez combiner les deux phases.</p>
      <div className="space-y-4">
        <ChoiceCard selected={d.types.grosOeuvre} onClick={() => tog('grosOeuvre')}>
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors ${d.types.grosOeuvre ? 'bg-gray-900 text-white' : 'bg-stone-100 text-gray-400'}`}><Building size={20} /></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-semibold text-gray-900">Gros Œuvre</span>
                <Checkmark selected={d.types.grosOeuvre} />
              </div>
              <p className="text-xs text-[#dca54c] font-medium mb-1">Structure & fondations</p>
              <p className="text-sm text-gray-500 leading-relaxed">Fondations, murs porteurs, dalles, charpente — le squelette solide de votre villa.</p>
            </div>
          </div>
        </ChoiceCard>
        <ChoiceCard selected={d.types.secondOeuvre} onClick={() => tog('secondOeuvre')}>
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md transition-colors ${d.types.secondOeuvre ? 'bg-gray-900 text-white' : 'bg-stone-100 text-gray-400'}`}><PaintBucket size={20} /></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif font-semibold text-gray-900">Second Œuvre / Finition</span>
                <Checkmark selected={d.types.secondOeuvre} />
              </div>
              <p className="text-xs text-[#dca54c] font-medium mb-1">Aménagements intérieurs</p>
              <p className="text-sm text-gray-500 leading-relaxed">Plomberie, électricité, plâtrerie, sols, peinture — les détails qui font le luxe.</p>
            </div>
          </div>
        </ChoiceCard>
      </div>
      {!ok && <p className="text-center text-xs text-gray-400 mt-6 tracking-wide">Sélectionnez au moins un type pour continuer.</p>}
      <NavRow onNext={onNext} disabled={!ok} />
    </div>
  );
}

/** Step 2 – Villa specs — premium redesign */
function StepSpecs({ d, upd, onNext, onBack }: { d: EstData; upd: (u: Partial<EstData>) => void; onNext: () => void; onBack: () => void }) {
  const fLevels: { id: FinitionLevel; label: string; sub: string }[] = [
    { id: 'simple',      label: 'Essentiel',     sub: 'Matériaux standards, finitions propres.' },
    { id: 'haute-gamme', label: 'Haut Standing',  sub: 'Matériaux nobles, climatisation centralisée.' },
    { id: 'luxe',        label: 'Prestige',        sub: 'Domotique, marbre importé, luxe absolu.' },
  ];
  const sliderPct = ((d.surface - 50) / 650) * 100;
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-serif text-2xl font-medium text-gray-900 mb-1">Spécifications de votre villa</h2>
        <p className="text-sm text-gray-400">Ces dimensions déterminent la base de votre estimation.</p>
      </div>

      {/* ── Surface ── */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-6">Surface habitable</p>
        <div className="flex items-end gap-3 mb-7">
          <span className="font-serif text-7xl font-light text-gray-900 tracking-tight leading-none">{d.surface}</span>
          <span className="text-2xl text-gray-300 mb-2 font-light">m²</span>
        </div>
        <input
          type="range" min={50} max={700} step={5} value={d.surface}
          onChange={e => upd({ surface: Number(e.target.value) })}
          className="w-full cursor-pointer appearance-none h-px bg-gray-200 mb-3"
          style={{
            background: `linear-gradient(to right, #111827 ${sliderPct}%, #e5e7eb ${sliderPct}%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-300 mb-6"><span>50 m²</span><span>700 m²</span></div>
        <div className="flex flex-wrap gap-2">
          {[100, 150, 200, 250, 300, 400, 500].map(v => (
            <button key={v} onClick={() => upd({ surface: v })}
              className={`px-4 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                d.surface === v
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
              {v} m²
            </button>
          ))}
        </div>
      </div>

      {/* ── Étage ── */}
      <div className="pb-10 border-b border-gray-100">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-8">Nombre d'étages</p>
        <div className="flex items-center gap-10">
          <button onClick={() => upd({ etage: Math.max(0, d.etage - 1) })}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 text-gray-400 text-2xl hover:border-gray-900 hover:text-gray-900 transition-colors duration-200">
            −
          </button>
          <div className="text-center">
            <span className="font-serif text-6xl font-light text-gray-900 leading-none">{d.etage}</span>
            <p className="text-xs text-gray-400 mt-3 tracking-widest uppercase">{d.etage === 0 ? 'Plain-pied' : d.etage === 1 ? 'R+1' : `R+${d.etage}`}</p>
          </div>
          <button onClick={() => upd({ etage: Math.min(5, d.etage + 1) })}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 text-gray-400 text-2xl hover:border-gray-900 hover:text-gray-900 transition-colors duration-200">
            +
          </button>
        </div>
      </div>

      {/* ── Finition – only if secondOeuvre ── */}
      {d.types.secondOeuvre && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-5">Niveau de finitions</p>
          <div className="space-y-3">
            {fLevels.map(l => {
              const sel = d.finition === l.id;
              return (
                <button key={l.id} onClick={() => upd({ finition: l.id })}
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                    sel
                      ? 'border-2 border-gray-900 bg-stone-100 shadow-sm'
                      : 'border border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-serif text-base font-semibold mb-1 ${sel ? 'text-gray-900' : 'text-gray-700'}`}>{l.label}</p>
                      <p className={`text-sm leading-relaxed ${sel ? 'text-gray-600' : 'text-gray-400'}`}>{l.sub}</p>
                    </div>
                    <div className={`flex h-5 w-5 shrink-0 ml-4 items-center justify-center rounded-full border-2 transition-all ${
                      sel ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`}>
                      {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
      <NavRow onBack={onBack} onNext={onNext} />
    </div>
  );
}

/** Generic 2-col pack grid */
function PackGrid<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)}
          className={`rounded-lg border py-3.5 text-sm font-medium transition-all duration-200 ${
            value === o.id
              ? 'border-2 border-gray-900 bg-stone-100 text-gray-900'
              : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Reusable slider block */
function SliderBlock({ label, value, min, max, step, unit, presets, onChange }:
  { label: string; value: number; min: number; max: number; step: number; unit: string; presets: number[]; onChange: (v: number) => void }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</label>
        <span className="font-serif text-4xl font-light text-gray-900 leading-none">{value} <span className="text-lg text-gray-300">{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full cursor-pointer appearance-none h-px bg-gray-200 mb-2"
        style={{ background: `linear-gradient(to right, #111827 ${pct}%, #e5e7eb ${pct}%)` }}
      />
      <div className="flex justify-between text-xs text-gray-300 mb-5"><span>{min} {unit}</span><span>{max} {unit}</span></div>
      <div className="flex flex-wrap gap-2">
        {presets.map(v => (
          <button key={v} onClick={() => onChange(v)}
            className={`px-3.5 py-1.5 text-xs rounded-full border transition-all duration-200 ${
              value === v
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}>
            {v} {unit}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Step 3 – Piscine */
function StepPiscine({ d, upd, onNext, onBack }: { d: EstData; upd: (u: Partial<EstData>) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50"><Waves size={20} className="text-blue-400" /></div>
          <h2 className="font-serif text-2xl font-medium text-gray-900">Piscine</h2>
        </div>
        <p className="text-sm text-gray-400 mt-2">Configurez la piscine de votre villa.</p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Pack / Phase</p>
        <PackGrid<PiscinePack> value={d.piscine_pack} onChange={v => upd({ piscine_pack: v })}
          options={[
            { id: 'gros',         label: 'Gros Œuvre' },
            { id: 'second',       label: 'Second Œuvre' },
            { id: 'installation', label: 'Installation complète' },
            { id: 'none',         label: 'Sans piscine' },
          ]} />
      </div>
      {d.piscine_pack !== 'none' && (
        <SliderBlock label="Surface de la piscine" value={d.piscine_sur} min={15} max={120} step={1} unit="m²"
          presets={[25, 32, 40, 50, 60, 80]} onChange={v => upd({ piscine_sur: v })} />
      )}
      <NavRow onBack={onBack} onNext={onNext} nextLabel={d.piscine_pack === 'none' ? 'Passer' : 'Continuer'} />
    </div>
  );
}

/** Step 4 – Clôture */
function StepCloture({ d, upd, onNext, onBack }: { d: EstData; upd: (u: Partial<EstData>) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-100"><Fence size={20} className="text-gray-500" /></div>
          <h2 className="font-serif text-2xl font-medium text-gray-900">Clôture</h2>
        </div>
        <p className="text-sm text-gray-400 mt-2">Délimitez votre propriété avec élégance.</p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Pack / Phase</p>
        <PackGrid<CloturePack> value={d.cloture_pack} onChange={v => upd({ cloture_pack: v })}
          options={[
            { id: 'gros',   label: 'Gros Œuvre' },
            { id: 'second', label: 'Second Œuvre' },
            { id: 'none',   label: 'Sans clôture' },
          ]} />
      </div>
      {d.cloture_pack !== 'none' && (
        <SliderBlock label="Longueur linéaire" value={d.cloture_lon} min={20} max={300} step={5} unit="ml"
          presets={[40, 60, 80, 100, 150, 200]} onChange={v => upd({ cloture_lon: v })} />
      )}
      <NavRow onBack={onBack} onNext={onNext} nextLabel={d.cloture_pack === 'none' ? 'Passer' : 'Continuer'} />
    </div>
  );
}

/** Step 5 – Jardin */
function StepJardin({ d, upd, onNext, onBack }: { d: EstData; upd: (u: Partial<EstData>) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50"><TreeDeciduous size={20} className="text-green-500" /></div>
          <h2 className="font-serif text-2xl font-medium text-gray-900">Jardin & Paysagisme</h2>
        </div>
        <p className="text-sm text-gray-400 mt-2">Un écrin de verdure qui sublime votre villa.</p>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">Pack jardin</p>
        <PackGrid<JardinPack> value={d.jardin_pack} onChange={v => upd({ jardin_pack: v })}
          options={[
            { id: 'simple',      label: 'Simple' },
            { id: 'haute-gamme', label: 'Haut Standing' },
            { id: 'luxe',        label: 'Prestige' },
            { id: 'none',        label: 'Sans jardin' },
          ]} />
      </div>
      {d.jardin_pack !== 'none' && (
        <SliderBlock label="Surface du jardin" value={d.jardin_sur} min={50} max={600} step={10} unit="m²"
          presets={[100, 150, 200, 300, 400]} onChange={v => upd({ jardin_sur: v })} />
      )}
      <NavRow onBack={onBack} onNext={onNext} nextLabel={d.jardin_pack === 'none' ? 'Passer' : 'Continuer'} />
    </div>
  );
}

/** Step 6 – Contact / Lead capture */
function StepContact({ d, upd, onSubmit, onBack }: { d: EstData; upd: (u: Partial<EstData>) => void; onSubmit: () => void; onBack: () => void }) {
  const set = (f: keyof EstData['contact'], v: string) => upd({ contact: { ...d.contact, [f]: v } });
  const ok  = d.contact.name.trim().length >= 2 && d.contact.email.includes('@') && d.contact.phone.trim().length >= 8;
  return (
    <div>
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-50 mx-auto mb-5"><Sparkles size={22} className="text-[#dca54c]" /></div>
      <h2 className="font-serif text-2xl font-medium text-gray-900 text-center mb-2">Votre estimation est prête</h2>
      <p className="text-sm text-gray-400 text-center mb-7">Recevez votre devis détaillé et une consultation gratuite de nos experts.</p>

      <div className="rounded-xl bg-stone-100 border border-gray-100 px-5 py-4 mb-7 space-y-3">
        {[
          { I: Gift,        t: 'Décomposition complète du devis par email' },
          { I: ShieldCheck, t: 'Consultation gratuite de 30 minutes' },
          { I: Sparkles,    t: 'Sans engagement — confidentialité garantie' },
        ].map(({ I, t }) => (
          <div key={t} className="flex items-center gap-3 text-sm text-gray-600"><I size={14} className="text-[#dca54c] shrink-0" />{t}</div>
        ))}
      </div>

      <div className="space-y-4">
        {[
          { f: 'name'  as const, lbl: 'Nom complet',   ph: 'Mohammed Alaoui',   type: 'text'  },
          { f: 'email' as const, lbl: 'Adresse email',  ph: 'vous@email.com',   type: 'email' },
          { f: 'phone' as const, lbl: 'Téléphone',      ph: '+212 6XX XXX XXX', type: 'tel'   },
        ].map(({ f, lbl, ph, type }) => (
          <div key={f}>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-widest">{lbl}</label>
            <input type={type} placeholder={ph} value={d.contact[f]} onChange={e => set(f, e.target.value)} className={inputCls} />
          </div>
        ))}
      </div>

      <div className="mt-7">
        <button onClick={() => ok && onSubmit()} disabled={!ok}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white text-xs font-medium rounded-lg tracking-widest uppercase hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
          <Sparkles size={14} /> Révéler mon estimation
        </button>
        <p className="text-center text-xs text-gray-400 mt-3">Données confidentielles — jamais revendues.</p>
      </div>
      <div className="mt-5 text-center">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mx-auto uppercase tracking-widest transition-colors">
          <ArrowLeft size={12} /> Retour
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── REVEAL VIEW ─────────────────── */
function RevealView({ d, onRestart }: { d: EstData; onRestart: () => void }) {
  const { grossPrix, secondPrix, piscinePrix, cloturePrix, jardinPrix, total } = calcTotal(d);
  const piscineLabel: Record<PiscinePack, string> = { gros: 'Gros Œuvre', second: 'Second Œuvre', installation: 'Installation', none: '' };
  const clotureLabel: Record<CloturePack, string> = { gros: 'Gros Œuvre', second: 'Second Œuvre', none: '' };
  const jardinLabel:  Record<JardinPack, string>  = { simple: 'Simple', 'haute-gamme': 'Haut Standing', luxe: 'Prestige', none: '' };
  const lines = [
    { show: d.types.grosOeuvre,        lbl: 'Gros Œuvre',             detail: `${d.surface} m² · ${d.etage} étage${d.etage > 1 ? 's' : ''}`, cost: grossPrix   },
    { show: d.types.secondOeuvre,      lbl: 'Second Œuvre / Finition', detail: `${d.surface} m² · ${d.etage + 1} niv. · ${d.finition}`,       cost: secondPrix  },
    { show: d.piscine_pack !== 'none', lbl: 'Piscine',                 detail: `${d.piscine_sur} m² · ${piscineLabel[d.piscine_pack]}`,        cost: piscinePrix },
    { show: d.cloture_pack !== 'none', lbl: 'Clôture',                 detail: `${d.cloture_lon} ml · ${clotureLabel[d.cloture_pack]}`,        cost: cloturePrix },
    { show: d.jardin_pack  !== 'none', lbl: 'Jardin',                  detail: `${d.jardin_sur} m² · ${jardinLabel[d.jardin_pack]}`,           cost: jardinPrix  },
  ].filter(l => l.show);

  return (
    <div className="flex h-full">
      {/* Left image */}
      <div className="hidden md:flex w-[42%] shrink-0 relative flex-col">
        <img src={REVEAL_IMG} alt="Villa de luxe" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/75" />
        <div className="absolute inset-x-0 bottom-0 px-10 pb-12 text-white">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Votre estimation</p>
          <p className="font-serif text-2xl font-light leading-snug">Votre villa,<br />votre budget maîtrisé.</p>
        </div>
      </div>

      {/* Right reveal */}
      <div className="flex-1 bg-[#F9F8F6] overflow-y-auto">
        <div className="px-10 py-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 mx-auto mb-5">
            <CheckCircle2 size={24} className="text-white" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-gray-900 text-center mb-1">Merci, {d.contact.name.split(' ')[0]} !</h2>
          <p className="text-sm text-gray-400 text-center mb-8">Devis envoyé à {d.contact.email}</p>

          {/* Total hero card */}
          <div className="rounded-xl bg-gray-900 px-6 py-8 text-center mb-6">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Estimation totale</p>
            <p className="font-serif text-4xl font-light text-white tracking-wide">{fmtMAD(total)}</p>
            <p className="text-xs text-gray-600 mt-3">Toutes phases et options configurées incluses</p>
          </div>

          {/* Breakdown */}
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">Détail du devis</p>
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 mb-6">
            {lines.map(l => (
              <div key={l.lbl} className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-sm font-medium text-gray-800">{l.lbl}</p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">{l.detail}</p>
                </div>
                <span className="text-sm font-semibold text-gray-800 ml-4 shrink-0">{fmtMAD(l.cost)}</span>
              </div>
            ))}
          </div>

          {/* Next steps */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { I: Mail,     t: 'Email',  d: 'Décomposition complète envoyée' },
              { I: Phone,    t: 'Appel',  d: 'Expert sous 24h' },
              { I: Calendar, t: 'Visite', d: 'Évaluation offerte' },
            ].map(({ I, t, d: desc }) => (
              <div key={t} className="text-center bg-white rounded-xl border border-gray-100 px-3 py-4">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-stone-100"><I size={14} className="text-gray-500" /></div>
                <p className="text-xs font-semibold text-gray-700">{t}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-6 bg-stone-100 rounded-lg px-4 py-3">
            <strong className="text-gray-600">Note :</strong> Estimation basée sur les prix de référence du marché à Marrakech. Le devis définitif est établi après visite de site.
          </p>

          <div className="flex flex-col gap-2">
            <a href="tel:+212600000000"
              className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white text-xs font-medium rounded-lg tracking-widest uppercase hover:bg-gray-800 transition-colors">
              <Phone size={13} /> Nous appeler maintenant
            </a>
            <button onClick={onRestart}
              className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 py-3 uppercase tracking-widest transition-colors">
              <RotateCcw size={12} /> Nouvelle estimation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN COMPONENT ─────────────────── */
export function CostEstimator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [d, setD]             = useState<EstData>(DEFAULT);
  const [stepIdx, setStepIdx] = useState(0);
  const [submitted, setSub]   = useState(false);
  const [imgOpacity, setImgO] = useState(1);
  const [dispImg, setDispImg] = useState(STEP_META.type.img);

  const upd = (u: Partial<EstData>) => setD(prev => ({ ...prev, ...u }));
  const next = () => setStepIdx(i => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIdx(i => Math.max(i - 1, 0));
  const restart   = () => { setD(DEFAULT); setStepIdx(0); setSub(false); };
  const handleClose = () => { onClose(); setTimeout(restart, 400); };

  const stepId = STEPS[stepIdx];
  const meta   = STEP_META[stepId];

  const rawImg = submitted ? REVEAL_IMG : (stepId === 'type'
    ? (d.types.grosOeuvre && d.types.secondOeuvre
        ? 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80'
        : d.types.grosOeuvre
        ? 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80'
        : d.types.secondOeuvre
        ? 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80'
        : meta.img)
    : meta.img);

  useEffect(() => {
    setImgO(0);
    const t = setTimeout(() => { setDispImg(rawImg); setImgO(1); }, 220);
    return () => clearTimeout(t);
  }, [rawImg]);

  const props = { d, upd, onNext: next, onBack: back };

  const renderStep = () => {
    switch (stepId) {
      case 'type':    return <StepType    d={d} upd={upd} onNext={next} />;
      case 'specs':   return <StepSpecs   {...props} />;
      case 'piscine': return <StepPiscine {...props} />;
      case 'cloture': return <StepCloture {...props} />;
      case 'jardin':  return <StepJardin  {...props} />;
      case 'contact': return <StepContact d={d} upd={upd} onBack={back} onSubmit={() => setSub(true)} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={handleClose} />

      {/* Modal — fixed height so both columns stretch equally */}
      <div className="relative w-full max-w-5xl rounded-xl overflow-hidden shadow-2xl flex" style={{ height: '88vh' }}>
        {submitted ? <RevealView d={d} onRestart={restart} /> : (
          <>
            {/* ── LEFT IMAGE PANEL ── */}
            <div className="hidden md:flex w-[42%] shrink-0 relative flex-col h-full">
              <img src={dispImg} alt={meta.label}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: imgOpacity, transition: 'opacity 0.4s ease' }} />
              <div className="absolute inset-0 bg-linear-to-b from-black/55 via-transparent to-black/75" />
              {/* Step info bottom */}
              <div className="relative z-10 mt-auto px-10 pb-12">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-light">{meta.tagline}</p>
                <h3 className="font-serif text-4xl font-light text-white leading-snug">{meta.label}</h3>
                {/* Progress dashes */}
                <div className="flex gap-2 mt-8">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`h-[3px] rounded-full transition-all duration-500 ${
                      i === stepIdx ? 'bg-[#dca54c] w-8' : i < stepIdx ? 'bg-white/60 w-4' : 'bg-white/20 w-4'
                    }`} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT FORM PANEL ── */}
            <div className="flex-1 bg-stone-50 flex flex-col h-full min-w-0">
              {/* Header bar */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0 bg-stone-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">Étape {stepIdx + 1} <span className="text-gray-300">/</span> {STEPS.length}</span>
                  <div className="h-3 w-px bg-gray-200" />
                  <span className="text-xs text-[#dca54c] font-semibold">{Math.round(((stepIdx + 1) / STEPS.length) * 100)}%</span>
                </div>
                <button onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-colors">
                  <X size={15} />
                </button>
              </div>
              {/* Progress bar */}
              <div className="h-[2px] bg-gray-100 shrink-0">
                <div className="h-full bg-[#dca54c] transition-all duration-500 ease-out"
                  style={{ width: `${Math.round(((stepIdx + 1) / STEPS.length) * 100)}%` }} />
              </div>
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-12 py-12">
                  <div key={stepId} className="animate-in fade-in slide-in-from-right-3 duration-300">
                    {renderStep()}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
