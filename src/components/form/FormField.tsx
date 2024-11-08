import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useStore } from '@/stores';
import type { FormState } from '@/stores';

interface FormFieldProps {
  name: keyof FormState;
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  type?: string;
  value?: string;
  InputLabelProps?: TextFieldProps['InputLabelProps'];
  helperText?: string;
  sx?: TextFieldProps['sx'];
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  required = false,
  multiline = false,
  rows = 1,
  disabled = false,
  type = 'text',
  value,
  InputLabelProps,
  helperText,
  sx,
}) => {
  const setField = useStore((state) => state.setField);
  const fieldValue = useStore((state) => state[name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setField(name, e.target.value);
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={value !== undefined ? value : fieldValue}
      onChange={handleChange}
      required={required}
      multiline={multiline}
      rows={rows}
      disabled={disabled}
      type={type}
      InputLabelProps={InputLabelProps}
      helperText={helperText}
      sx={sx}
    />
  );
};