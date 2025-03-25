
// Utility functions for our code editor

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Create an HTML file from the code inputs
 */
export const createHtmlFile = (html: string, css: string, js: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
</head>
<body>
${html}
<script>${js}</script>
</body>
</html>
  `.trim();
};

/**
 * Run the code and update the preview
 */
export const runCode = (html: string, css: string, js: string, iframe: HTMLIFrameElement | null): void => {
  if (!iframe) return;
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;
  
  const htmlContent = createHtmlFile(html, css, js);
  
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();
};

/**
 * Save code to localStorage
 */
export const saveToLocalStorage = (html: string, css: string, js: string): void => {
  try {
    localStorage.setItem('weaveCode', JSON.stringify({ html, css, js, timestamp: Date.now() }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Load code from localStorage
 */
export const loadFromLocalStorage = (): { html: string; css: string; js: string } | null => {
  try {
    const saved = localStorage.getItem('weaveCode');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  
  return null;
};

/**
 * Default code templates
 */
export const defaultHtml = `<div class="container">
  <h1>Welcome to Ako.js</h1>
  <p>Start editing to see your changes come to life!</p>
  <button id="changeColor">Change Color</button>
</div>`;

export const defaultCss = `body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: #333;
}

h1 {
  color: #007ACC;
  font-weight: 700;
}

.container {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #007ACC;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0066a8;
}`;

export const defaultJs = `document.getElementById('changeColor').addEventListener('click', function() {
  const colors = ['#007ACC', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.querySelector('h1').style.color = randomColor;
});`;
