import { NumberOfAppointments } from './number-of-appointments';

export interface ClinicAttendance {
    date: string;
    clinicName: string;
    totalCheckedInPatients: number;
    new: NumberOfAppointments;
    followUp: NumberOfAppointments;
}

export enum ClinicTabGroup {
    ClinicAttendance = 0,
    AppointmentReport
}
