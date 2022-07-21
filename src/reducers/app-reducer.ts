export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialAppState = {
    status: 'idle' as RequestStatusType
}

export type initialAppStateType = typeof initialAppState
export type AppActionsType = ReturnType<typeof setAppStatusAC>

export const appReducer = (state: initialAppStateType = initialAppState, action: AppActionsType) => {
    switch (action.type) {
        case "APP/SET-STATUS":
            return {...state, status: action.status}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)