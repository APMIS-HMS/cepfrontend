import { PrescriptionItem } from './prescription-item';
export interface Prescription {
    _id?: string;
    facilityId: string;
    employeeId: string;
    patientId: string;
    personId: string;
    title?: string;
    index?: number;
    priority: any;
    prescriptionItems: PrescriptionItem[];
    isAuthorised: Boolean;
    isDispensed?: Boolean;
    billId?: string,
    totalQuantity?: number;
    totalCost?: number;
    clinicDetails?: any;
    patientName?: any;
    employeeName?: any;
}

