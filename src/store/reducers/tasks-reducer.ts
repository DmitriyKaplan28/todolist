import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsAC,
} from "./todolists-reducer";
import {taskAPI, TaskAPIType, UpdateDomainTaskModelType, UpdateTaskType} from "../../api/task-api";
import {AppRootStateType} from "../store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialTasksState: TaskStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialTasksState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            console.log(action.payload.task.todoListId)
            state[action.payload.task.todoListId].unshift(action.payload.task);
        },
        setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todolistId]
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        });
    }
})

export const {
    removeTaskAC,
    addTaskAC,
    setTasksAC,
    updateTaskAC,
} = slice.actions

export const tasksReducer = slice.reducer
/*(state: TaskStateType = initialTasksState, action: any): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case addTodolistAC.type:
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            let tasksStateCopy = {...state}
            delete tasksStateCopy[action.id]
            return tasksStateCopy
        case setTodolistsAC.type: {
            const stateCopy = {...state}
            action.payload.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS':
            return {...state, [action.todolistId]: [...action.tasks]}
        default:
            return state
    }
}
*/
//actions
/*export const removeTaskAC = (id: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId: id, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)*/

//thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))

    taskAPI.getTasks(todolistId)
        .then((res) => {
            if (!res.data.error) {
                const tasks = res.data.items
                dispatch(setTasksAC({tasks, todolistId}));
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                //handleServerAppError(res.data,dispatch)
                dispatch(setAppErrorAC({error: res.data.error}))
                dispatch(setAppStatusAC({status: 'failed'}))
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))

    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({taskId, todolistId}));
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(updateTaskAC({taskId, model: {entityStatus: 'loading'}, todolistId}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))
    taskAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                console.log(res.data.data.item)
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {

        dispatch(setAppStatusAC({status: 'loading'}))

        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

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
            ...domainModel
        }

        taskAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC({taskId, model: domainModel, todolistId})
                    dispatch(action)
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
export type TaskStateType = {
    [todoListID: string]: TaskType[]
}
export type TaskType = TaskAPIType & {
    entityStatus: RequestStatusType
}
/*
export type TasksActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | AddTodoListAT
    | RemoveTodoListAT
    | SetTodolistsAT
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>*/
