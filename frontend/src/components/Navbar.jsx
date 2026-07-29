import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import HireModal from './HireModal';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    // Read from the DOM class that was already applied by the inline script in index.html.
    // This keeps React state in sync with the real DOM on first render (critical on mobile).
    return document.documentElement.classList.contains('dark');
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Project', path: '/project' },
    { name: 'Blog', path: '/blog' },
    { name: 'Resume', path: '/resume' }
  ];

  const toggleTheme = (e) => {
    const isDarkTheme = !isDark;
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Fallback for browsers without View Transition API
    if (!document.startViewTransition) {
      const root = document.documentElement;
      root.classList.add('is-transitioning');
      setIsDark(isDarkTheme);
      setTimeout(() => root.classList.remove('is-transitioning'), 420);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => setIsDark(isDarkTheme));
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {});
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full mb-8 transition-all duration-300 ${isScrolled
        ? 'backdrop-blur-sm'
        : 'backdrop-blur-md'
        }`}
      style={{
        backgroundColor: isScrolled
          ? (isDark ? 'rgba(15, 15, 18, 0.12)' : 'rgba(232, 232, 236, 0.12)')
          : (isDark ? 'rgba(15, 15, 18, 0.72)' : 'rgba(232, 232, 236, 0.75)')
      }}
    >
      <div className="flex justify-between items-center py-3.5 px-4 md:px-6 max-w-[600px] mx-auto w-full">
        <div className="flex gap-3 sm:gap-5 text-[12px] sm:text-[14px] font-medium items-center overflow-x-auto hide-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`transition-all whitespace-nowrap ${location.pathname === link.path
                ? 'text-[var(--text-main)] font-bold'
                : 'text-muted hover:text-[var(--text-main)]'
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsHireModalOpen(true)}
            className="neo-button text-[11px] py-1 px-3 !rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 flex items-center gap-1.5 font-bold tracking-wide shrink-0"
          >
            Hire me
          </button>

          <button
            onClick={toggleTheme}
            className="neo-button-subtle !rounded-full w-[38px] h-[38px] p-0 flex items-center justify-center text-muted hover:text-[var(--text-main)] transition-colors"
            title="Toggle Theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
            )}
          </button>
        </div>
      </div>
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
