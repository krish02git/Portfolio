import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300 text-[var(--text-main)]"
          title="Go to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
