export interface WalletTransaction {
  ref?: any;
  paymentMethod?: string;
  ePaymentMethod?: string;
  sourceId?: string;
  sourceType: EntityType;
  transactionType: TransactionType;
  transactionMedium: TransactionMedium;
  amount: number;
  description: string;
  destinationId?: string;
  destinationType: EntityType;
  transactionStatus?: string;
  transactionDirection: TransactionDirection;
  paidBy: string;
}
export enum TransactionType {
    Dr,
    Cr
}

export enum TransactionType2 {
    Dr,
    Cr
}
export const TransactionStatus = {
    'Incomplete': 'Incomplete',
    'Complete': 'Complete'
};

export const PaymentPlan = {
    'outOfPocket': 'wallet',
    'insurance': 'insurance',
    'company': 'company',
    'family': 'family',
    'waved':'waved'
};

export enum EntityType {
    Facility,
    Person,
    POS
}
export enum TransactionMedium {
    POS,
    Wallet,
    Cheque,
    Cash,
    PayStack,
    Flutterwave,
    Transfer
}
export enum TransactionDirection {
    PersonToPerson,
    PersonToFacility,
    FacilityToPerson,
    FacilityToFacility,
    ThirdPartyToPerson,
    ThirdPartyToFacility
}


