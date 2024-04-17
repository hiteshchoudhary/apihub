import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token } = useSelector((appStore) => appStore.authReducer);

  if (!token || !user?._id) return <Navigate to="/login" replace />;

  //If authenticated ,render the child component
  return children;
};

export default PrivateRoute;
