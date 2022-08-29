import {TasksActionsType, tasksReducer} from "./reducers/tasks-reducer";
import {AnyAction, combineReducers, Dispatch} from "redux";
import {TodolistActionsType, todolistsReducer} from "./reducers/todolists-reducer";
import {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {AppActionsType, appReducer} from "./reducers/app-reducer";
import {AuthActionsType, authReducer} from "./reducers/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

//store
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

//export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export const store = configureStore({
    reducer: rootReducer,
})
export const useAppDispatch = () => useDispatch<AppThunkType>()

//types
export type AppRootStateType = ReturnType<typeof rootReducer>
type AppThunkType = ThunkDispatch<AppRootStateType, void, AnyAction>
export type ThunkDispatchType = Dispatch<TodolistActionsType | TasksActionsType | AppActionsType | AuthActionsType>

// @ts-ignore
window.store = store;