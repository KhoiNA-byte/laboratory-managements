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
    // Nếu là admin, chuyển đến dashboard
    if (user?.role !== "normal_user") {
      return <Navigate to="/admin" replace />;
    }
    // Nếu là user, hiển thị trang Home đã đăng nhập
    return <HomePageLoggedIn />;
  }

  // Nếu chưa đăng nhập, hiển thị trang Home chưa đăng nhập
  return <HomePage />;
};
