import {
    IGroupableLabReportModel,
    ILabReportModel,
    ILabReportOption, ILabReportSummaryModel
} from "./LabReportModel";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {RestService} from "../../feathers/feathers.service";
import {PaymentReportGenerator, ReportGeneratorService} from "./report-generator-service";
import {IApiResponse} from "./ReportGenContracts";
import {IPaymentReportModel, IPaymentReportOptions, IPaymentReportSummaryModel} from "./PaymentReportModel";
import {CoolLocalStorage} from "angular2-cool-storage";
@Injectable()
export class DummyReportDataService extends ReportGeneratorService //  implements ICustomReportService
{
    constructor(private restService : RestService, localStorage  : CoolLocalStorage)
    {
        super(restService, localStorage);
    }
    getLabReport(options: ILabReportOption): Promise<IApiResponse<ILabReportModel[]>> {
        
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
            const  result  = {
                data : labRpt,
                success : true,
                message : "Lab Report Loaded successfully!",
                total : labRpt.length,
                skip :options.paginate ? options.paginationOptions.skip  : 0,
                limit : options.paginate ? options.paginationOptions.limit  : 0
            }
        const endPoint  = this.restService.getService("laboratory-report-summary");
        endPoint.find({
            query : {
                facilityId  : options.facilityId,
                startDate  : options.startDate,
                endDate  : options.endDate
            }
        }).then(x => {

            console.log("TESTING Backend Service Call: " , x);

        });
        this.getLocations().then(x => {
            console.log("LOCATIONS" , x);
        }); 
        this.getWorkBenches().then(x => {
            console.log("Work Benches" , x);
        });
            return Promise.resolve(result);
        
    }
    getLabReportInvestigation(options?: ILabReportOption): Promise<ILabReportModel[]> {
        return undefined;
    }

    getGroupedLabReport(options: ILabReportOption): Promise<IApiResponse<IGroupableLabReportModel[]>> {
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
        const  result  = {
            data : res,
            success : true,
            message : "Grouped Lab Report Loaded successfully!",
            total : res.length,
            skip :options.paginate ? options.paginationOptions.skip  : 0,
            limit : options.paginate ? options.paginationOptions.limit  : 0
        }
        return Promise.resolve(result);
        
    }

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<IApiResponse<ILabReportSummaryModel[]>> {
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
        const  result  = {
            data : res,
            success : true,
            message : "Lab Summary Report Loaded successfully!",
            total : res.length,
            skip :options.paginate ? options.paginationOptions.skip  : 0,
            limit : options.paginate ? options.paginationOptions.limit  : 0
        }
        return Promise.resolve(result);
       
    }
    
}
@Injectable()
export class DummyPaymentReportService extends PaymentReportGenerator
{
    constructor(private restService :RestService, locker : CoolLocalStorage)
    {
        super(restService, locker);
    }
    getPaymentReportSummary( rptOptions : IPaymentReportOptions) : Promise<IApiResponse<IPaymentReportSummaryModel>>
    {
        rptOptions.facilityId  = this.selectedFacility._id;
        //console.log("Selected Facility",this.selectedFacility);
        const data  = { 
            totalSales : 4500000
        };
        const res  = { data , success : true , message : "Payment Summary REPORT"};
      
        return Promise.resolve(res);
    }
    getInvoicePaymentReport(rptOptions : IPaymentReportOptions): Promise<IApiResponse<IPaymentReportModel[]>>
    {
        const result  = {
            success  : true,
            message : "Report Loaded",
            "total": 59,
            "limit": 20,
            "skip": 0,
            "data": [
                {
                    "_id": "5b107fcb097e9d1a1cae8d2e",
                    "patientId": "5afd31975b9522384839843f",
                    "totalPrice": 2500,
                    "balance": 0,
                    "invoiceNo": "IV/315/8275",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 2500,
                            "amountPaid": 2500,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-17T07:39:04.399Z",
                            "paymentDate": "2018-05-31T23:03:08.158Z"
                        }
                    ],
                    "person": "Nseobong Okoro"
                },
                {
                    "_id": "5b10803e097e9d1a1cae8d33",
                    "patientId": "5afd32515b95223848398447",
                    "totalPrice": 2500,
                    "balance": 0,
                    "invoiceNo": "IV/315/5731",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 2500,
                            "amountPaid": 2500,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-17T07:42:10.184Z",
                            "paymentDate": "2018-05-31T23:05:08.956Z"
                        }
                    ],
                    "person": "Monica Akpanowo"
                },
                {
                    "_id": "5b1081cc097e9d1a1cae8d38",
                    "patientId": "5afd32365b95223848398443",
                    "totalPrice": 7500,
                    "balance": 0,
                    "invoiceNo": "IV/315/3951",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 5000,
                            "amountPaid": 5000,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-05-18T13:41:53.726Z",
                            "paymentDate": "2018-05-31T23:11:46.789Z"
                        },
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 2500,
                            "amountPaid": 2500,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-17T07:41:43.495Z",
                            "paymentDate": "2018-05-31T23:11:46.790Z"
                        }
                    ],
                    "person": "Favour  Dick"
                },
                {
                    "_id": "5b1082a0097e9d1a1cae8d3b",
                    "patientId": "5afd30a45b9522384839842f",
                    "totalPrice": 7500,
                    "balance": 0,
                    "invoiceNo": "IV/315/1969",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 5000,
                            "amountPaid": 5000,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-05-17T09:22:38.282Z",
                            "paymentDate": "2018-05-31T23:15:13.864Z"
                        },
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 2500,
                            "amountPaid": 2500,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-17T07:35:01.218Z",
                            "paymentDate": "2018-05-31T23:15:13.864Z"
                        }
                    ],
                    "person": "Opeyemi Oromire"
                },
                {
                    "_id": "5b14e5159e5b750a0c2d77d5",
                    "patientId": "5afd315c5b9522384839843b",
                    "totalPrice": 7500,
                    "balance": 0,
                    "invoiceNo": "IV/46/104",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-06-01T06:54:11.665Z",
                            "paymentDate": "2018-06-04T07:07:01.808Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-17T07:38:05.154Z",
                            "paymentDate": "2018-06-04T07:07:01.808Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "paymentDate": "2018-06-04T07:04:47.055Z",
                            "date": "2018-06-04T07:07:01.808Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "amountPaid": 5000,
                            "totalPrice": 5000,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-06-04T07:04:47.056Z",
                            "date": "2018-06-04T07:07:01.808Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "amountPaid": 2500,
                            "totalPrice": 2500,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        }
                    ],
                    "person": "Jenny Akan"
                },
                {
                    "_id": "5b14f1689e5b750a0c2d77da",
                    "patientId": "5b0813dfbe26631da45ec49a",
                    "totalPrice": 20500,
                    "balance": 20500,
                    "invoiceNo": "IV/46/2462",
                    "paymentCompleted": false,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 13000,
                            "totalPrice": 13000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc08755b952238483983a4",
                                "service": "General ward",
                                "category": "Ward",
                                "categoryId": "5af54ca6dbffe92c90559049"
                            },
                            "qty": 2,
                            "date": "2018-06-01T06:52:59.599Z",
                            "paymentDate": "2018-06-04T07:59:36.757Z"
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-05-30T20:26:17.748Z",
                            "paymentDate": "2018-06-04T07:59:36.757Z"
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-25T13:47:12.316Z",
                            "paymentDate": "2018-06-04T07:59:36.757Z"
                        }
                    ],
                    "person": "Deji Iroko"
                },
                {
                    "_id": "5b17b7439e5b750a0c2d790c",
                    "patientId": "5b17b4579e5b750a0c2d78f8",
                    "totalPrice": 7500,
                    "balance": 0,
                    "invoiceNo": "IV/66/4549",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:19:40.440Z",
                            "paymentDate": "2018-06-06T10:28:19.973Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:15:52.621Z",
                            "paymentDate": "2018-06-06T10:28:19.973Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "paymentDate": "2018-06-06T10:25:57.307Z",
                            "date": "2018-06-06T10:28:19.973Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "amountPaid": 5000,
                            "totalPrice": 5000,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-06-06T10:25:57.308Z",
                            "date": "2018-06-06T10:28:19.973Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "amountPaid": 2500,
                            "totalPrice": 2500,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        }
                    ],
                    "person": "John Kunmi"
                },
                {
                    "_id": "5b17b7d89e5b750a0c2d7913",
                    "patientId": "5b17b4579e5b750a0c2d78f8",
                    "totalPrice": 3000,
                    "balance": 0,
                    "invoiceNo": "IV/66/6682",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 1500,
                            "totalPrice": 1500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:30:13.700Z",
                            "paymentDate": "2018-06-06T10:30:48.661Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 1500,
                            "totalPrice": 1500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:30:12.575Z",
                            "paymentDate": "2018-06-06T10:30:48.661Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "paymentDate": "2018-06-06T10:28:24.221Z",
                            "date": "2018-06-06T10:30:48.661Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "amountPaid": 1500,
                            "totalPrice": 1500,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-06-06T10:28:24.222Z",
                            "date": "2018-06-06T10:30:48.661Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "amountPaid": 1500,
                            "totalPrice": 1500,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        }
                    ],
                    "person": "John Kunmi"
                },
                {
                    "_id": "5b1e7b17261b7f28d85eedb9",
                    "patientId": "5afd30a45b9522384839842f",
                    "totalPrice": 15000,
                    "balance": 0,
                    "invoiceNo": "IV/116/9620",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-06-11T08:43:11.674Z",
                            "paymentDate": "2018-06-11T13:37:27.515Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-06-10T21:27:55.595Z",
                            "paymentDate": "2018-06-11T13:37:27.515Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-06-04T10:00:54.161Z",
                            "paymentDate": "2018-06-11T13:37:27.515Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "paymentDate": "2018-06-11T13:42:11.898Z",
                            "date": "2018-06-11T13:37:27.515Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "amountPaid": 5000,
                            "totalPrice": 5000,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-06-11T13:42:11.900Z",
                            "date": "2018-06-11T13:37:27.515Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "amountPaid": 5000,
                            "totalPrice": 5000,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-06-11T13:42:11.901Z",
                            "date": "2018-06-11T13:37:27.515Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "amountPaid": 5000,
                            "totalPrice": 5000,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        }
                    ],
                    "person": "Opeyemi Oromire"
                },
                {
                    "_id": "5b1e8066261b7f28d85eedbc",
                    "patientId": "5afd30a45b9522384839842f",
                    "totalPrice": 10000,
                    "balance": 0,
                    "invoiceNo": "IV/116/7106",
                    "paymentCompleted": true,
                    "payments": [],
                    "person": "Opeyemi Oromire"
                },
                {
                    "_id": "5b1f829f261b7f28d85eedee",
                    "patientId": "5b17b4579e5b750a0c2d78f8",
                    "totalPrice": 9000,
                    "balance": 0,
                    "invoiceNo": "IV/126/7575",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-06-12T08:13:15.832Z",
                            "paymentDate": "2018-06-12T08:21:51.609Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 1500,
                            "totalPrice": 1500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:30:12.575Z",
                            "paymentDate": "2018-06-12T08:21:51.609Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:15:52.621Z",
                            "paymentDate": "2018-06-12T08:21:51.609Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "paymentDate": "2018-06-12T08:19:19.415Z",
                            "date": "2018-06-12T08:21:51.609Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "amountPaid": 5000,
                            "totalPrice": 5000,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-06-12T08:19:19.422Z",
                            "date": "2018-06-12T08:21:51.609Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "amountPaid": 1500,
                            "totalPrice": 1500,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-06-12T08:19:19.422Z",
                            "date": "2018-06-12T08:21:51.609Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "amountPaid": 2500,
                            "totalPrice": 2500,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        }
                    ],
                    "person": "John Kunmi"
                },
                {
                    "_id": "5b1ff8ac4df50a0d84d0aa08",
                    "patientId": "5b17b4579e5b750a0c2d78f8",
                    "totalPrice": 8000,
                    "balance": 8000,
                    "invoiceNo": "IV/126/617",
                    "paymentCompleted": false,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398404",
                                "service": "Malaria Parasite",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-12T16:45:05.017Z",
                            "paymentDate": "2018-06-12T16:45:32.399Z"
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398408",
                                "service": "Widal Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-12T16:45:05.017Z",
                            "paymentDate": "2018-06-12T16:45:32.399Z"
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 1500,
                            "totalPrice": 1500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-12T16:43:47.063Z",
                            "paymentDate": "2018-06-12T16:45:32.399Z"
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 1500,
                            "totalPrice": 1500,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:30:12.575Z",
                            "paymentDate": "2018-06-12T16:45:32.399Z"
                        }
                    ],
                    "person": "John Kunmi"
                },
                {
                    "_id": "5b1ff8d64df50a0d84d0aa09",
                    "patientId": "5b17b4579e5b750a0c2d78f8",
                    "totalPrice": 8000,
                    "balance": 0,
                    "invoiceNo": "IV/126/412",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 2500,
                            "amountPaid": 2500,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398408",
                                "service": "Widal Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-12T16:45:05.017Z",
                            "paymentDate": "2018-06-12T16:46:10.680Z"
                        },
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 3000,
                            "amountPaid": 3000,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 2,
                            "date": "2018-06-12T16:43:47.063Z",
                            "paymentDate": "2018-06-12T16:46:10.681Z"
                        },
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 2500,
                            "amountPaid": 2500,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-06-06T10:15:52.621Z",
                            "paymentDate": "2018-06-12T16:46:10.681Z"
                        }
                    ],
                    "person": "John Kunmi"
                },
                {
                    "_id": "5b251ccd030efe1ea0118ed8",
                    "patientId": "5afd31975b9522384839843f",
                    "totalPrice": 4000,
                    "balance": 0,
                    "invoiceNo": "IV/166/1383",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 0,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5b2108ec4df50a0d84d0af5f",
                                "service": "consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 3,
                            "date": "2018-06-16T14:19:21.707Z",
                            "paymentDate": "2018-06-16T14:20:55.863Z"
                        }
                    ],
                    "person": "Nseobong Okoro"
                },
                {
                    "_id": "5b30afa2030efe1ea01190c5",
                    "patientId": "5b0813dfbe26631da45ec49a",
                    "totalPrice": 10000,
                    "balance": 0,
                    "invoiceNo": "IV/256/3375",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 10000,
                            "amountPaid": 10000,
                            "facilityServiceObject": {
                                "serviceId": "5b2cacaa030efe1ea0119033",
                                "service": "Diclofenac Sodium 50 MG Delayed Release Oral Tablet [Volraman]",
                                "category": "Pharmacy",
                                "categoryId": "5af54ca6dbffe92c9055904b"
                            },
                            "qty": 20,
                            "date": "2018-06-25T08:46:40.275Z",
                            "paymentDate": "2018-06-25T08:59:20.787Z"
                        }
                    ],
                    "person": "Deji Iroko"
                },
                {
                    "_id": "5b30dab6030efe1ea0119102",
                    "patientId": "5afd32695b9522384839844b",
                    "totalPrice": 1000,
                    "balance": 0,
                    "invoiceNo": "IV/256/8181",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 1000,
                            "amountPaid": 1000,
                            "facilityServiceObject": {
                                "serviceId": "5b2cacaa030efe1ea0119033",
                                "service": "Diclofenac Sodium 50 MG Delayed Release Oral Tablet [Volraman]",
                                "category": "Pharmacy",
                                "categoryId": "5af54ca6dbffe92c9055904b"
                            },
                            "qty": 2,
                            "date": "2018-06-25T12:04:56.533Z",
                            "paymentDate": "2018-06-25T12:03:25.235Z"
                        }
                    ],
                    "person": "Monica Akpanowo"
                },
                {
                    "_id": "5b40d40b0e24fe11e067001e",
                    "patientId": "5b0813dfbe26631da45ec49a",
                    "totalPrice": 7500,
                    "balance": 7500,
                    "invoiceNo": "IV/77/9573",
                    "paymentCompleted": false,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "isSubCharge": false,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-05-30T20:26:17.748Z",
                            "paymentDate": "2018-07-07T14:54:03.712Z"
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "isSubCharge": false,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-25T13:47:12.316Z",
                            "paymentDate": "2018-07-07T14:54:03.712Z"
                        }
                    ],
                    "person": "Deji Iroko"
                },
                {
                    "_id": "5b4c67a67079492d600a6cc9",
                    "patientId": "5afd32365b95223848398443",
                    "totalPrice": 7500,
                    "balance": 0,
                    "invoiceNo": "IV/167/2405",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 2500,
                            "totalPrice": 2500,
                            "isSubCharge": false,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398408",
                                "service": "Widal Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 1,
                            "date": "2018-06-22T07:54:59.205Z",
                            "paymentDate": "2018-07-16T09:38:46.177Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "createdBy": "",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": false,
                            "balance": 5000,
                            "totalPrice": 5000,
                            "isSubCharge": false,
                            "amountPaid": 0,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-06-13T11:14:16.435Z",
                            "paymentDate": "2018-07-16T09:38:46.177Z",
                            "isItemTxnClosed": true
                        },
                        {
                            "paymentDate": "2018-07-16T09:36:01.553Z",
                            "date": "2018-07-16T09:38:46.177Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398408",
                                "service": "Widal Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "amountPaid": 2500,
                            "totalPrice": 2500,
                            "isSubCharge": false,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": false,
                            "waiverComment": "",
                            "createdBy": "5afbe472dbffe92c90559101"
                        },
                        {
                            "paymentDate": "2018-07-16T09:36:01.554Z",
                            "date": "2018-07-16T09:38:46.177Z",
                            "qty": 1,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "amountPaid": 0,
                            "totalPrice": 5000,
                            "isSubCharge": false,
                            "balance": 0,
                            "isPaymentCompleted": true,
                            "isWaiver": true,
                            "waiverComment": "Consultation is free",
                            "createdBy": "5afbe472dbffe92c90559101"
                        }
                    ],
                    "person": "Favour  Dick"
                },
                {
                    "_id": "5b4c814d7079492d600a6d06",
                    "patientId": "5afd31405b95223848398437",
                    "totalPrice": 10000,
                    "balance": 0,
                    "invoiceNo": "IV/167/8004",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "isSubCharge": false,
                            "totalPrice": 4411.764705882353,
                            "amountPaid": 4411.764705882353,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398409",
                                "service": "Pregnancy Test",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 5,
                            "date": "2018-07-16T11:25:28.946Z",
                            "paymentDate": "2018-07-16T11:24:57.018Z"
                        },
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "isSubCharge": false,
                            "totalPrice": 1176.4705882352941,
                            "amountPaid": 1176.4705882352941,
                            "facilityServiceObject": {
                                "serviceId": "5afc3f3e5b95223848398404",
                                "service": "Malaria Parasite",
                                "category": "Laboratory",
                                "categoryId": "5af54ca6dbffe92c9055904d"
                            },
                            "qty": 2,
                            "date": "2018-07-16T11:13:47.090Z",
                            "paymentDate": "2018-07-16T11:24:57.018Z"
                        },
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "isSubCharge": false,
                            "totalPrice": 2941.176470588235,
                            "amountPaid": 2941.176470588235,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 1,
                            "date": "2018-07-16T10:42:04.919Z",
                            "paymentDate": "2018-07-16T11:24:57.020Z"
                        },
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "isSubCharge": false,
                            "totalPrice": 1470.5882352941176,
                            "amountPaid": 1470.5882352941176,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-17T07:37:37.425Z",
                            "paymentDate": "2018-07-16T11:24:57.020Z"
                        }
                    ],
                    "person": "Okokon Etim Udo"
                },
                {
                    "_id": "5b4cb4ed7079492d600a6dd6",
                    "patientId": "5afd32365b95223848398443",
                    "totalPrice": 10000,
                    "balance": 0,
                    "invoiceNo": "IV/167/6663",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "isSubCharge": false,
                            "totalPrice": 10000,
                            "amountPaid": 10000,
                            "facilityServiceObject": {
                                "serviceId": "5afc080d5b9522384839839e",
                                "service": "General Consultation",
                                "category": "Appointment",
                                "categoryId": "5af54ca6dbffe92c90559048"
                            },
                            "qty": 2,
                            "date": "2018-07-16T10:32:57.153Z",
                            "paymentDate": "2018-07-16T15:05:28.709Z"
                        }
                    ],
                    "person": "Favour  Dick"
                }
            ]
        };
        return Promise.resolve(result);
    }
}