import {authAPI} from "../../api/auth-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "../../utils/error-utils";


// thunks
export const initializeAppTC = createAsyncThunk('app/initialize', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await authAPI.me()

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}));
            //thunkAPI.dispatch(setIsInitializedAC({isInitialized: true}));
            return {isInitialized: true}
        } else {
            console.log('How come we end up here?')
        }
    } catch (err) {

        handleServerNetworkError(err, thunkAPI.dispatch)
        return {isLoggedIn: false};
    } finally {
        thunkAPI.dispatch(setIsInitializedAC({isInitialized: true}))
    }
})


//reducer
const initialAppState: initialAppStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
}

const slice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status;
        },

        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error;
        },

        setIsInitializedAC(state, action: PayloadAction<{ isInitialized: boolean }>) {
            state.isInitialized = action.payload.isInitialized;
        }
    },
})

export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC} = slice.actions

export const appReducer = slice.reducer


//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type initialAppStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}