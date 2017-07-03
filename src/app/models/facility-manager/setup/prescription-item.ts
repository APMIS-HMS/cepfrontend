export interface PrescriptionItem {
    drugName?: string,
    drugId?: string,
    genericName: string,
    frequency: string,
    duration: string,
    routeName: String,
    quantity?: number,
    patientInstruction: string,
    isRefill?: Boolean,
    refillCount: number,
    initiateBill: boolean,
    isBilled: boolean
}