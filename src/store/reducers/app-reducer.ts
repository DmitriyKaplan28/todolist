import {Dispatch} from "redux";
import {authAPI} from "../../api/auth-api";
import {setIsLoggedInAC} from "./auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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

//thunks
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({isLoggedIn: true}));
            dispatch(setIsInitializedAC({isInitialized: true}));
        } else {
            console.log('How come we end up here?')
        }
    })
        .finally(() => dispatch(setIsInitializedAC({isInitialized: true})))
}


//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type initialAppStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}