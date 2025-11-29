import React from "react";

interface UsersFiltersProps {
  genderFilter: string;
  ageFilter: string;
  roleFilter: string;
  searchTerm: string;
  setGenderFilter: (value: string) => void;
  setAgeFilter: (value: string) => void;
  setRoleFilter: (value: string) => void;
  setSearchTerm: (value: string) => void;
  onNewUser: () => void;
  searchPlaceholder?: string;
  newUserLabel?: string;
  allGenderLabel?: string;
  maleLabel?: string;
  femaleLabel?: string;
  allAgesLabel?: string;
  allRolesLabel?: string;
}

const UsersFilters: React.FC<UsersFiltersProps> = ({
  genderFilter,
  ageFilter,
  roleFilter,
  searchTerm,
  setGenderFilter,
  setAgeFilter,
  setRoleFilter,
  setSearchTerm,
  onNewUser,
  searchPlaceholder = "Search users...",
  newUserLabel = "New User",
  allGenderLabel = "All Genders",
  maleLabel = "Male",
  femaleLabel = "Female",
  allAgesLabel = "All Ages",
  allRolesLabel = "All Roles",
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-3">
        {/* Gender Filter */}
        <div className="relative">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Genders">{allGenderLabel}</option>
            <option value="Male">{maleLabel}</option>
            <option value="Female">{femaleLabel}</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Age Filter */}
        <div className="relative">
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Ages">{allAgesLabel}</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46+">46+</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Role Filter */}
        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All Roles">{allRolesLabel}</option>
            <option value="Administrator">Administrator</option>
            <option value="Lab Manager">Lab Manager</option>
            <option value="Lab User">Lab User</option>
            <option value="Service User">Service User</option>
            <option value="Normal User">Normal User</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* New User Button */}
        <button
          onClick={onNewUser}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {newUserLabel}
        </button>
      </div>
    </div>
  );
};

export default UsersFilters;
