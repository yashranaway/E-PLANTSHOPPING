import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeItem } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const [checkoutMsg, setCheckoutMsg] = React.useState("");

  // Calculate total amount for all products in the cart
  const calculateTotalAmount = () => {
    try {
      return cart.reduce((sum, item) => {
        if (!item || !item.cost) return sum;
        const costString = typeof item.cost === 'string' ? item.cost : `$${item.cost}`;
        const numericCost = parseFloat(costString.replace('$', ''));
        if (isNaN(numericCost)) return sum;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + (numericCost * quantity);
      }, 0).toFixed(2);
    } catch (error) {
      console.error('Error calculating total amount:', error);
      return '0.00';
    }
  };

  // Calculate total number of plants in the cart
  const calculateTotalCount = () => {
    try {
      return cart.reduce((sum, item) => {
        if (!item) return sum;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + quantity;
      }, 0);
    } catch (error) {
      console.error('Error calculating total count:', error);
      return 0;
    }
  };

  const handleContinueShopping = (e) => {
    e.preventDefault();
    if (onContinueShopping) onContinueShopping();
  };

  const handleIncrement = (item) => {
    if (!item || !item.name) {
      console.error('Invalid item provided to handleIncrement');
      return;
    }
    const currentQuantity = typeof item.quantity === 'number' ? item.quantity : 1;
    dispatch(updateQuantity({ name: item.name, quantity: currentQuantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (!item || !item.name) {
      console.error('Invalid item provided to handleDecrement');
      return;
    }
    const currentQuantity = typeof item.quantity === 'number' ? item.quantity : 1;
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ name: item.name, quantity: currentQuantity - 1 }));
    } else {
      dispatch(removeItem(item.name));
    }
  };

  const handleRemove = (item) => {
    if (!item || !item.name) {
      console.error('Invalid item provided to handleRemove');
      return;
    }
    dispatch(removeItem(item.name));
  };

  // Calculate total cost based on quantity for an item
  const calculateTotalCost = (item) => {
    try {
      if (!item || !item.cost) return '0.00';
      const costString = typeof item.cost === 'string' ? item.cost : `$${item.cost}`;
      const numericCost = parseFloat(costString.replace('$', ''));
      if (isNaN(numericCost)) return '0.00';
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
      return (numericCost * quantity).toFixed(2);
    } catch (error) {
      console.error('Error calculating item total cost:', error);
      return '0.00';
    }
  };

  const handleCheckout = () => {
    setCheckoutMsg("Checkout Coming Soon!");
    setTimeout(() => setCheckoutMsg(""), 2000);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2 className="total-amount-header">
          Total Cart Amount: ${calculateTotalAmount()}
        </h2>
        <div className="cart-summary">
          <span className="item-count">{calculateTotalCount()} items in cart</span>
        </div>
      </div>
      
      <div className="cart-items-wrapper">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some plants to get started!</p>
          </div>
        ) : (
          cart.map(item => (
            <div className="cart-item-modern" key={item.name}>
              <img className="cart-item-image-modern" src={item.image} alt={item.name} />
              <div className="cart-item-details-modern">
                <div className="cart-item-info">
                  <h3 className="cart-item-name-modern">{item.name}</h3>
                  <p className="cart-item-description">{item.description || 'No description available'}</p>
                  <div className="cart-item-price-modern">
                    ${(() => {
                      try {
                        const costString = typeof item.cost === 'string' ? item.cost : `$${item.cost}`;
                        const numericCost = parseFloat(costString.replace('$', ''));
                        return isNaN(numericCost) ? '0.00' : numericCost.toFixed(2);
                      } catch {
                        return '0.00';
                      }
                    })()}
                  </div>
                </div>
                
                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn decrease" 
                      onClick={() => handleDecrement(item)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity || 1}</span>
                    <button 
                      className="quantity-btn increase" 
                      onClick={() => handleIncrement(item)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    Subtotal: <span className="subtotal-price">${calculateTotalCost(item)}</span>
                  </div>
                  
                  <button 
                    className="remove-item-btn" 
                    onClick={() => handleRemove(item)}
                    aria-label="Remove item"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="cart-footer">
        <div className="cart-actions">
          <button className="continue-shopping-btn" onClick={handleContinueShopping}>
            ← Continue Shopping
          </button>
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout →
          </button>
        </div>
        {checkoutMsg && (
          <div className="checkout-message">
            {checkoutMsg}
          </div>
        )}
      </div>
    </div>
  );
};

CartItem.propTypes = {
  onContinueShopping: PropTypes.func,
};

export default CartItem;
