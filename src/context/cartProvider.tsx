import { useState, useEffect, useMemo, createContext } from "react";
import { DB } from "../data/db";
import type { Guitarra, CartItem } from "../types";

interface cartContextProps {
  guitarras: Guitarra[];
  cart: Guitarra[];
  isEmpty: boolean;
  cartTotal: number;
  addToCart: (item: Guitarra) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  cleanCart: () => void;
  MAX_ITEMS: number;
  MIN_ITEMS: number;

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
  MAX_ITEMS: 0,
  MIN_ITEMS: 0,
  removeFromCart: () => { },
});

function CartProvider({ children }: { children: React.ReactNode }) {
  //#region states

  const [guitarras, _] = useState<Guitarra[]>(DB);
  const [cart, setCart] = useState<CartItem[]>(loadLocalStorage());

  useEffect(() => {
    saveLocalStorage();
  }, [cart]);

  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(() => {
    return cart.reduce((acc: number, guitarra: CartItem) => {
      return acc + guitarra.price * guitarra.quantity;
    }, 0);
  }, [cart]);

  //#endregion

  //#region constants

  const MAX_ITEMS = 10;
  const MIN_ITEMS = 1;

  //#endregion

  //#region functions

  // This function saves the current state of the cart to local storage
  function saveLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // This function loads the cart state from local storage
  function loadLocalStorage(): CartItem[] {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  }

  // This function adds an item to the cart
  function addToCart(item: Guitarra) {
    const itemExists = cart.findIndex((guitarra: Guitarra) => guitarra.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity += 1;
      setCart(updatedCart);
    } else {
      const newItem: CartItem = { ...item, quantity: 1 };
      setCart([...cart, newItem]);
    }
  }

  // This function removes an item from the cart
  function removeFromCart(id: number) {
    const updatedCart = cart.filter((guitarra: Guitarra) => guitarra.id !== id);
    setCart(updatedCart);
  }

  // This function increases the quantity of a specific item in the cart
  function increaseQuantity(id: number) {
    const updatedCart = cart.map((guitarra: CartItem) => {
      if (guitarra.id === id && (guitarra.quantity || 0) < MAX_ITEMS) {
        return {
          ...guitarra,
          quantity: (guitarra.quantity || 0) + 1,
        };
      }
      return guitarra;
    });

    setCart(updatedCart);
  }

  // This function decreases the quantity of a specific item in the cart
  function decreaseQuantity(id: number) {
    const updatedCart = cart.map((guitarra: CartItem) => {
      if (guitarra.id === id && (guitarra.quantity || 0) > MIN_ITEMS) {
        return {
          ...guitarra,
          quantity: (guitarra.quantity || 0) - 1,
        };
      }
      return guitarra;
    });

    setCart(updatedCart);
  }

  // This function clears all items from the cart
  function cleanCart() {
    setCart([]);
  }

  //#endregion

  //#region return

  return (
    <CartContext.Provider
      value={{
        guitarras,
        cart,
        isEmpty,
        cartTotal,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cleanCart,
        MAX_ITEMS,
        MIN_ITEMS,
      }}
    >
      {children}
    </CartContext.Provider>
  );

  //#endregion
}

export default CartProvider;
