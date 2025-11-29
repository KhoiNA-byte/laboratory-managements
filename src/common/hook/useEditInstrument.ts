import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Instrument } from '../../store/types';
import { useInstrumentForm } from './useInstrumentForm';
import { INITIAL_FORM_DATA } from '../../constants/instruments/instrumentForm';

export const useEditInstrument = (instrument: Instrument | null) => {
  const { t } = useTranslation('common');
  
  const {
    formData,
    errors,
    saving,
    testTypes,
    reagents,
    loading,
    fetchError,
    setSaving,
    setFormData,
    setErrors,
    handleInputChange,
    handleReagentChange,
    validateForm,
    validateField,
    fetchData,
    resetForm,
  } = useInstrumentForm();

  // Load instrument data when popup opens
  useEffect(() => {
    if (instrument) {
      setFormData({
        name: instrument.name || "",
        model: instrument.model || "",
        serialNumber: instrument.serialNumber || "",
        manufacturer: instrument.manufacturer || "",
        status: instrument.status as any || "Active",
        location: instrument.location || "",
        nextCalibration: instrument.nextCalibration || "",
        supportedTest: instrument.supportedTest || "",
        supportedReagents: instrument.supportedReagents || [],
      });
    }
  }, [instrument, setFormData]);

  // Handle save for edit
  const handleSave = useCallback(async (onSave: (instrument: Instrument) => void, onClose: () => void) => {
    if (!instrument) return;
    
    if (!validateForm()) {
      alert(t('modals.addInstrument.validation.fixErrors'));
      return;
    }

    try {
      setSaving(true);
      
      // 🔹 SỬA: ĐẢM BẢO XỬ LÝ GIÁ TRỊ TRƯỚC KHI DÙNG .trim()
      const updatePayload = {
        id: instrument.id,
        name: formData.name?.toString().trim() || "", // 🔹 THÊM .toString() VÀ XỬ LÝ undefined
        model: formData.model?.toString().trim() || "",
        serialNumber: formData.serialNumber?.toString().trim() || "",
        manufacturer: formData.manufacturer?.toString().trim() || "",
        status: formData.status,
        location: formData.location,
        nextCalibration: formData.nextCalibration,
        supportedTest: formData.supportedTest,
        supportedReagents: formData.supportedReagents,
        calibrationDue: instrument.calibrationDue || false,
        // Giữ nguyên các thông số kỹ thuật
        temperature: instrument.temperature,
        sampleVolume: instrument.sampleVolume,
        firmwareVersion: instrument.firmwareVersion,
        port: instrument.port,
        encryption: instrument.encryption,
        ipAddress: instrument.ipAddress,
      };

      // Call onSave callback
      onSave(updatePayload as Instrument);
      onClose();
    } catch (error) {
      console.error('Error saving instrument:', error);
      alert(t('modals.editInstrument.errorSaving'));
    } finally {
      setSaving(false);
    }
  }, [instrument, formData, validateForm, setSaving, t]);

  const handleCancel = useCallback((onClose: () => void) => {
    const hasUnsavedChanges = Object.values(formData).some((value, key) => {
      const originalValue = instrument ? instrument[key as keyof Instrument] : null;
      return value !== originalValue;
    });
    
    if (hasUnsavedChanges && !window.confirm(t('modals.addInstrument.validation.cancelConfirm'))) {
      return;
    }
    onClose();
  }, [formData, instrument, t]);

  return {
    // State from useInstrumentForm
    formData,
    errors,
    saving,
    testTypes,
    reagents,
    loading,
    fetchError,
    
    // Actions
    setSaving,
    
    // Handlers
    handleInputChange,
    handleReagentChange,
    handleSave,
    handleCancel,
    validateForm,
    fetchData,
  };
};