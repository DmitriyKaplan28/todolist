import {Dispatch} from 'redux';
import {
    setAppErrorAC,
    setAppStatusAC,
} from "../store/reducers/app-reducer";
import {ResponseType} from "../api/todolist-api";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: any, dispatch: Dispatch) => {
    console.log(error)
    dispatch(setAppErrorAC({error: error.message}))
    dispatch(setAppStatusAC({status: 'failed'}))
}