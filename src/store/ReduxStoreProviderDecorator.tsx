import {Provider} from 'react-redux';
import React from 'react'
import {combineReducers, legacy_createStore} from 'redux'
import {AppRootStateType} from "./store";
import {tasksReducer} from "./reducers/tasks-reducer";
import {todolistsReducer} from "./reducers/todolists-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {

};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}