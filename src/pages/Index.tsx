
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import Preview from '@/components/Preview';
import EditorControls from '@/components/EditorControls';
import { 
  defaultHtml, 
  defaultCss, 
  defaultJs, 
  loadFromLocalStorage, 
  saveToLocalStorage 
} from '@/utils/editorUtils';
import { toast } from '@/components/ui/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  // State for editor content
  const [html, setHtml] = useState(defaultHtml);
  const [css, setCss] = useState(defaultCss);
  const [js, setJs] = useState(defaultJs);
  const [activeTab, setActiveTab] = useState('html');
  const [shouldRun, setShouldRun] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Load saved code on initial render
  useEffect(() => {
    const savedCode = loadFromLocalStorage();
    if (savedCode) {
      setHtml(savedCode.html);
      setCss(savedCode.css);
      setJs(savedCode.js);
      
      // Run the saved code
      setTimeout(() => {
        setShouldRun(true);
      }, 500);
    } else {
      // Run default code
      setTimeout(() => {
        setShouldRun(true);
      }, 500);
    }
    
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleRun = () => {
    setShouldRun(true);
    toast({
      title: "Code executed",
      description: "Your code is now running in the preview",
      duration: 2000,
    });
  };

  const handleRunComplete = () => {
    setShouldRun(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? This will clear your current code.')) {
      setHtml(defaultHtml);
      setCss(defaultCss);
      setJs(defaultJs);
      setShouldRun(true);
      toast({
        title: "Code reset",
        description: "Editor has been reset to default code",
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background transition-colors duration-300`}>
      <Header 
        html={html} 
        css={css} 
        js={js} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <main className="flex flex-col flex-grow p-4 md:p-6 space-y-4 md:space-y-6">
        <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border border-border overflow-hidden shadow-sm animate-fade-in">
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="flex flex-col h-full bg-card">
              <EditorControls 
                onRun={handleRun} 
                onReset={handleReset}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              
              <div className="relative flex-grow overflow-hidden transition-all duration-300">
                {activeTab === 'html' && (
                  <div className="absolute inset-0 p-4">
                    <CodeEditor 
                      value={html} 
                      onChange={setHtml} 
                      language="html" 
                    />
                  </div>
                )}
                
                {activeTab === 'css' && (
                  <div className="absolute inset-0 p-4">
                    <CodeEditor 
                      value={css} 
                      onChange={setCss} 
                      language="css" 
                    />
                  </div>
                )}
                
                {activeTab === 'js' && (
                  <div className="absolute inset-0 p-4">
                    <CodeEditor 
                      value={js} 
                      onChange={setJs} 
                      language="js" 
                    />
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <div className="h-full">
              <Preview 
                html={html} 
                css={css} 
                js={js} 
                shouldRun={shouldRun}
                onRunComplete={handleRunComplete}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      
      <footer className="py-3 text-center text-sm text-muted-foreground border-t border-border">
        <p>Ako.js - A modern web-based code editor inspired by CodePen</p>
      </footer>
    </div>
  );
};

export default Index;
