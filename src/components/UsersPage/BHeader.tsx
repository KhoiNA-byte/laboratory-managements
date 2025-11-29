import React from "react";

interface UsersHeaderProps {
  title?: string;
  subtitle?: string;
}

const BHeader: React.FC<UsersHeaderProps> = ({
  title = "All Users",
  subtitle = "View and manage all system users",
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default BHeader;
