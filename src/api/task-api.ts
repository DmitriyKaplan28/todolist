import axios from 'axios'
import {ResponseType} from "./todolist-api";

type TaskAPIType = {
    description: string
    title: string
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
type ResponseTasksType = {
    items: TaskAPIType[]
    error: string
    totalCount: number
}

export type UpdateTaskType = {
    title: string
    description: string
    status: number
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
        return instance.post<ResponseTasksType>(`${todolistId}/tasks`, {title: title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, updatedTask: UpdateTaskType) {
        return instance.put<ResponseType<TaskAPIType>>(`${todolistId}/tasks/${taskId}`, updatedTask)
    }
}
