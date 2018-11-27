import {IDefaultReportOption} from "./ReportGenContracts";

export interface ILabReportModel {
    patientName :string;
    apmisId : string;
    request? :string;
    doctor : string;
    status? : string;
    clinic? :string;
    date? : Date;
}
// This a grouped report data
export interface  ILabReportSummaryModel {
    location : string;
    summary : ISummary[]
    
}
export interface ISummary {
    request :string;
    total : number;
}
export interface IGroupableLabReportModel
{
    group : string;
    data : ILabReportModel[];
}
export interface ILabReportOption extends IDefaultReportOption{
    
    // if it an investigation summary report.
    isSummary? : boolean;  
    // Groupings
    groupBy? : 'location' | 'bench';
    
}


