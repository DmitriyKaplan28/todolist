import {todolistAPI, TodolistAPIType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialTodolistsState: Array<TodolistType> = []

const slice = createSlice({
    name: 'todolists',
    initialState: initialTodolistsState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state.splice(index, -1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistAPIType }>) {
            state.push({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, value: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].filter = action.payload.value
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].title = action.payload.title
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistAPIType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            state[index].entityStatus = action.payload.entityStatus
        },
    },
})

export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC
} = slice.actions

export const todolistsReducer = slice.reducer
/*(todolists
:
Array < TodolistType > = initialTodolistsState, action
:
TodolistActionsType
):
Array < TodolistType >
=>
{
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
}*/

//actions
/*export const removeTodolistAC = (id: string) =>
    ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistAPIType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistFilterAC = (id: string, value: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id, value} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id, title} as const)
export const setTodolistsAC = (todolists: TodolistAPIType[]) =>
    ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id, entityStatus} as const)*/

//thunks
export const fetchTodolistsTC = () => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))

    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC({todolists: res.data}));
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))

    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todolist: res.data.data.item}));
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))

    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({id: todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const updateTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))

    todolistAPI.updateTodolist(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({id: todolistId, title}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
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
/*export type TodolistActionsType = RemoveTodoListAT
    | AddTodoListAT
    | SetTodolistsAT
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>*/
