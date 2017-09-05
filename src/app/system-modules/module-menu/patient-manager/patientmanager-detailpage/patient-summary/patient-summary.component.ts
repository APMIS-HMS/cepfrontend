import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CountriesService, EmployeeService, FormsService,
  FacilitiesService, UserService, PersonService,
  PatientService, AppointmentService, DocumentationService
}
  from '../../../../../services/facility-manager/setup/index';
import {
  Facility, User, Patient, Employee, MinorLocation, Appointment, Country, ClinicInteraction,
  Documentation
} from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-patient-summary',
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.scss']
})
export class PatientSummaryComponent implements OnInit, OnDestroy {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient: Patient;
  // @Input() vitalDocuments: any;

  lineChartData = [];


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
  subsect_biodata = true;
  subsect_contacts = false;
  subsect_vitals = true;
  subsect_tags = true;
  addVitalsPop = false;
  addTagsPop = false;
  checkoutPatient = false;

  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;

  menuSummary = true;
  menuPharmacy = false;
  menuBilling = false;
  menuTreatmentPlan = false;
  menuPrescriptions = false;
  menuImaging = false;
  menuLab = false;
  menuForms = false;
  menuDocs = false;
  menuImages = false;
  menuLists = false;
  menuTimeline = false;
  menuFinance = false;

  contentSecMenuShow = false;
  modal_on = false;
  changeUserImg = false;
  logoutConfirm_on = false;
  empDetailPg = true;
  selectedDepartment: any;
  selectedNationality: Country;
  selectedState: any;
  selectedLGA: any;
  selectedFacility: Facility = <Facility>{};
  searchControl = new FormControl();
  patients: Patient[] = [];
  documentations: Documentation[] = [];
  homeAddress: string = '';
  selectedUser: User = <User>{};
  loginEmployee: Employee = <Employee>{};
  clinicInteraction: ClinicInteraction = <ClinicInteraction>{};
  previousUrl: string = '/';
  minorLocationList: MinorLocation[] = [];
  selectedAppointment: Appointment = <Appointment>{};
  json: any = {};
  vitalsObjArray = [];
  vitalsPulse = [];
  vitalsRespiratoryRate = [];
  vitalsBMI = [];
  vitalsHeight = [];
  vitalsWeight = [];
  vitalsSystolic = [];
  vitalsDiastolic = [];
  vitalsTemp = [];
  vitalChartData = [];
  constructor(private countryService: CountriesService,
    private patientService: PatientService,
    private userService: UserService,
    private facilityService: FacilitiesService,
    private appointmentService: AppointmentService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private formsService: FormsService,
    private router: Router, private route: ActivatedRoute,
    private locker: CoolSessionStorage,
    private _DocumentationService: DocumentationService) {

    this.router.events
      .filter(e => e.constructor.name === 'RoutesRecognized')
      .pairwise()
      .subscribe((e: any[]) => {
        this.previousUrl = e[0].urlAfterRedirects;
      });

    this.personService.updateListener.subscribe(payload => {
      this.patient.personDetails = payload;
    });

    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    
  }

  ngOnInit() {
    
    this.getForms();
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    if (this.patient !== undefined) {
      this.getCurrentUser();
      this.bindVitalsDataToChart();
    }

    this._DocumentationService.listenerCreate.subscribe(payload => {
      this.bindVitalsDataToChart();
    });

    this._DocumentationService.listenerUpdate.subscribe(payload => {
      this.bindVitalsDataToChart();
    });
  }

  // ngAfterViewInit() {
  //   this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  //   if (this.patient !== undefined) {
  //     this.getCurrentUser();
  //     this.bindVitalsDataToChart();
  //   }

  //   this._DocumentationService.listenerCreate.subscribe(payload => {
  //     this.bindVitalsDataToChart();
  //   });

  //   this._DocumentationService.listenerUpdate.subscribe(payload => {
  //     this.bindVitalsDataToChart();
  //   });
  //   this.refreshVitalsGraph();
  // }

  bindVitalsDataToChart() {
    this.lineChartData = [
      //{ data: [], label: 'Pulse Rate' },
      { data: [], label: 'Systolic' },
      { data: [], label: 'Diastolic' },
      { data: [], label: 'Temperature' },
      { data: [], label: 'Height' },
      { data: [], label: 'Weight' },
      { data: [], label: 'BMI' }
    ];
    this._DocumentationService.find({ query: { 'personId._id': this.patient.personId } }).subscribe((payload: any) => {
      if (payload.data.length !== 0) {
        console.log(payload.data)
        payload.data[0].documentations.forEach(documentItem => {
          if (documentItem.document.documentType !== undefined && documentItem.document.documentType.title === 'Vitals') {
            this.vitalsObjArray = documentItem.document.body.vitals;
          }
        });
        this.vitalsObjArray.forEach(item => {
          //this.lineChartData[0].data.push(item.pulseRate.pulseRateValue);
          this.lineChartData[0].data.push(item.bloodPressure.systolic);
          this.lineChartData[1].data.push(item.bloodPressure.diastolic);
          this.lineChartData[2].data.push(item.temperature);
          this.lineChartData[3].data.push(item.bodyMass.height);
          this.lineChartData[4].data.push(item.bodyMass.weight);
          this.lineChartData[5].data.push(item.bodyMass.bmi);
          const d = new Date(item.updatedAt);
          let dt = this.dateFormater(d);
          this.lineChartLabels.push(dt);
        });
        this.refreshVitalsGraph();
      }
    })
  }

  dateFormater(d) {
    var dt = [d.getDate(), 
    d.getMonth()+1].join('/')+' '+
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dt;
  }

  refreshVitalsGraph() {
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = this.lineChartData[i].data[j];
        console.log(this.lineChartData[i].data[j]);
      }
    }
    this.lineChartData = _lineChartData;
    
  }

  getForms() {
    this.formsService.findAll().then(payload => {
      this.json = payload.data[0].body;
    });
  }
  getCurrentUser() {
    if (this.patient !== null) {
      const patient$ = Observable.fromPromise(this.patientService.get(this.patient._id, {}));
      const user$ = Observable.fromPromise(this.userService.find({ query: { personId: this.patient.personId } }));
      Observable.forkJoin([patient$, user$]).subscribe((results: any) => {
        this.patient = results[0];
        console.log(this.patient.personDetails.nextOfKin);
        this.selectedUser = results[1];

      })
    }
  }
  navEpDetail(val: Patient) {
    this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', val.personId]);
  }
  getSelectedState() {
    this.selectedNationality.states.forEach((item, i) => {
      if (item._id === this.patient.personDetails.stateOfOriginId) {
        this.selectedState = item;
        this.getSelectedLGA();
      }
    });
  }

  getSelectedLGA() {
    this.selectedState.lgs.forEach((item, i) => {
      if (item._id === this.patient.personDetails.lgaOfOriginId) {
        this.selectedLGA = item;
      }
    });
  }
  getPatientDetail(val: any) {
  }
  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }
  addProblem_show(e) {
    this.addProblem_view = true;
  }
  addAllergy_show(e) {
    this.addAllergy_view = true;
  }
  addHistory_show(e) {
    this.addHistory_view = true;
  }
  addVitals_show(e) {
    this.addVitals_view = true;
  }
  close_onClick(message: boolean): void {
    this.changeUserImg = false;
    this.addVitalsPop = false;
    this.addTagsPop = false;
    this.checkoutPatient = false;
    this.addProblem_view = false;
    this.addAllergy_view = false;
    this.addHistory_view = false;
    this.addVitals_view = false;
  }
  show_changeUserImg() {
    this.changeUserImg = true;
  }
  innerMenuHide(e) {
    if (
      e.srcElement.className === 'inner-menu1-wrap' ||
      e.srcElement.localName === 'i' ||
      e.srcElement.id === 'innerMenu-ul'
    ) { } else {
      this.contentSecMenuShow = false;
    }
  }

  logoutConfirm_show() {
    this.modal_on = false;
    this.logoutConfirm_on = true;
    this.contentSecMenuShow = false;
  }
  generateUserShow() {
    this.router.navigate(['/dashboard/patient-manager/generate-user', this.patient._id]);
    this.contentSecMenuShow = false;
  }
  toggleActivate() {
    this.patient.isActive = !this.patient.isActive;

    this.patientService.update(this.patient).then(payload => {
      this.patient = payload;
    },
      error => {
        console.log(error);
      });
    this.contentSecMenuShow = false;
  }
  empDetailShow(apmisId) {
    this.empDetailPg = true;
    this.contentSecMenuShow = false;
  }
  closeActivate(e) {
    if (e.srcElement.id !== 'contentSecMenuToggle') {
      this.contentSecMenuShow = false;
    }
  }
  menuSummary_click() {
    this.menuSummary = true;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuPharmacy_click() {
    this.menuSummary = false;
    this.menuPharmacy = true;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuBilling_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = true;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuTreatmentPlan_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = true;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuImaging_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = true;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuLab_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = true;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuForms_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = true;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuDocs_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = true;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuImages_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = true;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuLists_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = true;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuTimeline_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = true;
    this.menuPrescriptions = false;
    this.menuFinance = false;
  }
  menuPrescriptions_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = true;
    this.menuFinance = false;
  }
  menuFinance_click() {
    this.menuSummary = false;
    this.menuPharmacy = false;
    this.menuBilling = false;
    this.menuTreatmentPlan = false;
    this.menuImaging = false;
    this.menuLab = false;
    this.menuForms = false;
    this.menuDocs = false;
    this.menuImages = false;
    this.menuLists = false;
    this.menuTimeline = false;
    this.menuPrescriptions = false;
    this.menuFinance = true;
  }

  subsect_biodata_click() {
    this.subsect_biodata = true;
    this.subsect_contacts = false;
  }
  subsect_contacts_click() {
    this.subsect_biodata = false;
    this.subsect_contacts = true;
  }
  subsect_vitals_click() {
    this.subsect_vitals = true;
  }
  subsect_tags_click() {
    this.subsect_tags = true;
  }

  addVitalsPop_show() {
    this.addVitalsPop = true;
  }
  checkoutPatient_show() {
    this.checkoutPatient = true;
  }
  addTagsPop_show() {
    this.addTagsPop = true;
  }

  ngOnDestroy() {
    if (this.clinicInteraction.locationName !== undefined && this.clinicInteraction.locationName.length > 1) {
      if (this.selectedAppointment.clinicInteractions === undefined) {
        this.selectedAppointment.clinicInteractions = [];
      }
      this.clinicInteraction.endAt = new Date();
      this.clinicInteraction.title = 'Doctor\'s Encounter';
      this.selectedAppointment.clinicInteractions.push(this.clinicInteraction);
      this.appointmentService.update(this.selectedAppointment).then(payload => {

      });
    }
  }




  // public randomize():void {
  //   let _lineChartData:Array<any> = new Array(this.lineChartData.length);
  //   for (let i = 0; i < this.lineChartData.length; i++) {
  //     _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
  //     for (let j = 0; j < this.lineChartData[i].data.length; j++) {
  //       _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
  //     }
  //   }
  //   this.lineChartData = _lineChartData;
  // }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
