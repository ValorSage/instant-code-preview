
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

  // Determine editor styling based on language
  const getEditorClassName = () => {
    const baseClasses = "w-full h-full min-h-[150px] md:min-h-[300px] resize-none p-2 md:p-4 font-mono text-sm leading-relaxed " +
      "outline-none bg-editor-background text-editor-foreground rounded-md";
    
    switch (language) {
      case 'html':
        return `${baseClasses} border-t-2 border-t-blue-500`;
      case 'css':
        return `${baseClasses} border-t-2 border-t-purple-500`;
      case 'js':
        return `${baseClasses} border-t-2 border-t-yellow-500`;
      case 'script':
        return `${baseClasses} border-t-2 border-t-green-500`;
      default:
        return baseClasses;
    }
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
          placeholder={`Enter your ${language === 'js' ? 'JavaScript' : language === 'script' ? 'Script' : language.toUpperCase()} code here...`}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
