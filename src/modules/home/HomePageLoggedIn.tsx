import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logoutRequest } from "../../store/slices/authSlice";
import NavHomePage from "./NavHomePage";
import AboutHomePage from "./AboutHomePage";
import FeaturesHomePage from "./FeaturesHomePage";
import WorkHomePage from "./WorkHomePage";
import TestimonialsHomePage from "./TestimonialsHomePage";
import FooterHomePage from "./FooterHomePage";
import HeaderHomePageLoggin from "./HeaderHomePageLoggin";

export const HomePageLoggedIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <h1 className="text-xl font-bold text-blue-600">
                Lab Management System
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Trang chủ
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Tính năng
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Tài nguyên
              </a>
            </nav>

            {/* Right side icons and user info */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">🔍</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">📊</span>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">👥</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {(user?.name || user?.username || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">
                  {user?.name || user?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeaderHomePageLoggin />
      {/* What is Hematology Management Section */}
      <AboutHomePage />

      {/* Features Section */}
      <FeaturesHomePage />
      {/* How it Works Section */}
      <WorkHomePage />
      {/* Testimonials Section */}
      <TestimonialsHomePage />

      {/* Footer */}
      <FooterHomePage />
    </div>
  );
};
