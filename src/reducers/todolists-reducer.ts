import {v1} from "uuid";
import {TodolistAPIType} from "../api/todolist-api";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = TodolistAPIType & {
    filter: FilterValuesType
}
export type RemoveTodoListAT = ReturnType<typeof RemoveTodoListAC>
export type AddTodoListAT = ReturnType<typeof AddTodoListAC>
export type ActionType = RemoveTodoListAT | AddTodoListAT | ReturnType<typeof ChangeTodoListFilterAC>| ReturnType<typeof ChangeTodoListTitleAC>

const initialTodolistsState: Array<TodolistType> = []

export const todolistsReducer = (todolists: Array<TodolistType> = initialTodolistsState, action: ActionType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{id: action.todolistId, title: action.title, filter: "all", addedDate:'', order: 0}, ...todolists]
        case "CHANGE-TODOLIST-FILTER":
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.value} : tl)
        case "CHANGE-TODOLIST-TITLE":
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        default:
            return todolists
    }
}

export const RemoveTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const AddTodoListAC = (title: string) => ({type: 'ADD-TODOLIST', title, todolistId: v1()} as const)
export const ChangeTodoListFilterAC = (id: string, value: FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id, value} as const)
export const ChangeTodoListTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)