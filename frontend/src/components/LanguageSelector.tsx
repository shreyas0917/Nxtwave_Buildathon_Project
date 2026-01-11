import React from 'react';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal';
  showIcon?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default',
  showIcon = true 
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
      <SelectTrigger 
        className={`
          ${variant === 'minimal' ? 'w-auto gap-2 border-0 bg-transparent' : 'w-[140px]'}
          focus:ring-primary
        `}
      >
        {showIcon && <Globe className="h-4 w-4 text-muted-foreground" />}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="font-medium">{lang.nativeName}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
