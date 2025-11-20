import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddPatientProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (patientData: any) => void;
}

const AddPatientModal: React.FC<AddPatientProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const { t } = useTranslation("common");
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "Male",
    phone: "",
    email: "",
    // identifyNumber: "",
    address: "",
  });

  // Track touched fields to show validation messages only after interaction / submit
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateName = (value: string) => value.trim() === "";
  const validateDob = (value: string) => {
    if (!value) return true;
    const d = new Date(value);
    if (isNaN(d.getTime())) return true;
    // future date invalid
    if (d > new Date()) return true;
    return false;
  };
  const validatePhone = (value: string) => !/^0\d{9}$/.test(value);
  const validateEmail = (value: string) =>
    value !== "" && !/^\S+@\S+\.\S+$/.test(value);
  const validateIdentify = (value: string) => !/^0\d{11}$/.test(value);
  const validateAddress = (value: string) => value.trim() === "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateName(formData.name);
    const dobErr = validateDob(formData.dob);
    const phoneErr = validatePhone(formData.phone);
    const emailErr = validateEmail(formData.email);
    // const identifyErr = validateIdentify(formData.identifyNumber);
    const addressErr = validateAddress(formData.address);

    if (
      nameErr ||
      dobErr ||
      phoneErr ||
      emailErr ||
      // identifyErr ||
      addressErr
    ) {
      // mark all as touched so errors show
      setTouched({
        name: true,
        dob: true,
        phone: true,
        email: true,
        identifyNumber: true,
        address: true,
      });
      return;
    }

    // compute age safely
    const dobDate = new Date(formData.dob);
    const birthYear = isNaN(dobDate.getFullYear())
      ? new Date().getFullYear()
      : dobDate.getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    const now = new Date().toISOString();

    const fullPatientData = {
      name: formData.name.trim(),
      email: formData.email || "",
      phone: formData.phone,
      gender: formData.gender,
      role: "normal_user",
      age: age,
      address: formData.address,
      status: "waiting",
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
      password: "AdminSecure2024!",
      // id: formData.identifyNumber || `id-${Date.now()}`,
      userId: `${Math.floor(Math.random() * 1000)}`,
    };

    onCreate(fullPatientData);

    alert(t("modals.addPatient.success", { name: formData.name }));
    console.log("Patient created:", fullPatientData);

    onClose();
    // reset touched (optional)
    setTouched({});
  };

  const nameError = touched.name && validateName(formData.name);
  const dobError = touched.dob && validateDob(formData.dob);
  const phoneError = touched.phone && validatePhone(formData.phone);
  const emailError = touched.email && validateEmail(formData.email);
  // const identifyError =
  //   touched.identifyNumber && validateIdentify(formData.identifyNumber);
  const addressError = touched.address && validateAddress(formData.address);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-8 relative">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("modals.addPatient.title")}
        </h2>
        <p className="text-gray-500 mb-6">
          {t("modals.addPatient.subtitle")}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("modals.addPatient.fullName")} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("modals.addPatient.placeholders.fullName")}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    t("modals.addPatient.validation.nameRequired")
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
              />
              {nameError && (
                <p className="mt-1 text-red-600 text-sm">
                  {t("modals.addPatient.validation.nameRequired")}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("modals.addPatient.dateOfBirth")} *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    t("modals.addPatient.validation.dobRequired")
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
              />
              {dobError && (
                <p className="mt-1 text-red-600 text-sm">
                  {t("modals.addPatient.validation.dobInvalid")}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("modals.addPatient.gender")} *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option>{t("modals.addPatient.genderOptions.male")}</option>
                <option>{t("modals.addPatient.genderOptions.female")}</option>
                <option>{t("modals.addPatient.genderOptions.other")}</option>
              </select>
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("modals.addPatient.phoneNumber")} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  const errorMsg = t("modals.addPatient.validation.phoneRequired");

                  if (!value) {
                    e.target.setCustomValidity(errorMsg);
                  } else if (!/^0\d{9}$/.test(value)) {
                    e.target.setCustomValidity(errorMsg);
                  } else {
                    e.target.setCustomValidity("");
                  }

                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder={t("modals.addPatient.placeholders.phoneNumber")}
                required
                pattern="0\d{9}"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    t("modals.addPatient.validation.phoneRequired")
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
              />

              {/* Red error text hiển thị khi invalid */}
              {formData.phone !== "" && !/^0\d{9}$/.test(formData.phone) && (
                <p className="absolute right-0 mt-1 text-red-600 text-sm">
                  {t("modals.addPatient.validation.phoneRequired")}
                </p>
              )}
              {touched.phone && phoneError && (
                <p className="mt-1 text-red-600 text-sm">
                  {t("modals.addPatient.validation.phoneRequired")}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("modals.addPatient.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("modals.addPatient.placeholders.email")}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {emailError && (
                <p className="mt-1 text-red-600 text-sm">
                  {t("modals.addPatient.validation.emailInvalid")}
                </p>
              )}
            </div>

            {/* Identify Number */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identify Number *
              </label>
              <input
                type="text"
                name="identifyNumber"
                value={formData.identifyNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!/^0\d{11}$/.test(value)) {
                    (e.target as HTMLInputElement).setCustomValidity(
                      "Invalid identify number"
                    );
                  } else {
                    (e.target as HTMLInputElement).setCustomValidity("");
                  }
                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder="Enter identify number"
                required
                pattern="0\d{11}"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    "Invalid identify number"
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
              />
              {identifyError && (
                <p className="mt-1 text-red-600 text-sm">
                  Identify number is required and must match pattern
                  0xxxxxxxxxxx
                </p>
              )}
            </div> */}

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("modals.addPatient.address")} *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("modals.addPatient.placeholders.address")}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity(
                    t("modals.addPatient.validation.addressRequired")
                  )
                }
                onInput={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("")
                }
              />
              {addressError && (
                <p className="mt-1 text-red-600 text-sm">
                  {t("modals.addPatient.validation.addressRequired")}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {t("modals.addPatient.createPatient")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
