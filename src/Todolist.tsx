import React, {useCallback, useEffect} from 'react';
import AddItemForm from "./components/AddItemForm";
import EditableSpan from "./components/EditableSpan";
import {Button, IconButton, List} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./state/store";
import {addTaskAC, fetchTasksTC} from "./reducers/tasks-reducer";
import {
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    removeTodoListAC,
    TodolistType
} from "./reducers/todolists-reducer";
import {Task} from "./components/Task";
import {TaskAPIType, TaskStatuses} from "./api/task-api";

type PropsType = {
    todolist: TodolistType
}

export const Todolist = React.memo(({todolist}: PropsType) => {
    let tasks = useSelector<AppRootStateType, Array<TaskAPIType>>(state => state.tasks[todolist.id])

    let tasksForTodolist = tasks

    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.New || t.status === TaskStatuses.InProgress);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.status === TaskStatuses.Completed);
    }
    const dispatch = useAppDispatch();

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, todolist.id));
    }, [todolist.id])

    const removeTodoList = useCallback(() => {
        dispatch(removeTodoListAC(todolist.id))
    }, [todolist.id])
    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(changeTodoListTitleAC(todolist.id, title))
    }, [todolist.id])

    const onAllClickHandler = useCallback(() => dispatch(changeTodoListFilterAC(todolist.id, "all")),[todolist.id])
    const onActiveClickHandler = useCallback(() => dispatch(changeTodoListFilterAC(todolist.id, "active")),[todolist.id])
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodoListFilterAC(todolist.id, "completed")),[todolist.id])

    useEffect(() => {
        dispatch(fetchTasksTC(todolist.id))
    }, [])

    return <div>
        <h3>
            <EditableSpan title={todolist.title} setNewTitle={changeTodoListTitle}/>
            <IconButton
                size={"small"}
                color={'primary'}
                onClick={removeTodoList}>
                <DeleteIcon/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
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
