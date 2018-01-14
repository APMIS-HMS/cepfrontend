import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import {
  CountriesService, EmployeeService, FormsService,
  FacilitiesService, UserService, PersonService,
  PatientService, AppointmentService, DocumentationService
} from '../../../../../services/facility-manager/setup/index';
import {
  Facility, User, Patient, Employee, MinorLocation, Appointment, Country, ClinicInteraction,
  Documentation
} from '../../../../../models/index';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IDateRange } from 'ng-pick-daterange';

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.scss']
})
export class PatientVitalsComponent implements OnInit {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient: Patient;
  public lineChartData: Array<any> = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90],
    [78, 68, 10, 99, 46, 37, 20],
    [68, 48, 30, 29, 86, 27, 60],
    [18, 58, 80, 49, 56, 17, 10]
  ];
  public lineChartLabels: Array<any> = [''];
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
    { // cyan
      backgroundColor: 'rgba(77,208,225,0.2)',
      borderColor: 'rgba(77,208,225,1)',
      pointBackgroundColor: 'rgba(77,208,225,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,208,225,0.8)'
    },
    { // green
      backgroundColor: 'rgba(129,199,132,0.2)',
      borderColor: 'rgba(129,199,132,1)',
      pointBackgroundColor: 'rgba(129,199,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(129,199,132,0.8)'
    },
    { // lime
      backgroundColor: 'rgba(220,231,117,0.2)',
      borderColor: 'rgba(220,231,117,1)',
      pointBackgroundColor: 'rgba(220,231,117,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220,231,117,0.8)'
    },
    { // purple
      backgroundColor: 'rgba(186,104,200,0.2)',
      borderColor: 'rgba(186,104,200,1)',
      pointBackgroundColor: 'rgba(186,104,200,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(186,104,200,0.8)'
    },
    { // red
      backgroundColor: 'rgba(229,	115,	115,0.2)',
      borderColor: 'rgba(229,115,115,1)',
      pointBackgroundColor: 'rgba(229,115,115,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(229,115,115,0.8)'
    },
    { // red
      backgroundColor: 'rgba(229,	115,	115,0.2)',
      borderColor: 'rgba(229,115,115,1)',
      pointBackgroundColor: 'rgba(229,115,115,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(229,115,115,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  addVitals_view = false;
  addVitalsPop = false;

  vitalsPulse = [];
  vitalsRespiratoryRate = [];
  vitalsBMI = [];
  vitalsHeight = [];
  vitalsWeight = [];
  vitalsSystolic = [];
  vitalsDiastolic = [];
  vitalsTemp = [];
  vitalChartData = [];

  dateRange: any;
  loadIndicatorVisible: any;

  constructor(private countryService: CountriesService,
    private patientService: PatientService,
    private userService: UserService,
    private facilityService: FacilitiesService,
    private appointmentService: AppointmentService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private formsService: FormsService,
    private router: Router, private route: ActivatedRoute,
    private locker: CoolLocalStorage,
    private _DocumentationService: DocumentationService) { }

  ngOnInit() {
    // this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    // if (this.patient !== undefined) {
    //   this.getCurrentUser();
    //   this.bindVitalsDataToChart();
    // }

    this._DocumentationService.listenerCreate.subscribe(payload => {
      //this.bindVitalsDataToChart();
      // window.location.reload();
    });
    this._DocumentationService.listenerUpdate.subscribe(payload => {
      //this.bindVitalsDataToChart();
      // window.location.reload();
    });
  }

  bindVitalsDataToChart() {
    var vitalsObjArray = [];
    this.lineChartData = [
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' }

    ];
    this._DocumentationService.find({ query: { 'personId._id': this.patient.personId } }).then((payload: any) => {
      if (payload.data.length !== 0) {
        payload.data[0].documentations.forEach(documentItem => {
          if (documentItem.document.documentType !== undefined && documentItem.document.documentType.title === 'Vitals') {
            vitalsObjArray = documentItem.document.body.vitals;
            if (vitalsObjArray !== undefined) {
              vitalsObjArray.forEach(item => {
                this.lineChartData[0].data.push(item.bloodPressure.systolic);
                this.lineChartData[0].label = "Systolic";
                this.lineChartData[1].data.push(item.bloodPressure.diastolic);
                this.lineChartData[1].label = "Diastolic";
                this.lineChartData[2].data.push(item.temperature);
                this.lineChartData[2].label = "Temperature";
                this.lineChartData[3].data.push(item.bodyMass.height);
                this.lineChartData[3].label = "Height";
                this.lineChartData[4].data.push(item.bodyMass.weight);
                this.lineChartData[4].label = "Weight";
                this.lineChartData[5].data.push(item.bodyMass.bmi);
                this.lineChartData[5].label = "BMI";
                const d = new Date(item.updatedAt);
                let dt = this.dateFormater(d);
                this.lineChartLabels.push(dt);
              });
              this.lineChartData = this.refreshVitalsGraph(this.lineChartData);
            }

          }
        });
      }
    }, error => {

    });
  }
  dateFormater(d) {
    var dt = [d.getDate(),
    d.getMonth() + 1].join('/') + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dt;
  }
  refreshVitalsGraph(lineChartData: any[]) {
    let _lineChartData: Array<any> = new Array(lineChartData.length);
    for (let i = 0; i < lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(lineChartData[i].data.length), label: lineChartData[i].label };
      for (let j = 0; j < lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = lineChartData[i].data[j];
      }
    }
    return _lineChartData;
  }

  addVitals_show(e) {
    this.addVitals_view = true;
  }
  close_onClick(message: boolean): void {
    this.addVitals_view = false;
  }
  addVitalsPop_show() {
    this.addVitalsPop = true;
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }
  setReturnValue(e) {

  }
}