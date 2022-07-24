import React, {useEffect, useState} from 'react'
import {taskAPI, UpdateTaskType} from "../api/task-api";

export default {
    title: 'API-tasks'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.getTasks('66f64bf1-3514-45df-b008-6659e252bfdd')
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.createTask('66f64bf1-3514-45df-b008-6659e252bfdd', 'AZAZA Task')
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        taskAPI.deleteTask('66f64bf1-3514-45df-b008-6659e252bfdd', '9bfea140-046a-43ee-9096-676cbc47c997')
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const updatedTask: UpdateTaskType = {
        title: "UPDATED AZAZA Task",
        description:"AZAZA is just like AHAHA",
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
    }
    useEffect(() => {
        taskAPI.updateTask('66f64bf1-3514-45df-b008-6659e252bfdd', '6ab79400-e8d9-4f87-81af-23ea55e2a96c', updatedTask)
            .then((res) => {
                setState(res.data);
            })
    }, [])
    return <div> {JSON.stringify(state)}</div>
}



