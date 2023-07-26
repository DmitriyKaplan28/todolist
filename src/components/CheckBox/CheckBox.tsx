import React, {ChangeEvent} from 'react';

type PropsType = {
    isDone: boolean
    callBack: (checkedValue: boolean) => void
}

export const CheckBox = ({isDone, callBack}: PropsType) => {
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        callBack(event.currentTarget.checked)
    }
    return (
        <input type="checkbox" checked={isDone}
               onChange={onChangeHandler}/>
    );
};