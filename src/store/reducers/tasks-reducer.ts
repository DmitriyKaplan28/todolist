import {addTodolistTC, fetchTodolistsTC, removeTodolistTC,} from "./todolists-reducer";
import {
    taskAPI,
    TaskAPIType,
    UpdateDomainTaskModelType,
    UpdateTaskType
} from "../../api/task-api";
import {AppRootStateType} from "../store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


//thunks
export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await taskAPI.getTasks(todolistId)

        if (!res.data.error) {
            const tasks = res.data.items
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {tasks, todolistId}
        } else {
            thunkAPI.dispatch(setAppErrorAC({error: res.data.error}))
            thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})

export const removeTaskTC = createAsyncThunk('tasks/removeTask', async (param: {
    taskId: string,
    todolistId: string
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await taskAPI.deleteTask(param.todolistId, param.taskId)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {taskId: param.taskId, todolistId: param.todolistId};
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})

export const addTaskTC = createAsyncThunk('tasks/addTask', async (param: {
    title: string, todolistId: string,
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await taskAPI.createTask(param.todolistId, param.title)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {task: res.data.data.item}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param: {
    taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const state = thunkAPI.getState() as AppRootStateType
        const task = state.tasks[param.todolistId].find((t: { id: string; }) => t.id === param.taskId)

        if (!task) {
            console.warn('task not found in the store')
            return
        }

        const apiModel: UpdateTaskType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            entityStatus: task.entityStatus,
            ...param.domainModel
        }

        const res = await taskAPI.updateTask(param.todolistId, param.taskId, apiModel)

        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {
                taskId: param.taskId,
                model: param.domainModel,
                todolistId: param.todolistId
            }
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (err) {
        handleServerNetworkError(err, thunkAPI.dispatch)
    }
})


//reducer

const tasksSlice = createSlice({
        name: 'tasks',

        initialState: {} as TaskStateType,

        reducers: {},

        extraReducers: (builder) => {
            builder.addCase(addTodolistTC.fulfilled, (state, action) => {
                if (action.payload) {
                    state[action.payload.todolist.id] = []
                }
            });
            builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
                action.payload && delete state[action.payload.todolistId]
            });
            builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            });
            builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
                if (action.payload)
                    state[action.payload.todolistId] = action.payload.tasks
            });
            builder.addCase(removeTaskTC.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId];
                    const index = tasks.findIndex(t => action.payload && t.id === action.payload.taskId)
                    if (index > -1) {
                        tasks.splice(index, 1)
                    }
                }
            });
            builder.addCase(addTaskTC.fulfilled, (state, action) => {
                action.payload && state[action.payload.task.todoListId].unshift(action.payload.task);
            });
            builder.addCase(updateTaskTC.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId];
                    const index = tasks.findIndex(t => action.payload && t.id === action.payload.taskId)
                    if (index > -1) {
                        tasks[index] = {...tasks[index], ...action.payload.model}
                    }
                }
            });
        }
    }
)

export const tasksReducer = tasksSlice.reducer


//types
export type TaskStateType = {
    [todoListID: string]: TaskType[]
}
export type TaskType = TaskAPIType & {
    entityStatus: RequestStatusType
}