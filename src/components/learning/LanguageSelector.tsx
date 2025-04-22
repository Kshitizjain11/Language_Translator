import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  onLanguageChange: (language: Language) => void;
  selectedLanguage?: Language;
}

const languages: Language[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
  selectedLanguage,
}) => {
  const [selected, setSelected] = useState<string>(selectedLanguage?.code || '');

  useEffect(() => {
    if (selectedLanguage) {
      setSelected(selectedLanguage.code);
    }
  }, [selectedLanguage]);

  const handleChange = (event: { target: { value: string } }) => {
    const language = languages.find((lang) => lang.code === event.target.value);
    if (language) {
      setSelected(language.code);
      onLanguageChange(language);
    }
  };

  return (
    <Box sx={{ minWidth: 200, m: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="language-select-label">Target Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={selected}
          label="Target Language"
          onChange={handleChange}
          sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center' } }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              value={language.code}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Typography component="span" sx={{ fontSize: '1.2rem' }}>
                {language.flag}
              </Typography>
              <Typography>{language.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector; 