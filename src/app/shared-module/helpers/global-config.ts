export const onAdmission = '1';
export const transfer = '2';
export const discharge = '3';
export const inTheater = '4';

export const DurationUnits = [
    { 'id': 1, 'name': 'Hours', 'selected': true },
    { 'id': 2, 'name': 'Days', 'selected': false },
    { 'id': 3, 'name': 'Weeks', 'selected': false },
    { 'id': 4, 'name': 'Months', 'selected': false }
];
export const Clients = [
    { 'id': 1, 'name': 'Individual', 'selected': true },
    { 'id': 2, 'name': 'Corporate', 'selected': false },
    { 'id': 3, 'name': 'Internal', 'selected': false }
];
export const PaymentChannels = [
    { 'id': 1, 'name': 'Cash'},
    { 'id': 2, 'name': 'Cheque'},
    { 'id': 3, 'name': 'Flutterwave'},
    { 'id': 4, 'name': 'Paystack' },
    { 'id': 5, 'name': 'POS' },
    { 'id': 6, 'name': 'Transfer' }
];
export const PAYSTACK_CLIENT_KEY = 'pk_test_3c53bcffeb3c889d04ea0f905c44d36fc342aa85';
export const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK-8da67f59fe34994e78c5f77022ba8178-X'; // Add public keys generated on your dashboard here
