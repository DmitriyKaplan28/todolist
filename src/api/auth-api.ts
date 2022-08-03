//api
import {instance, ResponseType} from "./todolist-api";
import {AxiosResponse} from "axios";

export const authAPI = {
    login(payload: LoginParamsType) {
        return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId: number }>>>(`auth/login`, payload)
    },
    me() {
        return instance.get <ResponseType<MeResponseType>>('auth/me')
    }
}

//types

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: boolean
}
type MeResponseType = {
    id: number
    email: string
    login: string
}