
import React, { useState, useCallback, useEffect } from 'react';
import { Search, File, Folder } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileType[];
  onFileSelect: (file: FileType) => void;
  searchContent?: boolean;
}

// Extended type for internal use with file path
interface FileWithPath extends FileType {
  path: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  files,
  onFileSelect,
  searchContent = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState<FileWithPath[]>([]);
  
  // Flatten file structure into searchable array
  const flattenFiles = useCallback((fileList: FileType[], path: string = ''): FileWithPath[] => {
    return fileList.reduce((acc: FileWithPath[], file) => {
      // Add current path to file
      const filePath = path ? `${path}/${file.name}` : file.name;
      const fileWithPath = { ...file, path: filePath };
      
      // Add current file to accumulator
      acc.push(fileWithPath);
      
      // If file has children, recursively add them too
      if (file.children && file.children.length > 0) {
        acc.push(...flattenFiles(file.children, filePath));
      }
      
      return acc;
    }, []);
  }, []);
  
  // Filter files based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFiles([]);
      return;
    }
    
    const flatFiles = flattenFiles(files);
    const results = flatFiles.filter(file => {
      // Match by filename
      const filenameMatch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Match by content if enabled and file has content
      const contentMatch = searchContent && 
                         file.type === 'file' && 
                         file.content && 
                         file.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      return filenameMatch || contentMatch;
    });
    
    setFilteredFiles(results);
  }, [searchQuery, files, flattenFiles, searchContent]);
  
  const handleSelect = (file: FileWithPath) => {
    // Convert back to FileType when passing to parent component
    const originalFile: FileType = {
      id: file.id,
      name: file.name,
      type: file.type,
      content: file.content,
      children: file.children,
      language: file.language,
      dateCreated: file.dateCreated,
      dateModified: file.dateModified
    };
    
    onFileSelect(originalFile);
    onClose();
    setSearchQuery('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">بحث في الملفات</DialogTitle>
        </DialogHeader>
        
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="اكتب للبحث..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-12"
          />
          
          <CommandList>
            <CommandEmpty>لا توجد نتائج للبحث</CommandEmpty>
            <CommandGroup>
              {filteredFiles.map((file) => (
                <CommandItem
                  key={file.id}
                  onSelect={() => handleSelect(file)}
                  className="flex items-center gap-2 py-3 px-4 cursor-pointer"
                >
                  {file.type === 'file' ? (
                    <File className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{file.name}</span>
                    {file.path && (
                      <span className="text-xs text-muted-foreground">{file.path}</span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
