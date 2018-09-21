import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-clinic-homepage',
  templateUrl: './clinic-homepage.component.html',
  styleUrls: ['./clinic-homepage.component.scss']
})
export class ClinicHomepageComponent implements OnInit {
  selectedFacility: any = <any>{};
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [''];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public randomize(): void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }

  constructor(private appointmentService: AppointmentService,
    private _locker: CoolLocalStorage) {

  }

  ngOnInit() {
    this.selectedFacility = <any>this._locker.getObject('selectedFacility');
    // this.getAppointmentChart();
  }

  getAppointmentChart() {
    this.appointmentService.getAppointmentChart(this.selectedFacility._id, {}).then(payload => {
      console.log(payload);
      // let data_1 = [];
      // for (let index = 0; index < payload.checkOuts.length; index++) {
      //   const element = payload.checkOuts[index];
      //   this.barChartLabels.push(element.date);
      //   data_1.push(element.count);
      // }
      // this.barChartData.push({
      //   data:data_1,
      //   label: 'Check Out'
      // })

      // for (let index = 0; index < payload.nonCheckOuts.length; index++) {
      //   const element = payload.nonCheckOuts[index];
      //   this.nonCheckOutsBarChartLabels.push(element.date);
      // }

      // payload.checkOuts.forEach(element => {
      //   this.checkOutsBarChartLabels.push(element.date);
      // });
    });
  }

}
