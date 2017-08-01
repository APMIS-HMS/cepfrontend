export interface Investigation {
    _id: string;
    name: string;
    specimen: InvestigationSpecimen;
    reportType: InvestigationReportType;
    refNoFrom: number;
    refNoTo: number;
    unit: string;
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