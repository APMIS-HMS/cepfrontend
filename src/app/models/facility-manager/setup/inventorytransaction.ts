export interface InventoryTransaction {
    batchNumber: string;
    productionDate: Date;
    expiryDate: Date;
    costPrice: number;
    quantity: number;
    strengthId: string;
    purchaseEntryId: string;
    purchaseEntryDetailId: string;
    transactionTypeId: string;
    createdAt: Date;
    updatedAt: Date;
}
