// src/components/AddReagent.tsx
import React, { useMemo, useState } from "react";
// src/types.ts
export type ReagentServer = {
  id?: number;                 // mock-api thường trả number as string
  name: string;
  lot_number: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  usage_per_run?: number;
  expiry_date?: string;       // ISO date string
  location?: string;
  min_stock?: number;
  max_stock?: number;
  cost?: number;
  created_at?: string;
  updated_at?: string;
  typeCbcs?: string[];        // array of strings, e.g. ["WBC","RBC"]
};

export type ReagentForm = {
  name: string;
  lotNumber: string;
  manufacturer: string;
  quantity: number;
  unit: string;
  usagePerRun?: number;
  expiryDate?: string;        // yyyy-mm-dd
  location?: string;
  minStock?: number;
  maxStock?: number;
  cost?: number;
  typeCbcs?: string[];        // client representation
};

interface AddReagentProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReagentForm) => Promise<void> | void;
}

const TYPE_OPTIONS = ["WBC","RBC","HGB","HCT","PLT","MCV","MCH","MCHC"];

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`w-full border rounded-lg px-3 py-2 ${props.className ?? ""}`} />
);

const AddReagent: React.FC<AddReagentProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<ReagentForm>({
    name: "",
    lotNumber: "",
    manufacturer: "",
    quantity: 0,
    unit: "Tests",
    usagePerRun: undefined,
    expiryDate: "",
    location: "",
    minStock: 0,
    maxStock: 0,
    cost: 0,
    typeCbcs: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.lotNumber.trim() !== "" &&
      form.manufacturer.trim() !== "" &&
      typeof form.quantity === "number" &&
      form.quantity >= 0 &&
      form.location?.trim() !== "" &&
      !!form.expiryDate
    );
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const type = (e.target as HTMLInputElement).type;
    let value: any = e.target.value;
    if (type === "number") value = value === "" ? "" : Number(value);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const toggleType = (value: string) => {
    setForm(prev => {
      const arr = prev.typeCbcs ?? [];
      if (arr.includes(value)) return { ...prev, typeCbcs: arr.filter(a => a !== value) };
      return { ...prev, typeCbcs: [...arr, value] };
    });
  };

  const onSubmitForm = async () => {
    setError(null);
    if (!valid) {
      setError("Vui lòng điền đủ các trường bắt buộc.");
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit(form);
      // reset
      setForm({
        name: "",
        lotNumber: "",
        manufacturer: "",
        quantity: 0,
        unit: "Tests",
        usagePerRun: undefined,
        expiryDate: "",
        location: "",
        minStock: 0,
        maxStock: 0,
        cost: 0,
        typeCbcs: [],
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError("Add reagent failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-[820px] shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Add Reagent</h3>
          <p className="text-sm text-gray-500">Enter reagent details</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Reagent Name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lot number *</label>
              <Input name="lotNumber" value={form.lotNumber} onChange={handleChange} placeholder="LOT-2025-..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Manufacturer *</label>
            <Input name="manufacturer" value={form.manufacturer} onChange={handleChange} placeholder="Manufacturer" />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Quantity *</label>
                <Input name="quantity" type="number" value={form.quantity as any} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option>Tests</option>
                  <option>Bottles</option>
                  <option>mL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Expiry date *</label>
                <Input name="expiryDate" type="date" value={form.expiryDate ?? ""} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Location *</label>
                <select name="location" value={form.location} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select...</option>
                  <option>Refrigerator A1</option>
                  <option>Refrigerator A2</option>
                  <option>Cabinet B1</option>
                </select>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Usage per run</label>
                <Input name="usagePerRun" type="number" value={form.usagePerRun ?? ""} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min stock</label>
                <Input name="minStock" type="number" value={form.minStock ?? 0} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max stock</label>
                <Input name="maxStock" type="number" value={form.maxStock ?? 0} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">Cost</label>
              <Input name="cost" type="number" value={form.cost ?? 0} onChange={handleChange} />
            </div>
          </div>

          {/* typeCbcs checkbox group */}
          <div>
            <label className="block text-sm font-medium mb-2">Type CBC (chọn 1 hoặc nhiều)</label>
            <div className="grid grid-cols-4 gap-2">
              {TYPE_OPTIONS.map(opt => {
                const checked = (form.typeCbcs ?? []).includes(opt);
                return (
                  <label key={opt} className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleType(opt)}
                      className="h-4 w-4"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
          <button
            onClick={onSubmitForm}
            disabled={!valid || submitting}
            className={`px-4 py-2 rounded-lg text-white ${valid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"}`}
          >
            {submitting ? "Adding..." : "Add Reagent"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReagent;
