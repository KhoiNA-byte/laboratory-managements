import React from "react";

interface UsersHeaderProps {}

const UsersHeader: React.FC<UsersHeaderProps> = () => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Users Management
      </h1>
      <p className="text-gray-600">
        Manage system users and their access permissions
      </p>
    </div>
  );
};

export default UsersHeader;
