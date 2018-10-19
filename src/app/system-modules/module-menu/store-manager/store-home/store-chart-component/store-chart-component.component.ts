import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IStoreSummaryItem } from '../new-store-manager-components/store-summary-model';

@Component({
  selector: 'store-chart',
  templateUrl: './store-chart-component.component.html',
  styleUrls: ['./store-chart-component.component.scss']
})
export class StoreChartComponentComponent implements OnInit, OnChanges {

@Input() chartObj: IStoreSummaryItem[] = [];
  // Chart configurtation setup
  public barChartLabels: string[];
  public barChartOptions: any = {
      scaleShowVerticalLines: false,
      responsive: true
    };
  public barChartLegend = true;
  public barChartType = 'bar';
  public barChartData: {};
  constructor() {
   }

  ngOnInit() {

  }
  ngOnChanges(simple: SimpleChanges) {
    if (simple['chartObj'].currentValue  != null) {
        // construct label and data object for the store chart
        setTimeout (() => this.barChartLabels = this.getPropFromArray(this.chartObj, 'key'));
        this.barChartData = [{data: this.getPropFromArray(this.chartObj, 'value'), label: 'Summary'}]
    }
  }

  // This method extracts the value of a particular property in an array
  private getPropFromArray(data: any, prop): any {
    return data.map(d => d[prop])
 }
  public chartClicked(e: any): void {
      console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

}
