import { UserCart } from "../../../../services/cart/CartTypes";
import { Product } from "../../../../services/product/ProductTypes";
import { useAppSelector } from "../../../../store";
import CartItemList from "../../../business/CartItemList";
import CartSummary from "../../../business/CartSummary";

interface CartProps {
  cart: UserCart | null;
  onQuantityChanged(product: Product, quantity: number): void;
  removeFromCart(product: Product): void;
  checkoutClickHandler(): void;
}
const Cart = (props: CartProps) => {
  const { cart, onQuantityChanged, removeFromCart, checkoutClickHandler } = props;

  const isRTL = useAppSelector(state => state.language.isRTL);
  
  return (
    <div className={`flex flex-col relative lg:flex-row lg:gap-x-4 ${isRTL ? 'lg:flex-row-reverse': ''} `}>
      <div className="overflow-auto h-96 lg:h-auto lg:flex-1">
        <CartItemList
          cartItems={cart?.items || []}
          onQuantityChanged={onQuantityChanged}
          removeFromCart={removeFromCart}
        />
      </div>
      {cart && (
        <div className="lg:w-1/3">
        <CartSummary
          userCart={cart}
          checkoutClickHandler={checkoutClickHandler}
          className="lg:sticky lg:top-28"
        />
        </div>
      )}
    </div>
  );
};

export default Cart;
