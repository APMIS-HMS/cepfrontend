import { BillItem } from './billitem';
export interface Invoice {
    facilityId: string;
    patientId: string;
    billingIds: [any];
    billingDetails: [BillItem];
    invoiceNo: string;
    totalDiscount: number;
    totalPrice: number;
    grandAmount: number;
    createdAt: Date;
    grandTotal: number;
    subTotal: number;
    discount: number;
    paymentCompleted:boolean;
    personDetails:any
}


