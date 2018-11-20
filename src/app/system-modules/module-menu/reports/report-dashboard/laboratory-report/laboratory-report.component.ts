import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {ReportGeneratorService} from "../../../../../core-ui-modules/ui-components/report-generator-service";
import {
    ILabReportModel,
    ILabReportOption,
    ILabReportSummaryModel
} from "../../../../../core-ui-modules/ui-components/LabReportModel";
import {IPagerSource} from "../../../../../core-ui-modules/ui-components/PagerComponent";

@Component({
    selector: 'app-laboratory-report',
    templateUrl: './laboratory-report.component.html',
    styleUrls: ['./laboratory-report.component.scss']
})
export class LaboratoryReportComponent implements OnInit {

    searchControl = new FormControl();
    searchCriteria = new FormControl('Search');

    pageInView = 'Laboratory Report';
    processing: boolean = false;
    reportData: ILabReportModel[] = [];
    reportOptions: ILabReportOption = {
        filterByDate: true,
        startDate: new Date(2018, 7, 20, 0, 30, 10),
        endDate: new Date()
    }
    reportSummaryData: ILabReportSummaryModel[] = [];
    pagerSource : IPagerSource = { totalPages : 0 , totalRecord : 0 , currentPage : 0 , pageSize : 30};
    constructor(private _router: Router, private reportSource: ReportGeneratorService) {
    }

    ngOnInit() {
        this.getReportData();
        this.getReportSummary();
    }

    getReportData() {
        this.processing = true;
        if(this.reportOptions.paginate)
        {
            this.reportOptions.paginationOptions = {
                limit  : this.pagerSource.pageSize,
                skip : this.pagerSource.currentPage * this.pagerSource.pageSize
            }
        }
        this.reportSource.getLabReport(this.reportOptions)
            .then(x => {
                console.log(x);
                this.reportData = x.data;
                this.processing = false;
                this.pagerSource.totalRecord  = x.total;
            });
    }

    getReportSummary() {
        this.reportSource.getLabReportInvestigationSummary(this.reportOptions)
            .then(x => {
                console.log(x);
                this.reportSummaryData = x.data;
            });
        console.log(this.reportOptions);
    }

    pageInViewLoader(title) {
        this.pageInView = title;
    }

    back_dashboard() {
        this._router.navigate(['/dashboard/reports/report-dashboard']);
    }
    pageClickedEvent(index: number) {
        // goto next page using the current index
        this.pagerSource.currentPage = index;
        this.getReportData();
    }

}
