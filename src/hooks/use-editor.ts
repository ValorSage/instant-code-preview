
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
  getDefaultFileContent,
  addFileToTree,
  deleteFileFromTree,
  renameFile,
  moveFileInTree
} from '@/utils/fileUtils';
import { toast } from '@/hooks/use-toast';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useProjects } from '@/contexts/ProjectContext';

export const useEditor = () => {
  // Get current project from ProjectContext
  const { currentProject } = useProjects();
  
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
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: false,
    lineNumbers: true,
    fontFamily: 'Menlo, monospace',
    formatOnSave: true,
  });
  
  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  
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
    
    // Check for saved theme preference
    const themeMode = localStorage.getItem('akojs-theme-mode');
    if (themeMode === 'dark') {
      setIsDarkMode(true);
    } else if (themeMode === 'light') {
      setIsDarkMode(false);
    } else if (themeMode === 'system') {
      // Set according to system preference
      setIsDarkMode(prefersDark);
    } else {
      // No saved preference, use system preference
      setIsDarkMode(prefersDark);
      localStorage.setItem('akojs-theme-mode', 'system');
    }
    
    // Check for auto-save preference
    const autoSavePref = localStorage.getItem('akojs-auto-save');
    if (autoSavePref !== null) {
      setAutoSaveEnabled(autoSavePref === 'true');
    }
    
    // Load editor settings from localStorage
    const savedSettings = localStorage.getItem('akojs-editor-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setEditorSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings
        }));
      } catch (error) {
        console.error('Error parsing editor settings:', error);
      }
    }
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

  // Handle file content update with auto-save
  const handleFileContentUpdate = useCallback((content: string) => {
    if (selectedFile && selectedFile.type === 'file') {
      // Set the file content immediately (for UI)
      setFileContent(content);
      
      // If auto-save is enabled, set a timer to save after a delay
      if (autoSaveEnabled) {
        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer);
        }
        
        const timer = setTimeout(() => {
          // Update the file content in the files tree
          const updatedFiles = updateFileContent(files, selectedFile.id, content);
          setFiles(updatedFiles);
          saveFilesToLocalStorage(updatedFiles);
          
          // Update the selected file reference
          const updatedFile = findFileById(updatedFiles, selectedFile.id);
          if (updatedFile) {
            setSelectedFile(updatedFile);
          }
        }, 1000); // 1 second delay for auto-save
        
        setAutoSaveTimer(timer);
      } else {
        // If auto-save is disabled, just update the content without saving
        // We'll save when the user explicitly requests it
      }
    }
  }, [files, selectedFile, autoSaveEnabled, autoSaveTimer]);

  const handleRun = () => {
    // If a file is selected, we need to save its content first
    if (selectedFile && selectedFile.type === 'file') {
      // Update the file content in the files tree immediately (don't wait for auto-save)
      const updatedFiles = updateFileContent(files, selectedFile.id, fileContent);
      setFiles(updatedFiles);
      saveFilesToLocalStorage(updatedFiles);
      
      // Update the selected file reference
      const updatedFile = findFileById(updatedFiles, selectedFile.id);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
    
    // Run the code in the main editor (HTML, CSS, JS)
    setShouldRun(true);
    
    toast({
      title: "تم تنفيذ الكود",
      description: "تم تنفيذ الكود في نافذة المعاينة",
      duration: 2000,
    });
  };

  const handleRunComplete = () => {
    setShouldRun(false);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد أنك تريد إعادة تعيين الكود؟ سيؤدي ذلك إلى مسح الكود الحالي.')) {
      setHtml(defaultHtml);
      setCss(defaultCss);
      setJs(defaultJs);
      setScript('// Add your custom script here');
      setShouldRun(true);
      toast({
        title: "تم إعادة تعيين الكود",
        description: "تم إعادة تعيين المحرر إلى الكود الافتراضي",
      });
    }
  };

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('akojs-theme-mode', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled(prevValue => {
      const newValue = !prevValue;
      localStorage.setItem('akojs-auto-save', newValue.toString());
      
      toast({
        title: newValue ? "الحفظ التلقائي مفعل" : "الحفظ التلقائي معطل",
        description: newValue 
          ? "سيتم حفظ التغييرات تلقائياً" 
          : "يجب الضغط على زر الحفظ لحفظ التغييرات",
        duration: 2000,
      });
      
      return newValue;
    });
  }, []);

  const handleSave = () => {
    // Save main editor content
    saveToLocalStorage(html, css, js, script);
    
    // If a file is selected, save its content
    if (selectedFile && selectedFile.type === 'file') {
      const updatedFiles = updateFileContent(files, selectedFile.id, fileContent);
      setFiles(updatedFiles);
      saveFilesToLocalStorage(updatedFiles);
      
      // Update the selected file reference
      const updatedFile = findFileById(updatedFiles, selectedFile.id);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
    
    toast({
      title: "تم حفظ المشروع",
      description: "تم حفظ الكود في التخزين المحلي",
    });
  };

  const handleSaveAll = () => {
    // Save all files
    saveFilesToLocalStorage(files);
    
    // Save main editor content
    saveToLocalStorage(html, css, js, script);
    
    toast({
      title: "تم حفظ جميع الملفات",
      description: "تم حفظ جميع ملفات المشروع",
      duration: 2000,
    });
  };

  const handleExportProject = () => {
    // Create a zip file with all project files
    try {
      // Create a JSON representation of the project
      const projectData = {
        html,
        css,
        js,
        script,
        files
      };
      
      // Convert to JSON string
      const jsonData = JSON.stringify(projectData, null, 2);
      
      // Create a blob and download it
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'akojs-project.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "تم تصدير المشروع",
        description: "تم حفظ المشروع كملف JSON",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to export project:', error);
      toast({
        title: "خطأ في التصدير",
        description: "فشل تصدير المشروع، يرجى المحاولة مرة أخرى",
        variant: "destructive",
        duration: 3000,
      });
    }
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
      handleFileContentUpdate(content);
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

  // Update editor settings
  const updateEditorSettings = useCallback((newSettings: Partial<typeof editorSettings>) => {
    setEditorSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      localStorage.setItem('akojs-editor-settings', JSON.stringify(updatedSettings));
      return updatedSettings;
    });
    
    toast({
      title: "تم تحديث الإعدادات",
      description: "تم تحديث إعدادات المحرر بنجاح",
      duration: 2000,
    });
  }, []);
  
  // Register keyboard shortcuts
  const { showHelpToast } = useKeyboardShortcuts({
    onRun: handleRun,
    onSave: handleSave,
    onToggleFileExplorer: toggleFileExplorer
  });

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
    autoSaveEnabled,
    toggleAutoSave,
    editorSettings,
    updateEditorSettings,
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
    setEditorContent,
    showHelpToast,
    // Export file utility functions so they can be accessed directly
    addFileToTree,
    deleteFileFromTree,
    renameFile,
    moveFileInTree,
    findFileById,
    saveFilesToLocalStorage,
    // Include currentProject from the projects context
    currentProject
  };
};
