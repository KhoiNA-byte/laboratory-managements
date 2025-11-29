import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useInstrumentForm } from '../../common/hook/useInstrumentForm';
import { FormInput } from '../../components/Instruments/formInput';
import { 
  FORM_CONFIG, 
  CLASS_NAMES, 
  FIELD_CONFIG,
  API_ENDPOINTS 
} from '../../constants/instruments/instrumentForm';
import { Instrument } from '../../store/types';

interface AddInstrumentPopupProps {
  onClose: () => void;
  onSave: (instrument: Instrument) => void;
}

const AddInstrumentPopup: React.FC<AddInstrumentPopupProps> = ({ onClose, onSave }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  
  const {
    formData,
    errors,
    saving,
    testTypes,
    reagents,
    loading,
    fetchError,
    setSaving,
    handleInputChange,
    handleReagentChange,
    validateForm,
    fetchData,
  } = useInstrumentForm();

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helper functions
  const getMinCalibrationDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert(t('modals.addInstrument.validation.fixErrors'));
      return;
    }

    try {
      setSaving(true);
      
      const newInstrument = {
        ...formData,
        name: formData.name.trim(),
        model: formData.model.trim(),
        serialNumber: formData.serialNumber.trim(),
        manufacturer: formData.manufacturer.trim(),
        calibrationDue: false
      };

      dispatch({ 
        type: 'instruments/addInstrumentRequest', 
        payload: newInstrument 
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving instrument:', error);
      alert(t('modals.addInstrument.validation.errorCreating'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const hasUnsavedChanges = Object.values(formData).some(value => 
      Array.isArray(value) ? value.length > 0 : Boolean(value)
    );
    
    if (hasUnsavedChanges && !window.confirm(t('modals.addInstrument.validation.cancelConfirm'))) {
      return;
    }
    onClose();
  };

  const isFormLoading = loading.testTypes || loading.reagents;
  const isSubmitDisabled = saving || isFormLoading;

  return (
    <div className={CLASS_NAMES.MODAL.OVERLAY}>
      <div className={CLASS_NAMES.MODAL.CONTAINER}>
        
        {/* Header */}
        <div className={CLASS_NAMES.MODAL.HEADER}>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('modals.addInstrument.title')}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {t('modals.addInstrument.subtitle')}
            </p>
          </div>
          <button onClick={handleCancel} className={CLASS_NAMES.BUTTON.CLOSE}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className={CLASS_NAMES.MODAL.SECTION}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('modals.addInstrument.basicInformation')}
            </h3>
            <div className={CLASS_NAMES.GRID.BASIC}>
              {/* Basic Fields */}
              {FIELD_CONFIG.BASIC_FIELDS.map(field => (
                <FormInput
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  error={errors[field.name]}
                  onChange={handleInputChange}
                />
              ))}
              
              {/* Dropdown Fields */}
              {FIELD_CONFIG.DROPDOWN_FIELDS.map(field => (
                <FormInput
                  key={field.name}
                  {...field}
                  value={formData[field.name]}
                  error={errors[field.name]}
                  onChange={handleInputChange}
                  options={FORM_CONFIG[field.options]}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Calibration Information */}
          <div className={CLASS_NAMES.MODAL.SECTION}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('modals.addInstrument.calibrationInformation')}
            </h3>
            <div className="max-w-md">
              <FormInput
                name="nextCalibration"
                label="modals.addInstrument.nextCalibrationDate"
                type="date"
                value={formData.nextCalibration}
                error={errors.nextCalibration}
                required={true}
                onChange={handleInputChange}
                min={getMinCalibrationDate()}
              />
            </div>
          </div>

          {/* Section 3: Testing Configuration */}
          <div className={CLASS_NAMES.MODAL.SECTION}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('modals.addInstrument.testingConfiguration')}
            </h3>
            <div className={CLASS_NAMES.GRID.CONFIG}>
              
              {/* Supported Test Type */}
              <FormInput
                name="supportedTest"
                label="modals.addInstrument.supportedTestType"
                type="select"
                value={formData.supportedTest}
                error={errors.supportedTest}
                required={true}
                placeholder="modals.addInstrument.selectTestType"
                onChange={handleInputChange}
                options={testTypes.map(test => ({
                  value: test.id,
                  label: `${test.id} - ${test.name}`
                }))}
                disabled={loading.testTypes}
              />

              {/* Supported Reagents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('modals.addInstrument.supportedReagents')} 
                  <span className="text-red-500">*</span>
                </label>
                <div className={`max-h-48 overflow-y-auto border rounded-md p-3 ${
                  errors.supportedReagents ? 'border-red-500' : 'border-gray-300'
                } ${loading.reagents ? 'opacity-50' : ''}`}>
                  
                  {loading.reagents ? (
                    <p className="text-gray-500 text-sm">
                      {t('modals.addInstrument.loadingReagents')}
                    </p>
                  ) : reagents.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      {t('modals.addInstrument.noReagentsAvailable')}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {reagents.map((reagent) => (
                        <label key={reagent.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg border border-gray-200">
                          <input
                            type="checkbox"
                            checked={formData.supportedReagents.includes(reagent.id)}
                            onChange={() => handleReagentChange(reagent.id)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={loading.reagents}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-sm">{reagent.name}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                reagent.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {reagent.quantity} {reagent.unit}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-1 space-y-1">
                              <div>Lot: {reagent.lot_number} • Mfg: {reagent.manufacturer}</div>
                              <div>Expires: {formatDate(reagent.expiry_date)} • Storage: {reagent.location}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {errors.supportedReagents && (
                  <p className="text-red-500 text-xs mt-1">{errors.supportedReagents}</p>
                )}
                {formData.supportedReagents.length > 0 && (
                  <p className="text-green-600 text-xs mt-1">
                    {t('modals.addInstrument.reagentsSelected', { count: formData.supportedReagents.length })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={CLASS_NAMES.MODAL.FOOTER}>
          <button
            onClick={handleCancel}
            disabled={saving}
            className={CLASS_NAMES.BUTTON.SECONDARY}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitDisabled}
            className={CLASS_NAMES.BUTTON.PRIMARY}
          >
            {saving && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>
              {saving ? t('modals.addInstrument.creating') : 
               isFormLoading ? t('modals.addInstrument.loadingData') : t('modals.addInstrument.createInstrument')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInstrumentPopup;