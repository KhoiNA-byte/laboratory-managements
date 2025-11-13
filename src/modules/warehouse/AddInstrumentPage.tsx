// AddInstrument.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { fetchReagentsRequest } from "../../store/slices/reagentSlice";
import { addInstrumentRequest } from "../../store/slices/instrumentsSlice";

interface AddInstrumentProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddInstrument: React.FC<AddInstrumentProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<any>();

  // Lấy danh sách reagents từ store
  const { list: reagents, loading: loadingReagents } = useSelector(
    (state: RootState) => state.reagents
  );

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    status: "Active",
    serialNumber: "",
    location: "",
    manufacturer: "",
    supportedTest: [] as string[],
    supportedReagents: [] as string[],
  });

  const [selectedReagent, setSelectedReagent] = useState<string>("");

  // --- Fetch reagents khi mở popup ---
  useEffect(() => {
    if (isOpen) dispatch(fetchReagentsRequest());
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (reagents.length > 0) setSelectedReagent(reagents[0].name);
  }, [reagents]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTest = () => {
    const t = prompt("Enter supported test (e.g., CBC)");
    if (t && !formData.supportedTest.includes(t)) {
      setFormData((prev) => ({
        ...prev,
        supportedTest: [...prev.supportedTest, t],
      }));
    }
  };

  const handleAddReagent = () => {
    if (
      selectedReagent &&
      !formData.supportedReagents.includes(selectedReagent)
    ) {
      setFormData((prev) => ({
        ...prev,
        supportedReagents: [...prev.supportedReagents, selectedReagent],
      }));
    }
  };

  const handleSave = () => {
    dispatch(addInstrumentRequest(formData));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Add New Instrument
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instrument Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) =>
                  handleInputChange("serialNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) =>
                  handleInputChange("manufacturer", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Supported Tests */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Supported Tests</span>
              <button
                onClick={handleAddTest}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add
              </button>
            </div>
            {formData.supportedTest.length === 0 ? (
              <div className="text-gray-400 text-sm">No tests added</div>
            ) : (
              <ul className="list-disc pl-5 text-gray-700">
                {formData.supportedTest.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Supported Reagents */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">
                Supported Reagents
              </span>
            </div>
            <div className="flex gap-2 mb-3">
              <select
                value={selectedReagent}
                onChange={(e) => setSelectedReagent(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={loadingReagents}
              >
                {loadingReagents ? (
                  <option>Loading...</option>
                ) : (
                  reagents.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))
                )}
              </select>
              <button
                onClick={handleAddReagent}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loadingReagents}
              >
                + Add
              </button>
            </div>
            {formData.supportedReagents.length === 0 ? (
              <div className="text-gray-400 text-sm">No reagents added</div>
            ) : (
              <ul className="list-disc pl-5 text-gray-700">
                {formData.supportedReagents.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Instrument
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstrument;
