export interface BillItem {
    _id: string;
    facilityServiceId: string;
    serviceId: string;
    facilityId: string;
    patientId: string;
    description: string;
    quantity: number;
    totalPrice: number;
    unitPrice: number;
    modifierId: [string];
    isChecked: boolean;
    facilityServiceObject: any;
    serviceModifierObject: any;
    modifiers: any;
    itemName: any;
    qty: number;
    amount: number;
    itemDesc: any;
}
