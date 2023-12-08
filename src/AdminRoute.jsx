import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import { UserContext } from "./context/UserContext";

const AdminRoute = ({ element }) => {
  const { activeUser } = useContext(UserContext);

  // activeUser yüklenmemişse bekleyin
  if (!activeUser) {
    return null;
  }

  return activeUser.type === "admin" ? (
    element
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
