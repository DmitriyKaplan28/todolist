import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';
import AddItemForm from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";

export type FilterValuesType = "all" | "active" | "completed";
export type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [todoListID: string]: TaskType[]
}

function App() {
    const todoListID_1 = v1()
    const todoListID_2 = v1()
    const [todoLists, setTodoLists] = useState<TodoListType[]>([
        {id: todoListID_1, title: 'What to learn', filter: 'all'},
        {id: todoListID_2, title: 'What to buy', filter: 'all'},
    ])
    const [tasks, setTasks] = useState<TaskStateType>({
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
        setTasks({...tasks, [todoListID]: tasks[todoListID].filter(t => t.id != id)});
    }

    function addTask(todoListID: string, title: string) {
        let newTask: TaskType = {id: v1(), title: title, isDone: false};
        setTasks({...tasks, [todoListID]: [newTask, ...tasks[todoListID]]});
    }

    const CheckBoxChange = (todoListID: string, currentID: string, checkedValue: boolean) => {
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].map(el => el.id === currentID ? {...el, isDone: checkedValue} : el)
        })
    }
    const changeTaskTitle = (todoListID: string, currentID: string, title: string) => {
        setTasks({
            ...tasks,
            [todoListID]: tasks[todoListID].map(el => el.id === currentID ? {...el, title} : el)
        })
    }

    function changeTodoListFilter(todoListID: string, value: FilterValuesType) {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter: value} : tl))
    }

    function changeTodoListTitle(todoListID: string, title: string) {
        setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, title} : tl))
    }

    const removeTodoList = (todoListID: string) => {
        setTodoLists(todoLists.filter(tl => tl.id !== todoListID))
        delete tasks[todoListID]
    }
    const addTodoList = (title: string) => {
        const newTodoListID = v1()
        const newTodoList: TodoListType = {
            id: newTodoListID,
            title: title,
            filter: 'all'
        }
        setTodoLists([...todoLists, newTodoList])
        setTasks({...tasks, [newTodoListID]: []})
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
                    variant={'outlined'} style={{padding: "20px"}}>
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
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container>
                    {todoListsForRender}
                </Grid>
            </Container>
        </div>
    );
}

export default App;
