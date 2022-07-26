import React from 'react';
import './App.css';
import {
    AppBar,
    Button,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {AppRootStateType} from "../state/store";
import {useSelector} from "react-redux";
import {RequestStatusType} from "../state/reducers/app-reducer";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

function App() {

    const status = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)

    return (
        <div className="App">
            <ErrorSnackbar/>
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
                <TodolistsList />
            </Container>
        </div>
    );
}

export default App;
