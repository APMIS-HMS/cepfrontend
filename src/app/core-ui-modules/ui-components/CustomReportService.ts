import {Injectable } from  '@angular/core';
import {RestService} from "../../feathers/feathers.service";
import {CustomReportService, ILabReportModel, ILabReportOption} from "./LabReportModel";
import {Observable} from "rxjs";



@Injectable()
export class ReportGeneratorService extends CustomReportService
{
    constructor(private restEndpoint : RestService)
    {
        super();
    }

    getLabReport(options: ILabReportOption): Promise<ILabReportModel[]> {
        return undefined;
    }

    getLabReportInvestigation(options?: ILabReportOption): Promise<ILabReportModel[]>{
        return undefined;
    }
}