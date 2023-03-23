import {todolistAPI, TodolistAPIType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


//thunks
export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await todolistAPI.getTodolists()

        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}));
        return {todolists: res.data}
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await todolistAPI.createTodolist(title)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await todolistAPI.deleteTodolist(todolistId)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            thunkAPI.dispatch(changeTodolistEntityStatusAC({
                todolistId: todolistId,
                entityStatus: 'loading'
            }))
            return {todolistId}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})

export const updateTodolistTitleTC = createAsyncThunk('todolists/updateTodolistTitle', async (param: {
    todolistId: string,
    title: string
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await todolistAPI.updateTodolist(param.todolistId, param.title)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId: param.todolistId, title: param.title}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(null)
    }
})


//reducer
const initialTodolistsState: Array<TodolistType> = []

const todolistsSlice = createSlice({
    name: 'todolists',

    initialState: initialTodolistsState,

    reducers: {
        changeTodolistFilterAC(state, action: PayloadAction<{ todolistId: string, value: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].filter = action.payload.value
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ todolistId: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            if (action.payload) {
                return action.payload.todolists.map(tl => ({
                    ...tl,
                    filter: 'all',
                    entityStatus: 'idle'
                }))
            }
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            if (action.payload) {
                state.unshift({
                    ...action.payload.todolist,
                    filter: 'all',
                    entityStatus: 'idle'
                })
            }
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => action.payload && tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1)
            }
        });
        builder.addCase(updateTodolistTitleTC.fulfilled, (state, action) => {
            if (action.payload) {
                const index = state.findIndex(tl => action.payload && tl.id === action.payload.todolistId);
                state[index].title = action.payload.title
            }
        });
    }
})

export const {
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC
} = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer


//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = TodolistAPIType & {
    filter: FilterValuesType,
    entityStatus: RequestStatusType
}