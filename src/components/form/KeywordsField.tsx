import React from 'react';
import { Box, Chip, TextField } from '@mui/material';
import { useStore } from '@/stores';

export interface KeywordsFieldProps {
  disabled?: boolean;
  keywords?: string[];
  onChange?: (keywords: string[]) => void;
}

export const KeywordsField: React.FC<KeywordsFieldProps> = ({
  disabled,
  keywords: externalKeywords,
  onChange
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const storeKeywords = useStore((state) => state.keywords);
  const setField = useStore((state) => state.setField);
  const isSubmitting = useStore((state) => state.isSubmitting);

  // Use external keywords if provided, otherwise use store keywords
  const keywords = externalKeywords ?? storeKeywords;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const newKeyword = inputValue.trim();

      if (newKeyword && !keywords.includes(newKeyword)) {
        const newKeywords = [...keywords, newKeyword];
        if (onChange) {
          onChange(newKeywords);
        } else {
          setField('keywords', newKeywords);
        }
      }

      setInputValue('');
    }
  };

  const handleDelete = (keywordToDelete: string) => {
    const newKeywords = keywords.filter(keyword => keyword !== keywordToDelete);
    if (onChange) {
      onChange(newKeywords);
    } else {
      setField('keywords', newKeywords);
    }
  };

  return (
    <Box sx={{ marginBottom: '30px' }}>
      <TextField
        fullWidth
        label="Keywords"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSubmitting}
        placeholder="Type and press Enter to add keywords"
        helperText="Press Enter or comma to add a keyword"
      />
      <Box className="flex flex-wrap gap-2 mt-4">
        {keywords.map((keyword) => (
          <Chip
            key={keyword}
            label={keyword}
            onDelete={() => handleDelete(keyword)}
            disabled={disabled || isSubmitting}
          />
        ))}
      </Box>
    </Box>
  );
};