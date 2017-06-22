export interface PrescriptionItem {
    id?: number,
    genericName: string,
    frequency: string,
    duration: number,
    routeName: String,
    quantity?: number,
    patientInstruction: string,
    priorityId: string,
    isRefill: Boolean,
    refillCount: number,
}