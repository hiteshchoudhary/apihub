import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../Loading";

const NonAuthRoute = ({ children }: { children: ReactNode }) => {
  const { token, user, loadingUser } = useSelector(
    (state: RootState) => state.auth
  );

  if (loadingUser) {
    return <Loading />;
  }

  if (token && user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default NonAuthRoute;
