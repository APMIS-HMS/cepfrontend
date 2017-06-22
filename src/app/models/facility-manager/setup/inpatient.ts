import {WardTransfer} from './wardtransfer';
import {WardDischarge} from './warddischarge'
export interface InPatient {
    facilityId: string;
    patientId: string;
    statusId: string;
    transfers: WardTransfer[];
    admissionDate: Date;
    admitByEmployeeId:string,
    discharge: WardDischarge;
}
