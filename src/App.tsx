import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LanguageGate } from './components/LanguageGate';
import { MainSite } from './components/MainSite';
import { BookingPage } from './components/booking/BookingPage';
import { BlogLayout } from './layouts/BlogLayout';
import { BlogIndex } from './components/blog/BlogIndex';
import { LanguageProvider, useLang } from './context/LanguageContext';
import { translations } from './locales';
import { useEffect } from 'react';

/**
 * Inner component — has access to both the router and LanguageContext.
 * Handles the auto-redirect from "/" when a saved language exists.
 */
function AppRoutes() {
  const { lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only auto-redirect when the user lands directly on "/"
    if (location.pathname === '/') {
      const saved = localStorage.getItem('preferredLanguage');
      if (saved && Object.keys(translations).includes(saved)) {
        navigate(`/${saved}`, { replace: true });
      }
    }
    // lang dependency ensures the effect re-evaluates after a language switch
  }, [lang, location.pathname, navigate]);

  return (
    <Routes>
      {/* Language selection gateway */}
      <Route path="/" element={<LanguageGate />} />

      {/* Per-language main site; e.g. /en, /fr, /ar */}
      {Object.keys(translations).map((code) => (
        <Route key={code} path={`/${code}/*`} element={<MainSite />} />
      ))}

      {/* Booking — language-prefixed so we can read it from the URL */}
      <Route path="/booking" element={<BookingPage />} />
      {Object.keys(translations).map((code) => (
        <Route key={`booking-${code}`} path={`/${code}/booking`} element={<BookingPage />} />
      ))}

      {/* Blog Magazine Routes */}
      <Route path="/blog" element={<BlogLayout />}>
        <Route index element={<BlogIndex />} />
      </Route>
      {Object.keys(translations).map((code) => (
        <Route key={`blog-${code}`} path={`/${code}/blog`} element={<BlogLayout />}>
          <Route index element={<BlogIndex />} />
        </Route>
      ))}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppRoutes />
      </Router>
    </LanguageProvider>
  );
}

export default App;
