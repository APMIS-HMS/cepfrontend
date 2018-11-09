import {Injectable } from  '@angular/core';
import {
    IGroupableLabReportModel,
    ILabReportModel,
    ILabReportOption, ILabReportSummaryModel
} from "./LabReportModel";
import {Observable} from "rxjs";
import {RestService} from "../../feathers/feathers.service";
import { ICustomReportService} from "./ReportGenContracts";
import {IPatientReportModel, IPatientReportOptions} from "./PatientReportModel";



@Injectable()
export class ReportGeneratorService implements ICustomReportService
{
    constructor(private restEndpoint : RestService)
    {
        //super();
    }

    getLabReport(options: ILabReportOption): Promise<ILabReportModel[]> {
        
        return this.restEndpoint.getService("lab-report-service")
            .find( { params: options});
    }

    getGroupedLabReport(options: ILabReportOption): Promise<IGroupableLabReportModel[]> {
        
        return this.restEndpoint.getService("grouped-lab-report-service")
        .find( { params: options});
        
    }

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<ILabReportSummaryModel[]> {
        return this.restEndpoint.getService("lab-summary-report-service")
            .find( { params: options});
    }

    getPatientReport(options: IPatientReportOptions): Promise<IPatientReportModel[]> {
        return Promise.resolve([]);
    }
/*  
*   Reports for Patients
* */
    
}