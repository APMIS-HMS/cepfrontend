import { PrescriptionItem } from './prescription-item';
export interface Prescription {
    facilityId: string,
    employeeId: string,
    patientId: string,
    title?: string,
    prescriptionItems: any,
    isAuthorised: Boolean,
    totalQuantity?: number,
    totalCost?: number
}