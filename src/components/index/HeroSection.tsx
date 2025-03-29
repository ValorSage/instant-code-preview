
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const HeroSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // تأثير الشبكة المتحركة
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };
    
    const colors = ['#9b87f5', '#7E69AB', '#c48cfa', '#8B5CF6', '#a78bfa'];
    
    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth * window.innerHeight / 12000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // رسم الخلفية المتدرجة
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(13, 12, 15, 0.8)');
      gradient.addColorStop(1, 'rgba(20, 16, 30, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        
        // تحديث موقع الجسيمات
        p.x += p.speedX;
        p.y += p.speedY;
        
        // إعادة توجيه الجسيمات عند وصولها للحواف
        if (p.x > canvas.width || p.x < 0) p.speedX = -p.speedX;
        if (p.y > canvas.height || p.y < 0) p.speedY = -p.speedY;
      }
      
      // رسم الخطوط بين الجسيمات القريبة
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = 0.2 * (1 - distance / 100);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    window.addEventListener('resize', resize);
    resize();
    drawParticles();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="relative w-full max-w-3xl mx-auto space-y-8 z-10">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
        style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}
      />
      
      <div className="space-y-6 animate-fade-in relative z-10 py-10">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-violet-500 drop-shadow-xl">
          منصة كودر التفاعلية
        </h1>
        <p className="text-xl text-white/90 drop-shadow-md">
          بيئة تطوير متكاملة للمبرمجين. أنشئ، طور، وشارك مشاريعك بسهولة.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-500/20 hover-lift transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-purple-500/20">
            <div className="mb-4 text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12"><path d="M8 17.7A6 6 0 0 0 2 12c0-3.3 2.7-6 6-6h8c2.2 0 4 1.8 4 4s-1.8 4-4 4H6c-1.1 0-2-.9-2-2s.9-2 2-2h6"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">تعاون في الوقت الحقيقي</h3>
            <p className="text-white/70 mt-2">العمل مع فريقك على نفس المشروع بشكل متزامن</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-500/20 hover-lift transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-purple-500/20">
            <div className="mb-4 text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">بيئات متعددة</h3>
            <p className="text-white/70 mt-2">دعم لمختلف لغات البرمجة وبيئات التشغيل</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-500/20 hover-lift transition-all duration-300 transform hover:translate-y-[-5px] hover:shadow-purple-500/20">
            <div className="mb-4 text-purple-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-white">نشر سهل</h3>
            <p className="text-white/70 mt-2">نشر واستضافة مشاريعك بضغطة زر واحدة</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white shadow-lg shadow-purple-500/20 border-0 font-bold"
            asChild
          >
            <Link to="/auth">ابدأ الآن</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-purple-400/30 text-white hover:bg-purple-500/10">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
