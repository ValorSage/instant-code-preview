
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// توفير إمكانية تبديل اتجاه الواجهة بين RTL و LTR
// قم بتخزين التفضيل في localStorage
const savedDirection = localStorage.getItem('akojs-direction') || 'rtl';
const savedLang = localStorage.getItem('akojs-lang') || 'ar';

document.documentElement.dir = savedDirection;
document.documentElement.lang = savedLang;

// إضافة meta viewport لتحسين التجربة على الأجهزة المحمولة
const metaViewport = document.createElement('meta');
metaViewport.name = 'viewport';
metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
document.head.appendChild(metaViewport);

// إضافة apple-mobile-web-app-capable لتمكين وضع التطبيق الكامل على iOS
const metaAppleWebApp = document.createElement('meta');
metaAppleWebApp.name = 'apple-mobile-web-app-capable';
metaAppleWebApp.content = 'yes';
document.head.appendChild(metaAppleWebApp);

// إضافة الأيقونة للأجهزة المحمولة
const linkAppleIcon = document.createElement('link');
linkAppleIcon.rel = 'apple-touch-icon';
linkAppleIcon.href = '/favicon.ico';
document.head.appendChild(linkAppleIcon);

createRoot(document.getElementById("root")!).render(<App />);
