import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";

function App() {
    const arr1=[
        {id: 1, title: "HTML&CSS1", isDone: true},
        {id: 2, title: "JS1", isDone: true},
        {id: 3, title: "ReactJS1", isDone: false},
        {id: 4, title: "Rest API1", isDone: false},

    ]

    const arr2=[
        {id: 1, title: "HTML&CSS222", isDone: true},
        {id: 2, title: "JS222", isDone: true},
        {id: 3, title: "ReactJS2222", isDone: false},
        {id: 4, title: "Rest API22222", isDone: false},
        {id: 5, title: "GraphQL22222", isDone: false},
    ]

    return (
        <div className="App">
            <Todolist topic1={'What to learn 11111'} arr={arr1}/>
            <Todolist topic1={'What to learn 22222'} arr={arr2}/>
           </div>
    );
}

export default App;
