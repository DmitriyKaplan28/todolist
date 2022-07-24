import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import EditableSpan from "../EditableSpan/EditableSpan";
import DeleteIcon from "@material-ui/icons/Delete";
import {removeTaskTC, updateTaskTC} from "../../state/reducers/tasks-reducer";

import {TaskAPIType, TaskStatuses} from "../../api/task-api";
import {useAppDispatch} from "../../state/store";

type TasksType = {
    task: TaskAPIType,
    todolistID: string
}

export const Task = React.memo((props: TasksType) => {
    const dispatch = useAppDispatch()

    const onClickHandler = useCallback(() => dispatch(removeTaskTC(props.task.id, props.todolistID)), [props.task.id, props.todolistID])
    const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = event.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.InProgress
        dispatch(updateTaskTC(props.task.id, {status: newIsDoneValue}, props.todolistID))
    }, [props.task.id, props.todolistID])
    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTC(props.task.id, {title}, props.todolistID,))
    }, [props.task.id, props.todolistID])

    return (
        <ListItem key={props.task.id}>
            <Checkbox
                size={"small"}
                color={"primary"}
                checked={props.task.status === TaskStatuses.Completed}
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
