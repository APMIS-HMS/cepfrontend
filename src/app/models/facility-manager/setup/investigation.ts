export interface Investigation {
    _id: string;
    name: string;
    specimen: InvestigationSpecimen;
    reportType: InvestigationReportType;
    facilityId: any;
    isPanel: boolean;
    panel: any;
    isActive: boolean,
}

export interface InvestigationSpecimen {
    _id: string;
    name: string;
}

export interface InvestigationReportType {
    _id: string;
    name: string;
}

export interface InvestigationModel {
    investigation: Investigation;
    isExternal: boolean;
    isUrgent: boolean;
    isChecked: boolean;
}
