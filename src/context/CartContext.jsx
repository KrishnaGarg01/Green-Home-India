import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "ghi_cart";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find((i) => i.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id
            ? { ...i, qty: Math.min(i.qty + 1, action.product.stock) }
            : i
        );
      }
      return [...state, { ...action.product, qty: 1 }];
    }

    case "REMOVE_ITEM":
      return state.filter((i) => i.id !== action.id);

    case "UPDATE_QTY": {
      const { id, qty } = action;
      if (qty <= 0) return state.filter((i) => i.id !== id);
      return state.map((i) => (i.id === id ? { ...i, qty } : i));
    }

    case "CLEAR_CART":
      return [];

    case "LOAD_CART":
      return action.cart;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          dispatch({ type: "LOAD_CART", cart: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addItem = (product) =>
    dispatch({ type: "ADD_ITEM", product });

  const removeItem = (id) =>
    dispatch({ type: "REMOVE_ITEM", id });

  const updateQty = (id, qty) =>
    dispatch({ type: "UPDATE_QTY", id, qty });

  const clearCart = () =>
    dispatch({ type: "CLEAR_CART" });

  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const isInCart = (id) => cart.some((i) => i.id === id);

  const getItemQty = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.qty : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        itemCount,
        subtotal,
        isInCart,
        getItemQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
