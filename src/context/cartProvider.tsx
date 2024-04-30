import { useEffect, useMemo, createContext, useReducer } from "react";
import { cartReducer, inititalState } from "../reducer/cart-reducer";
import type { Guitarra, CartItem } from "../types";

interface cartContextProps {
  guitarras: Guitarra[];
  cart: CartItem[];
  isEmpty: boolean;
  cartTotal: number;
  addToCart: (item: Guitarra) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  cleanCart: () => void;
}

export const CartContext = createContext<cartContextProps>({
  addToCart: () => { },
  cart: [],
  cartTotal: 0,
  cleanCart: () => { },
  decreaseQuantity: () => { },
  guitarras: [],
  increaseQuantity: () => { },
  isEmpty: false,
  removeFromCart: () => { },
});

function CartProvider({ children }: { children: React.ReactNode }) {
  //#region states

  const [state, dispatch] = useReducer(cartReducer, inititalState);

  useEffect(() => {
    saveLocalStorage();
  }, [state.cart]);

  const isEmpty = useMemo(() => state.cart.length === 0, [state.cart]);
  const cartTotal = useMemo(() => {
    return state.cart.reduce((acc: number, guitarra: CartItem) => {
      return acc + guitarra.price * guitarra.quantity;
    }, 0);
  }, [state.cart]);

  //#endregion

  //#region functions

  // This function saves the current state of the cart to local storage
  function saveLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }

  // This function adds an item to the cart
  function addToCart(item: Guitarra) {
    dispatch({ type: "add-to-cart", payload: { item } });
  }

  // This function removes an item from the cart
  function removeFromCart(id: number) {
    dispatch({ type: "remove-from-cart", payload: { id } })
  }

  // This function increases the quantity of a specific item in the cart
  function increaseQuantity(id: number) {
    dispatch({ type: "increase-quantity", payload: { id } })
  }

  // This function decreases the quantity of a specific item in the cart
  function decreaseQuantity(id: number) {
    dispatch({ type: "decrease-quantity", payload: { id } })
  }

  // This function clears all items from the cart
  function cleanCart() {
    dispatch({ type: "clean-cart" })
  }

  //#endregion

  //#region return

  return (
    <CartContext.Provider
      value={{
        guitarras: state.guitarras,
        cart: state.cart,
        isEmpty,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cleanCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );

  //#endregion
}

export default CartProvider;
