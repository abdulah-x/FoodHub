import React, { useContext, useState } from "react";
import classes from "./MyCart.module.css";
import Modal from "../UI/Modal";
import CartContext from "../store/Cart-context";
import CartItem from "./CartItem";
import { orderAPI } from "../../services/api";
import { useUser } from "../../contexts/UserContext";

const MyCart = (props) => {
    const cntxt = useContext(CartContext);
    const { currentUser } = useUser();
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    
    const addHandler = (item) => {
        // console.log(item);
        cntxt.addItem({ ...item, amount: 1 })
    }
    const remHandler = (id) => {
        cntxt.removeItem(id);
    }
    const amount = `$${cntxt.totalAmount.toFixed(2)}`;
    
    // Handle order submission
    const handleOrder = async () => {
        if (!currentUser) {
            alert('Please login to place an order');
            return;
        }
        
        if (cntxt.items.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        setIsOrdering(true);
        
        try {
            // Get restaurant ID from first item (assuming all items are from same restaurant)
            const firstItem = cntxt.items[0];
            const restaurantId = firstItem.restaurantId || "68de6433a7a3d40e7e7b2bc6"; // Default to Pizza Palace if not set
            
            // Prepare order data
            const orderData = {
                customer: currentUser._id,
                restaurant: restaurantId,
                items: cntxt.items.map(item => ({
                    menuItem: item.id,
                    quantity: item.amount,
                    price: item.price
                })),
                totalAmount: cntxt.totalAmount,
                status: 'pending',
                deliveryAddress: currentUser.address,
                customerPhone: currentUser.phone,
                notes: ''
            };
            
            console.log('Submitting order:', orderData);
            
            // Submit order to API
            const response = await orderAPI.createOrder(orderData);
            console.log('Order created:', response.data);
            
            // Show success message
            setOrderPlaced(true);
            setIsOrdering(false);
            
            // Clear cart after successful order
            cntxt.items.forEach(item => {
                for (let i = 0; i < item.amount; i++) {
                    cntxt.removeItem(item.id);
                }
            });
            
            // Close modal after 3 seconds
            setTimeout(() => {
                setOrderPlaced(false);
                props.onDrop();
            }, 3000);
            
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
            setIsOrdering(false);
        }
    };
    
    const cartItems = <ul className={classes.list}>{cntxt.items.map(item => (
        <CartItem
            key={item.id}
            price={item.price}
            name={item.name}
            amount={item.amount}
            onAdd={addHandler.bind(null, item)}
            onRemove={remHandler.bind(null, item.id)}
        >{item.name}</CartItem>
    ))}</ul>;

    console.log(cartItems);
    
    // Show success message when order is placed
    if (orderPlaced) {
        return <Modal drop={props.onDrop}>
            <div className={classes.success}>
                <h2>🎉 Order Placed Successfully!</h2>
                <p>Your order has been received and is being processed.</p>
                <p>Total: {amount}</p>
                <p>This window will close automatically...</p>
            </div>
        </Modal>
    }
    
    return <Modal drop={props.onDrop}>
        {cartItems}
        <div >
            <div className={classes.total}>
                <span>
                    Total Amount
                </span>
                <span>
                    {amount}
                </span>
            </div>
            <div className={classes.actions}>
                <button onClick={props.onDrop} className={classes['button--alt']}>Close</button>
                <button 
                    className={classes.button} 
                    onClick={handleOrder}
                    disabled={isOrdering || cntxt.items.length === 0}
                >
                    {isOrdering ? 'Placing Order...' : 'Order'}
                </button>
            </div>
        </div>
    </Modal>
}

export default MyCart;