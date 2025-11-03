import React from "react";
import { useNavigate } from "react-router-dom";
import NavHomePage from "./NavHomePage";
import HeaderHomePage from "./HeaderHomePage";
import AboutHomePage from "./AboutHomePage";
import FeaturesHomePage from "./FeaturesHomePage";
import WorkHomePage from "./WorkHomePage";
import TestimonialsHomePage from "./TestimonialsHomePage";
import FooterHomePage from "./FooterHomePage";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <NavHomePage />

      {/* Hero Section */}
      <HeaderHomePage />
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
