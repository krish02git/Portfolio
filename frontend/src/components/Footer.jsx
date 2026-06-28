import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full mt-auto" style={{ backgroundColor: 'var(--footer-bg)' }}>
      <div className="max-w-[600px] mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">

          <div className="flex flex-col items-start gap-1">
            <h3 className="font-bold text-[15px] tracking-wide mb-2">Contact</h3>
            <a href="tel:+919611785530" className="text-muted text-[14px] hover:text-[var(--text-main)] transition-all duration-300 py-0.5">
              +91 9611785530
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=k0102rish@gmail.com" target="_blank" rel="noopener noreferrer" className="text-muted text-[14px] hover:text-[var(--text-main)] transition-all duration-300 py-0.5">
              k0102rish@gmail.com
            </a>
          </div>

          <div className="flex flex-col items-start gap-1">
            <h3 className="font-bold text-[15px] tracking-wide mb-2">Navigate</h3>
            <div className="grid grid-cols-3 gap-x-6 gap-y-1.5 text-muted text-[13px]">
              <Link to="/" className="hover:text-[var(--text-main)] transition-all py-0.5">Home</Link>
              <Link to="/work" className="hover:text-[var(--text-main)] transition-all py-0.5">Work</Link>
              <Link to="/project" className="hover:text-[var(--text-main)] transition-all py-0.5">Projects</Link>
              <Link to="/blog" className="hover:text-[var(--text-main)] transition-all py-0.5">Blog</Link>
              <Link to="/resume" className="hover:text-[var(--text-main)] transition-all py-0.5">Resume</Link>
            </div>
          </div>

        </div>

        <p className="text-[12px] text-muted/60 mt-8 font-medium">
          &copy; 2026 Krish Kumar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
