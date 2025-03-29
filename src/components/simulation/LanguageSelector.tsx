
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
  languages: Array<{ id: string; name: string; icon: string }>;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageSelect,
  languages
}) => {
  return (
    <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="اختر لغة البرمجة" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded flex items-center justify-center bg-muted font-mono text-xs">
                {lang.icon}
              </div>
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
