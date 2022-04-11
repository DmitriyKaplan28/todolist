import React, {ChangeEvent,KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    // changeFilter: (value: FilterValuesType) => void
    addTask: (newTitle: string) => void
}

export function Todolist(props: PropsType) {

    let [filter, setFilter] = useState<FilterValuesType>("all");

    let tasksForTodolist = props.tasks;

    if (filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.isDone === false);
    }
    if (filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.isDone === true);
    }

    function changeFilter(value: FilterValuesType) {
        setFilter(value);
    }



    let [newTitle, setNewTitle] = useState('')
    console.log(newTitle)

    const onChangeHandler=(event:ChangeEvent<HTMLInputElement>)=>{
        setNewTitle(event.currentTarget.value)
    }
    const addTaskHandler = () => {
        props.addTask(newTitle)
        setNewTitle('')
    }
    const onKeyPressHandler=(e: KeyboardEvent<HTMLInputElement>)=>{
        // if(e.charCode===13){
        //     addTaskHandler()
        // }
        if(e.key==='Enter'){
            addTaskHandler()
        }
    }

    // const changeFilterHandlerAll=()=>{
    //     props.changeFilter("all")
    // }
    // const changeFilterHandlerActive=()=>{
    //     props.changeFilter("active")
    // }

    const changeFilterHandlerUniversal=(value:FilterValuesType)=>{
        changeFilter(value)
    }

    const removeTaskHandler=(tID:string)=>{
        props.removeTask(tID)
    }

    return <div>
        <h3>{props.title}</h3>
        <div>
            {/*<input onChange={(event) => setNewTitle(event.currentTarget.value)}/>*/}
            <input value={newTitle} onChange={onChangeHandler} onKeyPress={onKeyPressHandler}/>
            <button onClick={addTaskHandler}>+</button>
            {/*<button onClick={()=>props.addTask(newTitle)}>+</button>*/}
        </div>
        <ul>
            {
                tasksForTodolist.map(t =>{
                    // const removeTaskHandler=()=>{
                    //     props.removeTask(t.id)
                    // }
                    return(
                        <li key={t.id}>
                            <input type="checkbox" checked={t.isDone}/>
                            <span>{t.title}</span>
                            <button onClick={()=>removeTaskHandler(t.id)}>x</button>
                            {/*<button onClick={() => {props.removeTask(t.id)}}>x</button>*/}
                        </li>
                    )
                })
            }
        </ul>
        <div>
            {/*<button onClick={() => {props.changeFilter("all")}}>All</button>*/}
            <button onClick={()=>changeFilterHandlerUniversal('all')}>All</button>
            <button onClick={()=>changeFilterHandlerUniversal('active')}>Active</button>
            <button onClick={()=>changeFilterHandlerUniversal('completed')}>Completed</button>
        </div>
    </div>
}
