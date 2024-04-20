import { CartContext } from "../context/cartProvider";
import { useContext } from "react";

function useCart() {
  return useContext(CartContext);
}

export default useCart;
