import {TaskStateType} from "../App";
import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT, SetTodolistsAT} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/task-api";

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>

const initialTasksState: TaskStateType = {}

export type ActionType =
    RemoveTaskAT
    | AddTaskAT
    | ChangeTaskStatusAT
    | ChangeTaskTitleAT
    | AddTodoListAT
    | RemoveTodoListAT
    | SetTodolistsAT

export const tasksReducer = (state: TaskStateType = initialTasksState, action: ActionType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todoListID]: state[action.todoListID].filter(t => t.id != action.taskId)}
        case 'ADD-TASK':
            return {
                ...state, [action.todoListID]: [{
                    id: v1(),
                    title: action.title,
                    status: TaskStatuses.New,
                    description: '',
                    priority: TaskPriorities.Middle,
                    startDate: '',
                    deadline: '',
                    order: 0,
                    addedDate: '',
                    todoListId: action.todoListID
                }, ...state[action.todoListID]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(el => el.id === action.taskId ? {
                    ...el,
                    status: action.status
                } : el)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todoListID]: state[action.todoListID].map(el => el.id === action.taskId ? {
                    ...el,
                    title: action.title
                } : el)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolistId]: []}
        case 'REMOVE-TODOLIST':
            let tasksStateCopy = {...state}
            delete tasksStateCopy[action.id]
            return tasksStateCopy
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }

        default:
            return state
    }
}
export const removeTaskAC = (id: string, todoListID: string) => {
    return {
        type: 'REMOVE-TASK',
        taskId: id, todoListID
    } as const
}
export const addTaskAC = (title: string, todoListID: string) => {
    return {
        type: 'ADD-TASK',
        title, todoListID
    } as const
}

export const changeTaskStatusAC = (id: string, status: TaskStatuses, todoListID: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId: id, status, todoListID
    } as const
}

export const changeTaskTitleAC = (id: string, title: string, todoListID: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId: id, title, todoListID
    } as const
}


