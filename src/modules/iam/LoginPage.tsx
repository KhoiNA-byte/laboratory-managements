import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, setRedirectPath } from "../../store/slices/authSlice";
import { RootState } from "../../store";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { redirectPath, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirect when login succeeds
  useEffect(() => {
    if (isAuthenticated) {
      // If there's a redirectPath, use it, else default to '/'
      navigate(redirectPath || "/");
    }
  }, [isAuthenticated, redirectPath, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-gray-500">
            Sign in to access your laboratory system
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p>
              <strong>Admin:</strong> admin@lab.com / AdminSecure2024!
            </p>
            <p>
              <strong>User:</strong> user@lab.com / LabSecure2024!
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/verify-otp")}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 px-4 rounded-md transition-colors ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
