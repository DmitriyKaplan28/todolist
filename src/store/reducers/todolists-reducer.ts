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
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1)
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistAPIType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, value: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].filter = action.payload.value
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].title = action.payload.title
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: TodolistAPIType[] }>) {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
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
                dispatch(removeTodolistAC({todolistId: todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(changeTodolistEntityStatusAC({todolistId: todolistId, entityStatus: 'loading'}))
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
                dispatch(changeTodolistTitleAC({todolistId: todolistId, title}))
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