import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const fontSize = 13;
    const chars = '01アイウエオカキクケコサシスセソ∂∆∫≈≠⊕₿ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&';
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const x = i * fontSize;
        // Head — white flash
        ctx.fillStyle = '#ccffcc';
        ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y * fontSize);

        // Body — green
        ctx.fillStyle = '#00ff41';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, (y - 1) * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.974) drops[i] = 0;
        drops[i]++;
      });
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1);
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: 0, opacity: 0.16, pointerEvents: 'none',
      }}
    />
  );
};

export default MatrixRain;
