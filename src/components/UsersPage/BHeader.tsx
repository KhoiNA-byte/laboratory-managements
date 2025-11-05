import React from "react";

interface UsersHeaderProps {}

const BHeader: React.FC<UsersHeaderProps> = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        <p className="text-sm text-gray-600">
          View and manage all system users
        </p>
      </div>
    </div>
  );
};

export default BHeader;
