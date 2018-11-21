import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';

@Component({
  selector: 'app-patient-registration-analytics',
  templateUrl: './patient-registration-analytics.component.html',
  styleUrls: ['./patient-registration-analytics.component.scss']
})
export class PatientRegistrationAnalyticsComponent implements OnInit {
  patientManagerReport = false;
	patientRegistration = false;

  pageInView = 'Patient Registration Analytics';

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  //barChart 
  public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
  };
  public barChartLabels:string[] = ['0-14', '3-10', '11-30', '31-50', '51 above'];
  public barChartData: any[] = [
		{ data: [ 4, 8, 12, 16, 20, 24, 28 ], label: 'Female' },
		{ data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Male' }
	];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;


  //pieChart
  public pieChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
  };
  public pieChartLabels:string[] = ['Private patient', 'Company cover', 'HMO', 'Family'];
  public pieChartData: any[] = [
		{ data: [ 4, 8, 12, 16 ],  },
	];
  public pieChartType: string = 'pie';
  public pieChartLegend: boolean = true;
  // events
  public chartClicked(e: any ): void {
  }
  public chartHovered(e: any): void {
  }


  pageInViewLoader(title) {
		this.pageInView = title;
  }
  patientRegistration_analytics() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
  }
 
 }







