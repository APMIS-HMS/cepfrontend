import {CustomReportService, ILabReportModel, ILabReportOption} from "./LabReportModel";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
@Injectable()
export class DummyReportDataService 
{
    getLabReport(options: ILabReportOption): Promise<ILabReportModel[]> {
        
        /* return  a resolved promise with a collection of LabReportModel*/
        const labRpt  :  ILabReportModel[]  = [
            {
                apmisId  : 'SO-2341',
                clinic : "CK-Lab Clinic",
                patientName : "Mr James Iburio",
                doctor : "Dr. C Madu",
                date : new Date(),
                request : "Blood Sampling",
                status  : "In Progress"
            },
            {
                apmisId  : 'MK-2801',
                clinic : "HMR-Lab Clinic",
                patientName : "Mr Peter Asuokwou",
                doctor : "Dr. C Madu",
                date : new Date(),
                request : "Urinary Analysis",
                status  : "Completed"
            },
        ];
        return Promise.resolve(labRpt);
    }

    getLabReportInvestigation(options?: ILabReportOption): Promise<ILabReportModel[]> {
        return undefined;
    }
    
}