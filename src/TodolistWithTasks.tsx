import React, {ChangeEvent} from 'react';
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {TodoListType} from "./AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/tasks-reducer";
import {ChangeTodoListFilterAC, ChangeTodoListTitlerAC, RemoveTodoListAC} from "./reducers/todolists-reducer";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodoListType
}

export function TodolistWithTasks({todolist}: PropsType) {
    let tasks = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolist.id])

    if (todolist.filter === "active") {
        tasks = tasks.filter(t => !t.isDone);
    }
    if (todolist.filter === "completed") {
        tasks = tasks.filter(t => t.isDone);
    }
    const dispatch = useDispatch()

    const addTask = (title: string) => {
        dispatch(addTaskAC(title, todolist.id));
    }

    const removeTodoList = () => {
        dispatch(RemoveTodoListAC(todolist.id))
    }
    const changeTodoListTitle = (title: string) => {
        dispatch(ChangeTodoListTitlerAC(todolist.id, title))
    }

    const onAllClickHandler = () => dispatch(ChangeTodoListFilterAC(todolist.id, "all"))
    const onActiveClickHandler = () => dispatch(ChangeTodoListFilterAC(todolist.id, "active"))
    const onCompletedClickHandler = () => dispatch(ChangeTodoListFilterAC(todolist.id, "completed"))

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
            {
                tasks.map(t => {

                    const onClickHandler = () => dispatch(removeTaskAC(t.id, todolist.id))
                    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = event.currentTarget.checked
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, todolist.id))
                    }
                    const changeTaskTitle = (title: string) => {
                        dispatch(changeTaskTitleAC(t.id, title, todolist.id))
                    }
                    return <ListItem key={t.id}>
                        <Checkbox
                            size={"small"}
                            color={"primary"}
                            checked={t.isDone}
                            onChange={onChangeHandler}/>
                        <EditableSpan title={t.title} setNewTitle={changeTaskTitle}/>
                        <IconButton
                            size={"small"}
                            color={'secondary'}
                            onClick={onClickHandler}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItem>
                })
            }
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
}
