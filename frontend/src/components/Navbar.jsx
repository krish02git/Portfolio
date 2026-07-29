import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HireModal from './HireModal';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

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

  return (
    <nav
      className={`sticky top-0 z-50 w-full mb-8 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-sm' : 'backdrop-blur-md'
      }`}
      style={{
        backgroundColor: isScrolled
          ? 'color-mix(in srgb, var(--nav-bg) 16%, transparent)'
          : 'var(--nav-bg)',
      }}
    >
      <div className="flex justify-between items-center py-3.5 px-4 md:px-6 max-w-[600px] mx-auto w-full">
        <div className="flex gap-3 sm:gap-5 text-[12px] sm:text-[14px] font-medium items-center overflow-x-auto hide-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`transition-all whitespace-nowrap ${
                location.pathname === link.path
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
        </div>
      </div>
      <HireModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
