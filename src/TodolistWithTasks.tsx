import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import styles from './Todolist.module.css'

import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {TaskStateType, TodoListType} from "./AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/tasks-reducer";



export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodoListType
}

export function TodolistWithTasks({todolist}, props: PropsType) {
    const tasks = useSelector<AppRootStateType, Array<TaskStateType>>(state => state.tasks[todolost.id])
    const dispatch = useDispatch();

    if (todolist.filter === "active") {
        tasks = tasks.filter(t => t.isDone === false);
    }
    if (todolist.filter === "completed") {
        tasks = tasks.filter(t => t.isDone === true);
    }


    const dispatch = useDispatch()

    function addTask(todoListID: string, title: string) {
        dispatch(addTaskAC(title, todolist.id));
    }
    function removeTask(todoListID: string, id: string) {
        dispatch(removeTaskAC(id, todolist.id));
    }


    const changeTaskTitle = (todoListID: string, currentID: string, title: string) => {
        dispatch(changeTaskTitleAC(currentID, title, todolist.id))
    }

    const changeFilterHandler = (filterValue: FilterValuesType) => {
        return () => props.changeTodoListFilter(todolist.todoListID, filterValue)
    }
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(todolist.todoListID, title)
    }
    const onClickHandler = (tID: string) => props.removeTask(todolist.todoListID, tID)

    return <div>
        <h3>
            <EditableSpan title={todolist.title} setNewTitle={changeTodoListTitle}/>
            <IconButton
                size={"small"}
                color={'primary'}
                onClick={() => props.removeTodoList(todolist.todoListID)}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                tasks.map(t => {
                    const CheckBoxHandler = (todoListID: string, currentID: string, checkedValue: boolean) => {
                        dispatch(changeTaskStatusAC(currentID, checkedValue, todolist.id))
                    }
                    const onChangeHandler=(event:ChangeEvent<HTMLInputElement>)=>{
                        CheckBoxHandler(event.currentTarget.checked)
                    }
                    const changeTaskTitle = (todoListID: string, currentID: string, title: string) => {
                        dispatch(changeTaskTitleAC(currentID, title, todolist.id))
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
                            onClick={() => onClickHandler(t.id)}>
                            <DeleteIcon/>
                        </IconButton>
                    </ListItem>
                })
            }
        </List>
        <div>

            <Button
                size={"small"}
                color={props.filter === "all" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={changeFilterHandler("all")}>All
            </Button>
            <Button
                size={"small"}
                color={props.filter === "active" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={changeFilterHandler("active")}>Active
            </Button>
            <Button
                size={"small"}
                color={props.filter === "completed" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={changeFilterHandler("completed")}>Completed
            </Button>


            {/*<Button name={'all'} callBack={() => changeFilterHandler('all')}
                    className={props.filter === 'all' ? styles.activeFilter : ''}>All</Button>
            <Button name={'active'} callBack={() => changeFilterHandler('active')}
                    className={props.filter === 'active' ? styles.activeFilter : ''}/>
            <Button name={'completed'} callBack={() => changeFilterHandler('completed')}
                    className={props.filter === 'completed' ? styles.activeFilter : ''}/>*/}
        </div>
    </div>
}
