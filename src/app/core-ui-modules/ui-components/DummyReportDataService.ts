import {
    IGroupableLabReportModel,
    ILabReportModel,
    ILabReportOption, ILabReportSummaryModel
} from "./LabReportModel";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {RestService} from "../../feathers/feathers.service";
import {ReportGeneratorService} from "./report-generator-service";
@Injectable()
export class DummyReportDataService extends ReportGeneratorService //  implements ICustomReportService
{
    constructor(private restEndPoint : RestService)
    {
        super(restEndPoint);
    }
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
            {
                apmisId  : 'CG-12003',
                clinic : "Bload-Lab Clinic",
                patientName : "Mr Bayo Akindele",
                doctor : "Dr. Dike Okoye",
                date : new Date(),
                request : "Blood Sampling Analysis",
                status  : "Completed"
            },
        ];
           /* window.setTimeout( ()=>{
            return Promise.resolve(labRpt);
            }, 4000);*/
            
            return Promise.resolve(labRpt)
        
    }
    getLabReportInvestigation(options?: ILabReportOption): Promise<ILabReportModel[]> {
        return undefined;
    }

    getGroupedLabReport(options: ILabReportOption): Promise<IGroupableLabReportModel[]> {
        const res : IGroupableLabReportModel[] = [
            {
                group  : "West Lab Clinic",
                data  : [
                    {
                        apmisId : "KO-00022",
                        patientName : "Chidi Ezidiegwu",
                        status : "Completed",
                        clinic : "West Lab Clinic",
                        doctor :"Dr Felicia Adanbel",
                        request : "Blood Glucose Test",
                        date  : new  Date()
                   
                    
                    },
                    {
                        apmisId : "XC-013292",
                        patientName : "Maryann Ikonah",
                        status : "Completed",
                        clinic : "West Lab Clinic",
                        doctor :"Dr Bello Ahmed",
                        request : "Urinary Analysis",
                        date  : new  Date()


                    },
                ]
                
            },
            {
                group  : "North Lab Clinic",
                data  : [
                    {
                        apmisId : "KO-00022",
                        patientName : "Hadiza Adamu",
                        status : "In Progress",
                        clinic : "North Lab Clinic",
                        doctor :"Dr Chima Okoye",
                        request : "Pregnancy Test",
                        date  : new  Date()


                    },
                    
                ]

            },
        ];
        return Promise.resolve(res);
    }

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<ILabReportSummaryModel[]> {
        const res : ILabReportSummaryModel[] = [
            {
                location  : "West Lab Clinic",
                summary  : [
                    {
                       
                        
                        request : "Blood Glucose Test",
                        total  : 43


                    },
                    {
                       
                        request : "Urinary Analysis",
                        total  : 200


                    },
                ]

            },
            {
                location  : "North Lab Clinic",
                summary  : [
                    {
                       
                        request : "Pregnancy Test",
                        total  : 65


                    },

                ]

            },
        ];
        return Promise.resolve(res);
    }
    
}