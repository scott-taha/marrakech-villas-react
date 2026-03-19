import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { translations } from '../locales';

export function LanguageGate() {
  const navigate = useNavigate();
  // We still pick up the currently stored language only to do the one-time redirect
  const { setLang } = useLang();
  const t = translations.en; // gate labels are always shown in all 3 languages simultaneously

  useEffect(() => {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && Object.keys(translations).includes(saved)) {
      navigate(`/${saved}`, { replace: true });
    }
  }, [navigate]);

  const selectLanguage = (lang: 'en' | 'fr' | 'ar') => {
    setLang(lang); // updates context + localStorage instantly
    navigate(`/${lang}`);
  };

  return (
    <div className="gate-container">
      <div className="gate-overlay" />
      <div className="gate-content">
        <header className="gate-header">
          <h1 className="brand-logo" style={{ letterSpacing: '0.05em' }}>JT TRAVAUX</h1>
          <p className="brand-tagline">Construction &amp; Villa Projects in Marrakech</p>
        </header>

        <main className="gate-main">
          <h2 className="gate-title">Choose Your Language</h2>
          <p className="gate-subtitle">Please select your preferred language to continue</p>

          <div className="language-options">
            <button className="lang-btn" onClick={() => selectLanguage('en')}>
              <span className="lang-label">{t.enTitle}</span>
              <span className="lang-subtext">{t.enSub}</span>
            </button>
            <button className="lang-btn" onClick={() => selectLanguage('fr')}>
              <span className="lang-label">{t.frTitle}</span>
              <span className="lang-subtext">{t.frSub}</span>
            </button>
            <button className="lang-btn ar-btn" onClick={() => selectLanguage('ar')} dir="rtl">
              <span className="lang-label">{t.arTitle}</span>
              <span className="lang-subtext">{t.arSub}</span>
            </button>
          </div>
        </main>

        <footer className="gate-footer">
          <p>{t.gateFooter}</p>
        </footer>
      </div>
    </div>
  );
}
