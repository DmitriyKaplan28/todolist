import React, {useCallback, useEffect} from 'react';
import './App.css';
import AddItemForm from "./components/AddItemForm";
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodolistTC,
    fetchTodolistsTC,
    TodolistType,
} from "./reducers/todolists-reducer";
import {AppRootStateType, useAppDispatch} from "./state/store";
import {useSelector} from "react-redux";
import {Todolist} from "./Todolist";
import {TaskAPIType} from "./api/task-api";
import {RequestStatusType} from "./reducers/app-reducer";


export type TaskStateType = {
    [todoListID: string]: TaskAPIType[]
}

function App() {

    const todoLists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const dispatch = useAppDispatch();

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [])

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    }, [])

    return (
        <div className="App">
            <AppBar position="static">
                {status === 'loading' && <LinearProgress color={'secondary'}/>}
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
                    {
                        todoLists.map(tl => {

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
            </Container>
        </div>
    );
}

export default App;
