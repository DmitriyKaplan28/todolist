import {tasksReducer} from "../reducers/tasks-reducer";
import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {todolistsReducer} from "../reducers/todolists-reducer";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store;