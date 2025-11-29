import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { API_ENDPOINTS, FORM_CONFIG, INITIAL_FORM_DATA } from '../../constants/instruments/instrumentForm';
import { TestType, Reagent } from '../../store/types';

interface FormData {
  name: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  status: 'Active' | 'Maintenance' | 'Inactive';
  location: string;
  nextCalibration: string;
  supportedTest: string;
  supportedReagents: string[];
}

interface LoadingState {
  testTypes: boolean;
  reagents: boolean;
}

export const useInstrumentForm = () => {
  const { t } = useTranslation('common');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ testTypes: false, reagents: false });
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Validation functions
  const validateField = useCallback((field: string, value: any): string => {
    const { SPECIAL_CHAR_REGEX, MIN_NAME_LENGTH } = FORM_CONFIG.VALIDATION_RULES;

    const validationRules: Record<string, (val: any) => string> = {
      name: (val) => {
        if (!val.trim()) return t("modals.addInstrument.validation.nameRequired");
        if (SPECIAL_CHAR_REGEX.test(val)) return t("modals.addInstrument.validation.nameSpecialChars");
        if (val.trim().length < MIN_NAME_LENGTH) return t("modals.addInstrument.validation.nameMinLength");
        return '';
      },
      model: (val) => {
        if (!val.trim()) return t("modals.addInstrument.validation.modelRequired");
        if (SPECIAL_CHAR_REGEX.test(val)) return t("modals.addInstrument.validation.modelSpecialChars");
        return '';
      },
      serialNumber: (val) => {
        if (!val.trim()) return t("modals.addInstrument.validation.serialRequired");
        if (SPECIAL_CHAR_REGEX.test(val)) return t("modals.addInstrument.validation.serialSpecialChars");
        return '';
      },
      manufacturer: (val) => {
        if (!val.trim()) return t("modals.addInstrument.validation.manufacturerRequired");
        if (SPECIAL_CHAR_REGEX.test(val)) return t("modals.addInstrument.validation.manufacturerSpecialChars");
        return '';
      },
      location: (val) => !val.trim() ? t("modals.addInstrument.validation.locationRequired") : '',
      nextCalibration: (val) => {
        if (!val.trim()) return t("modals.addInstrument.validation.calibrationRequired");
        if (new Date(val) <= new Date()) return t("modals.addInstrument.validation.calibrationFuture");
        return '';
      },
      supportedTest: (val) => !val.trim() ? t("modals.addInstrument.validation.testTypeRequired") : '',
      supportedReagents: (val) => !val.length ? t("modals.addInstrument.validation.reagentsRequired") : '',
    };

    return validationRules[field]?.(value) || '';
  }, [t]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof FormData]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Form handlers
  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleReagentChange = useCallback((reagentId: string) => {
    setFormData(prev => {
      const updatedReagents = prev.supportedReagents.includes(reagentId)
        ? prev.supportedReagents.filter(id => id !== reagentId)
        : [...prev.supportedReagents, reagentId];
      
      return { ...prev, supportedReagents: updatedReagents };
    });

    if (errors.supportedReagents) {
      setErrors(prev => ({ ...prev, supportedReagents: '' }));
    }
  }, [errors]);

  // API functions
  const fetchData = useCallback(async () => {
    try {
      setLoading({ testTypes: true, reagents: true });
      setFetchError(null);

      const [testTypesResult, reagentsResult] = await Promise.allSettled([
        fetch(API_ENDPOINTS.TEST_TYPES).then(res => res.ok ? res.json() : Promise.reject('Test types failed')),
        fetch(API_ENDPOINTS.REAGENTS).then(res => res.ok ? res.json() : Promise.reject('Reagents failed')),
      ]);

      setTestTypes(testTypesResult.status === 'fulfilled' && Array.isArray(testTypesResult.value) ? testTypesResult.value : []);
      setReagents(reagentsResult.status === 'fulfilled' && Array.isArray(reagentsResult.value) ? reagentsResult.value : []);

    } catch (error) {
      console.error('Error fetching data:', error);
      setFetchError(t('modals.addInstrument.errors.fetchFailed'));
    } finally {
      setLoading({ testTypes: false, reagents: false });
    }
  }, [t]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setFetchError(null);
  }, []);

  return {
    // State
    formData,
    errors,
    saving,
    testTypes,
    reagents,
    loading,
    fetchError,
    
    // Actions
    setSaving,
    setFormData,
    setErrors,
    
    // Handlers
    handleInputChange,
    handleReagentChange,
    validateForm,
    validateField,
    fetchData,
    resetForm,
  };
};