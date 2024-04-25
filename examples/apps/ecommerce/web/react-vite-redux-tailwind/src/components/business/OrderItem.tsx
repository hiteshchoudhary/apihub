import { useMemo } from "react";
import { PUBLIC_IMAGE_PATHS } from "../../constants";
import { OrderItemClass } from "../../services/order/OrderTypes";
import { formatAmount } from "../../utils/commonHelper";
import Image from "../basic/Image";
import Text from "../basic/Text";
import { DEFAULT_CURRENCY } from "../../data/applicationData";
import { useAppSelector } from "../../store";

interface OrderItemProps {
  orderItem: OrderItemClass;
}

const OrderItem = (props: OrderItemProps) => {
  const { orderItem } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  /* Subtotal: price * quantity */
  const subTotal = useMemo(() => {
    return orderItem.product.price * orderItem.quantity;
  }, [orderItem]);

  return (
    <div
      className="flex shadow-md rounded p-4 items-center justify-between"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Image
        src={orderItem.product.mainImage.url}
        alt={orderItem.product.name}
        backupImageSrc={PUBLIC_IMAGE_PATHS.defaultProductImage}
        className="h-24 rounded"
      />

      <div className="flex flex-col w-2/4 lg:w-1/5">
        <Text className="capitalize font-poppinsMedium text-lg">
          {orderItem.product.name}
        </Text>
        <div className="flex gap-x-1">
          <Text>
            {`${formatAmount(orderItem.product.price, orderItem.product?.currency || DEFAULT_CURRENCY)}`}
          </Text>
          <Text>*</Text>
          <Text>{`${orderItem.quantity}`}</Text>
        </div>
        <Text className="font-poppinsMedium">
          {formatAmount(
            subTotal,
            orderItem?.product?.currency || DEFAULT_CURRENCY
          )}
        </Text>
      </div>
    </div>
  );
};

export default OrderItem;
