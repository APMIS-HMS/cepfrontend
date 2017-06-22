import { BillItem } from './billitem';
export interface BillIGroup {
    facilityId: string;
    patientId: string;
    userId: string;
    billItems: [BillItem];
    facilityItem: any;
    patientItem: any;
    discount: number;
    subTotal: number;
    grandTotal: number;
}
