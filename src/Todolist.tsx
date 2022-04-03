import React from "react";

type TodolistPropsType = {
    topic1?: string
    arr:Array<InArrayPropsType>
}

type InArrayPropsType={
    id: number,
    title: string,
    isDone: boolean
}

export const Todolist = (props: TodolistPropsType) => {
    return (
        <div>
            <h1>{props.topic1}</h1>
            <div>
                <input/>
                <button>+</button>
            </div>
            <ul>
                {props.arr.map((el)=>{
                    return(
                        <li><input type="checkbox" checked={el.isDone}/> <span>{el.title}</span></li>
                    )
                })}
                {/*<li><input type="checkbox" checked={props.arr[0].isDone}/> <span>{props.arr[0].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.arr[1].isDone}/> <span>{props.arr[1].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.arr[2].isDone}/> <span>{props.arr[2].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.arr[3].isDone}/> <span>{props.arr[3].title}</span></li>*/}
                {/*<li><input type="checkbox" checked={props.arr[4].isDone}/> <span>{props.arr[4].title}</span></li>*/}
            </ul>
            <div>
                <button>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    )
}