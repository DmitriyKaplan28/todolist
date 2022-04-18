import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import styles from './Todolist.module.css'
import {Button} from "./components/Button";
import {CheckBox} from "./components/CheckBox";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: string) => void
    changeFilter: (value: FilterValuesType) => void
    addTask: (title: string) => void
    checkBoxChange: (currentID: string, checkedValue: boolean) => void
    filter: FilterValuesType
}

export function Todolist(props: PropsType) {

    let [title, setTitle] = useState("")
    const [error, setError] = useState(false)

    const addTask = () => {
        if (title.trim() !== '') {
            props.addTask(title.trim());
            setTitle("");
        } else {
            setError(true)
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            addTask();
        }
    }

    const onAllClickHandler = () => props.changeFilter("all");
    const onActiveClickHandler = () => props.changeFilter("active");
    const onCompletedClickHandler = () => props.changeFilter("completed");

    /*const CheckBoxChangeHandler = (tID: string, checkedValue: boolean) => {
        props.checkBoxChange(tID, checkedValue)
    }*/
    /*const CheckBoxChangeHandler =(tID: string, checkedValue:boolean) => {
        props.checkBoxChange(tID, checkedValue)
    }
*/
    const changeFilterHandler = (filterValue: FilterValuesType) => {
        props.changeFilter(filterValue)
    }
    const onClickHandler = (tID: string) => props.removeTask(tID);


    return <div>
        <h3>{props.title}</h3>
        <div>

            <input
                className={error ? styles.error : ''}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
            />
            <button onClick={addTask}>+</button>

        </div>
        {error && <div className={styles.errorMessage}>Title is required!</div>}
        <ul>
            {
                props.tasks.map(t => {

                    /*const onClickHandler = () => props.removeTask(t.id)*/
                    const CheckBoxChangeHandler =(checkedValue:boolean) => {
                        props.checkBoxChange(t.id, checkedValue)
                    }
                    return <li key={t.id}>
                        <CheckBox isDone={t.isDone} callBack={CheckBoxChangeHandler}/>
                        {/*<input type="checkbox" checked={t.isDone}
                               onChange={(event) => CheckBoxChangeHandler(t.id, event.currentTarget.checked)}/>*/}
                        <span>{t.title}</span>
                        <button onClick={() => onClickHandler(t.id)}>x</button>
                    </li>
                })
            }
        </ul>
        <div>
            {/*<button className={props.filter === "all" ? styles.activeFilter : ''} onClick={onAllClickHandler}>All</button>
            <button className={props.filter === "active" ? styles.activeFilter : ''} onClick={onActiveClickHandler}>Active</button>
            <button className={props.filter === "completed" ? styles.activeFilter : ''} onClick={onCompletedClickHandler}>Completed</button>*/}

            <Button className={props.filter === "all" ? styles.activeFilter : ''} name={'all'}
                    callBack={() => changeFilterHandler('all')}/>
            <Button className={props.filter === "active" ? styles.activeFilter : ''} name={'active'}
                    callBack={() => changeFilterHandler('active')}/>
            <Button className={props.filter === "completed" ? styles.activeFilter : ''} name={'completed'}
                    callBack={() => changeFilterHandler('completed')}/>
        </div>
    </div>
}
