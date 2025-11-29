export interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  age: string;
  address: string;
}

export interface ValidationErrors {
  [key: string]: string;
}
