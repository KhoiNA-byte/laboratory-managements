import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { useCallback } from 'react'
import { 
    ACTION_TYPES, 
    UI_TEXT, 
    INSTRUMENT_STATUS, 
    STATUS_COLORS,
    // Import action creators từ slice
    fetchInstrumentsRequest,
    addInstrumentRequest, 
    deleteInstrumentRequest,
  } from '../constants/instruments/instruments';
  import { Instrument } from '../store/types'; // 🔹 THÊM IMPORT NÀY


// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector)

// Auth hooks
export const useAuth = () => {
    const dispatch = useAppDispatch()
    const auth = useAppSelector((state) => state.auth)

    const login = (credentials: { email: string; password: string }) => {
        dispatch({ type: 'auth/loginRequest', payload: credentials })
    }

    const logout = () => {
        dispatch({ type: 'auth/logoutRequest' })
    }

    const clearError = () => {
        dispatch({ type: 'auth/clearError' })
    }

    return {
        ...auth,
        login,
        logout,
        clearError,
    }
}

// User hooks
export const useUsers = () => {
    const dispatch = useAppDispatch()
    const users = useAppSelector((state) => state.users)

    const getUsers = () => {
        dispatch({ type: 'users/getUsersRequest' })
    }

    const createUser = (userData: any) => {
        dispatch({ type: 'users/createUserRequest', payload: userData })
    }

    const updateUser = (userData: any) => {
        dispatch({ type: 'users/updateUserRequest', payload: userData })
    }

    const deleteUser = (id: string) => {
        dispatch({ type: 'users/deleteUserRequest', payload: id })
    }

    return {
        ...users,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
    }
}

// Patient hooks
export const usePatients = () => {
    const dispatch = useAppDispatch()
    const patients = useAppSelector((state) => state.patients)

    const getPatients = () => {
        dispatch({ type: 'patients/getPatientsRequest' })
    }

    const createPatient = (patientData: any) => {
        dispatch({ type: 'patients/createPatientRequest', payload: patientData })
    }

    const updatePatient = (patientData: any) => {
        dispatch({ type: 'patients/updatePatientRequest', payload: patientData })
    }

    const deletePatient = (id: string) => {
        dispatch({ type: 'patients/deletePatientRequest', payload: id })
    }

    return {
        ...patients,
        getPatients,
        createPatient,
        updatePatient,
        deletePatient,
    }
}

// Test Order hooks
export const useTestOrders = () => {
    const dispatch = useAppDispatch()
    const testOrders = useAppSelector((state) => state.testOrders)

    const getTestOrders = () => {
        dispatch({ type: 'testOrders/getTestOrdersRequest' })
    }

    const createTestOrder = (orderData: any) => {
        dispatch({ type: 'testOrders/createTestOrderRequest', payload: orderData })
    }

    const updateTestOrder = (orderData: any) => {
        dispatch({ type: 'testOrders/updateTestOrderRequest', payload: orderData })
    }

    const deleteTestOrder = (id: string) => {
        dispatch({ type: 'testOrders/deleteTestOrderRequest', payload: id })
    }

    return {
        ...testOrders,
        getTestOrders,
        createTestOrder,
        updateTestOrder,
        deleteTestOrder,
    }
}

// Instrument hooks
export const useInstruments = () => {
    const dispatch = useDispatch();
    const { instruments, loading, error } = useSelector((state: RootState) => state.instruments);
  
    // Actions - SỬ DỤNG ACTION CREATORS TỪ SLICE
    const fetchInstruments = useCallback(() => {
      dispatch(fetchInstrumentsRequest()); // ✅ Dùng action creator
    }, [dispatch]);
  
    const addInstrument = useCallback((instrumentData: Partial<Instrument>) => {
      dispatch(addInstrumentRequest(instrumentData)); // ✅ Dùng action creator
    }, [dispatch]);
  
    const deleteInstrument = useCallback((instrumentId: string) => {
      dispatch(deleteInstrumentRequest(instrumentId)); // ✅ Dùng action creator
    }, [dispatch]);
  
    // Computed values và helper functions giữ nguyên
    const calibrationDueCount = instruments.filter(i => i.calibrationDue).length;
    const activeCount = instruments.filter(i => i.status === INSTRUMENT_STATUS.ACTIVE).length;
    const maintenanceCount = instruments.filter(i => i.status === INSTRUMENT_STATUS.MAINTENANCE).length;
  
    const getStatusColor = useCallback((status: string) => {
      return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS[INSTRUMENT_STATUS.INACTIVE];
    }, []);
  
    const getDeleteConfirmMessage = useCallback((instrumentName: string) => {
      return UI_TEXT.MESSAGES.DELETE_CONFIRM(instrumentName);
    }, []);
  
    return {
      // State
      instruments,
      loading,
      error,
      
      // Actions
      fetchInstruments,
      addInstrument,
      deleteInstrument,
      
      // Computed values
      calibrationDueCount,
      activeCount,
      maintenanceCount,
      
      // Helpers
      getStatusColor,
      getDeleteConfirmMessage,
      
      // Constants
      UI_TEXT,
      INSTRUMENT_STATUS,
    };
  };
