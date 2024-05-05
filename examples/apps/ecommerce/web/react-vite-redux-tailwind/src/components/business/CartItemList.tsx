import { CartItemClass } from "../../services/cart/CartTypes";
import { Product } from "../../services/product/ProductTypes";
import CartItem from "./CartItem";

interface CartItemListProps {
  cartItems: CartItemClass[];
  onQuantityChanged(product: Product, quantity: number): void;
  removeFromCart(product: Product): void;
}
const CartItemList = (props: CartItemListProps) => {
  const { cartItems, onQuantityChanged, removeFromCart } = props;
  return (
    <div>
      {cartItems.map((item) => (
        <div key={`${item._id}-${item.product._id}`} className="mb-4">
          <CartItem
            cartItem={item}
            onQuantityChanged={onQuantityChanged}
            removeFromCart={removeFromCart}
          />
        </div>
      ))}
    </div>
  );
};

export default CartItemList;
