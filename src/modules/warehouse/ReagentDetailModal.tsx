import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { ReagentServer, updateReagentRequest } from "../../store/slices/reagentSlice";

export default function ReagentDetailModal({
  isOpen,
  reagent,
  onClose,
}: {
  isOpen: boolean;
  reagent?: ReagentServer | null;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((s: RootState) => s.reagents.loading);

  const [form, setForm] = useState<Partial<ReagentServer>>({});

  useEffect(() => {
    setForm(reagent ? { ...reagent } : {});
  }, [reagent]);

  if (!isOpen || !reagent) return null;

  const setField = (k: keyof ReagentServer, v: any) =>
    setForm((p) => ({ ...(p ?? {}), [k]: v }));

  const handleSave = () => {
    const id = reagent.id!;
    // prepare partial payload - include only allowed fields
    const payload: Partial<ReagentServer> = {
      name: form.name ?? reagent.name,
      lot_number: form.lot_number ?? reagent.lot_number,
      manufacturer: form.manufacturer ?? reagent.manufacturer,
      quantity: Number(form.quantity ?? reagent.quantity ?? 0),
      unit: form.unit ?? reagent.unit,
      usage_per_run: Number(form.usage_per_run ?? reagent.usage_per_run ?? 0),
      expiry_date: form.expiry_date ?? reagent.expiry_date,
      location: form.location ?? reagent.location,
      min_stock: form.min_stock ?? reagent.min_stock,
      max_stock: form.max_stock ?? reagent.max_stock,
      cost: form.cost ?? reagent.cost,
    };

    dispatch(updateReagentRequest({ id: id as any, data: payload }));
    // close modal; saga will refresh list
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Reagent detail</h3>
            <div className="text-sm text-gray-500">ID: {String(reagent.id)}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              value={form.name ?? ""}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Lot number</label>
              <input
                value={form.lot_number ?? ""}
                onChange={(e) => setField("lot_number", e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Manufacturer</label>
              <input
                value={form.manufacturer ?? ""}
                onChange={(e) => setField("manufacturer", e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={form.quantity ?? 0}
                onChange={(e) => setField("quantity", Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Unit</label>
              <input
                value={form.unit ?? ""}
                onChange={(e) => setField("unit", e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Usage / run</label>
              <input
                type="number"
                value={form.usage_per_run ?? 0}
                onChange={(e) => setField("usage_per_run", Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Expiry date</label>
              <input
                type="date"
                value={form.expiry_date ? form.expiry_date.split("T")[0] : ""}
                onChange={(e) => setField("expiry_date", e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <input
                value={form.location ?? ""}
                onChange={(e) => setField("location", e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Min stock</label>
              <input
                type="number"
                value={form.min_stock ?? 0}
                onChange={(e) => setField("min_stock", Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max stock</label>
              <input
                type="number"
                value={form.max_stock ?? 0}
                onChange={(e) => setField("max_stock", Number(e.target.value))}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Cost</label>
            <input
              type="number"
              value={form.cost ?? 0}
              onChange={(e) => setField("cost", Number(e.target.value))}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
