import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store";
import { HomePage } from "./HomePage";
import { HomePageLoggedIn } from "./HomePageLoggedIn";

export const HomePageWrapper = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Nếu đã đăng nhập
  if (isAuthenticated) {
  // If user has admin, lab_manager, lab_user, or service_user role, go to admin
  if (user?.role === "admin" || user?.role === "lab_manager" || user?.role === "lab_user" || user?.role === "service_user") {
    return <Navigate to="/admin" replace />;
  }
  // If normal user, go to home
  return <Navigate to="/home" replace />;
}

  // Nếu chưa đăng nhập, hiển thị trang Home chưa đăng nhập
  return <HomePage />;
};
