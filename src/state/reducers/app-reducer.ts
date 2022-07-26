export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = string | null

const initialAppState = {
    status: 'idle' as RequestStatusType,
    error: null as ErrorType
}

export const appReducer = (state: initialAppStateType = initialAppState, action: AppActionsType) => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

//actions
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: ErrorType) => ({type: 'APP/SET-ERROR', error} as const)

//types
export type initialAppStateType = typeof initialAppState
export type AppActionsType = ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppErrorAC>