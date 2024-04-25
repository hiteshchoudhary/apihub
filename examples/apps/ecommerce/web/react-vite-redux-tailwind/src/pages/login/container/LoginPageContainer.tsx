import { useEffect } from "react";
import LoginPage from "../presentation/LoginPage"
import { useAppSelector } from "../../../store";
import useCustomNavigate from "../../../hooks/useCustomNavigate";


const LoginPageContainer = () => {

    const navigate = useCustomNavigate();

    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

    /* If the user is logged in navigate to home */
    useEffect(() => {
        if(isLoggedIn){
            navigate("/", false);
        }
    },  [navigate, isLoggedIn])
    return (
        <LoginPage />
    )
}

export default LoginPageContainer;