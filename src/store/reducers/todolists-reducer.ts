import {todolistAPI, TodolistAPIType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {ThunkDispatchType} from "../store";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialTodolistsState: Array<TodolistType> = []

export const todolistsReducer = (todolists: Array<TodolistType> = initialTodolistsState, action: TodolistActionsType): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...todolists]
        case "CHANGE-TODOLIST-FILTER":
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.value} : tl)
        case "CHANGE-TODOLIST-TITLE":
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case "CHANGE-TODOLIST-ENTITY-STATUS":
            return todolists.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        default:
            return todolists
    }
}

//actions
export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistAPIType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistFilterAC = (id: string, value: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, value} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const setTodolistsAC = (todolists: TodolistAPIType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const)

//thunks
export const fetchTodolistsTC = () => (dispatch: ThunkDispatchType) => {

    dispatch(setAppStatusAC('loading'))

    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data));
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTodolistTC = (title: string) => (dispatch: ThunkDispatchType) => {

    dispatch(setAppStatusAC('loading'))

    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: ThunkDispatchType) => {

    dispatch(setAppStatusAC('loading'))

    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const updateTodolistTitleTC = (todolistId: string, title: string) => (dispatch: ThunkDispatchType) => {

    dispatch(setAppStatusAC('loading'))

    todolistAPI.updateTodolist(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = TodolistAPIType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}
export type RemoveTodoListAT = ReturnType<typeof removeTodolistAC>
export type AddTodoListAT = ReturnType<typeof addTodolistAC>
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type TodolistActionsType = RemoveTodoListAT
    | AddTodoListAT
    | SetTodolistsAT
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
