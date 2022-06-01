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
import App from "./App";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./reducers/tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed";
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [todoListID: string]: TaskType[]
}

function AppWithReducer() {
    const todoListID_1 = v1()
    const todoListID_2 = v1()
    const [todoLists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todoListID_1, title: 'What to learn', filter: 'all'},
        {id: todoListID_2, title: 'What to buy', filter: 'all'},
    ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer,{
        [todoListID_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
        ],
        [todoListID_2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Meat", isDone: true},
            {id: v1(), title: "3rd thing here", isDone: false},
            {id: v1(), title: "Bread", isDone: false},
        ],
    })


    function removeTask(todoListID: string, id: string) {
        dispatchToTasks(removeTaskAC(id, todoListID));
    }
    function addTask(todoListID: string, title: string) {
        dispatchToTasks(addTaskAC(title, todoListID));
    }
    const CheckBoxChange = (todoListID: string, currentID: string, checkedValue: boolean) => {
        dispatchToTasks(changeTaskStatusAC(currentID, checkedValue, todoListID))
    }
    const changeTaskTitle = (todoListID: string, currentID: string, title: string) => {
        dispatchToTasks(changeTaskTitleAC(currentID, title, todoListID))
    }

    function changeTodoListFilter(todoListID: string, value: FilterValuesType) {
        dispatchToTodolists(ChangeTodoListFilterAC(todoListID, value))
    }
    function changeTodoListTitle(todoListID: string, title: string) {
        dispatchToTodolists(ChangeTodoListTitlerAC(todoListID, title))
    }
    const removeTodoList = (todoListID: string) => {
        const action = RemoveTodoListAC(todoListID)
        dispatchToTodolists(action)
        dispatchToTasks(action)
    }
    const addTodoList = (title: string) => {
        const action = AddTodoListAC(title)
        dispatchToTodolists(action)
        dispatchToTasks(action)
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
                    <Todolist

                        todoListID={tl.id}
                        title={tl.title}
                        filter={tl.filter}
                        tasks={tasksForTodolist}

                        removeTodoList={removeTodoList}
                        removeTask={removeTask}
                        changeTodoListFilter={changeTodoListFilter}
                        addTask={addTask}
                        CheckBoxChange={CheckBoxChange}
                        changeTaskTitle={changeTaskTitle}
                        changeTodoListTitle={changeTodoListTitle}
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

export default App;
