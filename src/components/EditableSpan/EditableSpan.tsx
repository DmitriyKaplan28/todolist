import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {TextField} from "@material-ui/core";


type EditableSpanPropsType = {
    title: string
    setNewTitle: (newTitle: string) => void
    disabled: boolean
}

const EditableSpan = ({setNewTitle,disabled, ...props}: EditableSpanPropsType) => {

    const [title, setTitle] = useState(props.title)
    const [editMode, setEditMode] = useState<boolean>(false)
    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        if (title.trim()) {
            setEditMode(false)
            setNewTitle(title)
        }
    }
    const onKeyPressOffEditMode = (e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && offEditMode()
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)

    return (
        editMode
            ? <TextField
                value={title}
                onChange={onChangeHandler}
                autoFocus
                onBlur={offEditMode}
                onKeyDown={onKeyPressOffEditMode}
                disabled={disabled}
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
};

export default EditableSpan;