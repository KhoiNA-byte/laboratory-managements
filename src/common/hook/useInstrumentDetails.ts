import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Instrument } from '../../store/types';
import { API_ENDPOINTS, CALIBRATION_CONFIG, STATUS_CONFIG } from '../../constants/instruments/instrumentDetail';

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

interface LoadingState {
  testTypes: boolean;
  reagents: boolean;
}

export const useInstrumentDetails = (instrument: Instrument | null) => {
  const { t, i18n } = useTranslation();
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [reagents, setReagents] = useState<Reagent[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ testTypes: false, reagents: false });

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!instrument) return;

    try {
      setLoading({ testTypes: true, reagents: true });

      const [testTypesResult, reagentsResult] = await Promise.allSettled([
        fetch(API_ENDPOINTS.TEST_TYPES).then(res => res.ok ? res.json() : Promise.reject('Test types failed')),
        fetch(API_ENDPOINTS.REAGENTS).then(res => res.ok ? res.json() : Promise.reject('Reagents failed')),
      ]);

      setTestTypes(testTypesResult.status === 'fulfilled' && Array.isArray(testTypesResult.value) ? testTypesResult.value : []);
      setReagents(reagentsResult.status === 'fulfilled' && Array.isArray(reagentsResult.value) ? reagentsResult.value : []);

    } catch (error) {
      console.error('Error fetching instrument details:', error);
    } finally {
      setLoading({ testTypes: false, reagents: false });
    }
  }, [instrument]);

  // Status helper functions
  const getStatusConfig = useCallback((status: string) => {
    return Object.values(STATUS_CONFIG).find(config => config.value === status) || STATUS_CONFIG.INACTIVE;
  }, []);

  const getCalibrationStatus = useCallback((instrument: Instrument) => {
    const daysUntilCalibration = getDaysUntilCalibration(instrument);
    const isDueSoon = daysUntilCalibration <= CALIBRATION_CONFIG.WARNING_THRESHOLD;
    
    return {
      isDueSoon,
      daysUntilCalibration,
      status: isDueSoon ? CALIBRATION_CONFIG.STATUS.DUE_SOON : CALIBRATION_CONFIG.STATUS.ON_TRACK,
    };
  }, []);

  const getDaysUntilCalibration = useCallback((instrument: Instrument) => {
    const calibrationDate = new Date(instrument.nextCalibration);
    const today = new Date();
    const diffTime = calibrationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);

  // Data formatting
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return t('modals.instrumentDetails.invalidDate');
    }
  }, [i18n.language, t]);

  // Data filtering
  const getTestTypeInfo = useCallback(() => {
    if (!instrument?.supportedTest) return null;
    return testTypes.find(test => test.id === instrument.supportedTest);
  }, [instrument, testTypes]);

  const getSelectedReagents = useCallback(() => {
    if (!instrument?.supportedReagents?.length) return [];
    return reagents.filter(reagent => 
      instrument.supportedReagents?.includes(reagent.id)
    );
  }, [instrument, reagents]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // State
    testTypes,
    reagents,
    loading,
    
    // Computed values
    testTypeInfo: getTestTypeInfo(),
    selectedReagents: getSelectedReagents(),
    calibrationStatus: instrument ? getCalibrationStatus(instrument) : null,
    daysUntilCalibration: instrument ? getDaysUntilCalibration(instrument) : 0,
    
    // Helper functions
    getStatusConfig,
    formatDate,
  };
};