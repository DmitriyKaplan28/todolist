import React, {useCallback, useEffect} from 'react';
import {addTodolistTC, fetchTodolistsTC} from "../../store/reducers/todolists-reducer";
import {Grid, Paper} from "@material-ui/core";
import AddItemForm from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "../Todolist/Todolist";
import {useAppDispatch} from "../../store/store";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn, selectTodolists} from "../../store/reducers/selectors";


type TodolistListPropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<TodolistListPropsType> = ({demo = false}) => {

    const todolists = useSelector(selectTodolists)
    const isLoggedIn = useSelector(selectIsLoggedIn)

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