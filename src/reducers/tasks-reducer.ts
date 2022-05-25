import { TaskStateType} from "../App";
import {v1} from "uuid";
import { AddTodoListAT, RemoveTodoListAT} from "./todolists-reducer";

type RemoveTaskAT = ReturnType<typeof removeTaskAC>

/*{
    type: 'REMOVE-TASK'
    taskId: string
    todoListID: string
}*/

type AddTaskAT = ReturnType<typeof addTaskAC>

/*{
    type: 'ADD-TASK'
    title: string
    todoListID: string
}*/

type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>


export type ActionType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT | ChangeTaskTitleAT | AddTodoListAT |RemoveTodoListAT

export const tasksReducer = (state: TaskStateType, action: ActionType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todoListID]: state[action.todoListID].filter(t => t.id != action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.todoListID]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todoListID]]}
        case 'CHANGE-TASK-STATUS':
            return {
                ...state, [action.todoListID]: state[action.todoListID].map(el => el.id === action.taskId ? {...el, isDone: action.isDone} : el)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state, [action.todoListID]: state[action.todoListID].map(el => el.id === action.taskId ? {...el, title: action.title} : el)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolistId]: []}
        case 'REMOVE-TODOLIST':
            let tasksStateCopy = {...state}
            delete tasksStateCopy[action.id]
            return tasksStateCopy
        default:
            throw new Error("I don't understand this type")
    }
}
export const removeTaskAC = (id: string, todoListID: string) => {
    return {
        type: 'REMOVE-TASK',
        taskId: id, todoListID
    } as const
}
export const addTaskAC = (title: string, todoListID: string) => {
    return {type: 'ADD-TASK',
    title, todoListID} as const
}

export const changeTaskStatusAC = (id: string, isDone: boolean, todoListID: string) => {
    return {type: 'CHANGE-TASK-STATUS',
        taskId: id,isDone,todoListID} as const
}

export const changeTaskTitleAC = (id: string, title: string, todoListID: string) => {
    return {type: 'CHANGE-TASK-TITLE',
        taskId: id,title,todoListID} as const
}


