import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-record-documentation',
  templateUrl: './med-record-documentation.component.html',
  styleUrls: ['./med-record-documentation.component.scss']
})
export class MedRecordDocumentationComponent implements OnInit {

  tab1 = true;
  tab2 = false;
  tab3 = false;

  public lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  problem: any;
  constructor() { }

  ngOnInit() {
  }

  vital_tab() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
  }
  allergies_tab() {
    this.tab1 = false;
    this.tab2 = true;
    this.tab3 = false;
  }
  problem_tab() {
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = true;
  }
  chartClicked(e){

  }
  chartHovered(e){
    
  }
}
