import {Provider} from 'react-redux';

import React from 'react'
import {combineReducers, legacy_createStore} from 'redux'
import {v1} from 'uuid'
    ;
import {AppRootStateType} from "../state/store";
import {tasksReducer} from "../reducers/tasks-reducer";
import {todolistsReducer} from "../reducers/todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/task-api";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: "What to learn", filter: "all", addedDate: '', order: 0},
        {id: 'todolistId2', title: "What to buy", filter: "all", addedDate: '', order: 0}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(),
                title: "CSS",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1"
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1"
            },
            {
                id: v1(),
                title: "React",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1"
            }
        ],
        ['todolistId2']: [
            {
                id: v1(),
                title: "bread",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2"
            },
            {
                id: v1(),
                title: "milk",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2"
            },
            {
                id: v1(),
                title: "tea",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2"
            }
        ]
    },
    app: {
        status: 'idle'
    }
};

export const storyBookStore = legacy_createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => {
    return <Provider store={storyBookStore}>{storyFn()}</Provider>
}