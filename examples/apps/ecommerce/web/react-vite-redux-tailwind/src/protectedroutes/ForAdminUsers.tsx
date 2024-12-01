import { Outlet } from "react-router-dom";
import { USER_ROLES } from "../services/auth/AuthTypes";
import { useAppSelector } from "../store";
import { useEffect } from "react";
import useCustomNavigate from "../hooks/useCustomNavigate";


const ForAdminUsers = () => {
    const user = useAppSelector((state) => state.auth.userDetails);
    const isLogInCheckDone = useAppSelector((state) => state.auth.isLogInCheckDone);

    const navigate = useCustomNavigate();

    useEffect(() => {
        if(isLogInCheckDone && user?.role !== USER_ROLES.admin){
            navigate("/", true);
        }
    }, [isLogInCheckDone, user?.role, navigate])

    if(isLogInCheckDone && user && user.role == USER_ROLES.admin){
        return <Outlet />;
    }

    return <></>
}

export default ForAdminUsers;