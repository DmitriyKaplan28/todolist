import {AddTodoListAT, RemoveTodoListAT, SetTodolistsAT} from "./todolists-reducer";
import {taskAPI, TaskAPIType, UpdateDomainTaskModelType, UpdateTaskType} from "../../api/task-api";
import {AppRootStateType, ThunkDispatchType} from "../store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";
import {AxiosError} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialTasksState: TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialTasksState, action: TasksActionsType): TaskStateType => {
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
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
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
        case 'SET-TASKS':
            return {...state, [action.todolistId]: [...action.tasks]}
        default:
            return state
    }
}

//actions
export const removeTaskAC = (id: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId: id, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)

//thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: ThunkDispatchType) => {

    dispatch(setAppStatusAC('loading'))

    taskAPI.getTasks(todolistId)
        .then((res) => {
            if (!res.data.error) {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId));
                dispatch(setAppStatusAC('succeeded'))
            } else {
                //handleServerAppError(res.data,dispatch)
                dispatch(setAppErrorAC(res.data.error))
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: ThunkDispatchType) => {

    dispatch(setAppStatusAC('loading'))

    taskAPI.deleteTask(todolistId, taskId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(taskId, todolistId));
                dispatch(setAppStatusAC('succeeded'))
                dispatch(updateTaskAC(taskId, {entityStatus: 'loading'} ,todolistId))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: ThunkDispatchType) => {

    dispatch(setAppStatusAC('loading'))

    taskAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: ThunkDispatchType, getState: () => AppRootStateType) => {

        dispatch(setAppStatusAC('loading'))

        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        if (!task) {
            console.warn('task not found in the state')
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
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
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
export type TaskStateType = {
    [todoListID: string]: TaskType[]
}
export type TaskType = TaskAPIType & {
    entityStatus: RequestStatusType
}
export type TasksActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | AddTodoListAT
    | RemoveTodoListAT
    | SetTodolistsAT
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>