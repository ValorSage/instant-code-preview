
import React, { useRef, useEffect } from 'react';
import { debounce } from '@/utils/editorUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  autoRun?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  autoRun = false
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Handle auto-resizing of the textarea
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
  }, [value]);

  // Use debounced changes if autoRun is enabled
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (autoRun) {
      debouncedOnChange(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  const debouncedOnChange = debounce((newValue: string) => {
    onChange(newValue);
  }, 1000);

  // Get language-specific syntax highlighting class
  const getLanguageClass = () => {
    switch (language.toLowerCase()) {
      case 'html':
        return 'language-html';
      case 'css':
        return 'language-css';
      case 'js':
      case 'javascript':
        return 'language-javascript';
      case 'ts':
      case 'typescript':
        return 'language-typescript';
      case 'python':
        return 'language-python';
      case 'java':
        return 'language-java';
      case 'cpp':
      case 'c++':
        return 'language-cpp';
      case 'csharp':
      case 'c#':
        return 'language-csharp';
      case 'go':
        return 'language-go';
      case 'rust':
        return 'language-rust';
      case 'php':
        return 'language-php';
      case 'ruby':
        return 'language-ruby';
      case 'swift':
        return 'language-swift';
      case 'kotlin':
        return 'language-kotlin';
      case 'lua':
        return 'language-lua';
      case 'sql':
        return 'language-sql';
      default:
        return 'language-plaintext';
    }
  };

  // Determine editor styling based on language
  const getEditorClassName = () => {
    const baseClasses = "w-full h-full min-h-[150px] md:min-h-[300px] resize-none p-2 md:p-4 font-mono text-sm leading-relaxed " +
      "outline-none bg-editor-background text-editor-foreground rounded-md";
    
    switch (language.toLowerCase()) {
      case 'html':
        return `${baseClasses} border-t-2 border-t-blue-500 ${getLanguageClass()}`;
      case 'css':
        return `${baseClasses} border-t-2 border-t-purple-500 ${getLanguageClass()}`;
      case 'js':
      case 'javascript':
        return `${baseClasses} border-t-2 border-t-yellow-500 ${getLanguageClass()}`;
      case 'ts':
      case 'typescript':
        return `${baseClasses} border-t-2 border-t-blue-600 ${getLanguageClass()}`;
      case 'python':
        return `${baseClasses} border-t-2 border-t-green-500 ${getLanguageClass()}`;
      case 'java':
        return `${baseClasses} border-t-2 border-t-red-500 ${getLanguageClass()}`;
      case 'cpp':
      case 'c++':
        return `${baseClasses} border-t-2 border-t-purple-500 ${getLanguageClass()}`;
      case 'csharp':
      case 'c#':
        return `${baseClasses} border-t-2 border-t-green-600 ${getLanguageClass()}`;
      case 'go':
        return `${baseClasses} border-t-2 border-t-cyan-500 ${getLanguageClass()}`;
      case 'rust':
        return `${baseClasses} border-t-2 border-t-orange-600 ${getLanguageClass()}`;
      case 'php':
        return `${baseClasses} border-t-2 border-t-indigo-500 ${getLanguageClass()}`;
      case 'ruby':
        return `${baseClasses} border-t-2 border-t-red-600 ${getLanguageClass()}`;
      case 'swift':
        return `${baseClasses} border-t-2 border-t-orange-500 ${getLanguageClass()}`;
      case 'kotlin':
        return `${baseClasses} border-t-2 border-t-purple-600 ${getLanguageClass()}`;
      case 'lua':
        return `${baseClasses} border-t-2 border-t-blue-400 ${getLanguageClass()}`;
      case 'sql':
        return `${baseClasses} border-t-2 border-t-gray-500 ${getLanguageClass()}`;
      case 'script':
        return `${baseClasses} border-t-2 border-t-green-500`;
      default:
        return `${baseClasses} ${getLanguageClass()}`;
    }
  };

  // Get placeholder text based on language
  const getPlaceholder = () => {
    const langName = language.toLowerCase();
    if (langName === 'js') return 'Enter your JavaScript code here...';
    if (langName === 'ts') return 'Enter your TypeScript code here...';
    
    // For languages with their full name
    if (langName === 'javascript') return 'Enter your JavaScript code here...';
    if (langName === 'typescript') return 'Enter your TypeScript code here...';
    if (langName === 'html') return 'Enter your HTML code here...';
    if (langName === 'css') return 'Enter your CSS code here...';
    if (langName === 'python') return 'Enter your Python code here...';
    if (langName === 'java') return 'Enter your Java code here...';
    if (langName === 'cpp' || langName === 'c++') return 'Enter your C++ code here...';
    if (langName === 'csharp' || langName === 'c#') return 'Enter your C# code here...';
    if (langName === 'go') return 'Enter your Go code here...';
    if (langName === 'rust') return 'Enter your Rust code here...';
    if (langName === 'php') return 'Enter your PHP code here...';
    if (langName === 'ruby') return 'Enter your Ruby code here...';
    if (langName === 'swift') return 'Enter your Swift code here...';
    if (langName === 'kotlin') return 'Enter your Kotlin code here...';
    if (langName === 'lua') return 'Enter your Lua code here...';
    if (langName === 'sql') return 'Enter your SQL query here...';
    if (langName === 'script') return 'Enter your custom script here...';
    
    return `Enter your ${language} code here...`;
  };

  return (
    <div className="editor-wrapper w-full h-full transition-all duration-300 ease-out">
      <div className="relative h-full rounded-md overflow-hidden shadow-sm border border-editor-border">
        <textarea
          ref={editorRef}
          value={value}
          onChange={handleChange}
          className={getEditorClassName()}
          spellCheck={false}
          data-language={language}
          placeholder={getPlaceholder()}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
