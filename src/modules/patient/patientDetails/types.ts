import { Patient, TestOrder } from "../../../services/patientApi";

export type { Patient, TestOrder };

export interface PatientDetailsHeaderProps {
  title: string;
  subtitle: string;
  backText: string;
}

export interface PatientInfoCardProps {
  patient: Patient;
}

export interface OverviewTabProps {
  patient: Patient;
  recentActivity: TestOrder[];
  summaryStats: {
    title: string;
    value: string;
    icon?: string;
  }[];
}

export interface TestHistoryTabProps {
  testOrders: TestOrder[] | undefined;
}
