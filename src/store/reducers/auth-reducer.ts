import {setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {authAPI, LoginParamsType} from "../../api/auth-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {FieldsErrorsType} from "../../api/todolist-api";

export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType,{ rejectValue: { errors: string[], fieldsErrors: FieldsErrorsType | undefined} }  >('auth/login', async (param: LoginParamsType, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

    try {
        const res = await authAPI.login(param)

        if (res.data.resultCode === 0) {
            //thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}))
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true};
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue({
                errors: res.data.messages,
                fieldsErrors: res.data.fieldsErrors
            })
        }
    } catch (err) {

        handleServerNetworkError(err, thunkAPI.dispatch)
        return {isLoggedIn: false};
    }
})

/*export const login_TC = (data: LoginParamsType) => (dispatch: Dispatch) => {

    dispatch(setAppStatusAC({status: 'loading'}))

    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedIn: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((err: AxiosError) => {
            handleServerNetworkError(err, dispatch)
        })
}*/


//reducer
const initialAuthState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ isLoggedIn: boolean }>) {
            state.isLoggedIn = action.payload.isLoggedIn;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
        })
    }
})

export const {setIsLoggedInAC} = slice.actions

export const authReducer = slice.reducer


// thunks


export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({isLoggedIn: false}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}