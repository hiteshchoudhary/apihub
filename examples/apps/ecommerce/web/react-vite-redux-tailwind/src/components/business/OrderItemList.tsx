import { OrderItemClass } from "../../services/order/OrderTypes";
import OrderItem from "./OrderItem";

interface OrderItemListProps {
  itemList: Array<OrderItemClass>;
}
const OrderItemList = (props: OrderItemListProps) => {
  const { itemList } = props;

  return (
    <div className="flex flex-col">
      {itemList.map((item) => (
        <div className="mb-4" key={item._id}>
          <OrderItem orderItem={item} />
        </div>
      ))}
    </div>
  );
};

export default OrderItemList;
