import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/index";
import { addReagentRequest, ReagentForm } from "../../store/slices/reagentSlice";

interface AddReagentProps {
  isOpen: boolean;
  onClose: () => void;
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      props.className ?? ""
    }`}
  />
);

const AddReagent: React.FC<AddReagentProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<ReagentForm>({
    name: "",
    lotNumber: "",
    manufacturer: "",
    quantity: 0,
    unit: "µL",
    usagePerRun: undefined,
    expiryDate: "",
    location: "",
    minStock: 0,
    maxStock: 0,
    cost: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => {
    // basic required validation
    return (
      !!form.name.trim() &&
      !!form.lotNumber.trim() &&
      !!form.manufacturer.trim() &&
      typeof form.quantity === "number" &&
      form.quantity >= 0 &&
      !!form.location?.trim() &&
      !!form.expiryDate &&
      // ensure min/max are numbers and min <= max (if provided)
      typeof form.minStock === "number" &&
      typeof form.maxStock === "number" &&
      form.minStock <= form.maxStock
    );
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    let value: any = e.target.value;
    // normalize number inputs
    if ((e.target as HTMLInputElement).type === "number") {
      // allow empty string to clear
      value = value === "" ? "" : Number(value);
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitForm = () => {
    if (!valid) {
      setError(
        "Please fill required fields. Ensure min stock ≤ max stock and required fields are not empty."
      );
      return;
    }
    setError(null);
    setSubmitting(true);
    // dispatch redux action (saga will handle API + refresh)
    dispatch(addReagentRequest(form));
    setSubmitting(false);
    onClose();
    // reset form
    setForm({
      name: "",
      lotNumber: "",
      manufacturer: "",
      quantity: 0,
      unit: "µL",
      usagePerRun: undefined,
      expiryDate: "",
      location: "",
      minStock: 0,
      maxStock: 0,
      cost: 0,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[720px] shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Add Reagent</h3>
          <p className="text-sm text-gray-500">Enter reagent details</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Name & Lot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Reagent Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Lot number *
              </label>
              <Input
                name="lotNumber"
                value={form.lotNumber}
                onChange={handleChange}
                placeholder="LOT-2025-..."
              />
            </div>
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium mb-1">Manufacturer *</label>
            <Input
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              placeholder="Manufacturer"
            />
          </div>

          {/* Quantity / Unit / Expiry / Location */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Quantity *
              </label>
              <Input
                name="quantity"
                type="number"
                min={0}
                value={form.quantity as any}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option>µL</option>
                <option>mL</option>
                <option>Tests</option>
                <option>Bottles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Expiry date *
              </label>
              <Input
                name="expiryDate"
                type="date"
                value={form.expiryDate ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Location *
              </label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select...</option>
                <option>Refrigerator A1</option>
                <option>Refrigerator A2</option>
                <option>Cabinet B1</option>
                <option>Shelf C1</option>
              </select>
            </div>
          </div>

          {/* usagePerRun / minStock / maxStock / cost */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Usage per run (µL)
              </label>
              <Input
                name="usagePerRun"
                type="number"
                min={0}
                value={form.usagePerRun === undefined ? "" : (form.usagePerRun as any)}
                onChange={handleChange}
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min stock</label>
              <Input
                name="minStock"
                type="number"
                min={0}
                value={form.minStock as any}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max stock</label>
              <Input
                name="maxStock"
                type="number"
                min={0}
                value={form.maxStock as any}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cost (per unit)</label>
              <Input
                name="cost"
                type="number"
                min={0}
                step="0.01"
                value={form.cost as any}
                onChange={handleChange}
                placeholder="e.g., 12.50"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSubmitForm}
            disabled={!valid || submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              valid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
            }`}
          >
            {submitting ? "Adding..." : "Add Reagent"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReagent;
