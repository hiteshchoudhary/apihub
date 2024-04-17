import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/app/hook";

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const data = useAppSelector((appStore) => appStore.authReducer);

  if (!data.token || !data.user?._id) return <Navigate to="/login" replace />;

  //If authenticated ,render the child component
  return children;
};

export default PrivateRoute;
