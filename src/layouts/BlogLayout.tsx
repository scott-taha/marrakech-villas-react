import { Outlet, Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export function BlogLayout() {
  const { lang, isRtl } = useLang();
  const location = useLocation();

  return (
    <div className={`min-h-screen bg-white text-gray-900 font-serif overflow-x-hidden ${isRtl ? 'rtl' : 'ltr'}`}>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex justify-between items-center">
          <Link to={`/${lang}`} className="text-xl font-bold tracking-widest uppercase text-gray-900 hover:text-orange-900 transition-colors w-1/3">
            JT TRAVAUX <span className="font-light italic ml-3 border-l border-gray-300 pl-3">Magazine</span>
          </Link>
          
          <div className="hidden md:flex gap-10 uppercase text-[11px] tracking-[0.2em] font-semibold text-gray-400 justify-center w-1/3">
            <Link to={`/${lang}/blog/architecture`} className="hover:text-black transition-colors">Architecture</Link>
            <Link to={`/${lang}/blog/design`} className="hover:text-black transition-colors">Design</Link>
            <Link to={`/${lang}/blog/lifestyle`} className="hover:text-black transition-colors">Lifestyle</Link>
          </div>

          <div className="flex w-1/3 justify-end">
            <Link to={`/${lang}`} className="text-xs uppercase tracking-widest font-medium border border-gray-200 px-5 py-2.5 hover:bg-black hover:text-white transition-colors">
              Retour au site
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-16 lg:py-24">
        <Outlet />
      </main>

      <footer className="border-t border-black/10 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center text-xs uppercase tracking-widest text-gray-400">
          JT Travaux Magazine © {new Date().getFullYear()} – Marrakech, Morocco
        </div>
      </footer>
    </div>
  );
}
