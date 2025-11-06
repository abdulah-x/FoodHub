import React from "react";
import classes from "./Input.module.css";

const Input = React.forwardRef((props, ref) => {
    return <div className={classes.input} data-testid="input-container">
        <label htmlFor={props.input.id} data-testid="input-label">{props.label}</label>
        <input {...props.input} ref={ref} data-testid="input-field" />
    </div>
});

export default Input;