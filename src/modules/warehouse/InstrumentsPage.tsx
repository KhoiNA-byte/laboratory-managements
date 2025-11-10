// InstrumentsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Instrument {
  id: string;
  name: string;
  model: string;
  status: string;
  serialNumber?: string;
  location?: string;
  manufacturer?: string;
  supportedTest?: string[];
  supportedReagents?: string[];
  created_at?: string;
  updated_at?: string;
  nextCalibration?: string;
  calibrationDue?: boolean;
}

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io/";
const RESOURCE = "/instruments";

const InstrumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showActionsDropdown, setShowActionsDropdown] = useState<string | null>(
    null
  );
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstruments();
    // close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showActionsDropdown && !target.closest(".dropdown-container")) {
        setShowActionsDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showActionsDropdown]);

  async function fetchInstruments() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${RESOURCE}`);
      setInstruments(res.data ?? []);
    } catch (err) {
      console.error("Failed to fetch instruments:", err);
      setInstruments([]);
    } finally {
      setLoading(false);
    }
  }

  // Handlers
  const handleViewDetails = (instrumentId: string) => {
    setShowActionsDropdown(null);
    navigate(`/admin/instruments/${instrumentId}`);
  };

  const handleUpdateQuantity = (instrumentId: string) => {
    setShowActionsDropdown(null);
    const newVal = prompt("Enter new value (this demo does not persist):");
    if (newVal !== null) alert("Demo only — implement API PATCH to persist.");
  };

  const handleMoveLocation = (instrumentId: string) => {
    setShowActionsDropdown(null);
    const newLoc = prompt("Enter new location:");
    if (newLoc) alert("Demo only — implement API PATCH to persist.");
  };

  const handleDeleteInstrument = async (instrumentId: string) => {
    setShowActionsDropdown(null);
    if (!window.confirm("Are you sure you want to delete this instrument?"))
      return;
    try {
      await axios.delete(`${API_BASE}/${RESOURCE}/${instrumentId}`);
      // remove locally
      setInstruments((prev) => prev.filter((i) => i.id !== instrumentId));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed. Check console.");
    }
  };

  const handleAddInstrument = () => navigate("/admin/instruments/new");

  // filtering
  const filteredInstruments = instruments.filter(
    (instrument) =>
      instrument.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInstruments = instruments.length;
  const activeInstruments = instruments.filter(
    (i) => i.status === "Active"
  ).length;
  const maintenanceInstruments = instruments.filter(
    (i) => i.status === "Maintenance"
  ).length;
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
          <p className="text-3xl font-bold text-gray-900">
            {activeInstruments}
          </p>
          <p className="text-sm text-gray-500">Operational</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-600">Maintenance</p>
          <p className="text-3xl font-bold text-gray-900">
            {maintenanceInstruments}
          </p>
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
            <h3 className="text-lg font-semibold text-gray-900">
              All Instruments
            </h3>
            <p className="text-sm text-gray-600">
              View and manage laboratory equipment
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded">
              + Sync-up
            </button>
            <button
              onClick={handleAddInstrument}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
            >
              + Add Instrument
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-end mb-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search instruments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading instruments...
            </div>
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
                  <div
                    className={`p-4 ${instrument.calibrationDue ? "pt-8" : ""}`}
                  >
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
                          <h4 className="font-medium text-gray-900">
                            {instrument.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {instrument.model}
                          </p>
                        </div>
                      </div>

                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionsDropdown(
                              showActionsDropdown === instrument.id
                                ? null
                                : instrument.id
                            );
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
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
                                onClick={() =>
                                  handleUpdateQuantity(instrument.id)
                                }
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Update Quantity
                              </button>
                              <button
                                onClick={() =>
                                  handleMoveLocation(instrument.id)
                                }
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Move location
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteInstrument(instrument.id)
                                }
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
                        <span className="text-gray-900">
                          {instrument.serialNumber ?? "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900">
                          {instrument.location ?? "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Manufacturer:</span>
                        <span className="text-gray-900">
                          {instrument.manufacturer ?? "-"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Supported Tests:</span>
                        <span className="text-gray-900">
                          {(instrument.supportedTest || []).join(", ") || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstrumentsPage;
