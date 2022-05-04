import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import styles from './Todolist.module.css'
import {Button} from "./components/Button";
import {CheckBox} from "./components/CheckBox";
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";

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

    const addTask = (title:string) => props.addTask(props.todoListID, title)
    const changeFilterHandler = (filterValue: FilterValuesType) => {
        props.changeTodoListFilter(props.todoListID, filterValue)
    }
    const changeTodoListTitle = (title:string) => {
        props.changeTodoListTitle(props.todoListID, title)
    }
    const onClickHandler = (tID: string) => props.removeTask(props.todoListID, tID)

    return <div>
        <h3>
            <EditableSpan title={props.title} setNewTitle={changeTodoListTitle} />
            <Button name={'x'} callBack={() => props.removeTodoList(props.todoListID)} />
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                props.tasks.map(t => {
                    const CheckBoxHandler=(checkedValue:boolean)=>{
                        props.CheckBoxChange(props.todoListID, t.id, checkedValue)
                    }
                    const changeTaskTitle = (title:string) => {
                        props.changeTaskTitle(props.todoListID, t.id, title)
                    }
                    return <li key={t.id}>
                        <CheckBox isDone={t.isDone} callBack={CheckBoxHandler}/>
                        <EditableSpan title={t.title} setNewTitle={changeTaskTitle}/>
                        <button onClick={() => onClickHandler(t.id)}>x</button>
                    </li>
                })
            }
        </ul>
        <div>

            <Button name={'all'} callBack={() => changeFilterHandler('all')}
                    className={props.filter === 'all' ? styles.activeFilter : ''}/>
            <Button name={'active'} callBack={() => changeFilterHandler('active')}
                    className={props.filter === 'active' ? styles.activeFilter : ''}/>
            <Button name={'completed'} callBack={() => changeFilterHandler('completed')}
                    className={props.filter === 'completed' ? styles.activeFilter : ''}/>
        </div>
    </div>
}
