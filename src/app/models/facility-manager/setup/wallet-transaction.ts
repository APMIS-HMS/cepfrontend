export interface WalletTransaction {
    sourceId?: string;
    source: EntityType,
    transactionType: TransactionType;
    transactionMedium: TransactionMedium;
    amount: number;
    description: string;
    destinationId?: string;
    destination: EntityType,
    transactionDirection: TransactionDirection
}
export enum TransactionType {
    Dr,
    Cr
}
export enum EntityType {
    Facility,
    Person,
    POS
}
export enum TransactionMedium {
    POS,
    Wallet,
    Cash,
    PayStack
}
export enum TransactionDirection {
    PersonToPerson,
    PersonToFacility,
    FacilityToPerson,
    FacilityToFacility,
    ThirdPartyToPerson,
    ThirdPartyToFacility
}