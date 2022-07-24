import {TaskStateType} from "../App";
import {AddTodoListAT, RemoveTodoListAT, SetTodolistsAT, ThunkDispatch} from "./todolists-reducer";
import {taskAPI, TaskAPIType, UpdateDomainTaskModelType, UpdateTaskType} from "../api/task-api";
import {AppRootStateType} from "../state/store";
import {setAppStatusAC} from "./app-reducer";
import {AxiosError} from "axios";

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>

type SetTasksAT = ReturnType<typeof setTasksAC>
type UpdateTaskAT = ReturnType<typeof updateTaskAC>

const initialTasksState: TaskStateType = {}

export type TasksActionsType = RemoveTaskAT
    | AddTaskAT
    | AddTodoListAT
    | RemoveTodoListAT
    | SetTodolistsAT
    | SetTasksAT
    | UpdateTaskAT

export const tasksReducer = (state: TaskStateType = initialTasksState, action: TasksActionsType): TaskStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)}
        case 'ADD-TASK':
            const stateCopy = {...state}
            //const tasks = stateCopy[action.task.todoListId];
            //const newTasks = [action.task, ...tasks];
            stateCopy[action.task.todoListId] = [action.task, ...{...state}[action.task.todoListId]];
            return stateCopy;
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
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
        case 'SET-TASKS':
            return {...state, [action.todolistId]: [...action.tasks]}
        default:
            return state
    }
}
export const removeTaskAC = (id: string, todolistId: string) =>  ({type: 'REMOVE-TASK', taskId: id, todolistId} as const)
export const addTaskAC = (task: TaskAPIType) => ({type: 'ADD-TASK', task} as const)
export const setTasksAC = (tasks: TaskAPIType[], todolistId: string) => ({type: 'SET-TASKS', tasks, todolistId} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)

export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        taskAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId));
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const removeTaskTC = (taskId: string, todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        taskAPI.deleteTask(todolistId, taskId)
            .then(() => {
                dispatch(removeTaskAC(taskId, todolistId));
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const addTaskTC = (title: string, todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        taskAPI.createTask(todolistId, title)
            .then((res) => {
                dispatch(addTaskAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
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
            ...domainModel
        }

        taskAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    if (res.data.messages.length) {
                        //dispatch(setAppErrorAc(res.data.messages[0]))
                    } else {
                        //dispatch(setAppErrorAc('Some error'))
                    }
                    dispatch(setAppStatusAC('failed'))
                }
            })
            .catch((err: AxiosError) => {
                //handleServerNetworkError(err.message, dispatch)
                // dispatch(setAppErrorAc(err.message))
                // dispatch(setAppStatusAc('failed'))
            })
    }