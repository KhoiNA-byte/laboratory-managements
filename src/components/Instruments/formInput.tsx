import React from 'react';
import { useTranslation } from 'react-i18next';
import { CLASS_NAMES } from '../../constants/instruments/instrumentForm';

interface FormInputProps {
  name: string;
  label: string;
  type: 'text' | 'date' | 'select';
  value: any;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }> | string[];
  disabled?: boolean;
  onChange: (field: string, value: any) => void;
  translationNamespace?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type,
  value,
  error,
  required = false,
  placeholder,
  options = [],
  disabled = false,
  onChange,
  translationNamespace = 'common',
}) => {
  const { t } = useTranslation(translationNamespace);

  const inputClass = `${CLASS_NAMES.INPUT.BASE} ${
    error ? CLASS_NAMES.INPUT.INVALID : CLASS_NAMES.INPUT.VALID
  } ${disabled ? CLASS_NAMES.INPUT.DISABLED : ''}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className={inputClass}
            disabled={disabled}
            required={required}
          >
            {placeholder && <option value="">{t(placeholder)}</option>}
            {options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : t(option.label);
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className={inputClass}
            disabled={disabled}
            required={required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            className={inputClass}
            placeholder={placeholder ? t(placeholder) : undefined}
            disabled={disabled}
            required={required}
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t(label)} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};