// src/components/InstrumentDetailPopup.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Instrument } from '../../store/types'

interface InstrumentDetailsPopupProps {
  instrument: Instrument | null;
  onClose: () => void;
  onEdit: (instrument: Instrument) => void;
}

interface TestType {
  id: string;
  name: string;
}

interface Reagent {
  id: string;
  name: string;
  lot_number: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  location: string;
}

const InstrumentDetailsPopup: React.FC<InstrumentDetailsPopupProps> = ({ 
  instrument, 
  onClose,
  onEdit 
}) => {
  const { t, i18n } = useTranslation();
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [loading, setLoading] = useState({
    testTypes: false,
    reagents: false
  });

  // Fetch test types and reagents từ API
  useEffect(() => {
    const fetchData = async () => {
      if (!instrument) return;

      try {
        setLoading(prev => ({ ...prev, testTypes: true, reagents: true }));

        // Fetch test types
        const testTypesPromise = fetch('https://69085724b49bea95fbf32f71.mockapi.io/test-type')
          .then(response => {
            if (!response.ok) throw new Error(`Test types API error: ${response.status}`);
            return response.json();
          });

        // Fetch reagents
        const reagentsPromise = fetch('https://69085724b49bea95fbf32f71.mockapi.io/reagents')
          .then(response => {
            if (!response.ok) throw new Error(`Reagents API error: ${response.status}`);
            return response.json();
          });

        const [testTypesResult, reagentsResult] = await Promise.allSettled([
          testTypesPromise,
          reagentsPromise
        ]);

        // Xử lý test types
        if (testTypesResult.status === 'fulfilled') {
          setTestTypes(Array.isArray(testTypesResult.value) ? testTypesResult.value : []);
        }

        // Xử lý reagents
        if (reagentsResult.status === 'fulfilled') {
          setReagents(Array.isArray(reagentsResult.value) ? reagentsResult.value : []);
        }

      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setLoading(prev => ({ ...prev, testTypes: false, reagents: false }));
      }
    };

    fetchData();
  }, [instrument]);

  if (!instrument) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Active':
        return t('common.active');
      case 'Maintenance':
        return t('modals.instrumentDetails.maintenance');
      case 'Inactive':
        return t('common.inactive');
      default:
        return status;
    }
  };

  // Tính số ngày còn lại đến lần hiệu chuẩn tiếp theo
  const getDaysUntilCalibration = () => {
    const calibrationDate = new Date(instrument.nextCalibration);
    const today = new Date();
    const diffTime = calibrationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return t('modals.instrumentDetails.invalidDate');
    }
  };

  // Lấy thông tin test type
  const getTestTypeInfo = () => {
    if (!instrument.supportedTest) return null;
    return testTypes.find(test => test.id === instrument.supportedTest);
  };

  // Lấy thông tin reagents đã chọn
  const getSelectedReagents = () => {
    if (!instrument.supportedReagents || !instrument.supportedReagents.length) return [];
    return reagents.filter(reagent => 
      instrument.supportedReagents?.includes(reagent.id)
    );
  };

  const testTypeInfo = getTestTypeInfo();
  const selectedReagents = getSelectedReagents();
  const daysUntilCalibration = getDaysUntilCalibration();
  const isCalibrationDueSoon = daysUntilCalibration <= 7;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white z-10 flex justify-between items-start p-6 border-b rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t('modals.instrumentDetails.title')}</h2>
            <p className="text-gray-600 text-sm mt-1">{t('modals.instrumentDetails.subtitle', { name: instrument.name })}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Section 1: Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('modals.instrumentDetails.basicInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.instrumentName')}</label>
                <p className="text-gray-900 font-medium">{instrument.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.model')}</label>
                <p className="text-gray-900 font-medium">{instrument.model}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.serialNumber')}</label>
                <p className="text-gray-900 font-medium">{instrument.serialNumber}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.status')}</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(instrument.status)}`}>
                  {translateStatus(instrument.status)}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.location')}</label>
                <p className="text-gray-900 font-medium">{instrument.location}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.manufacturer')}</label>
                <p className="text-gray-900 font-medium">{instrument.manufacturer}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Calibration Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('modals.instrumentDetails.calibrationInformation')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.nextCalibration')}</label>
                <p className="text-gray-900 font-medium">{formatDate(instrument.nextCalibration)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.calibrationStatus')}</label>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    instrument.calibrationDue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {instrument.calibrationDue ? t('modals.instrumentDetails.dueSoon') : t('modals.instrumentDetails.onTrack')}
                  </span>
                  {isCalibrationDueSoon && (
                    <span className="text-sm text-red-600">
                      ({t('modals.instrumentDetails.daysRemaining', { days: daysUntilCalibration })})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Testing Configuration */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('modals.instrumentDetails.testingConfiguration')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supported Test Type */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">{t('modals.instrumentDetails.supportedTestType')}</label>
                {loading.testTypes ? (
                  <p className="text-gray-500 text-sm">{t('modals.instrumentDetails.loadingTestType')}</p>
                ) : testTypeInfo ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-900">{testTypeInfo.id}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {t('modals.instrumentDetails.testType')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{testTypeInfo.name}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">{t('modals.instrumentDetails.noTestTypeSelected')}</p>
                )}
              </div>

              {/* Supported Reagents */}
              <div>
                <label className="text-sm text-gray-500 block mb-2">
                  {t('modals.instrumentDetails.supportedReagents', { count: selectedReagents.length })}
                </label>
                {loading.reagents ? (
                  <p className="text-gray-500 text-sm">{t('modals.instrumentDetails.loadingReagents')}</p>
                ) : selectedReagents.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {selectedReagents.map((reagent) => (
                      <div key={reagent.id} className="bg-white border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900">{reagent.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            reagent.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {reagent.quantity} {reagent.unit}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <div>{t('modals.instrumentDetails.lot')}: {reagent.lot_number} • {t('modals.instrumentDetails.mfg')}: {reagent.manufacturer}</div>
                          <div>{t('modals.instrumentDetails.expires')}: {formatDate(reagent.expiry_date)} • {t('modals.instrumentDetails.storage')}: {reagent.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">{t('modals.instrumentDetails.noReagentsSelected')}</p>
                )}
              </div>
            </div>
          </div>

          {/* Calibration Alert */}
          {isCalibrationDueSoon && (
            <div className="border rounded-lg p-4 bg-red-50 border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                    <svg 
                      className="w-5 h-5 text-red-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-red-800">
                      {instrument.calibrationDue ? t('modals.instrumentDetails.calibrationDue') : t('modals.instrumentDetails.calibrationDueSoon')}
                    </p>
                    <p className="text-sm text-red-600">
                      {t('modals.instrumentDetails.nextCalibrationLabel')} {formatDate(instrument.nextCalibration)}
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
            <label className="text-sm text-gray-500 block mb-1">{t('modals.instrumentDetails.instrumentId')}</label>
            <p className="text-gray-900 font-mono text-sm">{instrument.id}</p>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-white z-10 flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t('common.close')}
          </button>
          <button
            onClick={() => {
              onEdit(instrument);
              onClose();
            }}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('instrumentsPage.table.editInstrument')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstrumentDetailsPopup;