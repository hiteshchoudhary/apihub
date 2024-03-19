// required imports

import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../Loading";

const NonAuthRoute = ({ children }: { children: ReactNode }) => {
  const { token, user, loadingUser } = useSelector(
    (state: RootState) => state.auth
  );

  // loading state if the data is requested
  if (loadingUser) {
    return <Loading />;
  }

  // check user and token both are available, redirect to home if available
  if (token && user?._id) {
    return <Navigate to="/" />;
  }

  return children;
};

export default NonAuthRoute;
