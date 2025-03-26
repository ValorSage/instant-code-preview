import { useState, useCallback, useEffect } from 'react';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage,
  defaultHtml,
  defaultCss,
  defaultJs
} from '@/utils/editorUtils';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { 
  findFileById, 
  updateFileContent,
  saveFilesToLocalStorage,
  loadFilesFromLocalStorage,
  getDefaultFileContent
} from '@/utils/fileUtils';
import { toast } from '@/hooks/use-toast';

export const useEditor = () => {
  // State for editor content
  const [html, setHtml] = useState(defaultHtml);
  const [css, setCss] = useState(defaultCss);
  const [js, setJs] = useState(defaultJs);
  const [script, setScript] = useState('// Add your custom script here');
  const [activeTab, setActiveTab] = useState('html');
  const [shouldRun, setShouldRun] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [files, setFiles] = useState<FileType[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [fileContent, setFileContent] = useState('');
  
  // Load saved code and files on initial render
  useEffect(() => {
    // Load default editor content
    const savedCode = loadFromLocalStorage();
    if (savedCode) {
      setHtml(savedCode.html);
      setCss(savedCode.css);
      setJs(savedCode.js);
      setScript(savedCode.script || '// Add your custom script here');
    }
    
    // Load files from localStorage
    const savedFiles = loadFilesFromLocalStorage();
    setFiles(savedFiles);
    
    // Run the saved code
    setTimeout(() => {
      setShouldRun(true);
    }, 500);
    
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

  // Update file content when a file is selected
  useEffect(() => {
    if (selectedFile && selectedFile.type === 'file') {
      setFileContent(selectedFile.content || '');
      // Set active tab based on file language
      if (selectedFile.language) {
        setActiveTab(selectedFile.language);
      }
    }
  }, [selectedFile]);

  // Handle file selection
  const handleFileSelect = (file: FileType) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  // Handle file content update
  const handleFileContentUpdate = useCallback((content: string) => {
    if (selectedFile && selectedFile.type === 'file') {
      // Update the file content in the files tree
      const updatedFiles = updateFileContent(files, selectedFile.id, content);
      setFiles(updatedFiles);
      saveFilesToLocalStorage(updatedFiles);
      
      // Update the selected file reference
      const updatedFile = findFileById(updatedFiles, selectedFile.id);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
      
      // Also update the file content state
      setFileContent(content);
    }
  }, [files, selectedFile]);

  const handleRun = () => {
    // If a file is selected, we need to save its content first
    if (selectedFile && selectedFile.type === 'file') {
      handleFileContentUpdate(fileContent);
    }
    
    // Run the code in the main editor (HTML, CSS, JS)
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
      setScript('// Add your custom script here');
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

  const handleSave = () => {
    // Save main editor content
    saveToLocalStorage(html, css, js, script);
    
    // If a file is selected, save its content
    if (selectedFile && selectedFile.type === 'file') {
      handleFileContentUpdate(fileContent);
    }
    
    // Save all files
    saveFilesToLocalStorage(files);
    
    toast({
      title: "Project saved",
      description: "Your code has been saved to local storage",
    });
  };

  const handleSaveAll = () => {
    // Save all files
    saveFilesToLocalStorage(files);
    
    // Save main editor content
    saveToLocalStorage(html, css, js, script);
    
    toast({
      title: "All files saved",
      description: "All project files have been saved",
      duration: 2000,
    });
  };

  const handleExportProject = () => {
    // TODO: Implement project export functionality
    toast({
      title: "Export not implemented",
      description: "This feature will be available in a future update",
      duration: 2000,
    });
  };

  const toggleFileExplorer = () => {
    setShowFileExplorer(!showFileExplorer);
  };

  const getFinalJs = () => {
    // If script tab is active, combine js and script
    return `${js}\n\n// Custom script\n${script}`;
  };

  // Get content for the editor based on the active tab
  const getEditorContent = () => {
    // If a file is selected, show its content
    if (selectedFile && selectedFile.type === 'file') {
      return fileContent;
    }
    
    // Otherwise show the main editor content based on the active tab
    switch (activeTab) {
      case 'html':
        return html;
      case 'css':
        return css;
      case 'js':
      case 'javascript':
        return js;
      case 'script':
        return script;
      default:
        // For other languages, show a default template
        return getDefaultFileContent(activeTab);
    }
  };

  // Set content for the editor based on the active tab
  const setEditorContent = (content: string) => {
    // If a file is selected, update its content
    if (selectedFile && selectedFile.type === 'file') {
      setFileContent(content);
      return;
    }
    
    // Otherwise update the main editor content based on the active tab
    switch (activeTab) {
      case 'html':
        setHtml(content);
        break;
      case 'css':
        setCss(content);
        break;
      case 'js':
      case 'javascript':
        setJs(content);
        break;
      case 'script':
        setScript(content);
        break;
      default:
        // For other languages, we don't update any state
        break;
    }
  };

  return {
    html,
    css,
    js,
    script,
    activeTab,
    setActiveTab,
    shouldRun,
    setShouldRun,
    isDarkMode,
    toggleDarkMode,
    showFileExplorer,
    setShowFileExplorer,
    files,
    setFiles,
    selectedFile,
    setSelectedFile,
    fileContent,
    setFileContent,
    handleFileSelect,
    handleFileContentUpdate,
    handleRun,
    handleRunComplete,
    handleReset,
    handleSave,
    handleSaveAll,
    handleExportProject,
    toggleFileExplorer,
    getFinalJs,
    getEditorContent,
    setEditorContent
  };
};
