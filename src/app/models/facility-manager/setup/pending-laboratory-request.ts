export interface PendingLaboratoryRequest {
    investigationId: string;
    labRequestId: string;
    name: string;
    facility: any;
    patient: any;
    specimen: any;
    price: number;
    unit: number;
    service: any;
    reportType: any;
    report: any;
    facilityServiceId: string;
    clinicalInformation: string;
    diagnosis: string;
    labNumber: string;
    minorLocation: any;
    workbench: any;
    investigations: any[];
    isActive: boolean;
    isSaved: boolean;
    isUploaded: boolean;
    isExternal: boolean;
    isUrgent: boolean;
    isPanel: boolean;
    updatedAt: Date;
    createdAt: Date;
    createdBy: any;
    personId: string;
    specimenReceived: boolean;
    specimenNumber: string;
    sampleTaken:boolean;
    sampleTakenBy:any;
}
