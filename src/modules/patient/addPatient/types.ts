export interface AddPatientFormData {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
}

export interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (patientData: any) => void;
}
