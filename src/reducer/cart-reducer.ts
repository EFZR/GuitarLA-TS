import { DB } from "../data/db";
import { CartItem, Guitarra } from "../types";

const MAX_ITEMS = 10;
const MIN_ITEMS = 1;

export type CartActions =
  | { type: "add-to-cart"; payload: { item: Guitarra } }
  | { type: "remove-from-cart"; payload: { id: Guitarra["id"] } }
  | { type: "decrease-quantity"; payload: { id: Guitarra["id"] } }
  | { type: "increase-quantity"; payload: { id: Guitarra["id"] } }
  | { type: "clean-cart" };

export type CartState = {
  guitarras: Guitarra[];
  cart: CartItem[];
};

// This function loads the cart state from local storage
function loadLocalStorage(): CartItem[] {
  const localStorageCart = localStorage.getItem("cart");
  return localStorageCart ? JSON.parse(localStorageCart) : [];
}

export const inititalState: CartState = {
  guitarras: DB,
  cart: loadLocalStorage(),
};

export const cartReducer = (
  state: CartState = inititalState,
  action: CartActions
) => {
  // This handler adds an item to the cart
  if (action.type === "add-to-cart") {
    let updatedCart: CartItem[] = [];
    const itemExists = state.cart.find(
      (guitarra: Guitarra) => guitarra.id === action.payload.item.id
    );

    // If products exists increase quantity.
    if (itemExists) {
      updatedCart = state.cart.map((item) => {
        if (item.id === action.payload.item.id) {
          if (item.quantity < MAX_ITEMS) {
            return {
              ...item,
              quantity: item.quantity++,
            };
          } else {
            return item;
          }
        } else {
          return item;
        }
      });
    }

    // If not is add it to the cart.
    else {
      const newItem: CartItem = { ...action.payload.item, quantity: 1 };
      updatedCart = [...state.cart, newItem];
    }

    return {
      ...state,
      cart: updatedCart,
    };
  }

  // This handler removes an item from the cart
  if (action.type === "remove-from-cart") {
    const updatedCart = state.cart.filter(
      (guitarra: Guitarra) => guitarra.id !== action.payload.id
    );

    return {
      ...state,
      cart: updatedCart,
    };
  }

  // This handler increases the quantity of a specific item in the cart
  if (action.type === "increase-quantity") {
    const updatedCart = state.cart.map((guitarra: CartItem) => {
      if (
        guitarra.id === action.payload.id &&
        (guitarra.quantity || 0) < MAX_ITEMS
      ) {
        return {
          ...guitarra,
          quantity: (guitarra.quantity || 0) + 1,
        };
      }
      return guitarra;
    });

    return {
      ...state,
      cart: updatedCart,
    };
  }

  // This handler decreases the quantity of a specific item in the cart
  if (action.type === "decrease-quantity") {
    const updatedCart = state.cart.map((guitarra: CartItem) => {
      if (
        guitarra.id === action.payload.id &&
        (guitarra.quantity || 0) > MIN_ITEMS
      ) {
        return {
          ...guitarra,
          quantity: (guitarra.quantity || 0) - 1,
        };
      }
      return guitarra;
    });

    return {
      ...state,
      cart: updatedCart,
    };
  }

  // This handler clears all items from the cart
  if (action.type === "clean-cart") {
    return {
      ...state,
      cart: [],
    };
  }

  return state;
};
