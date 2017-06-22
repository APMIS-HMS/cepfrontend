export interface PrescriptionItem {
    id?: number,
    genericName: string,
    frequency: string,
    duration: string,
    routeName: String,
    quantity?: number,
    patientInstruction: string,
    isRefill?: Boolean,
    refillCount: number
}