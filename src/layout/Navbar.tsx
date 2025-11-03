import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutRequest } from '../store/slices/authSlice'
import {
  MagnifyingGlassIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
export const Navbar = () => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logoutRequest())
  }

  return (
    <div className="bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Test Results
              </h1>
              <p className="text-gray-600 mt-1">
                View your laboratory test results
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <BellIcon className="h-6 w-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
