import {Observable} from "rxjs";
import {DummyReportDataService} from "./DummyReportDataService";
import {ReportGeneratorService} from "./CustomReportService"; 
export interface ILabReportModel {
    patientName :string;
    apmisId : string;
    request? :string;
    doctor : string;
    status? : string;
    clinic? :string;
    date? : Date;
}
export interface IGroupableLabReportModel
{
    group : string;
    data : ILabReportModel[];
}
export interface ILabReportOption {
    filterByDate?  :boolean;
    startDate? : Date;
    endDate? : Date;
    filterByClinic? : boolean;
    clinic? : string;
    isInvestigation? : boolean;
    paginate? : boolean ;
   
}
export interface ICustomReportService {
    // Lab report
    getLabReport(options : ILabReportOption) :Promise<any[]>;
    getLabReportInvestigation(options? : ILabReportOption) : Promise<any[]>;
    // patient investigation
    
}

const useDummyData  = true;
export function reportServiceFactory()
{
    return useDummyData ?  DummyReportDataService  :   ReportGeneratorService;
}
export abstract class CustomReportService implements  ICustomReportService
{
    abstract getLabReport(options: ILabReportOption): Promise<any[]> ;
    abstract getGroupedLabReport(options: ILabReportOption): Promise<IGroupableLabReportModel[]> ;
    abstract getLabReportInvestigation(options?: ILabReportOption): Promise<any[]>;
    
}
