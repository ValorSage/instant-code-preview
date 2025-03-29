
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ButtonImproved } from '@/components/ui/button-improved';
import HeroSection from '@/components/index/HeroSection';

const LandingPage: React.FC = () => {
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  
  // إنشاء الجسيمات المتحركة عند تحميل الصفحة
  useEffect(() => {
    if (!particlesContainerRef.current) return;
    
    const container = particlesContainerRef.current;
    const particlesCount = 20;
    
    // إزالة الجسيمات السابقة إن وجدت
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // إنشاء جسيمات جديدة
    for (let i = 0; i < particlesCount; i++) {
      const particle = document.createElement('div');
      
      // حجم عشوائي
      const size = Math.random() * 10 + 2;
      
      // موقع عشوائي
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // تأخير عشوائي
      const delay = Math.random() * 5;
      
      // مدة عشوائية
      const duration = 3 + Math.random() * 7;
      
      // تكوين الجسيم
      particle.className = 'particle';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${left}%`;
      particle.style.top = `${top}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      // إضافة تدرج لون
      const hue = Math.floor(Math.random() * 60) + 230; // أزرق وأرجواني
      particle.style.background = `hsla(${hue}, 80%, 70%, 0.5)`;
      
      container.appendChild(particle);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden relative">
      {/* خلفية متحركة أنيقة */}
      <div className="animated-background">
        <div className="grid"></div>
        <div ref={particlesContainerRef} className="particles"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,63,165,0.2)_0,rgba(15,12,25,0.8)_100%)]"></div>
      </div>
      
      <header className="w-full py-4 px-6 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">كودر</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6 rtl:space-x-reverse ml-auto">
          <Link to="/" className="text-white/70 hover:text-white transition-colors">الرئيسية</Link>
          <Link to="/projects" className="text-white/70 hover:text-white transition-colors">المشاريع</Link>
          <Link to="/tools" className="text-white/70 hover:text-white transition-colors">أدوات التطوير</Link>
        </nav>
        
        <div className="flex space-x-2 rtl:space-x-reverse">
          <ButtonImproved 
            variant="ghost" 
            size="sm" 
            className="text-white"
            asChild
            hasAnimation
          >
            <Link to="/auth" state={{ activeTab: 'signin' }}>تسجيل الدخول</Link>
          </ButtonImproved>
          
          <ButtonImproved 
            variant="neon" 
            size="sm" 
            className="shadow-lg text-white"
            asChild
            hasAnimation
          >
            <Link to="/auth" state={{ activeTab: 'signup' }}>إنشاء حساب</Link>
          </ButtonImproved>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <HeroSection />
      </main>
      
      <footer className="py-6 text-center text-white/50 z-10 relative">
        <div className="container mx-auto text-center text-sm">
          <p>منصة كودر التفاعلية © {new Date().getFullYear()} - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
