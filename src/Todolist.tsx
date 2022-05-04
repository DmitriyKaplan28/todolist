import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import styles from './Todolist.module.css'
import {Button} from "./components/Button";
import {CheckBox} from "./components/CheckBox";
import AddItemForm from "./components/AddItemForm";

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
    changeFilter: (todoListID: string, value: FilterValuesType) => void
    addTask: (todoListID: string, title: string) => void
    CheckBoxChange: (todoListID: string, currentID: string, checkedValue: boolean) => void
    filter: FilterValuesType
}

export function Todolist(props: PropsType) {



    const addTask = (title:string) => props.addTask(props.todoListID, title)


    const changeFilterHandler = (filterValue: FilterValuesType) => {
        props.changeFilter(props.todoListID, filterValue)
    }

    const onClickHandler = (tID: string) => props.removeTask(props.todoListID, tID)


    return <div>
        <h3>{props.title}
            <Button name={'x'} callBack={() => props.removeTodoList(props.todoListID)} />
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                props.tasks.map(t => {
                    const CheckBoxHandler=(checkedValue:boolean)=>{
                        props.CheckBoxChange(props.todoListID, t.id, checkedValue)
                    }
                    return <li key={t.id}>
                        <CheckBox isDone={t.isDone} callBack={CheckBoxHandler}/>
                        <span>{t.title}</span>
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
