import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark'; // Defaults to false (light theme) if not set
  });

  const [isScrolled, setIsScrolled] = useState(false);

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
    
    if (!document.startViewTransition) {
      setIsDark(isDarkTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setIsDark(isDarkTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
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
            onClick={toggleTheme}
            className="p-2.5 rounded-full neo-button-sm text-muted hover:text-[var(--text-main)] transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
