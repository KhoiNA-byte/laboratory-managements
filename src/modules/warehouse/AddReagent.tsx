import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("common");
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
      setError(t("modals.addReagent.validation.fillRequired"));
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
          <h3 className="text-xl font-semibold">{t("modals.addReagent.title")}</h3>
          <p className="text-sm text-gray-500">{t("modals.addReagent.subtitle")}</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Name & Lot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("modals.addReagent.name")} *</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("modals.addReagent.placeholders.name")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("modals.addReagent.lotNumber")} *
              </label>
              <Input
                name="lotNumber"
                value={form.lotNumber}
                onChange={handleChange}
                placeholder={t("modals.addReagent.placeholders.lotNumber")}
              />
            </div>
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium mb-1">{t("modals.addReagent.manufacturer")} *</label>
            <Input
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              placeholder={t("modals.addReagent.placeholders.manufacturer")}
            />
          </div>

          {/* Quantity / Unit / Expiry / Location */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                {t("modals.addReagent.quantity")} *
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
              <label className="block text-sm text-gray-600 mb-1">{t("modals.addReagent.unit")}</label>
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
                {t("modals.addReagent.expiryDate")} *
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
                {t("modals.addReagent.location")} *
              </label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">{t("modals.addReagent.selectLocation")}</option>
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
                {t("modals.addReagent.usagePerRun")}
              </label>
              <Input
                name="usagePerRun"
                type="number"
                min={0}
                value={form.usagePerRun === undefined ? "" : (form.usagePerRun as any)}
                onChange={handleChange}
                placeholder={t("modals.addReagent.placeholders.usagePerRun")}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t("modals.addReagent.minStock")}</label>
              <Input
                name="minStock"
                type="number"
                min={0}
                value={form.minStock as any}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t("modals.addReagent.maxStock")}</label>
              <Input
                name="maxStock"
                type="number"
                min={0}
                value={form.maxStock as any}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t("modals.addReagent.cost")}</label>
              <Input
                name="cost"
                type="number"
                min={0}
                step="0.01"
                value={form.cost as any}
                onChange={handleChange}
                placeholder={t("modals.addReagent.placeholders.cost")}
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
            {t("common.cancel")}
          </button>
          <button
            onClick={onSubmitForm}
            disabled={!valid || submitting}
            className={`px-4 py-2 rounded-lg text-white ${
              valid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
            }`}
          >
            {submitting ? t("modals.addReagent.adding") : t("modals.addReagent.addReagent")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReagent;
