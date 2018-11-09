import {IGroupableLabReportModel, ILabReportOption, ILabReportSummaryModel} from "./LabReportModel";
import {DummyReportDataService} from "./DummyReportDataService";
import {ReportGeneratorService} from "./report-generator-service";
import {Injectable} from "@angular/core";

export interface ICustomReportService {
    // Lab report
    getLabReport(options: ILabReportOption): Promise<any[]>;

    getGroupedLabReport(options: ILabReportOption): Promise<IGroupableLabReportModel[]>;

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<ILabReportSummaryModel[]>

    //getLabReportInvestigation(options? : ILabReportOption) : Promise<any[]>;
    // patient investigation

}

export function reportServiceFactory() {
    const useDummyData = true;
    return useDummyData ? DummyReportDataService : ReportGeneratorService;
}

@Injectable()
export abstract class CustomReportService implements ICustomReportService {
    abstract getLabReport(options: ILabReportOption): Promise<any[]> ;

    abstract getGroupedLabReport(options: ILabReportOption): Promise<IGroupableLabReportModel[]> ;

    /* abstract getLabReportInvestigation(options?: ILabReportOption): Promise<any[]>;*/
    abstract getLabReportInvestigationSummary(options?: ILabReportOption): Promise<ILabReportSummaryModel[]>;
}