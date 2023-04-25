import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton, ListItem} from "@material-ui/core";
import EditableSpan from "../../components/EditableSpan/EditableSpan";
import DeleteIcon from "@material-ui/icons/Delete";
import {removeTaskTC, TaskType, updateTaskTC} from "../../store/reducers/tasks-reducer";
import {TaskStatuses} from "../../api/task-api";
import {useAppDispatch} from "../../store/store";


type TasksPropsType = {
    task: TaskType
    todolistID: string
}

export const Task = React.memo(({task, todolistID}: TasksPropsType) => {

    const dispatch = useAppDispatch()

    const onClickHandler = useCallback(() => dispatch(removeTaskTC({
        taskId: task.id,
        todolistId: todolistID
    })), [task.id, todolistID])

    const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = event.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.InProgress
        dispatch(updateTaskTC({
            taskId: task.id,
            domainModel: {status: newIsDoneValue},
            todolistId: todolistID,
        }))
    }, [task.id, todolistID])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTC({
            taskId: task.id, domainModel: {title}, todolistId: todolistID,
        }))
    }, [task.id, todolistID])

    return (
        <ListItem key={task.id}>
            <Checkbox
                size={"small"}
                color={"primary"}
                checked={task.status === TaskStatuses.Completed}
                onChange={onChangeHandler}/>
            <EditableSpan title={task.title} setNewTitle={changeTaskTitle}
                          disabled={task.entityStatus === 'loading'}/>
            <IconButton
                size={"small"}
                color={'secondary'}
                onClick={onClickHandler}>
                <DeleteIcon/>
            </IconButton>
        </ListItem>
    );
})