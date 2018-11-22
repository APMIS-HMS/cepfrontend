import {Injectable} from '@angular/core';
import {
    IGroupableLabReportModel,
    ILabReportModel,
    ILabReportOption, ILabReportSummaryModel
} from "./LabReportModel";
import {RestService} from "../../feathers/feathers.service";
import {IApiResponse, ICustomReportService, IPaymentReportServiceEndPoint} from "./ReportGenContracts";
import {IPatientReportModel, IPatientReportOptions} from "./PatientReportModel";
import {
    IPaymentGroups,
    IPaymentReportModel,
    IPaymentReportOptions,
    IPaymentReportSummaryModel
} from "./PaymentReportModel";
import {CoolLocalStorage} from "angular2-cool-storage";


@Injectable()
export class ReportGeneratorService implements ICustomReportService {
    selectedFacility: any;

    constructor(private restEndpoint: RestService, localStorage: CoolLocalStorage) {
        //super();
        this.selectedFacility = localStorage.getObject("selectedFacility");

    }

    getLabReport(options: ILabReportOption): Promise<IApiResponse<ILabReportModel[]>> {
        options.facilityId = this.selectedFacility._id;
        const newOption: any = {...options};
        if (options.paginate) {
            // set the appropriate fields
            newOption.limit = options.paginationOptions.limit;
            newOption.skip = options.paginationOptions.limit * options.paginationOptions.skip;
        }

        return this.restEndpoint.getService("laboratory-report-summary")
            .find({query: newOption});
    }

    getGroupedLabReport(options: ILabReportOption): Promise<IApiResponse<IGroupableLabReportModel[]>> {

        options.facilityId = this.selectedFacility._id;
        options.useGrouping  = true;
        options.groupBy = options.groupBy || 'location';
        
        // Check for pagination and fix the request appropriately
        const newOption: any = {...options};
        if (options.paginate) {
            // set the appropriate fields
            newOption.$limit = options.paginationOptions.limit;
            newOption.$skip = options.paginationOptions.limit * options.paginationOptions.skip;
        }
        return this.restEndpoint.getService("laboratory-report-summary")
            .find({query: newOption});

    }

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<IApiResponse<ILabReportSummaryModel[]>> {
        options = options || {};
        options.facilityId = this.selectedFacility._id;
        options.isInvestigation = true;
        return this.restEndpoint.getService("laboratory-report-summary")
            .find({query: options});
    }

    getPatientReport(options: IPatientReportOptions): Promise<IApiResponse<IPatientReportModel[]>> {
        return Promise.resolve({data: []});
    }

    getWorkBenches(): any {
        // get the Service end point;
        console.log(this.selectedFacility);
        return this.restEndpoint.getService("workbenches").find({
            query: {
                facilityId: this.selectedFacility._id
            }
        });
    }

    getLocations() {
        return this.selectedFacility.minorLocations.map(x => {
            return {
                id: x.locationId,
                location: x.name
            }
        });
    }

    /*  
    *   Reports for Patients
    * */

}

@Injectable()
export class PaymentReportGenerator implements IPaymentReportServiceEndPoint {
    paymentReportServiceRef;
    selectedFacility: any;

    constructor(private restEndpoint: RestService, locker: CoolLocalStorage) {
        //super();
        this.paymentReportServiceRef = this.restEndpoint.getService("payment-reports");
        this.selectedFacility = locker.getObject("selectedFacility");
    }

    getInvoicePaymentReport(options: IPaymentReportOptions): Promise<IApiResponse<IPaymentReportModel[]>> {
        options.facilityId = this.selectedFacility._id;
        const newOption:any  = {...options};
        if(options.paginate)
        {
            // set the appropriate fields
            newOption.$limit  = options.paginationOptions.limit;
            newOption.$skip  = options.paginationOptions.limit * options.paginationOptions.skip;
        }
        return this.paymentReportServiceRef.get(options.facilityId,
            {
                query: options
            }
        );

    }

    getPaymentGroups(rptOption: IPaymentReportOptions): Promise<IApiResponse<IPaymentGroups[]>> {
        rptOption.facilityId = this.selectedFacility._id;
        return undefined;
    }

    getPaymentReportSummary(rptOption: IPaymentReportOptions = {}): Promise<IApiResponse<IPaymentReportSummaryModel>> {
        rptOption.facilityId = this.selectedFacility._id;

        /* So to get  all report summary we simply send a 'isSummary' variable to the server, Date range might be checked on server*/
        // we also expect the facility id to be set
        rptOption.isSummary = true;
        return this.paymentReportServiceRef.get(rptOption.facilityId,
            {
                query: rptOption
            }
        );

    }

}