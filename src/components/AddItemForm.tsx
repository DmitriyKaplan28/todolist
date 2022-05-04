import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import styles from "../Todolist.module.css";

type AddItemFormPropsType = {
    addItem: (title:string) => void
}

const AddItemForm = (props:AddItemFormPropsType) => {
    const [title, setTitle] = useState("")
    const [error, setError] = useState(false)
    const onClickAddItem = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle);
            setTitle("");
        } else {
            setError(true)
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setTitle(e.currentTarget.value)
    }
    const onKeyPressAddItem = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClickAddItem();
        }
    }
    return (
        <div>
        <div>
            <input
                className={error ? styles.error : ''}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressAddItem}
            />
            <button onClick={onClickAddItem}>+</button>
        </div>
    {error && <div className={styles.errorMessage}>Title is required</div>}
        </div>
    );
};

export default AddItemForm;