export interface PrescriptionItem {
    _id?: string,
    productName?: string,
    productId?: string,
    genericName: string,
    frequency: string,
    duration: string,
    cost?: number,
    routeName: String,
    quantity?: number,
    patientInstruction: string,
    isRefill?: Boolean,
    isExternal: Boolean,
    refillCount: number,
    initiateBill: boolean,
    isBilled: boolean
}