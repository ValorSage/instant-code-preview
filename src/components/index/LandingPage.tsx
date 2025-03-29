
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/index/HeroSection';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
      <Header 
        html="" 
        css=""
        js=""
        script=""
        isDarkMode={false}
        toggleDarkMode={() => {}}
        onSave={() => {}}
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <HeroSection />
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>منصة كودر التفاعلية © {new Date().getFullYear()} - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
