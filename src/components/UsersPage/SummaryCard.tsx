import React from "react";

interface SummaryCardProps {
  totalUsers: number;
  newThisMonth: number;
  growthPercentage: number;
  totalLabel?: string;
  totalDescription?: string;
  newLabel?: string;
  newDescription?: string;
}

const SummaryCards: React.FC<SummaryCardProps> = ({
  totalUsers,
  newThisMonth,
  growthPercentage,
  totalLabel = "Total Users",
  totalDescription = "Active records",
  newLabel = "New This Month",
  newDescription = `+${growthPercentage}% from last month`,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Users Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {totalLabel}
            </p>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
            <p className="text-sm text-gray-500 mt-1">{totalDescription}</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* New This Month Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {newLabel}
            </p>
            <p className="text-3xl font-bold text-gray-900">{newThisMonth}</p>
            <p className="text-sm text-green-600 mt-1">{newDescription}</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
