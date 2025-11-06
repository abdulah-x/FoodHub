import React, { useContext, useState, useEffect } from "react";
import classes from "./MyCart.module.css";
import Modal from "../UI/Modal";
import CartContext from "../store/Cart-context";
import CartItem from "./CartItem";
import { orderAPI } from "../../services/api";
import { useUser } from "../../contexts/UserContext";
import { useNotifications } from "../../contexts/NotificationContext";

const MyCart = (props) => {
    const cntxt = useContext(CartContext);
    const { currentUser } = useUser();
    const { addNotification } = useNotifications();
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [deliveryFee] = useState(2.99);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [showPromoInput, setShowPromoInput] = useState(false);
    
    const addHandler = (item) => {
        cntxt.addItem({ ...item, amount: 1 });
        // Show feedback for adding item
        addNotification({
            id: Date.now(),
            type: 'cart_update',
            title: '✅ Item Added',
            message: `${item.name} added to cart`,
            timestamp: new Date(),
            read: false
        });
    }
    
    const remHandler = (id) => {
        const item = cntxt.items.find(item => item.id === id);
        cntxt.removeItem(id);
        if (item) {
            addNotification({
                id: Date.now(),
                type: 'cart_update', 
                title: '🗑️ Item Removed',
                message: `${item.name} removed from cart`,
                timestamp: new Date(),
                read: false
            });
        }
    }
    
    const clearCart = () => {
        cntxt.items.forEach(item => {
            for (let i = 0; i < item.amount; i++) {
                cntxt.removeItem(item.id);
            }
        });
        addNotification({
            id: Date.now(),
            type: 'cart_update',
            title: '🗑️ Cart Cleared',
            message: 'All items removed from cart',
            timestamp: new Date(),
            read: false
        });
    }
    
    const subtotal = cntxt.totalAmount;
    const total = subtotal + deliveryFee - discount;
    const amount = `$${total.toFixed(2)}`;
    
    const handlePromoCode = () => {
        if (promoCode.toUpperCase() === 'SAVE10') {
            setDiscount(subtotal * 0.1);
            addNotification({
                id: Date.now(),
                type: 'promo',
                title: '🎉 Promo Applied!',
                message: '10% discount applied to your order',
                timestamp: new Date(),
                read: false
            });
        } else if (promoCode.toUpperCase() === 'WELCOME') {
            setDiscount(5);
            addNotification({
                id: Date.now(),
                type: 'promo',
                title: '🎉 Welcome Discount!',
                message: '$5 discount applied to your order',
                timestamp: new Date(),
                read: false
            });
        } else {
            addNotification({
                id: Date.now(),
                type: 'error',
                title: '❌ Invalid Code',
                message: 'Promo code is not valid',
                timestamp: new Date(),
                read: false
            });
        }
        setShowPromoInput(false);
        setPromoCode('');
    };
    
    // Handle order submission
    const handleOrder = () => {
        if (!currentUser) {
            addNotification({
                id: Date.now(),
                type: 'error',
                title: '🔐 Login Required',
                message: 'Please login to place an order',
                timestamp: new Date(),
                read: false
            });
            return;
        }
        
        if (cntxt.items.length === 0) {
            addNotification({
                id: Date.now(),
                type: 'error',
                title: '🛒 Empty Cart',
                message: 'Your cart is empty',
                timestamp: new Date(),
                read: false
            });
            return;
        }
        
        setShowOrderSummary(true);
    };
    
    const confirmOrder = async () => {
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
                totalAmount: total,
                status: 'pending',
                deliveryAddress: currentUser.address,
                customerPhone: currentUser.phone,
                notes: '',
                deliveryFee: deliveryFee,
                discount: discount
            };
            
            console.log('Submitting order:', orderData);
            
            // Submit order to API
            const response = await orderAPI.createOrder(orderData);
            console.log('Order created:', response.data);
            
            // Show success message
            setOrderPlaced(true);
            setIsOrdering(false);
            setShowOrderSummary(false);
            
            // Add success notification
            addNotification({
                id: Date.now(),
                type: 'order_success',
                title: '🎉 Order Placed!',
                message: `Order #${response.data._id?.slice(-6)} placed successfully`,
                timestamp: new Date(),
                read: false
            });
            
            // Clear cart after successful order
            cntxt.items.forEach(item => {
                for (let i = 0; i < item.amount; i++) {
                    cntxt.removeItem(item.id);
                }
            });
            
            // Close modal after 4 seconds
            setTimeout(() => {
                setOrderPlaced(false);
                props.onDrop();
            }, 4000);
            
        } catch (error) {
            console.error('Error placing order:', error);
            setIsOrdering(false);
            addNotification({
                id: Date.now(),
                type: 'error',
                title: '❌ Order Failed',
                message: 'Failed to place order. Please try again.',
                timestamp: new Date(),
                read: false
            });
        }
    };
    
    const cartItems = (
        <div className={classes.cartContent}>
            <div className={classes.cartHeader}>
                <h2>🛒 Your Order</h2>
                {cntxt.items.length > 0 && (
                    <button onClick={clearCart} className={classes.clearBtn}>
                        <i className="fas fa-trash"></i> Clear All
                    </button>
                )}
            </div>
            <ul className={classes.list}>
                {cntxt.items.map(item => (
                    <CartItem
                        key={item.id}
                        price={item.price}
                        name={item.name}
                        amount={item.amount}
                        description={item.description}
                        onAdd={addHandler.bind(null, item)}
                        onRemove={remHandler.bind(null, item.id)}
                    />
                ))}
            </ul>
        </div>
    );
    
    // Show success message when order is placed
    if (orderPlaced) {
        return <Modal drop={props.onDrop}>
            <div className={classes.success}>
                <div className={classes.successIcon}>🎉</div>
                <h2>Order Placed Successfully!</h2>
                <div className={classes.successDetails}>
                    <p>Your delicious order is on its way!</p>
                    <div className={classes.orderInfo}>
                        <span>Total Paid: <strong>{amount}</strong></span>
                        <span>Items: <strong>{cntxt.items.reduce((sum, item) => sum + item.amount, 0)}</strong></span>
                    </div>
                    <div className={classes.timeline}>
                        <div className={classes.timelineItem}>
                            <span className={classes.timelineIcon}>✅</span>
                            <span>Order Confirmed</span>
                        </div>
                        <div className={classes.timelineItem}>
                            <span className={classes.timelineIcon}>👨‍🍳</span>
                            <span>Being Prepared</span>
                        </div>
                        <div className={classes.timelineItem}>
                            <span className={classes.timelineIcon}>🚚</span>
                            <span>On the Way</span>
                        </div>
                    </div>
                    <p className={classes.autoClose}>This window will close automatically...</p>
                </div>
            </div>
        </Modal>
    }
    
    if (cntxt.items.length === 0) {
        return <Modal drop={props.onDrop}>
            <div className={classes.empty}>
                <div className={classes.emptyIcon}>🛒</div>
                <h2>Your Cart is Empty</h2>
                <p>Discover amazing food from our restaurants!</p>
                <div className={classes.emptyFeatures}>
                    <div className={classes.feature}>
                        <span>🍕</span>
                        <span>Fresh Ingredients</span>
                    </div>
                    <div className={classes.feature}>
                        <span>🚚</span>
                        <span>Fast Delivery</span>
                    </div>
                    <div className={classes.feature}>
                        <span>⭐</span>
                        <span>Top Rated</span>
                    </div>
                </div>
                <div className={classes.actions}>
                    <button onClick={props.onDrop} className={classes.button}>
                        <i className="fas fa-utensils"></i> Browse Restaurants
                    </button>
                </div>
            </div>
        </Modal>
    }

    // Order Summary Modal
    if (showOrderSummary) {
        return <Modal drop={() => setShowOrderSummary(false)}>
            <div className={classes.orderSummary}>
                <h2>📋 Order Summary</h2>
                <div className={classes.summaryDetails}>
                    <div className={classes.summarySection}>
                        <h3>Items ({cntxt.items.reduce((sum, item) => sum + item.amount, 0)})</h3>
                        {cntxt.items.map(item => (
                            <div key={item.id} className={classes.summaryItem}>
                                <span>{item.name} x{item.amount}</span>
                                <span>${(item.price * item.amount).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className={classes.summarySection}>
                        <div className={classes.summaryRow}>
                            <span>Subtotal:</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className={classes.summaryRow}>
                            <span>Delivery Fee:</span>
                            <span>${deliveryFee.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className={classes.summaryRow}>
                                <span>Discount:</span>
                                <span className={classes.discount}>-${discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className={classes.summaryRow + ' ' + classes.total}>
                            <span><strong>Total:</strong></span>
                            <span><strong>{amount}</strong></span>
                        </div>
                    </div>

                    <div className={classes.deliveryInfo}>
                        <h3>📍 Delivery Address</h3>
                        <p>{currentUser?.address?.street}, {currentUser?.address?.city}</p>
                        <p>📞 {currentUser?.phone}</p>
                    </div>
                </div>
                
                <div className={classes.actions}>
                    <button onClick={() => setShowOrderSummary(false)} className={classes['button--alt']}>
                        <i className="fas fa-arrow-left"></i> Back to Cart
                    </button>
                    <button 
                        className={classes.button} 
                        onClick={confirmOrder}
                        disabled={isOrdering}
                    >
                        {isOrdering ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Processing...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check"></i> Confirm Order
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    }

    return <Modal drop={props.onDrop}>
        {cartItems}
        
        {/* Promo Code Section */}
        <div className={classes.promoSection}>
            {!showPromoInput ? (
                <button 
                    onClick={() => setShowPromoInput(true)} 
                    className={classes.promoBtn}
                >
                    <i className="fas fa-tag"></i> Have a promo code?
                </button>
            ) : (
                <div className={classes.promoInput}>
                    <input
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button onClick={handlePromoCode} className={classes.applyBtn}>Apply</button>
                    <button onClick={() => setShowPromoInput(false)} className={classes.cancelBtn}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
        </div>

        {/* Order Breakdown */}
        <div className={classes.orderBreakdown}>
            <div className={classes.breakdownRow}>
                <span>Subtotal ({cntxt.items.reduce((sum, item) => sum + item.amount, 0)} items)</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={classes.breakdownRow}>
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
            </div>
            {discount > 0 && (
                <div className={classes.breakdownRow}>
                    <span>Discount</span>
                    <span className={classes.discount}>-${discount.toFixed(2)}</span>
                </div>
            )}
            <div className={classes.totalRow}>
                <span>Total Amount</span>
                <span>{amount}</span>
            </div>
        </div>

        <div className={classes.actions}>
            <button onClick={props.onDrop} className={classes['button--alt']}>
                <i className="fas fa-shopping-cart"></i> Continue Shopping
            </button>
            <button 
                className={classes.button} 
                onClick={handleOrder}
                disabled={cntxt.items.length === 0}
            >
                <i className="fas fa-credit-card"></i> Proceed to Order
            </button>
        </div>
    </Modal>
}

export default MyCart;