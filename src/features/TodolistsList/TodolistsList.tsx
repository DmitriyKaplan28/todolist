import React, {useCallback, useEffect} from 'react';
import {addTodolistTC, fetchTodolistsTC, TodolistType} from "../../state/reducers/todolists-reducer";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "../../components/Todolist/Todolist";
import {AppRootStateType, useAppDispatch} from "../../state/store";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

type TodolistListPropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<TodolistListPropsType> = ({demo = false}) => {

    const todolists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const isLoggedIn = useSelector((state: AppRootStateType) => state.auth.isLoggedIn)

    const dispatch = useAppDispatch();

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [])

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodolistsTC())
    }, [])

    if (!isLoggedIn) {
        return <Navigate to="/login"/>
    }

    return <>
        <Grid container style={{padding: "20px 0 px"}}>
            <AddItemForm addItem={addTodoList}/>
        </Grid>
        <Grid container spacing={5}>
            {todolists.map(tl => {
                return <Grid item key={tl.id}>
                    <Paper style={{padding: "10px"}}>
                        <Todolist
                            todolist={tl}
                        />
                    </Paper>
                </Grid>
            })
            }
        </Grid>
    </>
}
