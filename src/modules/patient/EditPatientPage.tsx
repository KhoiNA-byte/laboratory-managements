// @/pages/EditPatientPage.tsx

import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPatientById } from "../../services/patientApi";

import {
  updatePatientRequest,
  clearMessages,
  clearUpdateSuccess,
} from "../../store/slices/patientSlice";
import type { RootState } from "../../store";

export const EditPatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 3. Lấy state từ Redux
  const {
    loading: updateLoading,
    error: updateError,
    updateSuccess,
    successMessage,
  } = useSelector((state: RootState) => state.patients);

  // 4. State cho form data, validation, và loading trang
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "", // Dùng string cho input, sẽ convert sang number khi submit
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // 5. Logic validation (Đã cập nhật theo yêu cầu)
  const validateField = (name: string, value: string | number) => {
    const errors: { [key: string]: string } = { ...validationErrors };
    // Đảm bảo value là string để xử lý trim/regex
    const stringValue = value.toString().trim();

    switch (name) {
      case "name":
        if (!stringValue) {
          errors.name = "Name is required";
        } else if (
          !/^[a-zA-Z\sàáãạảăắằặẳẵâấầậẩẫèéẽẹẻêếềệểễìíĩịỉòóõọỏôốồộổỗơớờợởỡùúũụủưứừựửữỳýỹỵỷĐđ]+$/i.test(
            stringValue
          )
        ) {
          // Regex cho phép chữ cái (cả tiếng Việt), và khoảng trắng. Không cho phép số/ký tự đặc biệt.
          errors.name =
            "Full Name cannot contain numbers or special characters";
        } else {
          delete errors.name;
        }
        break;
      case "email":
        // Bỏ required. Chỉ kiểm tra format nếu có giá trị.
        if (stringValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue))
          errors.email = "Invalid email format";
        else delete errors.email;
        break;
      case "phone":
        if (!stringValue) {
          errors.phone = "Phone is required";
        } else if (!/^0\d{9}$/.test(stringValue)) {
          // Format: Bắt đầu bằng 0, tổng cộng 10 số.
          errors.phone = "Phone number must be 10 digits and start with 0";
        } else {
          delete errors.phone;
        }
        break;
      case "age":
        if (!stringValue) {
          errors.age = "Age is required";
        } else if (isNaN(Number(stringValue)) || Number(stringValue) <= 0) {
          errors.age = "Age must be a positive number";
        } else {
          delete errors.age;
        }
        break;
      case "address":
        if (!stringValue) errors.address = "Address is required";
        else delete errors.address;
        break;
      case "gender":
        if (!stringValue) errors.gender = "Gender is required";
        else delete errors.gender;
        break;
      default:
        break;
    }
    setValidationErrors(errors);
  };

  const isFormValid = () => {
    // Kiểm tra không còn lỗi
    const hasValidationErrors = Object.keys(validationErrors).some(
      (key) => validationErrors[key]
    );

    if (hasValidationErrors) {
      return false;
    }

    // Kiểm tra các trường bắt buộc (name, phone, age, address, gender)
    const { name, phone, age, address, gender } = formData;

    return (
      name.trim() && phone.trim() && age.trim() && address.trim() && gender // Kiểm tra gender
    );
  };

  // 6. Fetch dữ liệu Patient khi trang được tải
  useEffect(() => {
    if (!id) {
      navigate("/admin/patients");
      return;
    }

    const fetchPatient = async () => {
      setPageLoading(true);
      setPageError(null);
      try {
        const patient = await getPatientById(id);
        // Set dữ liệu cho form (chuyển đổi các giá trị về string)
        const initialData = {
          name: patient.name,
          email: patient.email || "", // Đảm bảo không null
          phone: patient.phone,
          gender: patient.gender,
          age: patient.age.toString(),
          address: patient.address,
        };
        setFormData(initialData);

        // Chạy validation ban đầu cho các trường bắt buộc/có quy tắc
        const initialErrors: { [key: string]: string } = {};
        Object.entries(initialData).forEach(([key, value]) => {
          if (key !== "email" || value) {
            const tempErrors: { [key: string]: string } = {};
            const stringValue = value.toString().trim();

            switch (key) {
              case "name":
                if (!stringValue) tempErrors.name = "Name is required";
                else if (
                  !/^[a-zA-Z\sàáãạảăắằặẳẵâấầậẩẫèéẽẹẻêếềệểễìíĩịỉòóõọỏôốồộổỗơớờợởỡùúũụủưứừựửữỳýỹỵỷĐđ]+$/i.test(
                    stringValue
                  )
                )
                  tempErrors.name =
                    "Full Name cannot contain numbers or special characters";
                break;
              case "email":
                if (
                  stringValue &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)
                )
                  tempErrors.email = "Invalid email format";
                break;
              case "phone":
                if (!stringValue) tempErrors.phone = "Phone is required";
                else if (!/^0\d{9}$/.test(stringValue))
                  tempErrors.phone =
                    "Phone number must be 10 digits and start with 0";
                break;
              case "age":
                if (!stringValue) tempErrors.age = "Age is required";
                else if (isNaN(Number(stringValue)) || Number(stringValue) <= 0)
                  tempErrors.age = "Age must be a positive number";
                break;
              case "address":
                if (!stringValue) tempErrors.address = "Address is required";
                break;
              case "gender":
                if (!stringValue) tempErrors.gender = "Gender is required";
                break;
              default:
                break;
            }

            Object.assign(initialErrors, tempErrors);
          }
        });

        setValidationErrors(initialErrors);
      } catch (err) {
        setPageError("Failed to load patient data. Patient not found.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchPatient();

    // Clear messages khi component unmount
    return () => {
      dispatch(clearMessages());
    };
  }, [id, navigate, dispatch]);

  // 7. Xử lý tự động điều hướng khi cập nhật thành công
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        navigate(`/admin/patients/${id}`);
        dispatch(clearUpdateSuccess());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, navigate, dispatch, id]);

  // 8. Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Validate ngay khi gõ
    validateField(name, value);
  };

  // 9. Handle Submit (Gửi action Redux)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Thực hiện validation đầy đủ trước khi submit
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key as keyof typeof formData]);
    });

    if (!isFormValid() || !id) {
      return;
    }

    // Chuyển đổi dữ liệu về đúng type
    const patientDataToSubmit = {
      ...formData,
      // Đảm bảo age là số nguyên
      age: parseInt(formData.age, 10),
      id: id,
      // Giữ role nếu cần
      role: "normal_user",
    };

    // Gửi action
    dispatch(updatePatientRequest(patientDataToSubmit));
  };

  // 10. Handle Cancel
  const handleCancel = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  // 11. Xử lý trạng thái Loading trang
  if (pageLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading patient data...</p>
      </div>
    );
  }

  // 12. Xử lý lỗi Loading trang
  if (pageError) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{pageError}</p>
        <div className="mt-4">
          <Link
            to="/admin/patients"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  // 13. Render Form
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6">
        <nav className="text-sm" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex space-x-2">
            <li className="flex items-center">
              <Link
                to="/admin/patients"
                className="text-gray-500 hover:text-blue-600"
              >
                Patients
              </Link>
              {/* ... (icon) */}
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link
                to={`/admin/patients/${id}`}
                className="text-gray-500 hover:text-blue-600"
              >
                {formData.name || "Patient Details"}
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-700">Edit</span>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">
          Edit Patient Information
        </h1>
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Details
          </h2>
          {/* CÁC TRƯỜNG CỦA FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.age && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.age}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {validationErrors.address && (
                <p className="mt-1 text-sm text-red-600">
                  {validationErrors.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          {/* Messages Section */}
          <div className="flex-grow">
            {updateError && (
              <div className="text-red-600 text-sm">{updateError}</div>
            )}
            {successMessage && (
              <div className="text-green-600 text-sm">{successMessage}</div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCancel}
            disabled={updateLoading}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || updateLoading}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${
              !isFormValid() || updateLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {updateLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};
