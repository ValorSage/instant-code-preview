
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import HeroSection from '@/components/index/HeroSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden relative">
      {/* خلفية متحركة أنيقة */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(82,63,165,0.2)_0,rgba(15,12,25,0.8)_100%)]"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>
      
      <header className="w-full py-4 px-6 flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">كودر</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6 ml-auto">
          <Link to="/" className="text-white/70 hover:text-white transition-colors">الرئيسية</Link>
          <Link to="/projects" className="text-white/70 hover:text-white transition-colors">المشاريع</Link>
          <Link to="/tools" className="text-white/70 hover:text-white transition-colors">أدوات التطوير</Link>
        </nav>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white"
            asChild
          >
            <Link to="/auth" state={{ activeTab: 'signin' }}>تسجيل الدخول</Link>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg text-white"
            asChild
          >
            <Link to="/auth" state={{ activeTab: 'signup' }}>إنشاء حساب</Link>
          </Button>
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
