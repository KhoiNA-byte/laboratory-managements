import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: string
    username: string
    email: string
    role: string
    name?: string
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    token: string | null
    loading: boolean
    error: string | null
    redirectPath: string | null    
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
    redirectPath: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Saga action creators
        loginRequest: (state, action: PayloadAction<{ email: string; password: string }>) => {
            state.loading = true
            state.error = null
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload.user
            state.token = action.payload.token
            state.error = null
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.token = null
            state.error = action.payload
        },
        logoutRequest: (state) => {
            state.loading = true
            state.error = null
        },
        logoutSuccess: (state) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null
            state.token = null
            state.error = null
        },
        logoutFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
        setRedirectPath: (state, action: PayloadAction<string>) => {
            state.redirectPath = action.payload
        },
    },
})

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
    logoutFailure,
    clearError,
    setRedirectPath
} = authSlice.actions
export default authSlice.reducer
