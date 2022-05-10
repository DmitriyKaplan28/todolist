import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import styles from './Todolist.module.css'

import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, Checkbox, IconButton, List, ListItem} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';



export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todoListID: string
    title: string
    tasks: Array<TaskType>
    removeTask: (todoListID: string, taskId: string) => void
    removeTodoList: (todoListID: string) => void
    changeTodoListFilter: (todoListID: string, value: FilterValuesType) => void
    changeTodoListTitle: (todoListID: string, title: string) => void
    addTask: (todoListID: string, title: string) => void
    CheckBoxChange: (todoListID: string, currentID: string, checkedValue: boolean) => void
    filter: FilterValuesType
    changeTaskTitle: (todoListID: string, currentID: string, title: string) => void
}

export function Todolist(props: PropsType) {

    const addTask = (title: string) => props.addTask(props.todoListID, title)
    const changeFilterHandler = (filterValue: FilterValuesType) => {
        return () => props.changeTodoListFilter(props.todoListID, filterValue)
    }
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(props.todoListID, title)
    }
    const onClickHandler = (tID: string) => props.removeTask(props.todoListID, tID)

    return <div>
        <h3>
            <EditableSpan title={props.title} setNewTitle={changeTodoListTitle}/>
            {/*<button onClick={() => props.removeTodoList(props.todoListID)}>x</button>*/}
            <IconButton
                size={"small"}
                color={'primary'}
                onClick={() => props.removeTodoList(props.todoListID)}>
                <DeleteIcon/>
            </IconButton>
            {/* <Button name={'x'} callBack={() => props.removeTodoList(props.todoListID)} />*/}
        </h3>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                props.tasks.map(t => {
                    const CheckBoxHandler = (checkedValue: boolean) => {
                        props.CheckBoxChange(props.todoListID, t.id, checkedValue)
                    }
                    const onChangeHandler=(event:ChangeEvent<HTMLInputElement>)=>{
                        CheckBoxHandler(event.currentTarget.checked)
                    }
                    const changeTaskTitle = (title: string) => {
                        props.changeTaskTitle(props.todoListID, t.id, title)
                    }
                    return <ListItem key={t.id}>
                        <Checkbox
                            size={"small"}
                            color={"primary"}
                            checked={t.isDone}
                            onChange={onChangeHandler}/>
                       {/* <CheckBox isDone={t.isDone} callBack={CheckBoxHandler}/>*/}
                        <EditableSpan title={t.title} setNewTitle={changeTaskTitle}/>
                        {/*<button onClick={() => onClickHandler(t.id)}>x</button>*/}
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
