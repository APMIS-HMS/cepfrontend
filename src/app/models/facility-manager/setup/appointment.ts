import { ClinicInteraction } from './clinicinteraction';
export interface Appointment {
    _id: string;
    facilityId: string;
    clinicId: string;
    appointmentTypeId: string;
    doctorId: string;
    startDate: Date;
    locationId: string;
    endDate: Date;
    allDay: boolean;
    attendance: any;
    encounters: [any];
    patientId: string;
    scheduleId: string;
    appointmentReason: string;
    isActive: boolean;
    personDetails: any;
    checkin: boolean;
    clinicInteractions: ClinicInteraction[];
}
