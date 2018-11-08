import {Injectable } from  '@angular/core';
import {RestService} from "../../feathers/feathers.service";
import {CustomReportService, IGroupableLabReportModel, ILabReportModel, ILabReportOption} from "./LabReportModel";
import {Observable} from "rxjs";



@Injectable()
export class ReportGeneratorService extends CustomReportService
{
    constructor(private restEndpoint : RestService)
    {
        super();
    }

    getLabReport(options: ILabReportOption): Promise<ILabReportModel[]> {
        
        return this.restEndpoint.getService("lab-report-service")
            .find( { params: options});
    }

    getLabReportInvestigation(options?: ILabReportOption): Promise<ILabReportModel[]>{
        return undefined;
    }

    getGroupedLabReport(options: ILabReportOption): Promise<IGroupableLabReportModel[]> {
        return undefined;
    }
}