import classes from './CartItem.module.css';

const CartItem = (props) => {
  const price = `$${props.price.toFixed(2)}`;
  const totalPrice = `$${(props.price * props.amount).toFixed(2)}`;

  return (
    <li className={classes['cart-item']}>
      <div className={classes.itemContent}>
        <div className={classes.itemInfo}>
          <h3 className={classes.itemName}>{props.name}</h3>
          {props.description && (
            <p className={classes.itemDescription}>{props.description}</p>
          )}
          <div className={classes.priceInfo}>
            <span className={classes.unitPrice}>{price} each</span>
            <span className={classes.totalPrice}>{totalPrice}</span>
          </div>
        </div>
        
        <div className={classes.quantityControl}>
          <button 
            onClick={props.onRemove}
            className={classes.quantityBtn}
            disabled={props.amount <= 1}
          >
            <i className="fas fa-minus"></i>
          </button>
          <span className={classes.quantity}>{props.amount}</span>
          <button 
            onClick={props.onAdd}
            className={classes.quantityBtn}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      
      <div className={classes.itemActions}>
        <button 
          onClick={() => {
            // Remove all instances of this item
            for (let i = 0; i < props.amount; i++) {
              props.onRemove();
            }
          }}
          className={classes.removeBtn}
          title="Remove item"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </li>
  );
};

export default CartItem;
