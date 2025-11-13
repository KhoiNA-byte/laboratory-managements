"use client";

import { ChevronLeft, Search, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProfileHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 hover:bg-muted rounded-lg">
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted-foreground">
            View and manage information
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm outline-none"
          />
        </div>
        <button className="relative p-2 hover:bg-muted rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
      </div>
    </div>
  );
}
