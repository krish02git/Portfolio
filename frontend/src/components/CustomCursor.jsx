import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLensHover, setIsLensHover] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const updateHoverState = (e) => {
      const target = e.target;
      
      const lensTarget = target.closest('.lens-target');
      
      const textTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'LI', 'LABEL', 'TD', 'TH', 'CAPTION'];
      const isTextNode = textTags.includes(target.tagName.toUpperCase());
      const isSvgOrImg = ['SVG', 'PATH', 'IMG', 'CIRCLE', 'RECT', 'LINE', 'POLYLINE', 'POLYGON'].includes(target.tagName.toUpperCase());
      
      if (lensTarget) {
        setIsLensHover(true);
      } else if (isTextNode && !isSvgOrImg) {
        setIsLensHover(true);
      } else {
        setIsLensHover(false);
      }

      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Don't show on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice || !isVisible) return null;

  return (
    <div 
      className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-all duration-150 ease-out ${
        isLensHover ? 'mix-blend-difference bg-white' : 'bg-[var(--text-main)]'
      }`}
      style={{ 
        width: '12px',
        height: '12px',
        transform: `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0) scale(${isHovering && !isLensHover ? 1.5 : 1})`,
        boxShadow: isLensHover ? 'none' : '0 0 12px 2px var(--text-main)',
        opacity: (isHovering && !isLensHover) ? 0.7 : 1
      }}
    />
  );
};

export default CustomCursor;
