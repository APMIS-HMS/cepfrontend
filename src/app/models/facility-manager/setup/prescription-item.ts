export interface PrescriptionItem {
    _id?: string;
    facilityId?: string;
    productName?: string;
    productId?: string;
    genericName: string;
    ingredients?: any[];
    form?: string;
    frequency: string;
    duration: string;
    cost?: number;
    totalCost?: number;
    routeName: String;
    quantity?: number;
    quantityDispensed?: number;
    dispensedBalance?: number;
    dispensed?: Dispensed;
    paymentCompleted?: boolean;
    patientInstruction: string;
    isRefill?: Boolean;
    isExternal: Boolean;
    refillCount: number;
    initiateBill: boolean;
    isBilled: boolean;
    isDispensed: boolean;
    isOpen?: boolean;
    transactions?: any[];
    serviceId?: string;
    facilityServiceId?: string;
    categoryId?: string;
}

export interface Dispensed {
    totalQtyDispensed: number;
	outstandingBalance: number;
	dispensedArray?: DispensedArray[];
}

export interface DispensedArray {
    orderIndex: number; // unique
    dispensedDate: Date; // Date time
    batchNumber: String;
    qty: number;
    employeeName: string;
    storeName: string;
    unitBilledPrice: number;
    totalAmount: number;
}