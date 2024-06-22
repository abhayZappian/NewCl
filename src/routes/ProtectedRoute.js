import { MyContext } from "context/MyContextProvider";
import React from "react";
import { useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const accessToken = JSON.parse(localStorage.getItem("token"))?.access_token;
  if (accessToken !== null && accessToken !== undefined) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
