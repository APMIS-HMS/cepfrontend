import { Address } from '../../index';
export interface Person {
    _id: string;
    apmisId: string;
    title: string;
    firstName: string;
    lastName: string;
    otherNames?: string;
    gender: string;
    biometric?: any;
    homeAddress: Address;
    primaryContactPhoneNo: string;
    nationalityId: string;
    stateOfOriginId: string;
    lgaOfOriginId: string;
    email: string;
    maritalStatusId: string;
    nextOfKin: any[];
    dateOfBirth: Date;
    profileImageObject: any;
    personFullName:any;
}

export interface nextOfKin {
    fullName: string;
    address: string;
    nextOfKinApmisId?: string;
    phoneNumber: string;
    email: string;
    relationship: string,
}
