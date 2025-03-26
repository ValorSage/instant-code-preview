
import { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface KeyboardShortcutProps {
  onRun: () => void;
  onSave: () => void;
  onToggleFileExplorer: () => void;
  onShowHelp?: () => void;
}

export const useKeyboardShortcuts = ({
  onRun,
  onSave,
  onToggleFileExplorer,
  onShowHelp
}: KeyboardShortcutProps) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if input elements are focused (don't trigger shortcuts)
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' || 
      target.tagName === 'TEXTAREA' || 
      target.isContentEditable
    ) {
      return;
    }
    
    // Ctrl+Enter or Cmd+Enter to run code
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      onRun();
      return;
    }
    
    // Ctrl+S or Cmd+S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      onSave();
      return;
    }
    
    // Ctrl+B or Cmd+B to toggle file explorer
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      onToggleFileExplorer();
      return;
    }
    
    // F1 or Ctrl+/ or Cmd+/ to show help
    if (
      event.key === 'F1' || 
      ((event.ctrlKey || event.metaKey) && event.key === '/')
    ) {
      event.preventDefault();
      if (onShowHelp) {
        onShowHelp();
      } else {
        showHelpToast();
      }
      return;
    }
  }, [onRun, onSave, onToggleFileExplorer, onShowHelp]);
  
  const showHelpToast = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: "Ctrl/Cmd+Enter: Run code | Ctrl/Cmd+S: Save | Ctrl/Cmd+B: Toggle files | F1: Help",
      duration: 5000,
    });
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return { showHelpToast };
};
