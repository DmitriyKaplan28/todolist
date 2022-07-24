import React from 'react';

type ButtonPropsType = {
    name: string,
    callBack: () => void
    className?: string
}

export const Button = (props: ButtonPropsType) => {

    const onClickHandler = () => {
        props.callBack()
    }
    return (
        <button className={props.className} onClick={onClickHandler}>{props.name}</button>
    );
};

