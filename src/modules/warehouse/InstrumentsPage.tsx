// InstrumentsPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchInstrumentsRequest,
  deleteInstrumentRequest,
} from "../../store/slices/instrumentsSlice";
import AddInstrument from "./AddInstrumentPage";

const InstrumentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { instruments, loading } = useSelector(
    (state: RootState) => state.instruments
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInstrumentsRequest());
  }, [dispatch]);

  // Filtering
  const filteredInstruments = instruments.filter(
    (instrument) =>
      instrument.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalInstruments = instruments.length;
  const activeInstruments = instruments.filter((i) => i.status === "Active").length;
  const maintenanceInstruments = instruments.filter((i) => i.status === "Maintenance").length;
  const calibrationDue = instruments.filter((i) => i.calibrationDue).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-blue-100 text-blue-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (id: string) => {
    setShowActionsDropdown(null);
    // navigate(`/admin/instruments/${id}`); // giữ nếu muốn đi tới chi tiết
  };

  const handleDeleteInstrument = (id: string) => {
    setShowActionsDropdown(null);
    if (!window.confirm("Are you sure you want to delete this instrument?")) return;
    dispatch(deleteInstrumentRequest(id));
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-600">Total Instruments</p>
          <p className="text-3xl font-bold text-gray-900">{totalInstruments}</p>
          <p className="text-sm text-gray-500">All equipment</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-gray-900">{activeInstruments}</p>
          <p className="text-sm text-gray-500">Operational</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-600">Maintenance</p>
          <p className="text-3xl font-bold text-gray-900">{maintenanceInstruments}</p>
          <p className="text-sm text-gray-500">Under service</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-600">Calibration Due</p>
          <p className="text-3xl font-bold text-gray-900">{calibrationDue}</p>
          <p className="text-sm text-gray-500">Within 7 days</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Instruments</h3>
            <p className="text-sm text-gray-600">View and manage laboratory equipment</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded">
              + Sync-up
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
            >
              + Add Instrument
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-end mb-4">
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading instruments...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstruments.map((instrument) => (
                <div
                  key={instrument.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm relative"
                >
                  {instrument.calibrationDue && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs font-medium py-1 text-center rounded-t-lg">
                      Calibration due soon
                    </div>
                  )}
                  <div className={`p-4 ${instrument.calibrationDue ? "pt-8" : ""}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{instrument.name}</h4>
                          <p className="text-sm text-gray-500">{instrument.model}</p>
                        </div>
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsDropdown(
                              showActionsDropdown === instrument.id ? null : instrument.id
                            );
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {showActionsDropdown === instrument.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(instrument.id)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => handleDeleteInstrument(instrument.id)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >
                                Delete Instrument
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            instrument.status
                          )}`}
                        >
                          {instrument.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Serial:</span>
                        <span className="text-gray-900">{instrument.serialNumber ?? "-"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900">{instrument.location ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Popup AddInstrument */}
      {isAddOpen && <AddInstrument isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />}
    </div>
  );
};

export default InstrumentsPage;
