import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import EditableSpan from "./EditableSpan";

export default {
    title: 'Todolist/EditableSpan',
    component: EditableSpan,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argsTypes: {
        callback: {
            description: 'Value EditableSpan changed'
        },
        title: {
            title: 'HTML',
            description: 'Start Value EditableSpan'
        }
    },
    args: {
        title: 'HTML'
    }
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanStory = Template.bind({});

EditableSpanStory.args = {
    setNewTitle: action('Value EditableSpan changed')
};
