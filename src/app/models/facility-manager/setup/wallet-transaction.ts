export interface WalletTransaction {
  ref?: any;
  paymentMethod?: string;
  ePaymentMethod?: string;
  sourceId?: string;
  source: EntityType;
  transactionType: TransactionType;
  transactionMedium: TransactionMedium;
  amount: number;
  description: string;
  destinationId?: string;
  destination: EntityType;
  transactionStatus?:string;
  transactionDirection: TransactionDirection;
}
export enum TransactionType {
    Dr,
    Cr
}
export const TransactionStatus = {
    'Incomplete': 'Incomplete',
    'Complete': 'Complete'
};
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


