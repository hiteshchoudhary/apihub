import { useEffect } from "react";
import SignupPage from "../presentation/SignupPage"
import { useAppSelector } from "../../../store";
import useCustomNavigate from "../../../hooks/useCustomNavigate";


const SignupPageContainer = () => {

    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
    const navigate = useCustomNavigate();

    useEffect(() => {
        if(isLoggedIn){
            navigate("/", true);
        }
    }, [isLoggedIn, navigate])
    
    return (
        <SignupPage />
    )
}

export default SignupPageContainer;