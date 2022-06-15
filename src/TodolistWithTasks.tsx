import React, {useCallback} from 'react';
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button,  IconButton, List} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {TodoListType} from "./AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC} from "./reducers/tasks-reducer";
import {ChangeTodoListFilterAC, ChangeTodoListTitlerAC, RemoveTodoListAC} from "./reducers/todolists-reducer";
import {Task} from "./components/Task";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodoListType
}

export const TodolistWithTasks = React.memo(({todolist}: PropsType) => {
    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolist.id])

    if (todolist.filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (todolist.filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }
    const dispatch = useDispatch()

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, todolist.id));
    }, [todolist.id])

    const removeTodoList = useCallback(() => {
        dispatch(RemoveTodoListAC(todolist.id))
    }, [todolist.id])
    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(ChangeTodoListTitlerAC(todolist.id, title))
    }, [todolist.id])

    const onAllClickHandler = useCallback(() => dispatch(ChangeTodoListFilterAC(todolist.id, "all")),[todolist.id])
    const onActiveClickHandler = useCallback(() => dispatch(ChangeTodoListFilterAC(todolist.id, "active")),[todolist.id])
    const onCompletedClickHandler = useCallback(() => dispatch(ChangeTodoListFilterAC(todolist.id, "completed")),[todolist.id])

    return <div>
        <h3>
            <EditableSpan title={todolist.title} setNewTitle={changeTodoListTitle}/>
            <IconButton
                size={"small"}
                color={'primary'}
                onClick={removeTodoList}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <List>
            {tasks.map(t => <Task task={t}
                                  todolistID={todolist.id}/>)}
        </List>
        <div>

            <Button
                size={"small"}
                color={todolist.filter === "all" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={onAllClickHandler}>All
            </Button>
            <Button
                size={"small"}
                color={todolist.filter === "active" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={onActiveClickHandler}>Active
            </Button>
            <Button
                size={"small"}
                color={todolist.filter === "completed" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={onCompletedClickHandler}>Completed
            </Button>
        </div>
    </div>
})
