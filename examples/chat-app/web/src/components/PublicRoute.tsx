import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();

  if (token && user?._id) return <Navigate to="/chat" replace />;
  return children;
};

export default PublicRoute;
