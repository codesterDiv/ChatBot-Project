import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      size: number;
    }> = [];

    const connections: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      alpha: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          alpha: Math.random() * 0.6 + 0.2,
          size: Math.random() * 3 + 1,
        });
      }
    };

    const createConnections = () => {
      connections.length = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            connections.push({
              x1: particles[i].x,
              y1: particles[i].y,
              x2: particles[j].x,
              y2: particles[j].y,
              alpha: (120 - distance) / 120 * 0.3,
            });
          }
        }
      }
    };

    const animate = () => {
      // Clear canvas with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(0.3, '#1a1a2e');
      gradient.addColorStop(0.7, '#16213e');
      gradient.addColorStop(1, '#0f0f23');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle overlay pattern
      ctx.fillStyle = 'rgba(0, 191, 255, 0.02)';
      for (let x = 0; x < canvas.width; x += 100) {
        for (let y = 0; y < canvas.height; y += 100) {
          ctx.fillRect(x, y, 1, 1);
        }
      }

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 191, 255, 0.08)';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle with glow effect
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#39FF14';
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 20, ${particle.alpha})`;
        ctx.fill();
        
        // Add inner glow
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00BFFF';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 191, 255, ${particle.alpha * 0.8})`;
        ctx.fill();
        
        ctx.restore();
      });

      // Create and draw connections
      createConnections();
      connections.forEach((connection) => {
        ctx.beginPath();
        ctx.moveTo(connection.x1, connection.y1);
        ctx.lineTo(connection.x2, connection.y2);
        ctx.strokeStyle = `rgba(0, 191, 255, ${connection.alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Add floating geometric shapes
      const time = Date.now() * 0.001;
      for (let i = 0; i < 5; i++) {
        const x = canvas.width * 0.1 + (Math.sin(time + i) * canvas.width * 0.8);
        const y = canvas.height * 0.1 + (Math.cos(time * 0.7 + i) * canvas.height * 0.8);
        const size = 20 + Math.sin(time + i) * 10;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time + i);
        ctx.strokeStyle = `rgba(57, 255, 20, ${0.1 + Math.sin(time + i) * 0.1})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(-size/2, -size/2, size, size);
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      particles.length = 0;
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  );
};

export default Background;