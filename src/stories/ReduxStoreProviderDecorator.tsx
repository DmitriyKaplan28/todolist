import {Provider} from 'react-redux';

import React from 'react'
import {combineReducers, legacy_createStore} from 'redux'
import {v1} from 'uuid'
;
import {AppRootStateType} from "../state/store";
import {tasksReducer} from "../reducers/tasks-reducer";
import {todolistsReducer} from "../reducers/todolists-reducer";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
   /* todolists: [
        {id: 'todolistId1', title: 'What to learn', filter: 'all'},
        {id: 'todolistId2', title: 'What to buy', filter: 'all'}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'React', isDone: false},
            {id: v1(), title: 'Rest API', isDone: false},
            {id: v1(), title: 'GraphQL', isDone: false},
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Pork', isDone: true},
            {id: v1(), title: 'Tomatoes', isDone: true},
            {id: v1(), title: 'Сucumbers', isDone: false},
            {id: v1(), title: 'Bread', isDone: false},
            {id: v1(), title: 'Ketchup', isDone: false},
        ]
    }*/
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}