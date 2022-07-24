import {TasksActionsType, tasksReducer} from "./reducers/tasks-reducer";
import {AnyAction, applyMiddleware, combineReducers, Dispatch, legacy_createStore} from "redux";
import {TodolistActionsType, todolistsReducer} from "./reducers/todolists-reducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {AppActionsType, appReducer} from "./reducers/app-reducer";

//state
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export const useAppDispatch = () => useDispatch<AppThunkType>()

//types
export type AppRootStateType = ReturnType<typeof rootReducer>
type AppThunkType = ThunkDispatch<AppRootStateType, void, AnyAction>
export type ThunkDispatchType = Dispatch<TodolistActionsType | TasksActionsType | AppActionsType>

// @ts-ignore
window.store = store;