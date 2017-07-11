import { PrescriptionItem } from './prescription-item';
export interface Prescription {
    _id?: string;
    facilityId: string;
    employeeId: string;
    patientId: string;
    title?: string;
    index?: number;
    priorityId: string;
    prescriptionItems: PrescriptionItem[];
    isAuthorised: Boolean;
    isDispensed?: Boolean;
    totalQuantity?: number;
    totalCost?: number;
    priorityObject?: any;
    clinicDetails?: any;
    patientName?: any;
    employeeName?: any;
}

