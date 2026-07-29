import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/><path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/><path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // origin: 'top' => x=50vw, y=0  |  'bottom' => x=50vw, y=100vh
  const triggerToggle = (origin) => {
    const isDarkTheme = !isDark;

    const x = window.innerWidth / 2;
    const y = origin === 'top' ? 0 : window.innerHeight;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    if (!document.startViewTransition) {
      setIsDark(isDarkTheme);
      return;
    }

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => setIsDark(isDarkTheme));
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 600,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {});
    } catch {
      setIsDark(isDarkTheme);
    }
  };

  const pillClass = `
    fixed z-[9998] left-1/2 -translate-x-1/2
    flex items-center gap-1.5
    px-3 py-1.5 rounded-full
    text-[11px] font-semibold tracking-wide
    select-none
    transition-all duration-300
    backdrop-blur-md
    border border-[var(--neo-border)]
    shadow-[0_2px_12px_rgba(0,0,0,0.12)]
    text-[var(--text-muted)] hover:text-[var(--text-main)]
    bg-[var(--nav-bg)]
    hover:scale-105 active:scale-95
  `;

  return (
    <>
      {/* ── Top-center pill ── */}
      <button
        onClick={() => triggerToggle('top')}
        className={`${pillClass} top-1`}
        title="Toggle theme from top"
        style={{ pointerEvents: 'auto' }}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
        <span>{isDark ? 'Light' : 'Dark'}</span>
        {/* tiny caret pointing down */}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ opacity: 0.5 }}>
          <path d="M0 2l4 4 4-4z"/>
        </svg>
      </button>

      {/* ── Bottom-center pill ── */}
      <button
        onClick={() => triggerToggle('bottom')}
        className={`${pillClass} bottom-1`}
        title="Toggle theme from bottom"
        style={{ pointerEvents: 'auto' }}
      >
        {/* tiny caret pointing up */}
        <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ opacity: 0.5 }}>
          <path d="M0 6l4-4 4 4z"/>
        </svg>
        <span>{isDark ? 'Light' : 'Dark'}</span>
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </>
  );
};

export default ThemeToggle;
