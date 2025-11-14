import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Instrument, Reagent, FlaggingRule } from '../types'

interface InstrumentState {
    instruments: Instrument[]
    reagents: Reagent[]
    flaggingRules: FlaggingRule[]
    loading: boolean
    error: string | null
}

const initialState: InstrumentState = {
    instruments: [],
    reagents: [],
    flaggingRules: [],
    loading: false,
    error: null,
}

const instrumentSlice = createSlice({
    name: 'instruments',
    initialState,
    reducers: {
        fetchInstrumentsStart: (state) => {
            state.loading = true
            state.error = null
        },
        fetchInstrumentsSuccess: (state, action: PayloadAction<Instrument[]>) => {
            state.loading = false
            state.instruments = action.payload
            state.error = null
        },
        fetchInstrumentsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        addInstrument: (state, action: PayloadAction<Instrument>) => {
            state.instruments.push(action.payload)
        },
        updateInstrument: (state, action: PayloadAction<Instrument>) => {
            const index = state.instruments.findIndex(instrument => instrument.id === action.payload.id)
            if (index !== -1) {
                state.instruments[index] = action.payload
            }
        },
        deleteInstrument: (state, action: PayloadAction<string>) => {
            state.instruments = state.instruments.filter(instrument => instrument.id !== action.payload)
        },
        fetchReagentsStart: (state) => {
            state.loading = true
            state.error = null
        },
        fetchReagentsSuccess: (state, action: PayloadAction<Reagent[]>) => {
            state.loading = false
            state.reagents = action.payload
            state.error = null
        },
        fetchReagentsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        addReagent: (state, action: PayloadAction<Reagent>) => {
            state.reagents.push(action.payload)
        },
        updateReagent: (state, action: PayloadAction<Reagent>) => {
            const index = state.reagents.findIndex(reagent => reagent.id === action.payload.id)
            if (index !== -1) {
                state.reagents[index] = action.payload
            }
        },
        deleteReagent: (state, action: PayloadAction<string>) => {
            state.reagents = state.reagents.filter(reagent => reagent.id !== action.payload)
        },
        fetchFlaggingRulesStart: (state) => {
            state.loading = true
            state.error = null
        },
        fetchFlaggingRulesSuccess: (state, action: PayloadAction<FlaggingRule[]>) => {
            state.loading = false
            state.flaggingRules = action.payload
            state.error = null
        },
        fetchFlaggingRulesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },
        addFlaggingRule: (state, action: PayloadAction<FlaggingRule>) => {
            state.flaggingRules.push(action.payload)
        },
        updateFlaggingRule: (state, action: PayloadAction<FlaggingRule>) => {
            const index = state.flaggingRules.findIndex(rule => rule.id === action.payload.id)
            if (index !== -1) {
                state.flaggingRules[index] = action.payload
            }
        },
        deleteFlaggingRule: (state, action: PayloadAction<string>) => {
            state.flaggingRules = state.flaggingRules.filter(rule => rule.id !== action.payload)
        },
    },
})

export const {
    fetchInstrumentsStart,
    fetchInstrumentsSuccess,
    fetchInstrumentsFailure,
    addInstrument,
    updateInstrument,
    deleteInstrument,
    fetchReagentsStart,
    fetchReagentsSuccess,
    fetchReagentsFailure,
    addReagent,
    updateReagent,
    deleteReagent,
    fetchFlaggingRulesStart,
    fetchFlaggingRulesSuccess,
    fetchFlaggingRulesFailure,
    addFlaggingRule,
    updateFlaggingRule,
    deleteFlaggingRule,
} = instrumentSlice.actions
export default instrumentSlice.reducer
