import React from 'react';
import { useTranslation } from 'react-i18next';
import { useInstrumentDetails } from '../../common/hook/useInstrumentDetails';
import { DetailSection, DetailField, StatusBadge } from '../../components/Instruments/detailSection';
import { CLASS_NAMES, FIELD_CONFIG, CALIBRATION_CONFIG } from '../../constants/instruments/instrumentDetail';
import { Instrument } from '../../store/types';

interface InstrumentDetailsPopupProps {
  instrument: Instrument | null;
  onClose: () => void;
  onEdit: (instrument: Instrument) => void;
}

const InstrumentDetailsPopup: React.FC<InstrumentDetailsPopupProps> = ({ 
  instrument, 
  onClose,
  onEdit 
}) => {
  const { t } = useTranslation();
  
  const {
    testTypes,
    reagents,
    loading,
    testTypeInfo,
    selectedReagents,
    calibrationStatus,
    daysUntilCalibration,
    getStatusConfig,
    formatDate,
  } = useInstrumentDetails(instrument);

  if (!instrument) return null;

  const handleEdit = () => {
    onEdit(instrument);
    onClose();
  };

  // Helper để render giá trị với unit
  const renderFieldValue = (field: any) => {
    const value = instrument[field.key as keyof Instrument] as string;
    
    if (field.unit) {
      return value ? `${value} ${field.unit}` : null;
    }
    
    return value;
  };

  return (
    <div className={CLASS_NAMES.MODAL.OVERLAY}>
      <div className={CLASS_NAMES.MODAL.CONTAINER}>
        
        {/* Header */}
        <div className={CLASS_NAMES.MODAL.HEADER}>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t('modals.instrumentDetails.title')}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {t('modals.instrumentDetails.subtitle', { name: instrument.name })}
            </p>
          </div>
          <button onClick={onClose} className={CLASS_NAMES.BUTTON.CLOSE}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Section 1: Basic Information */}
          <DetailSection title={t('modals.instrumentDetails.basicInformation')}>
            <div className={CLASS_NAMES.GRID.BASIC}>
              {FIELD_CONFIG.BASIC_INFO.map(field => (
                <DetailField
                  key={field.key}
                  label={t(field.translationKey)}
                  value={
                    field.isStatus ? (
                      <StatusBadge 
                        status={instrument[field.key as keyof Instrument] as string} 
                        getStatusConfig={getStatusConfig}
                      />
                    ) : (
                      instrument[field.key as keyof Instrument] as string
                    )
                  }
                />
              ))}
            </div>
          </DetailSection>

          {/* 🔹 THÊM SECTION MỚI: Technical Specifications */}
          <DetailSection title={t('modals.instrumentDetails.technicalSpecifications')}>
            <div className={CLASS_NAMES.GRID.BASIC}>
              {FIELD_CONFIG.TECHNICAL_SPECS.map(field => (
                <DetailField
                  key={field.key}
                  label={t(field.translationKey)}
                  value={renderFieldValue(field)}
                  unit={field.unit}
                />
              ))}
            </div>
          </DetailSection>

          {/* Section 2: Calibration Information */}
          <DetailSection title={t('modals.instrumentDetails.calibrationInformation')}>
            <div className={CLASS_NAMES.GRID.BASIC}>
              <DetailField
                label={t('modals.instrumentDetails.nextCalibration')}
                value={formatDate(instrument.nextCalibration || '')}
              />
              <DetailField
                label={t('modals.instrumentDetails.calibrationStatus')}
                value={
                  <div className="flex items-center space-x-2">
                    <span className={`${CLASS_NAMES.STATUS_BADGE} ${calibrationStatus?.status.color}`}>
                      {t(calibrationStatus?.status.translationKey || '')}
                    </span>
                    {calibrationStatus?.isDueSoon && (
                      <span className="text-sm text-red-600">
                        ({t('modals.instrumentDetails.daysRemaining', { days: daysUntilCalibration })})
                      </span>
                    )}
                  </div>
                }
              />
            </div>
          </DetailSection>

          {/* Section 3: Testing Configuration */}
          <DetailSection title={t('modals.instrumentDetails.testingConfiguration')}>
            <div className={CLASS_NAMES.GRID.CONFIG}>
              
              {/* Supported Test Type */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">
                  {t('modals.instrumentDetails.supportedTestType')}
                </label>
                {loading.testTypes ? (
                  <p className="text-gray-500 text-sm">
                    {t('modals.instrumentDetails.loadingTestType')}
                  </p>
                ) : testTypeInfo ? (
                  <div className={CLASS_NAMES.INFO_CARD}>
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-900">{testTypeInfo.id}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {t('modals.instrumentDetails.testType')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{testTypeInfo.name}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {t('modals.instrumentDetails.noTestTypeSelected')}
                  </p>
                )}
              </div>

              {/* Supported Reagents */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">
                  {t('modals.instrumentDetails.supportedReagents', { count: selectedReagents.length })}
                </label>
                {loading.reagents ? (
                  <p className="text-gray-500 text-sm">
                    {t('modals.instrumentDetails.loadingReagents')}
                  </p>
                ) : selectedReagents.length > 0 ? (
                  <div className={CLASS_NAMES.REAGENT_LIST}>
                    {selectedReagents.map((reagent) => (
                      <div key={reagent.id} className={CLASS_NAMES.INFO_CARD}>
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900">{reagent.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            reagent.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reagent.quantity} {reagent.unit}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <div>
                            {t('modals.instrumentDetails.lot')}: {reagent.lot_number} • 
                            {t('modals.instrumentDetails.mfg')}: {reagent.manufacturer}
                          </div>
                          <div>
                            {t('modals.instrumentDetails.expires')}: {formatDate(reagent.expiry_date)} • 
                            {t('modals.instrumentDetails.storage')}: {reagent.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {t('modals.instrumentDetails.noReagentsSelected')}
                  </p>
                )}
              </div>
            </div>
          </DetailSection>

          {/* Calibration Alert */}
          {calibrationStatus?.isDueSoon && (
            <div className={CLASS_NAMES.ALERT.CONTAINER}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={CLASS_NAMES.ALERT.ICON}>
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">
                      {instrument.calibrationDue ? 
                        t('modals.instrumentDetails.calibrationDue') : 
                        t('modals.instrumentDetails.calibrationDueSoon')
                      }
                    </p>
                    <p className="text-sm text-red-600">
                      {t('modals.instrumentDetails.nextCalibrationLabel')} {formatDate(instrument.nextCalibration || '')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-800">
                    {t('modals.instrumentDetails.daysRemaining', { days: daysUntilCalibration })}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Instrument ID */}
          <div className="pt-6 border-t border-gray-200">
            <DetailField
              label={t('modals.instrumentDetails.instrumentId')}
              value={<code className="font-mono text-sm">{instrument.id}</code>}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={CLASS_NAMES.MODAL.FOOTER}>
          <button onClick={onClose} className={CLASS_NAMES.BUTTON.SECONDARY}>
            {t('common.close')}
          </button>
          <button onClick={handleEdit} className={CLASS_NAMES.BUTTON.PRIMARY}>
            {t('instrumentsPage.table.editInstrument')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstrumentDetailsPopup;