// Validation functions for test order form

export const validatePatientName = (name: string): string => {
  if (!name.trim()) return "Patient name is required";
  if (name.length > 25) return "Patient name must not exceed 25 characters";
  return "";
};

export const validateAge = (age: string): string => {
  if (!age.trim()) return "Age is required";
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return "Age must be a number";
  if (ageNum < 0) return "Age cannot be negative";
  if (ageNum > 120) return "Age cannot be greater than 120";
  return "";
};

export const validateGender = (gender: string): string => {
  if (!gender.trim()) return "Gender is required";
  return "";
};

export const validatePhoneNumber = (phone: string): string => {
  if (!phone.trim()) return "Phone number is required";
  if (!/^\d+$/.test(phone)) return "Phone number must contain only digits";
  if (phone.length !== 10) return "Phone number must be exactly 10 digits";
  return "";
};

export const validateTester = (tester: string): string => {
  if (!tester.trim()) return "Tester is required";
  return "";
};

export const validateTestType = (testType: string): string => {
  if (!testType.trim()) return "Test type is required";
  return "";
};

export const validateRunDate = (runDate: string, createDate: string): string => {
  if (!runDate) return "Run date is required";

  // Check MM/DD/YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (!dateRegex.test(runDate)) return "Date must be in MM/DD/YYYY format";

  // Convert MM/DD/YYYY to Date for comparison
  const parseDate = (dateStr: string): Date => {
    const [month, day, year] = dateStr.split("/").map((num) => parseInt(num));
    return new Date(year, month - 1, day);
  };

  const runDateObj = parseDate(runDate);
  const createDateObj = parseDate(createDate);

  if (runDateObj < createDateObj)
    return "Run date must be after or equal to create date";
  return "";
};
