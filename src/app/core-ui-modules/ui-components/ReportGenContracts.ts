import {IGroupableLabReportModel, ILabReportOption, ILabReportSummaryModel} from "./LabReportModel";
import {DummyReportDataService} from "./DummyReportDataService";
import {ReportGeneratorService} from "./report-generator-service";

import {IPatientReportModel, IPatientReportOptions} from "./PatientReportModel";

export interface ICustomReportService {
    // Lab report
    getLabReport(options: ILabReportOption): Promise<any[]>;

    getGroupedLabReport(options: ILabReportOption): Promise<IGroupableLabReportModel[]>;

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<ILabReportSummaryModel[]>

    //getLabReportInvestigation(options? : ILabReportOption) : Promise<any[]>;
    // patient investigation
    getPatientReport(options? : IPatientReportOptions) : Promise<IPatientReportModel[]>

}

export function reportServiceFactory() {
    const useDummyData = true;
    return useDummyData ? DummyReportDataService : ReportGeneratorService;
}

