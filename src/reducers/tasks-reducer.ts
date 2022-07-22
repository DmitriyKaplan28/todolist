import {TaskStateType} from "../App";
import {AddTodoListAT, RemoveTodoListAT, SetTodolistsAT, ThunkDispatch} from "./todolists-reducer";
import {taskAPI, TaskAPIType, TaskStatuses} from "../api/task-api";
import {AppRootStateType} from "../state/store";
import {setAppStatusAC} from "./app-reducer";

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>
type SetTasksAT = ReturnType<typeof setTasksAC>

const initialTasksState: TaskStateType = {}

export type TasksActionsType = RemoveTaskAT
    | AddTaskAT
    | ChangeTaskStatusAT
    | ChangeTaskTitleAT
    | AddTodoListAT
    | RemoveTodoListAT
    | SetTodolistsAT
    | SetTasksAT

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
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {
                    ...el,
                    status: action.status
                } : el)
            }
        case 'CHANGE-TASK-TITLE':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(el => el.id === action.taskId ? {
                    ...el,
                    title: action.title
                } : el)
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
export const removeTaskAC = (id: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        taskId: id, todolistId
    } as const
}
export const addTaskAC = (task: TaskAPIType)=> {
    return {type: 'ADD-TASK', task} as const
}
export const changeTaskStatusAC = (id: string, status: TaskStatuses, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        taskId: id, status, todolistId
    } as const
}
export const changeTaskTitleAC = (id: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        taskId: id, title, todolistId
    } as const
}
export const setTasksAC = (tasks: TaskAPIType[], todolistId: string) => ({
    type: 'SET-TASKS',
    tasks,
    todolistId
} as const)


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
        taskAPI.deleteTask(todolistId,taskId)
            .then(() => {
                dispatch(removeTaskAC(taskId,todolistId));
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const addTaskTC = (title: string, todolistId: string) => {
    return (dispatch: ThunkDispatch) => {
        taskAPI.createTask(todolistId,title)
            .then((res) => {
                dispatch(addTaskAC(res.data.data.item));
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const updateTaskStatusTC = (taskId: string, todolistId: string,status:TaskStatuses) => {
    return (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistId].find(t => {
            return t.id === taskId
        })
        if (task) {
            taskAPI.updateTask(todolistId, taskId, {
                title: task.title,
                description: task.description,
                status: status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            })
                .then(() => {
                    dispatch(changeTaskStatusAC(taskId, status, todolistId))
                })
        }
    }
}
export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string) => {
    return (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistId].find(t => {
            return t.id === taskId
        })
        if (task) {
            taskAPI.updateTask(todolistId, taskId, {
                title: title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            })
                .then(() => {
                    dispatch(changeTaskTitleAC(taskId, title, todolistId))
                })
        }
    }
}