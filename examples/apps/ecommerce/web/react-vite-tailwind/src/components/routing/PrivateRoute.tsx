import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/app/hook";
import Loader from "../uiComponents/Loader";

const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const data = useAppSelector((appStore) => appStore.authReducer);

  //If loading is true loader will render
  if (data.isLoading) return <Loader />;

  if (!data.token || !data.user?._id) return <Navigate to="/login" replace />;

  //If authenticated ,render the child component
  return children;
};

export default PrivateRoute;
