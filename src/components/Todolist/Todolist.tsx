import React, {useCallback, useEffect} from 'react';
import AddItemForm from "../AddItemForm/AddItemForm";
import EditableSpan from "../EditableSpan/EditableSpan";
import {Button, IconButton, List} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../store/store";
import {addTaskTC, fetchTasksTC, TaskType} from "../../store/reducers/tasks-reducer";
import {
    changeTodolistFilterAC,
    removeTodolistTC,
    TodolistType, updateTodolistTitleTC
} from "../../store/reducers/todolists-reducer";
import {Task} from "../Task/Task";
import {TaskStatuses} from "../../api/task-api";


type PropsType = {
    todolist: TodolistType
}

export const Todolist = React.memo(({todolist}: PropsType) => {

    let tasksForTodolist = useSelector<AppRootStateType, Array<TaskType>>(state => state.tasks[todolist.id])

    if (todolist.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.New || t.status === TaskStatuses.InProgress);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter(t => t.status === TaskStatuses.Completed);
    }

    const dispatch = useAppDispatch();

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC({title, todolistId: todolist.id}));
    }, [todolist.id])

    const removeTodoList = useCallback(() => {
        dispatch(removeTodolistTC(todolist.id))
    }, [todolist.id])

    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(updateTodolistTitleTC({todolistId: todolist.id, title}))
    }, [todolist.id])

    const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC({
        todolistId: todolist.id,
        value: "all"
    })), [todolist.id])

    const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC({
        todolistId: todolist.id,
        value: "active"
    })), [todolist.id])

    const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC({
        todolistId: todolist.id,
        value: "completed"
    })), [todolist.id])

    useEffect(() => {
        dispatch(fetchTasksTC(todolist.id))
    }, [])

    return <div>
        <h3>
            <EditableSpan title={todolist.title} setNewTitle={changeTodoListTitle}
                          disabled={todolist.entityStatus === 'loading'}/>
            <IconButton
                size={"small"}
                color={'primary'}
                onClick={removeTodoList}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={todolist.entityStatus === 'loading'}/>
        <List>
            {tasksForTodolist.map(t => <Task task={t}
                                             todolistID={todolist.id}/>)}
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
})
