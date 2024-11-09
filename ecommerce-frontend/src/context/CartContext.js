// src/context/CartContext.js
import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [] };
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return { items: [] };
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

// Cart reducer
const cartReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      const price = parseFloat(action.payload.price) || 0;

      if (existingItem) {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          items: [...state.items, { ...action.payload, price, quantity: 1 }],
        };
      }
      break;
    }

    case 'REMOVE_FROM_CART': {
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      break;
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      const validQuantity = Math.max(0, parseInt(quantity) || 0);

      if (validQuantity === 0) {
        newState = {
          ...state,
          items: state.items.filter(item => item.id !== id),
        };
      } else {
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity: validQuantity }
              : item
          ),
        };
      }
      break;
    }

    case 'CLEAR_CART': {
      newState = {
        ...state,
        items: [],
      };
      break;
    }

    default:
      return state;
  }

  // Save to localStorage and return new state
  saveCartToStorage(newState);
  return newState;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, null, loadCartFromStorage);

  // Add item to cart
  const addToCart = (product) => {
    if (!product?.id || !product?.price) {
      console.error('Invalid product data:', product);
      return;
    }

    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        category_name: product.category_name,
        stock: product.stock,
        description: product.description
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 0) {
      console.error('Invalid quantity:', quantity);
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity }
    });
  };

  // Clear cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calculate cart total
  const getCartTotal = () => {
    try {
      return state.items.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return 0;
    }
  };

  // Get cart items count
  const getCartItemsCount = () => {
    try {
      return state.items.reduce((total, item) => {
        return total + (parseInt(item.quantity) || 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating cart items count:', error);
      return 0;
    }
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;