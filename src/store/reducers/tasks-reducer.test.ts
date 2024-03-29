import {
    addTaskTC,
    removeTaskTC,
    tasksReducer,
    TaskStateType,
    updateTaskTC,
} from './tasks-reducer';
import {
    addTodolistTC, removeTodolistTC,
    todolistsReducer,
    TodolistType
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/task-api";

let startState: TaskStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1",
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1",
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1",
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2",
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2",
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2",
                entityStatus: "idle"
            }
        ]
    };
})

test('correct task should be deleted from correct array', () => {
    const action = removeTaskTC.fulfilled({
        taskId: "2",
        todolistId: "todolistId2"
    }, "requestId", {taskId: "2", todolistId: "todolistId2"});
    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1",
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1",
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId1",
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2",
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                description: '',
                priority: TaskPriorities.Middle,
                startDate: '',
                deadline: '',
                order: 0,
                addedDate: '',
                todoListId: "todolistId2",
                entityStatus: "idle"
            }
        ]
    });

});

test('correct task should be added to correct array', () => {

    const action = addTaskTC.fulfilled({
        task: {
            description: 'ggg',
            title: "testTask",
            status: TaskStatuses.New,
            priority: TaskPriorities.Middle,
            startDate: '',
            deadline: '',
            id: "4",
            todoListId: "todolistId2",
            order: 0,
            addedDate: '',
            entityStatus: "idle"
        }
    }, "", {title: "testTask", todolistId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][1].title).toBe("bread");
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId2"][0].title).toBe("testTask");
})

test('status of specified task should be changed', () => {

    let newValue = {
        taskId: "2",
        model: {status: TaskStatuses.Completed},
        todolistId: "todolistId2"
    };
    let newValue2 = {
        taskId: "2",
        domainModel: {status: TaskStatuses.Completed},
        todolistId: "todolistId2"
    };
    const action = updateTaskTC.fulfilled(newValue, "", newValue2);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.Completed);
    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(3);
});

test('title of specified task should be changed', () => {

    let newValue = {
        taskId: "1",
        model: {title: "HTML&CSS"},
        todolistId: "todolistId1"
    };
    let newValue2 = {
        taskId: "1",
        domainModel: {title: "HTML&CSS"},
        todolistId: "todolistId1"
    };
    const action = updateTaskTC.fulfilled(newValue, "", newValue2);

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][0].title).toBe("HTML&CSS");
    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(3);
});

test('new array should be added when new todolist is added', () => {

    const action = addTodolistTC.fulfilled({
        todolist: {
            title: "new todolist",
            id: "newId",
            order: 1,
            addedDate: ''
        }
    }, "", "new todolist");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistType> = [];

    const action = addTodolistTC.fulfilled({
        todolist: {
            title: "new todolist",
            id: "newId",
            order: 1,
            addedDate: ''
        }
    }, "", "new todolist");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload && action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload && action.payload.todolist.id);
});

test('property with todolistId should be deleted', () => {

    const action = removeTodolistTC.fulfilled({todolistId:"todolistId2"}, "", "todolistId2");

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});