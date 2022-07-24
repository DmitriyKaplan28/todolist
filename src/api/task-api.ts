import axios, {AxiosResponse} from 'axios'
import {ResponseType} from "./todolist-api";

export type TaskAPIType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgent = 3,
    Later = 4
}


type ResponseTasksType = {
    items: TaskAPIType[]
    error: string
    totalCount: number
}

export type UpdateTaskType = {
    title: string
    description: string
    status: TaskStatuses
    priority: number
    startDate: string | null
    deadline: string | null
}

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/todo-lists/',
    withCredentials: true,
    headers: {
        'API-KEY': '3d16c705-9d76-4149-af9f-e3f3ed45edd2'
    }
})

export const taskAPI = {
    getTasks(todolistId: string) {
        return instance.get<ResponseTasksType>(`${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskAPIType }>>>(`${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskType) {
        return instance.put<UpdateTaskType, AxiosResponse<ResponseType<{ item: TaskAPIType }>>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}
