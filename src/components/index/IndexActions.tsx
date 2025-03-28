
import React from 'react';
import { FileType } from '@/components/FileExplorer/FileExplorer';
import { toast } from '@/hooks/use-toast';

interface IndexActionsProps {
  files: FileType[];
  selectedFile: FileType | null;
  addFileToTree: (files: FileType[], file: FileType, parentId?: string) => FileType[];
  saveFilesToLocalStorage: (files: FileType[]) => void;
  setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileType | null>>;
  deleteFileFromTree: (files: FileType[], fileId: string) => FileType[];
  renameFile: (files: FileType[], fileId: string, newName: string) => FileType[];
  findFileById: (files: FileType[], fileId: string) => FileType | null;
  moveFileInTree: (files: FileType[], fileId: string, targetFolderId: string | null) => FileType[];
}

export const useIndexActions = ({
  files,
  selectedFile,
  addFileToTree,
  saveFilesToLocalStorage,
  setFiles,
  setSelectedFile,
  deleteFileFromTree,
  renameFile,
  findFileById,
  moveFileInTree
}: IndexActionsProps) => {
  const handleFileCreate = (file: FileType, parentId?: string) => {
    const updatedFiles = addFileToTree(files, file, parentId);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    if (file.type === 'file') {
      setSelectedFile(file);
    }
    
    toast({
      title: `${file.type === 'file' ? 'تم إنشاء الملف' : 'تم إنشاء المجلد'}`,
      description: `تم إنشاء ${file.name} بنجاح.`,
      duration: 2000,
    });
  };

  const handleFileDelete = (fileId: string) => {
    if (selectedFile && selectedFile.id === fileId) {
      setSelectedFile(null);
    }
    
    const updatedFiles = deleteFileFromTree(files, fileId);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف الملف أو المجلد.",
      duration: 2000,
    });
  };

  const handleFileRename = (fileId: string, newName: string) => {
    const updatedFiles = renameFile(files, fileId, newName);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    if (selectedFile && selectedFile.id === fileId) {
      const updatedFile = findFileById(updatedFiles, fileId);
      if (updatedFile) {
        setSelectedFile(updatedFile);
      }
    }
    
    toast({
      title: "تمت إعادة التسمية",
      description: `تمت إعادة التسمية إلى ${newName} بنجاح.`,
      duration: 2000,
    });
  };
  
  const handleFileMove = (fileId: string, targetFolderId: string | null) => {
    const updatedFiles = moveFileInTree(files, fileId, targetFolderId);
    setFiles(updatedFiles);
    saveFilesToLocalStorage(updatedFiles);
    
    toast({
      title: "تم نقل الملف",
      description: "تم نقل الملف بنجاح.",
      duration: 2000,
    });
  };

  return {
    handleFileCreate,
    handleFileDelete,
    handleFileRename,
    handleFileMove
  };
};
