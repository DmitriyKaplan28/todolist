import {tasksReducer} from "./reducers/tasks-reducer";
import {AnyAction, combineReducers} from "redux";
import {todolistsReducer} from "./reducers/todolists-reducer";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {appReducer} from "./reducers/app-reducer";
import {authReducer} from "./reducers/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";


//store
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
})

export const useAppDispatch = () => useDispatch<AppThunkType>()


//types
export type AppRootStateType = ReturnType<typeof rootReducer>
type AppThunkType = ThunkDispatch<AppRootStateType, void, AnyAction>

// @ts-ignore
window.store = store;