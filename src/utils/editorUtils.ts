
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
 * Run Python code using Pyodide WebAssembly
 */
export const runPythonCode = async (code: string, iframe: HTMLIFrameElement | null): Promise<void> => {
  if (!iframe) return;
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;
  
  const pyodideUrl = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Python Execution</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    #output { 
      background: #f5f5f5; 
      padding: 10px; 
      border-radius: 4px; 
      margin-top: 10px; 
      white-space: pre-wrap;
      max-height: 400px;
      overflow-y: auto;
    }
    .error { color: red; }
    .loading { 
      text-align: center; 
      padding: 20px;
      font-style: italic;
      color: #555;
    }
  </style>
</head>
<body>
  <h2>Python Execution</h2>
  <div id="loading" class="loading">Loading Python environment (Pyodide)...</div>
  <div id="output" style="display: none;"></div>

  <script src="${pyodideUrl}"></script>
  <script>
    // Redirect console output to the page
    const output = document.getElementById('output');
    const loading = document.getElementById('loading');
    
    // Custom console for capturing output
    const customConsole = {
      log: function(...args) {
        console.log(...args);
        appendToOutput(args.map(arg => String(arg)).join(' '));
      },
      error: function(...args) {
        console.error(...args);
        appendToOutput(args.map(arg => String(arg)).join(' '), true);
      }
    };
    
    function appendToOutput(text, isError = false) {
      const line = document.createElement('div');
      line.textContent = text;
      if (isError) {
        line.className = 'error';
      }
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }
    
    // Run Python code with Pyodide
    async function runPython() {
      try {
        loading.style.display = 'block';
        output.style.display = 'none';
        
        // Initialize Pyodide
        const pyodide = await loadPyodide();
        
        // Setup stdout/stderr redirection
        pyodide.setStdout({ write: text => customConsole.log(text) });
        pyodide.setStderr({ write: text => customConsole.error(text) });
        
        // Execute the code
        loading.style.display = 'none';
        output.style.display = 'block';
        
        const pythonCode = \`${code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\\$/g, '\\\\$')}\`;
        
        await pyodide.runPythonAsync(pythonCode);
      } catch (error) {
        loading.style.display = 'none';
        output.style.display = 'block';
        customConsole.error('Error:', error.message);
      }
    }
    
    // Run Python when the page loads
    runPython();
  </script>
</body>
</html>
  `.trim();
  
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();
};

/**
 * Run specific language code or use WebAssembly
 */
export const runCodeForLanguage = (code: string, language: string, iframe: HTMLIFrameElement | null): void => {
  if (!iframe) return;
  
  // Based on language, choose appropriate execution strategy
  switch (language.toLowerCase()) {
    case 'html':
    case 'css':
    case 'javascript':
    case 'js':
      // For web technologies, embed in an HTML document
      runCode(language === 'html' ? code : '', language === 'css' ? code : '', 
              (language === 'javascript' || language === 'js') ? code : '', iframe);
      break;
      
    case 'python':
    case 'py':
      // Run Python via Pyodide WebAssembly
      runPythonCode(code, iframe);
      break;
      
    case 'typescript':
    case 'ts':
      // For TypeScript, use TypeScript compiler in browser
      runTypeScriptCode(code, iframe);
      break;
      
    default:
      // For other languages, show message that it's not directly executable
      showLanguageNotSupportedMessage(code, language, iframe);
      break;
  }
};

/**
 * Run TypeScript code by transpiling to JavaScript
 */
export const runTypeScriptCode = (code: string, iframe: HTMLIFrameElement | null): void => {
  if (!iframe) return;
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript Execution</title>
  <style>
    body { font-family: sans-serif; padding: 20px; }
    #output { 
      background: #f5f5f5; 
      padding: 10px; 
      border-radius: 4px; 
      margin-top: 10px; 
      white-space: pre-wrap;
      max-height: 400px;
      overflow-y: auto;
    }
    .error { color: red; }
    .info { color: blue; }
  </style>
</head>
<body>
  <h2>TypeScript Execution</h2>
  <div id="output"></div>

  <script src="https://cdn.jsdelivr.net/npm/typescript@5.0.4/lib/typescript.min.js"></script>
  <script>
    // Redirect console output to the page
    const output = document.getElementById('output');
    
    // Custom console for capturing output
    const originalConsole = { ...console };
    console.log = function(...args) {
      originalConsole.log(...args);
      appendToOutput(args.map(arg => String(arg)).join(' '));
    };
    console.error = function(...args) {
      originalConsole.error(...args);
      appendToOutput(args.map(arg => String(arg)).join(' '), true);
    };
    console.info = function(...args) {
      originalConsole.info(...args);
      appendToOutput(args.map(arg => String(arg)).join(' '), 'info');
    };
    
    function appendToOutput(text, type = '') {
      const line = document.createElement('div');
      line.textContent = text;
      if (type === true || type === 'error') {
        line.className = 'error';
      } else if (type === 'info') {
        line.className = 'info';
      }
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    }
    
    // Transpile and run TypeScript
    function runTypeScript() {
      try {
        // Original TypeScript code
        const tsCode = \`${code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\\$/g, '\\\\$')}\`;
        
        appendToOutput('Transpiling TypeScript...', 'info');
        
        // Transpile to JavaScript
        const result = ts.transpileModule(tsCode, {
          compilerOptions: {
            target: ts.ScriptTarget.ES2015,
            module: ts.ModuleKind.None
          }
        });
        
        const jsCode = result.outputText;
        appendToOutput('TypeScript transpiled successfully.', 'info');
        appendToOutput('Running JavaScript...', 'info');
        
        // Execute the transpiled JavaScript
        new Function(jsCode)();
        
        appendToOutput('Execution complete.', 'info');
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
    
    // Run when the page loads
    runTypeScript();
  </script>
</body>
</html>
  `.trim();
  
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();
};

/**
 * Show message for languages that aren't directly executable yet
 */
export const showLanguageNotSupportedMessage = (code: string, language: string, iframe: HTMLIFrameElement | null): void => {
  if (!iframe) return;
  
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;
  
  const languageSupportInfo: Record<string, { status: string, message: string }> = {
    'cpp': { 
      status: 'Planned', 
      message: 'Planned for implementation using WebAssembly and Emscripten.'
    },
    'c++': { 
      status: 'Planned', 
      message: 'Planned for implementation using WebAssembly and Emscripten.'
    },
    'csharp': { 
      status: 'Planned', 
      message: 'Planned for implementation using Blazor WebAssembly.' 
    },
    'c#': { 
      status: 'Planned', 
      message: 'Planned for implementation using Blazor WebAssembly.' 
    },
    'go': { 
      status: 'Planned', 
      message: 'Planned for implementation using GopherJS or TinyGo WebAssembly.' 
    },
    'rust': { 
      status: 'Planned', 
      message: 'Planned for implementation using WebAssembly and wasm-bindgen.' 
    },
    'java': { 
      status: 'Under Consideration', 
      message: 'May be implemented using Cheerpj or similar technology.' 
    },
    'php': { 
      status: 'Under Consideration', 
      message: 'May be implemented using PHP.js or similar technology.' 
    },
    'ruby': { 
      status: 'Under Consideration', 
      message: 'May be implemented using Ruby.wasm or similar technology.' 
    },
    'swift': { 
      status: 'Under Consideration', 
      message: 'Limited browser execution options currently available.' 
    },
    'kotlin': { 
      status: 'Planned', 
      message: 'Planned for implementation using Kotlin/JS transpiler.' 
    },
    'lua': { 
      status: 'Planned', 
      message: 'Planned for implementation using Fengari or similar Lua VM for JavaScript.' 
    },
    'sql': { 
      status: 'Planned', 
      message: 'Planned for implementation using SQL.js (SQLite compiled to WebAssembly).' 
    }
  };
  
  const info = languageSupportInfo[language.toLowerCase()] || {
    status: 'Not Supported',
    message: 'Currently no direct browser execution is available for this language.'
  };
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${language} Code</title>
  <style>
    body { 
      font-family: sans-serif; 
      padding: 20px; 
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .language-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    .language-icon {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      background-color: #f0f0f0;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .status {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 14px;
      margin-left: 10px;
    }
    .status-planned {
      background-color: #e5f7ed;
      color: #0e8a44;
    }
    .status-consideration {
      background-color: #fff8e6;
      color: #b75d00;
    }
    .status-not-supported {
      background-color: #ffeaea;
      color: #d93848;
    }
    .message {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #ddd;
      margin-bottom: 20px;
    }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 14px;
      line-height: 1.5;
    }
    code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="language-header">
      <div class="language-icon">${language.substring(0, 2).toUpperCase()}</div>
      <h2>${language.charAt(0).toUpperCase() + language.slice(1)} Code</h2>
      <div class="status status-${info.status === 'Planned' ? 'planned' : (info.status === 'Under Consideration' ? 'consideration' : 'not-supported')}">
        ${info.status}
      </div>
    </div>
    
    <div class="message">
      <p>${info.message}</p>
      <p>We're continuously improving language support in Ako.js.</p>
    </div>
    
    <h3>Your Code:</h3>
    <pre><code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
  </div>
</body>
</html>
  `.trim();
  
  iframeDoc.open();
  iframeDoc.write(htmlContent);
  iframeDoc.close();
};

/**
 * Run code with WebAssembly support (for languages like Rust, C++, etc.)
 */
export const runCodeWithWasm = (code: string, language: string, iframe: HTMLIFrameElement | null): void => {
  // Delegate to the appropriate language handler
  runCodeForLanguage(code, language, iframe);
};

/**
 * Save code to localStorage
 */
export const saveToLocalStorage = (html: string, css: string, js: string, script: string = ''): void => {
  try {
    localStorage.setItem('weaveCode', JSON.stringify({ 
      html, 
      css, 
      js, 
      script, 
      timestamp: Date.now() 
    }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Load code from localStorage
 */
export const loadFromLocalStorage = (): { html: string; css: string; js: string; script?: string } | null => {
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
