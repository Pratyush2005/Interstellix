import React, { useEffect, useRef } from 'react';

interface StarFieldProps {
  // mousePosition: { x: number; y: number }; // Removed
}

const StarField: React.FC<StarFieldProps> = () => { // Removed mousePosition prop
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars: { 
      x: number; 
      y: number; 
      size: number; 
      opacity: number; 
      speed: number;
      twinkleSpeed: number;
      glowIntensity: number;
    }[] = [];
    
    const shootingStars: {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
    }[] = [];
    
    // Create more stars for a richer effect
    for (let i = 0; i < 400; i++) { // Restored to 400 stars
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        glowIntensity: Math.random() * 0.5 + 0.5
      });
    }

    // Create shooting stars periodically
    const createShootingStar = () => {
      if (Math.random() < 0.01) { // Restored chance from 0.5% to 1% per frame
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5, // Upper half of screen
          length: Math.random() * 100 + 50,
          speed: Math.random() * 8 + 5,
          angle: Math.random() * Math.PI / 4 + Math.PI / 8, // 22.5 to 67.5 degrees
          opacity: 1,
          life: 1
        });
      }
    };

    const animate = () => {
      // Clear with slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and animate regular stars
      stars.forEach(star => {
        // Twinkling effect
        star.opacity += (Math.random() - 0.5) * star.twinkleSpeed;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        
        // Glow effect
        const glowSize = star.size * star.glowIntensity * 3;
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(0.3, `rgba(173, 216, 230, ${star.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(173, 216, 230, 0)');
        
        ctx.globalAlpha = star.opacity;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Bright center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Create new shooting stars
      createShootingStar();

      // Draw and animate shooting stars
      shootingStars.forEach((shootingStar, index) => {
        if (shootingStar.life <= 0) {
          shootingStars.splice(index, 1);
          return;
        }

        const dx = Math.cos(shootingStar.angle) * shootingStar.speed;
        const dy = Math.sin(shootingStar.angle) * shootingStar.speed;

        // Draw shooting star trail
        const gradient = ctx.createLinearGradient(
          shootingStar.x, shootingStar.y,
          shootingStar.x - dx * shootingStar.length / shootingStar.speed,
          shootingStar.y - dy * shootingStar.length / shootingStar.speed
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        gradient.addColorStop(0.5, `rgba(135, 206, 235, ${shootingStar.opacity * 0.7})`);
        gradient.addColorStop(1, 'rgba(135, 206, 235, 0)');

        ctx.globalAlpha = shootingStar.opacity;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - dx * shootingStar.length / shootingStar.speed,
          shootingStar.y - dy * shootingStar.length / shootingStar.speed
        );
        ctx.stroke();

        // Update position
        shootingStar.x += dx;
        shootingStar.y += dy;

        // Fade out
        shootingStar.life -= 0.01;
        shootingStar.opacity = shootingStar.life;

        // Remove if off screen
        if (shootingStar.x > canvas.width || shootingStar.y > canvas.height) {
          shootingStars.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0"
    >
      {/* Animated stars overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
      {/* Additional dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Floating cosmic particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarField;