import {Injectable } from  '@angular/core';
import {
    IGroupableLabReportModel,
    ILabReportModel,
    ILabReportOption, ILabReportSummaryModel
} from "./LabReportModel";
import {Observable} from "rxjs";
import {RestService} from "../../feathers/feathers.service";
import {CustomReportService, ICustomReportService} from "./ReportGenContracts";



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
/*  
*   Reports for Patients
* */
    
}