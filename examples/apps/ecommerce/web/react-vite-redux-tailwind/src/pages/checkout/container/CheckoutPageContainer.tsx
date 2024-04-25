import { useEffect, useMemo } from "react";
import CheckoutPage from "../presentation/CheckoutPage"
import { useLocation } from "react-router-dom";
import useCustomNavigate from "../../../hooks/useCustomNavigate";
import { useAppSelector } from "../../../store";


const CheckoutPageContainer = () => {

    const navigate = useCustomNavigate();
    const location = useLocation();

    const userCart = useAppSelector((state) => state.cart.userCart);

    /* Checking for isFromCartPage state in route location */
    const isFromCartPage = useMemo(() => {
        return location.state?.isFromCartPage;
    }, [location])

    useEffect(() => {
        /* User can only come to checkout page from cart page */
        if(!isFromCartPage){
            navigate("/", true);
        }

    }, [isFromCartPage, navigate])

    /* No Items in the cart */
    useEffect(() => {
        if(!userCart?.items?.length){
            navigate("/", true);
        }
    }, [userCart, navigate])

    return (
        <CheckoutPage />
    )
}

export default CheckoutPageContainer;