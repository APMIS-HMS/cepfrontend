import {Component, Input, OnInit} from '@angular/core';
import {ILabReportOption, ILabReportSummaryModel} from "./LabReportModel";
import {ReportGeneratorService} from "./report-generator-service";

@Component({
    selector: 'app-lab-report-summary',
    template: `
        <div class="pad20">
            <h3>Lab Report Summary</h3>
            <table class="table">
                <tr>
                    <th></th>
                    <th>Request Type</th>
                    <th>Total</th>
                </tr>
                <tr *ngFor="let r of reportData">
                    <td colspan="3">
                        <h4>{{r.location}}</h4>
                        <hr>
                        <div>
                            <table class="table">
                                <tr *ngFor=" let s of r.summary">
                                    <td></td>
                                    <td>{{s.request}}</td>
                                    <td>{{s.total|number}}</td>
                                </tr>
                            </table>
                        </div>
                    </td>

                </tr>
            </table>

        </div>`,
    styles: [`
        .pad20 {
            padding: 20px;
            margin-top: 10px;
        }
    `]
})

export class LabReportSummaryComponent implements OnInit {
    @Input() reportData: ILabReportSummaryModel[] = [];
    @Input() reportOption: ILabReportOption;

    constructor() {
    }

    ngOnInit() {
        //this.getReportSummary();
    }

    /*getReportSummary()
    {
        this.reportGen.getLabReportInvestigationSummary(this.reportOption)
            .then( x => {
                console.log(x);
                this.reportData = x;
            });
        console.log(this.reportOption);
    }*/
}