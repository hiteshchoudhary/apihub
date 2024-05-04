import { useMemo } from "react";
import { PUBLIC_IMAGE_PATHS } from "../../constants";
import { CartItemClass } from "../../services/cart/CartTypes";
import Button from "../basic/Button";
import Image from "../basic/Image";
import QuantityCounter from "./QuantityCounter";
import { DEFAULT_CURRENCY } from "../../data/applicationData";
import DeleteIcon from "../icons/DeleteIcon";
import { Product } from "../../services/product/ProductTypes";
import { useAppSelector } from "../../store";
import { useTranslation } from "react-i18next";
import { formatAmount } from "../../utils/commonHelper";
import Text from "../basic/Text";

interface CartItemProps {
  cartItem: CartItemClass;
  onQuantityChanged(product: Product, quantity: number): void;
  removeFromCart(product: Product): void;
}
const CartItem = (props: CartItemProps) => {
  const isRTL = useAppSelector((state) => state.language.isRTL);

  const { t } = useTranslation();
  const { cartItem, onQuantityChanged, removeFromCart } = props;

  const product = useMemo(() => {
    return cartItem.product;
  }, [cartItem]);

  const subTotal = useMemo(() => {
    return cartItem.product.price * cartItem.quantity;
  }, [cartItem]);

  const isInStock = useMemo(() => {
    if (cartItem.quantity >= cartItem.product.stock) {
      return false;
    }
    return true;
  }, [cartItem]);

  const quantityChangeHandler = (quantity: number) => {
    if (quantity !== cartItem.quantity) {
      onQuantityChanged(product, quantity);
    }
  };

  return (
    <div
      className={`flex shadow-md rounded p-4 items-center justify-between`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Image
        src={product.mainImage.url}
        alt={product.name}
        backupImageSrc={PUBLIC_IMAGE_PATHS.defaultProductImage}
        className="rounded h-24"
      />
      <div className="flex flex-col w-2/4 lg:w-1/5">
        <Text className="capitalize font-poppinsMedium text-lg">
          {product.name}
        </Text>
        <Text>
          {`x ${cartItem.quantity}`}
        </Text>
        <Text>
          {formatAmount(subTotal, product.currency || DEFAULT_CURRENCY)}
        </Text>

        {!isInStock && (
          <Text className={`capitalize mt-2 font-poppinsMedium text-darkRed`}>
            {t("outOfStock")}
          </Text>
        )}

        <div className={`flex mt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <QuantityCounter
            onQuantityChanged={quantityChangeHandler}
            defaultQuantity={cartItem.quantity}
            maxLimit={product.stock}
            className="flex-1"
            textClassName="text-base font-poppinsMedium"
          />
          <Button
            onClickHandler={() => removeFromCart(product)}
            className={`${isRTL ? "mr-2" : "ml-2"}`}
          >
            <DeleteIcon className="w-6 h-6 fill-darkRed" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
