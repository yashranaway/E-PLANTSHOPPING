import { createSlice } from '@reduxjs/toolkit';

export const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // Initialize items as an empty array
  },
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      if (!item || !item.name || !item.cost) {
        console.error('Invalid item data provided to addItem');
        return;
      }
      
      const existing = state.items.find(
        (i) => i.name === item.name
      );
      if (!existing) {
        // Ensure valid quantity and cost format
        const newItem = {
          ...item,
          quantity: 1,
          cost: typeof item.cost === 'string' ? item.cost : `$${item.cost}`,
          description: item.description || 'No description available'
        };
        state.items.push(newItem);
      } else {
        // If item already exists, increment quantity
        existing.quantity = (existing.quantity || 1) + 1;
      }
    },
    removeItem: (state, action) => {
      const name = action.payload;
      if (!name) {
        console.error('No item name provided to removeItem');
        return;
      }
      state.items = state.items.filter((i) => i.name !== name);
    },
    updateQuantity: (state, action) => {
      const { name, quantity } = action.payload;
      if (!name || typeof quantity !== 'number') {
        console.error('Invalid parameters provided to updateQuantity');
        return;
      }
      
      const item = state.items.find((i) => i.name === name);
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter((i) => i.name !== name);
        } else {
          item.quantity = Math.max(1, Math.floor(quantity)); // Ensure positive integer
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = CartSlice.actions;

export default CartSlice.reducer;
