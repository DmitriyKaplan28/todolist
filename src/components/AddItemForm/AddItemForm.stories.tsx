import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import AddItemForm from "./AddItemForm";

import {action} from "@storybook/addon-actions";

export default {
  title: 'Todolist/AddItemForm',
  component: AddItemForm,
  argTypes: {
    onClick: { description: 'button inside form is clicked' },
  },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args}/>

export const AddItemFormExample = Template.bind({})

AddItemFormExample.args = {
  addItem: action('button inside form is clicked')
}