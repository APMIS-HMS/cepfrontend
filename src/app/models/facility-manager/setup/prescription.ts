import { PrescriptionItem } from './prescription-item';
export interface Prescription {
    facilityId: string,
    employeeId: string,
    patientId: string,
    title?: string,
    index?: number,
    priorityId: string,
    prescriptionItems: PrescriptionItem[],
    isAuthorised: Boolean,
    totalQuantity?: number,
    totalCost?: number
}