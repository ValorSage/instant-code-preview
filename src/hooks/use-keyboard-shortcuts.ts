
import { useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface KeyboardShortcutProps {
  onRun: () => void;
  onSave: () => void;
  onToggleFileExplorer: () => void;
  onShowHelp?: () => void;
  onSwitchToEditorView?: () => void;
  onSwitchToSplitView?: () => void;
  onSwitchToPreviewView?: () => void;
}

export const useKeyboardShortcuts = ({
  onRun,
  onSave,
  onToggleFileExplorer,
  onShowHelp,
  onSwitchToEditorView,
  onSwitchToSplitView,
  onSwitchToPreviewView
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
    
    // Ctrl+1 or Cmd+1 to switch to editor view
    if ((event.ctrlKey || event.metaKey) && event.key === '1') {
      event.preventDefault();
      if (onSwitchToEditorView) {
        onSwitchToEditorView();
      }
      return;
    }
    
    // Ctrl+2 or Cmd+2 to switch to split view
    if ((event.ctrlKey || event.metaKey) && event.key === '2') {
      event.preventDefault();
      if (onSwitchToSplitView) {
        onSwitchToSplitView();
      }
      return;
    }
    
    // Ctrl+3 or Cmd+3 to switch to preview view
    if ((event.ctrlKey || event.metaKey) && event.key === '3') {
      event.preventDefault();
      if (onSwitchToPreviewView) {
        onSwitchToPreviewView();
      }
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
  }, [onRun, onSave, onToggleFileExplorer, onShowHelp, onSwitchToEditorView, onSwitchToSplitView, onSwitchToPreviewView]);
  
  const showHelpToast = () => {
    toast({
      title: "Keyboard Shortcuts",
      description: "Ctrl/Cmd+Enter: Run code | Ctrl/Cmd+S: Save | Ctrl/Cmd+B: Toggle files | F1: Help | Ctrl/Cmd+1: Editor | Ctrl/Cmd+2: Split | Ctrl/Cmd+3: Preview",
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
