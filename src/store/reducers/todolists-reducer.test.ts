import {
    addTodolistAC,
    changeTodolistFilterAC, changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC,
    todolistsReducer, TodolistType
} from './todolists-reducer';
import {v1} from 'uuid';
import {TodolistAPIType} from "../../api/todolist-api";


let todolistId1: string
let todolistId2: string
let startState: Array<TodolistType>

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'}
    ]
})

test('correct todolist should be removed', () => {

    const endState = todolistsReducer(startState, removeTodolistAC({id: todolistId1}))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {

    let todolist: TodolistAPIType = {
        title: "new todolist",
        id: "newId",
        order: 1,
        addedDate: ''
    }

    const endState = todolistsReducer(startState, addTodolistAC({todolist}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("new todolist");
});

test('correct filter of todolist should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const endState = todolistsReducer(startState, changeTodolistFilterAC({id:todolistId2,value: newFilter}));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('correct todolist should change its name', () => {

    let newTodolistTitle = "New Todolist";

    const endState = todolistsReducer(startState, changeTodolistTitleAC({id:todolistId2,title: newTodolistTitle}));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});
