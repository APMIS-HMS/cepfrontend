import {IDefaultReportOption} from "./ReportGenContracts";

export interface IPatientReportModel {
    patientName :string;
    apmisId : string;
    gender? :string;
    address? : string;
    phoneNo? : string;
    age? :number;
    dateCreated? : Date;
}
export interface IPatientReportOptions extends IDefaultReportOption{
   
    ageRange ?: string | 'all';  // "all"  all age range should be returned, 20-30 age range btw 20 and 30
    gender ?: 'all' | 'male' | 'female' ; // 'all' , male, or female
   
    
}