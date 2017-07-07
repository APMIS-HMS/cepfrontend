export interface DispenseItem {
    productId?: string,
    cost: number,
    quantity: number,
    isRefill?: boolean,
    refillCount?: number,
    startDate?: Date,
    isExternal: boolean,
    batchNumber?: string,
    instruction?: string
}