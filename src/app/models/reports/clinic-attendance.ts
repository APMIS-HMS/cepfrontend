import { NumberOfAppointments } from './clinic-attendance';
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

export const AppointmentSearchCriteria = {
    ByProvider: 'By Provider',
    ByPatient: 'By Patient'
};

export const AppointmentReportStatus = {
    CheckedIn: 'Checked In',
    CheckedOut: 'Checked Out',
    Suspend: 'Suspend',
    Postponed: 'Postponed'
};
export interface NumberOfAppointments {
    total: number;
    totalMale: number;
    totalFemale: number;
}

export interface AppointmentReport {
    provider: string;
    dateTime: string;
    patientName: string;
    apmisId: string;
    phone: string;
    appointmentType: string;
    status: string;
}