import axios from 'axios'

export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '3d16c705-9d76-4149-af9f-e3f3ed45edd2'
    }
})

//api
export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistAPIType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistAPIType }>>('todo-lists', {title: title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
    },
}

//types
export type TodolistAPIType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type FieldsErrorsType = [{ error: string, field: string }];
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: FieldsErrorsType
    data: D
}