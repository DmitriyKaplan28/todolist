import {v1} from "uuid";
import {todolistAPI, TodolistAPIType} from "../api/todolist-api";
import {Dispatch} from "redux";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = TodolistAPIType & {
    filter: FilterValuesType
}

export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
export type AddTodoListAT = ReturnType<typeof addTodoListAC>
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type ActionType = RemoveTodoListAT
    | AddTodoListAT
    | SetTodolistsAT
    | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof setTodolistsAC>

type ThunkDispatch = Dispatch<ActionType>

const initialTodolistsState: Array<TodolistType> = []

export const todolistsReducer = (todolists: Array<TodolistType> = initialTodolistsState, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{id: action.todolistId, title: action.title, filter: "all", addedDate: '', order: 0}, ...todolists]
        case "CHANGE-TODOLIST-FILTER":
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.value} : tl)
        case "CHANGE-TODOLIST-TITLE":
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({
                ...tl,
                filter: 'all'
            }))
        }
        default:
            return todolists
    }
}

export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodoListAC = (title: string) => ({type: 'ADD-TODOLIST', title, todolistId: v1()} as const)
export const changeTodoListFilterAC = (id: string, value: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id, value} as const)
export const changeTodoListTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const setTodolistsAC = (todolists: TodolistAPIType[]) =>  ({type: 'SET-TODOLISTS', todolists} as const)

export const fetchTodolistsTC = () => {
    return (dispatch: ThunkDispatch) => {
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}