
import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const languages = [
  { id: 'javascript', name: 'JavaScript', icon: 'js' },
  { id: 'typescript', name: 'TypeScript', icon: 'ts' },
  { id: 'html', name: 'HTML', icon: 'html' },
  { id: 'css', name: 'CSS', icon: 'css' },
  { id: 'python', name: 'Python', icon: 'py' },
  { id: 'java', name: 'Java', icon: 'java' },
  { id: 'cpp', name: 'C++', icon: 'cpp' },
  { id: 'csharp', name: 'C#', icon: 'cs' }
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageSelect: (languageId: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageSelect
}) => {
  const [open, setOpen] = React.useState(false);
  
  const currentLanguage = languages.find(lang => lang.id === selectedLanguage) || languages[0];
  
  const handleSelectLanguage = (langId: string) => {
    onLanguageSelect(langId);
    setOpen(false);
    
    toast({
      title: "تم تغيير اللغة",
      description: `تم تغيير لغة البرمجة إلى ${languages.find(l => l.id === langId)?.name}`,
      duration: 2000,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Globe className="h-3.5 w-3.5" />
          <span>{currentLanguage.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[200px]">
        <Command>
          <CommandInput placeholder="ابحث عن لغة..." />
          <CommandList>
            <CommandEmpty>لم يتم العثور على لغات.</CommandEmpty>
            <CommandGroup heading="لغات البرمجة">
              {languages.map((language) => (
                <CommandItem
                  key={language.id}
                  onSelect={() => handleSelectLanguage(language.id)}
                  className="flex items-center"
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded bg-muted text-[10px] font-bold mr-2">
                    {language.icon}
                  </div>
                  <span>{language.name}</span>
                  {language.id === selectedLanguage && (
                    <Check className="ml-auto h-4 w-4 opacity-100" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
