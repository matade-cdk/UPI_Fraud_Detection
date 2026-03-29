import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∂∆∫≈≠⊕⊗⊙⊚∅∞§¶₿ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const charIndex = Math.floor(Math.random() * chars.length);
        const char = chars[charIndex];
        const x = i * fontSize;

        // Lead character (bright)
        ctx.fillStyle = '#ffffff';
        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        ctx.fillText(char, x, y * fontSize);

        // Body characters (green)
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, (y - 1) * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 35);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.18,
        pointerEvents: 'none',
      }}
    />
  );
};

export default MatrixRain;
