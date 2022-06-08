import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import EditableSpan from "./EditableSpan";
import DeleteIcon from "@material-ui/icons/Delete";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../reducers/tasks-reducer";
import {useDispatch} from "react-redux";
import {TaskType} from "../TodolistWithTasks";

type TasksType = {
    task: TaskType,
    todolistID: string
}

export const Tasks = React.memo((props: TasksType) => {
    const dispatch = useDispatch()

    const onClickHandler = useCallback(() => dispatch(removeTaskAC(props.task.id, props.todolistID)),[props.task.id, props.todolistID])
    const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = event.currentTarget.checked
        dispatch(changeTaskStatusAC(props.task.id, newIsDoneValue, props.todolistID))
    },[props.task.id, props.todolistID])
    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(props.task.id, title, props.todolistID))
    },[props.task.id, props.todolistID])

    return (
        <ListItem key={props.task.id}>
            <Checkbox
                size={"small"}
                color={"primary"}
                checked={props.task.isDone}
                onChange={onChangeHandler}/>
            <EditableSpan title={props.task.title} setNewTitle={changeTaskTitle}/>
            <IconButton
                size={"small"}
                color={'secondary'}
                onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    );
})
