import { useLocation } from "react-router-dom";
import PaymentFeedbackPage from "../presentation/PaymentFeedbackPage"
import { useEffect } from "react";
import useCustomNavigate from "../../../hooks/useCustomNavigate";


const PaymentFeedbackPageContainer = () => {

    const location = useLocation();
    const navigate = useCustomNavigate();


    useEffect(() => {
        if(!location.state?.checkoutDetails){
            navigate("/", true);
        }
    }, [location, navigate])

    const navigateToHome = () => {
        navigate("/", true);
    }
    return (
        <PaymentFeedbackPage 
            isSuccess={location.state?.checkoutDetails?.isSuccess ? true : false}
            navigateToHome={navigateToHome}
        />
    )
}

export default PaymentFeedbackPageContainer;