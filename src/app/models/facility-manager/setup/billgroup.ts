import { BillItem } from './billitem';
export interface BillIGroup {
    facilityId: string;
    patientId: string;
    walkInClientDetails: any;
    isWalkIn: boolean;
    userId: string;
    billItems: [BillItem];
    facilityItem: any;
    patientItem: any;
    discount: number;
    subTotal: number;
    grandTotal: number;
}
