// AddInstrumentPage.tsx
import React, { useState, useEffect } from "react"; // Đã thêm useEffect
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "https://69085724b49bea95fbf32f71.mockapi.io/";
const RESOURCE = "instruments";
const REAGENT_RESOURCE = "reagents"; // Resource cho Reagents

const nowIso = () => new Date().toISOString();

// Định nghĩa kiểu dữ liệu cho Reagent
type Reagent = {
  id: string;
  name: string;
  // (có thể có các trường khác)
};

const AddInstrumentPage: React.FC = () => {
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "Hematology Analyzer",
    model: "HA-5000",
    serialNumber: "HA6000-2025-001",
    manufacturer: "MedTech Systems",
    status: "Active",
    location: "Lab Room A",
    supportedTest: [] as string[],
    supportedReagents: [] as string[], // Vẫn là mảng string (tên)
  });

  // State mới để lưu danh sách reagents từ API
  const [availableReagents, setAvailableReagents] = useState<Reagent[]>([]);
  const [selectedReagentName, setSelectedReagentName] = useState<string>("");
  const [loadingReagents, setLoadingReagents] = useState(true);

  // --- Tải Reagents khi component mount ---
  useEffect(() => {
    const fetchReagents = async () => {
      setLoadingReagents(true);
      try {
        const res = await axios.get(`${API_BASE}/${REAGENT_RESOURCE}`);
        const reagents: Reagent[] = res.data || [];
        setAvailableReagents(reagents);
        // Tự động chọn reagent đầu tiên trong danh sách (nếu có)
        if (reagents.length > 0) {
          setSelectedReagentName(reagents[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch reagents", err);
        alert("Không thể tải danh sách thuốc thử (reagents).");
      } finally {
        setLoadingReagents(false);
      }
    };

    fetchReagents();
  }, []); // [] đảm bảo chỉ chạy 1 lần khi mount

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Logic cho Supported Test (giữ nguyên)
  const handleAddSupportedTest = () => {
    const t = prompt("Add supported test (e.g., CBC)");
    if (t)
      setFormData((prev) => ({
        ...prev,
        supportedTest: [...prev.supportedTest, t],
      }));
  };

  // --- Logic mới cho Supported Reagent ---
  const handleAddSupportedReagent = () => {
    if (!selectedReagentName) {
      alert("Vui lòng chọn một thuốc thử từ danh sách.");
      return;
    }

    // Kiểm tra nếu đã thêm rồi
    if (formData.supportedReagents.includes(selectedReagentName)) {
      alert("Thuốc thử này đã được thêm.");
      return;
    }

    // Thêm tên thuốc thử đã chọn vào mảng
    setFormData((prev) => ({
      ...prev,
      supportedReagents: [...prev.supportedReagents, selectedReagentName],
    }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      // Build payload matching format you requested
      const payload = {
        name: formData.name,
        model: formData.model,
        status: formData.status,
        location: formData.location,
        serialNumber: formData.serialNumber,
        manufacturer: formData.manufacturer,
        supportedTest: formData.supportedTest,
        supportedReagents: formData.supportedReagents, // mảng tên reagents
        created_at: nowIso(),
        updated_at: nowIso(),
      };

      const res = await axios.post(`${API_BASE}/${RESOURCE}`, payload);
      console.log("Created instrument:", res.data);

      // after success navigate back to instruments list
      navigate("/admin/instruments", { replace: true });
    } catch (err) {
      console.error("Failed to create instrument", err);
      alert("Tạo instrument thất bại. Kiểm tra console.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/instruments");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Instrument
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new laboratory instrument to the system
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={submitting}
          >
            {/* ... (Icon SVG) */}
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              {/* ... (Name, Serial, Location inputs - không thay đổi) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) =>
                    handleInputChange("serialNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              {/* ... (Model, Manufacturer, Status inputs - không thay đổi) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    handleInputChange("manufacturer", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* supported lists */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* === Supported Tests (Không thay đổi) === */}
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Supported Tests
                </div>
                <button
                  onClick={handleAddSupportedTest}
                  className="text-sm text-blue-600"
                >
                  + add
                </button>
              </div>
              <div className="text-sm text-gray-700">
                {formData.supportedTest.length === 0 ? (
                  <div className="text-gray-400">None</div>
                ) : (
                  <ul className="list-disc pl-5">
                    {formData.supportedTest.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* === Supported Reagents (ĐÃ CẬP NHẬT) === */}
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">
                  Supported Reagents
                </div>
              </div>

              {/* Giao diện chọn và thêm Reagent mới */}
              <div className="flex gap-2 mb-3">
                <select
                  value={selectedReagentName}
                  onChange={(e) => setSelectedReagentName(e.target.value)}
                  disabled={loadingReagents || availableReagents.length === 0}
                  className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white text-sm"
                >
                  {loadingReagents ? (
                    <option>Loading...</option>
                  ) : availableReagents.length === 0 ? (
                    <option>No reagents found</option>
                  ) : (
                    availableReagents.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))
                  )}
                </select>
                <button
                  onClick={handleAddSupportedReagent}
                  className="text-sm text-white bg-blue-600 rounded px-3 py-1"
                  disabled={loadingReagents || availableReagents.length === 0}
                >
                  + Add
                </button>
              </div>

              {/* Danh sách hiển thị các reagents đã thêm */}
              <div className="text-sm text-gray-700">
                {formData.supportedReagents.length === 0 ? (
                  <div className="text-gray-400">None</div>
                ) : (
                  <ul className="list-disc pl-5">
                    {formData.supportedReagents.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border rounded-md text-gray-700 mr-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {submitting ? "Adding..." : "Add Instrument"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInstrumentPage;