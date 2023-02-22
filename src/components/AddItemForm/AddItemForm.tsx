import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import styles from "../Todolist/Todolist.module.css";
import PostAddIcon from '@material-ui/icons/PostAdd';
import {IconButton, TextField} from "@material-ui/core";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

const AddItemForm = React.memo((props: AddItemFormPropsType) => {

    const [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>(null)

    const onClickAddItem = () => {
        const trimmedTitle = title.trim()

        if (trimmedTitle) {
            props.addItem(trimmedTitle);
            setTitle("");
        } else {
            setError("Title is required")
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressAddItem = (e: KeyboardEvent<HTMLInputElement>) => {

        if (error !== null) {
            setError(null)
        }

        if (e.key === "Enter") {
            onClickAddItem();
        }
    }

    return (
        <div>
            <div>
                <TextField
                    label={'Title'}
                    error={!!error}
                    helperText={error}
                    size={"small"}
                    variant={"outlined"}
                    value={title}
                    onChange={onChangeHandler}
                    onKeyDown={onKeyPressAddItem}
                />
                <IconButton onClick={onClickAddItem} disabled={props.disabled}>
                    <PostAddIcon/>
                </IconButton>
            </div>
            {error && <div className={styles.errorMessage}>Title is required</div>}
        </div>
    );
});

export default AddItemForm;