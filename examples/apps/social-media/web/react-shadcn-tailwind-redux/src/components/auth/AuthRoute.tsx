// required imports

import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../Loading";

const AuthRoute = ({ children }: { children: ReactNode }) => {
  const { token, user, loadingUser } = useSelector(
    (state: RootState) => state.auth
  );

  // loading state if the data is requested
  if (loadingUser) {
    return <Loading />;
  }

  // check user and token both are available, else redirect to login
  if (!token || !user?._id) {
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default AuthRoute;
