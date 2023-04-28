import {Provider} from 'react-redux';
import React from 'react'
import {combineReducers} from 'redux'
import {tasksReducer} from "./reducers/tasks-reducer";
import {todolistsReducer} from "./reducers/todolists-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {};

/*export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);*/
export const storyBookStore = configureStore({
    reducer: rootReducer,
})

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}