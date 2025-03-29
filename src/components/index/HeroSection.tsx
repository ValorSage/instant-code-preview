
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
        منصة كودر التفاعلية
      </h1>
      <p className="text-xl text-muted-foreground">
        بيئة تطوير متكاملة للمبرمجين. أنشئ، طور، وشارك مشاريعك بسهولة.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="bg-card rounded-lg p-6 shadow-sm border hover-lift">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10"><path d="M8 17.7A6 6 0 0 0 2 12c0-3.3 2.7-6 6-6h8c2.2 0 4 1.8 4 4s-1.8 4-4 4H6c-1.1 0-2-.9-2-2s.9-2 2-2h6"/></svg>
          </div>
          <h3 className="text-lg font-semibold">تعاون في الوقت الحقيقي</h3>
          <p className="text-muted-foreground mt-2">العمل مع فريقك على نفس المشروع بشكل متزامن</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border hover-lift">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
          </div>
          <h3 className="text-lg font-semibold">بيئات متعددة</h3>
          <p className="text-muted-foreground mt-2">دعم لمختلف لغات البرمجة وبيئات التشغيل</p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm border hover-lift">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
          </div>
          <h3 className="text-lg font-semibold">نشر سهل</h3>
          <p className="text-muted-foreground mt-2">نشر واستضافة مشاريعك بضغطة زر واحدة</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white animate-pulse">
          <Link to="/auth">ابدأ الآن</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-5 w-5" />
            GitHub
          </a>
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
