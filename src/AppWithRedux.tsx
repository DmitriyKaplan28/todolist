import React, {useReducer, useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    AddTodoListAC,
    ChangeTodoListFilterAC,
    ChangeTodoListTitlerAC,
    RemoveTodoListAC,
    todolistsReducer
} from "./reducers/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./reducers/tasks-reducer";
import {AppRootStateType} from "./state/store";
import {useDispatch, useSelector} from "react-redux";
import {TodolistWithTasks} from "./TodolistWithTasks";

export type FilterValuesType = "all" | "active" | "completed";
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [todoListID: string]: TaskType[]
}

function AppWithRedux() {
    const todoListID_1 = v1()
    const todoListID_2 = v1()

    const todoLists = useSelector<AppRootStateType, Array<TodoListType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    const dispatch = useDispatch();

    function removeTask(todoListID: string, id: string) {
        dispatch(removeTaskAC(id, todoListID));
    }

    function addTask(todoListID: string, title: string) {
        dispatch(addTaskAC(title, todoListID));
    }

    const CheckBoxChange = (todoListID: string, currentID: string, checkedValue: boolean) => {
        dispatch(changeTaskStatusAC(currentID, checkedValue, todoListID))
    }
    const changeTaskTitle = (todoListID: string, currentID: string, title: string) => {
        dispatch(changeTaskTitleAC(currentID, title, todoListID))
    }

    function changeTodoListFilter(todoListID: string, value: FilterValuesType) {
        dispatch(ChangeTodoListFilterAC(todoListID, value))
    }

    function changeTodoListTitle(todoListID: string, title: string) {
        dispatch(ChangeTodoListTitlerAC(todoListID, title))
    }

    const removeTodoList = (todoListID: string) => {
        dispatch(RemoveTodoListAC(todoListID))
    }
    const addTodoList = (title: string) => {
        dispatch(AddTodoListAC(title))
    }

    const todoListsForRender = todoLists.map(tl => {
        let tasksForTodolist = tasks[tl.id];
        if (tl.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
        }
        if (tl.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
        }

        return (
            <Grid item key={tl.id}>
                <Paper
                    variant={'outlined'} style={{padding: "20px"}} elevation={10}>
                    <TodolistWithTasks
                        todolist={tl}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px 0 px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5}>
                    {todoListsForRender}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
