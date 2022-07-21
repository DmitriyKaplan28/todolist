import {tasksReducer} from "../reducers/tasks-reducer";
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {todolistsReducer} from "../reducers/todolists-reducer";
import thunk, {ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";
import {appReducer} from "../reducers/app-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>

type AppThunkType = ThunkDispatch<AppRootStateType, void, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkType>()

// @ts-ignore
window.store = store;