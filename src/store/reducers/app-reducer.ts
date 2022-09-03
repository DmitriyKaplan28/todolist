import {Dispatch} from "redux";
import {authAPI} from "../../api/auth-api";
import {setIsLoggedInAC} from "./auth-reducer";

const initialAppState: initialAppStateType = {
    status: 'idle',
    error: null,
    isInitialized: false,
}

export const appReducer = (state: initialAppStateType = initialAppState, action: AppActionsType): initialAppStateType => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

//actions
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({type: 'APP/SET-INITIALIZED', isInitialized} as const)

//thunks
export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}));
            dispatch(setIsInitializedAC(true));
        } else {
            console.log('How come we end up here?')
        }
    })
        .finally(() => dispatch(setIsInitializedAC(true)))
}


//types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type initialAppStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
export type AppActionsType = SetAppStatusActionType
    | SetAppErrorActionType
    | SetIsInitializedActionType
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>