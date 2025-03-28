
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// توفير إمكانية تبديل اتجاه الواجهة بين RTL و LTR
// قم بتخزين التفضيل في localStorage
const savedDirection = localStorage.getItem('akojs-direction') || 'rtl';
const savedLang = localStorage.getItem('akojs-lang') || 'ar';

document.documentElement.dir = savedDirection;
document.documentElement.lang = savedLang;

createRoot(document.getElementById("root")!).render(<App />);
