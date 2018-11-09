import {Component, Input, OnInit} from '@angular/core';
import {ILabReportModel, ILabReportOption, ILabReportSummaryModel} from "./LabReportModel";
import {DummyReportDataService} from "./DummyReportDataService";
import {ReportGeneratorService} from "./report-generator-service";
import {CustomReportService} from "./ReportGenContracts";

@Component({
    selector: 'app-report-viewer',
    template: `
        <div>
            <div class="report-options margin-b-15 flex-container">
                <div class="options">
                    <div class="row">
                        <div class="col-sm-4" >
                            <input type="checkbox" [checked]="reportOptions.filterByDate" #chk/>Filter By Date
                            <p class="pad20" *ngIf="chk.checked">
                                <app-date-range (dateRangeChange)="setDateOptions($event)" [dateRange]="{from : reportOptions.startDate, to: reportOptions.endDate}"></app-date-range>
                            </p>
                          
                        </div>
                        <div class="col-sm-8">
                            <div class="row" style="min-width:500px;">
                                <div class="col-sm-5">
                                    Select Clinic
                                    <select class="form-control">
                                    </select>
                                   <!-- <p class="pad10 divider">
                                        <span>Include Provider</span>
                                        <br>
                                        <input type="text" class="form-control" placeholder="Provider">
                                    </p>-->
                                </div>
                                <div class="col-sm-7">
                                    <div style="float : right;padding: 10px; ">
                                        <asom-pager-button [is-oval]="true" (onClick)="printReport()">
                                            <span class="fa fa-print fa-2x"></span>
                                        </asom-pager-button>
                                        
                                        <app-document-printer [content]="template"></app-document-printer>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-container margin-b-30">

                <div class="report-viewer-container" #template>
                    <div class="report-header">
                        <h3>{{title || 'Report Title'}}</h3>
                    </div>
                    <div class="report-body">
                        <table class="table table-bordered">
                            <tr>
                                <th style="width : 25%; ">Patient Info</th>
                                <th>Date</th>
                                <th>Request</th>
                                <th>Doctor Assigned</th>
                                <th>Clinic Assigned</th>
                                <th>Status</th>
                            </tr>
                            <tr *ngIf="processing">
                                <td colspan="6">
                                    <div class="pad20 flex-container">
                                        <span class="fa fa-3x fa-spin fa-spinner"></span>
                                    </div>
                                </td>
                            </tr>
                            <tr *ngFor="let r of reportData">
                                <td>
                                    <span>{{r.patientName}}
                                </span>
                                    <br>
                                    <small>Apmis ID: <span
                                            style="font-weight: bold; color : #2984ff;">{{r.apmisId}}</span></small>
                                </td>
                                <td><span>{{r.date | date:'MMM dd, yyyy'}}</span></td>
                                <td><span>{{r.request}}</span></td>
                                <td><span>{{r.doctor}}</span></td>
                                <td><span>{{r.clinic}}</span></td>
                                <td><span class="green highlight">{{r.status}}</span></td>
                            </tr>
                        </table>
                        
                        <div>
                            <app-lab-report-summary [reportOption]="reportOptions" [reportData]="reportSummaryData"></app-lab-report-summary>
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `,
    styles: [`
        .font-size-14
        {
            font-size: 14px;
        }

        div.report-options {
            background: #fdfdfd;
            background-image: linear-gradient(#f5f6fc, #e8eaf5);
            padding: 20px;
            min-height: 40px;
            box-shadow: 0px -1px 13px rgba(194, 194, 194, 0.49);
            -webkit-transition: all linear 0.3s;
            -moz-transition: all linear 0.3s;
            -ms-transition: all linear 0.3s;
            -o-transition: all linear 0.3s;
            transition: all linear 0.3s;

        }

        div.flex-container {
            display: flex;
            flex-direction: column;
            align-content: start;
            align-items: center;
            justify-content: center;

        }

        .margin-b-30 {
            margin-bottom: 30px;
        }

        .margin-b-15 {
            margin-bottom: 15px;
        }

        div.report-viewer-container {
            min-width: 8.27in;
            font-size: 1.3rem;
            background-color: white;
            min-height: 11.69in;
            box-shadow: 0px 3px 13px rgba(172, 172, 172, 0.49), -1px 0px 20px rgba(172, 172, 172, 0.49);
        }

        div.report-header {
            padding: 20px 25px;
            background-color: #f0f2f5;

        }

        div.report-body {
            padding: 20px 25px;
        }

        .highlight {
            font-weight: bold;
            font-size: 1.2rem;

        }

        .green {
            color: forestgreen;

        }

        .green-bg {
            background-color: forestgreen;
            color: white;
            display: block;
        }

        @media print {
            div.report-options {
                display: none;
            }

            div.report-viewer-container {
                display: block !important;
                box-shadow: none;
            }
        }
    `]
})

export class AsomReportViewerComponent implements OnInit {
    processing : boolean = false;
    @Input() title: string = "Report Title";
    clinics: string[] = [];
    reportData: ILabReportModel[] = [];
    reportOptions: ILabReportOption = {
        filterByClinic: false,
        filterByDate: true,
        startDate: new Date(2018,7,20,0,30,10),
        endDate: new Date()
    }
    reportSummaryData: ILabReportSummaryModel[] =[];

    constructor(private  reportSource: ReportGeneratorService) {
    }

    ngOnInit() {
        this.getReportData();
        this.getReportSummary();
    }

    getReportData() {
        this.processing = true;
        this.reportSource.getLabReport(this.reportOptions)
            .then(x => {
                console.log(x);
                this.reportData = x;
                this.processing  = false;
            });
    }
    getReportSummary()
    {
        this.reportSource.getLabReportInvestigationSummary(this.reportOptions)
            .then( x => {
                console.log(x);
                this.reportSummaryData = x;
            });
        console.log(this.reportOptions);
    }
    
    printReport() {
        // Hide all Banners
        window.print();
    }

    setDateOptions(dateRange ) {
        console.log(dateRange);
        this.reportOptions.startDate = dateRange.from;
        this.reportOptions.endDate  = dateRange.to;
    }
}