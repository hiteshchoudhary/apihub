import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../Loading";

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { token, user, loadingUser } = useSelector(
    (state: RootState) => state.auth
  );

  if (loadingUser) {
    return <Loading />;
  }

  // check user and token both are available, else redirect to login
  if (!token || !user) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default AuthRoute;
