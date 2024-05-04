import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useMemo, useRef } from "react";
import OrderService from "../../services/order/OrderService";
import ApiError from "../../services/ApiError";
import { OnApproveData } from "@paypal/paypal-js/types/components/buttons";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { ROUTE_PATHS } from "../../constants";
import { useAppDispatch } from "../../store";
import { getUserCartThunk } from "../../store/CartSlice";
interface PaymentProps {
  addressId: string;
  isDisabled?: boolean
}
const Payment = (props: PaymentProps) => {
  const { addressId, isDisabled = false } = props;

  const navigate = useCustomNavigate();
  const dispatch = useAppDispatch();

  const paypalClientId = useMemo(() => {
    return import.meta.env.VITE_PAYPAL_CLIENT_ID;
  }, []);

  const addressIdRef = useRef("");

  useEffect(() => {
    addressIdRef.current = addressId
  }, [addressId])
  
  const createOrder = async () => {
    return OrderService.generatePayPalOrder(addressIdRef.current)
      .then((response) => {
        if (!(response instanceof ApiError)) {
          return response.id;
        } else {
          /* Error Here */
          throw response;
        }
      })
      .catch((error) => {
        console.error("Payment, Create Order Api Error", error);
        return "";
      });
  };

  const onApprove = async (data: OnApproveData) => {
    return OrderService.verifyPayment(data.orderID).then((response) => {
      if (!(response instanceof ApiError)) {
        /* Payment Successful */
        dispatch(getUserCartThunk());
        navigate(ROUTE_PATHS.paymentFeedback, true, {checkoutDetails: {isSuccess: true}})
      } else {
        console.error("Payment, On Approve Order Failed", response);
        /* Failed */
        navigate(ROUTE_PATHS.paymentFeedback, true, {checkoutDetails: {isSuccess: false}})
      }
    });
  };
  return (
    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
      <div className="z-0">
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} disabled={isDisabled} />
      </div>
    </PayPalScriptProvider>
  );
};

export default Payment;
