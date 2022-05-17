import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}

type AddTodoListAT = {
    type: 'ADD-TODOLIST'
    title: string
}

type ChangeTodoListFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    id: string
    value: FilterValuesType
}

type ChangeTodoListTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    id: string
    title: string
}

export type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListFilterAT | ChangeTodoListTitleAT

export const todolistsReducer = (todoLists: Array<TodoListType>, action: ActionType): Array<TodoListType> => {
switch (action.type) {
    case "REMOVE-TODOLIST":
        return todoLists.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
        const newTodoListID = v1()
        const newTodoList: TodoListType = {
            id: newTodoListID,
            title: action.title,
            filter: 'all'
        }
        return [...todoLists, newTodoList]
    case "CHANGE-TODOLIST-FILTER":
        return todoLists.map(tl => tl.id === action.id ? {...tl, filter: action.value} : tl)
    case "CHANGE-TODOLIST-TITLE":
        return todoLists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
    default:
        return todoLists
}
}
export const RemoveTodoListAC = (id: string):RemoveTodoListAT => {
    return {type: 'REMOVE-TODOLIST', id}
}
export const AddTodoListAC = (title: string):AddTodoListAT => {
    return {type: 'ADD-TODOLIST', title}
}

export const ChangeTodoListFilterAC = (id: string, value: FilterValuesType):ChangeTodoListFilterAT => {
    return {type: 'CHANGE-TODOLIST-FILTER', id, value}
}
export const ChangeTodoListTitlerAC = (id: string, title: string):ChangeTodoListTitleAT => {
    return {type: 'CHANGE-TODOLIST-TITLE', id, title}
}

