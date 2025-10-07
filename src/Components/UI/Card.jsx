import React from "react";
import classes from "./Card.module.css";

const Card = (props) => {
    const { children, className, ...otherProps } = props;
    const cardClasses = className ? `${classes.card} ${className}` : classes.card;
    
    return <div 
        className={cardClasses} 
        data-testid={otherProps['data-testid'] || "card"}
        {...otherProps}
    >
        {children}
    </div>
}

export default Card;