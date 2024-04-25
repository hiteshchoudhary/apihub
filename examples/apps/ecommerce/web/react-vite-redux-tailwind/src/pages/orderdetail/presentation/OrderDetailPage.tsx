import OrderDetailContainer from "../../../components/widgets/orderdetail/container/OrderDetailContainer";


interface OrderDetailPageProps {
    orderId: string;
}
const OrderDetailPage = ({orderId}: OrderDetailPageProps) => {

    return (
        <div className="px-2 py-4 lg:px-10">
            <OrderDetailContainer orderId={orderId} />

        </div>
    )
}

export default OrderDetailPage;