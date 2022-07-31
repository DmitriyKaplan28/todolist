import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {Task} from "./Task";
import {ReduxStoreProviderDecorator} from "../../state/ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {action} from "@storybook/addon-actions";
import {TaskType} from "../../state/reducers/tasks-reducer";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator],
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    args: {
        todolistID: '1',
        changeStatus: action('Status changed inside Task'),
        updateTask: action('Title changed inside Task'),
        removeTask: action('Remove button inside Task clicked'),
    },
} as ComponentMeta<typeof Task>;

const TaskWithDispatch = () => {
    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId2'][0])

    return <Task
        task={task}
        todolistID={'todolistId2'}
    />
}

const Template: ComponentStory<typeof TaskWithDispatch> = () => <TaskWithDispatch  />;

export const TaskWithDispatchStories = Template.bind({});
TaskWithDispatchStories.args = {}


// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
/*
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsDoneStory.args = {
    task: {id: '1', isDone: true, title: 'JS'},
};

export const TaskIsNotDoneStory = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
TaskIsNotDoneStory.args = {
    task: {id: '1', isDone: false, title: 'JS'},
};*/
