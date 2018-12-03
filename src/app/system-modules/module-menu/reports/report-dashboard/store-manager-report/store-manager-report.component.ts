import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-manager-report',
  templateUrl: './store-manager-report.component.html',
  styleUrls: ['./store-manager-report.component.scss']
})
export class StoreManagerReportComponent implements OnInit {

	stockReport = false;
  storeSalesReport = false;

    pageInView = 'Store Report';

  constructor(private _router: Router) { }

  ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
  }

  checkPageUrl(param: string) {
		if (param.includes('storeSales')) {
			this.stockReport = false;
			this.storeSalesReport = true;
			this._router.navigate([ '/dashboard/reports/report-dashboard/storeManagerReport/storeSales' ]);
		} else if (param.includes('stockReport')) {
			this.stockReport = true;
			this.storeSalesReport = false;
			this._router.navigate([ '/dashboard/reports/report-dashboard/storeReport/stockReport' ]);
		} else {
			this.stockReport = false;
			this.storeSalesReport = true;
			this._router.navigate([ '/dashboard/reports/report-dashboard/storeReport/salesReport' ]);
		}
	}
	// route(link) {
	// 	console.log(link);
	// 	if (link === 'patientAnalytics') {
	// 		this.patientRegistrationAnalytics = true;
	// 	}  else {
	// 		this.patientRegistrationAnalytics = false;
	// 	}
	// 	this._router.navigate([ '/dashboard/reports/report-dashboard/patient-manager-report' + link ]);
	// }

 // pageInViewLoader(title) {
		//this.pageInView = title;
  //}

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
  }
	storeSales() {
		this._router.navigate(['/dashboard/reports/report-dashboard/storeReport/salesReport']);
	 }


 storeStockReport() {
		this._router.navigate(['/dashboard/reports/report-dashboard/storeReport/stockReport']);
 }

 pageInViewLoader(title) {
  this.pageInView = title;
}

}

