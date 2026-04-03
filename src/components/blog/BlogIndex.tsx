import { useLang } from '../../context/LanguageContext';

export function BlogIndex() {
  const { lang, t } = useLang();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16 animate-fadeInUp">
        <p className="text-xs uppercase tracking-[0.2em] text-[#dca54c] font-semibold mb-4">Dernière Édition</p>
        <h1 className="text-5xl md:text-7xl font-light text-black leading-[1.1] mb-8 font-serif tracking-tight">
          L'Art de Vivre:<br/>Modernizing Marrakech’s Architectural Heritage
        </h1>
        <p className="text-xl text-gray-500 leading-relaxed font-sans max-w-2xl mx-auto font-light">
          Discover the delicate balance between high-end modern functionality and traditional Moroccan craftsmanship when executing luxury construction projects.
        </p>
      </div>

      <div className="w-full aspect-video md:aspect-[21/9] bg-stone-100 mb-16 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" 
          alt="Villa Editorial" 
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000"
        />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-black/10" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-sans font-semibold">Volume 1 • Publication</span>
          <div className="h-[1px] flex-1 bg-black/10" />
        </div>
        
        <p className="text-lg text-gray-800 leading-[1.8] font-serif mb-6">
          Building a luxury home in the vibrant city of Marrakech demands more than technical excellence; it requires an intricate understanding of the region's climate, culture, and materials. At JT Travaux, our commitment is not just to erect structures, but to curate living spaces that honor the Moroccan legacy while affording uncompromised contemporary luxury.
        </p>
        
        <p className="text-lg text-gray-800 leading-[1.8] font-serif">
          From sourcing authentic zellige tiles to engineering seamless infinity pools that gaze toward the Atlas Mountains, the approach is definitively holistic. A modern villa here doesn't reject its environment, it invites it in through grand patios, shaded riads, and sustainable passive cooling channels engineered right into the masonry.
        </p>

        <div className="mt-20 pt-10 border-t border-black text-center">
            <span className="text-xs text-gray-400 uppercase tracking-[0.2em] font-sans">More articles coming soon...</span>
        </div>
      </div>
    </div>
  );
}
