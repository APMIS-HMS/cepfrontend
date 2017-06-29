import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CountriesService, EmployeeService, FormsService,
  FacilitiesService, UserService, PersonService,
  PatientService, AppointmentService, DocumentationService
}
  from '../../../../services/facility-manager/setup/index';
import {
  Facility, User, Patient, Employee, MinorLocation, Appointment, Country, ClinicInteraction,
  Documentation
} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patientmanager-detailpage',
  templateUrl: './patientmanager-detailpage.component.html',
  styleUrls: ['./patientmanager-detailpage.component.scss']
})
export class PatientmanagerDetailpageComponent implements OnInit, OnDestroy {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() employeeDetails: any;
  @Input() patient: Patient;


  subsect_biodata = true;
  subsect_contacts = false;
  subsect_vitals = true;
  subsect_tags = true;
  addVitalsPop = false;
  addTagsPop = false;
  checkoutPatient = false;

  menuSummary = true;
  menuPharmacy = false;
  menuBilling = false;
  menuTreatmentPlan = false;
  menuPrescription = false;
  menuMedicationHistory: boolean = false;
  menuImaging = false;
  menuLab = false;
  menuForms = false;
  menuDocs = false;
  menuImages = false;
  menuLists = false;
  menuTimeline = false;
  menuFinance = false;
  menuPrescriptions = false;

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
  tempChart: any[] = [];
  bpChart: any[] = [];
  wHChart: any[] = [];
  rRChart: any[] = [];
  pRChart: any[] = [];
  timeVal: Date;
  routeId: any;

  oilCosts: any[] = [{
    month: 1,
    2010: 77,
    2011: 93,
    2012: 107
  }, {
    month: 2,
    2010: 72,
    2011: 101,
    2012: 112
  }, {
    month: 3,
    2010: 79,
    2011: 115,
    2012: 123
  }, {
    month: 4,
    2010: 82,
    2011: 116,
    2012: 123
  }, {
    month: 5,
    2010: 86,
    2011: 124,
    2012: 116
  }, {
    month: 6,
    2010: 73,
    2011: 115,
    2012: 102
  }, {
    month: 7,
    2010: 73,
    2011: 110,
    2012: 94
  }, {
    month: 8,
    2010: 77,
    2011: 117,
    2012: 105
  }, {
    month: 9,
    2010: 76,
    2011: 113,
    2012: 113
  }, {
    month: 10,
    2010: 81,
    2011: 103,
    2012: 111
  }, {
    month: 11,
    2010: 83,
    2011: 110,
    2012: 107
  }, {
    month: 12,
    2010: 89,
    2011: 109,
    2012: 110
  }];


  goldCosts: any[] = [{
    month: 1,
    2010: 1115,
    2011: 1358,
    2012: 1661
  }, {
    month: 2,
    2010: 1099,
    2011: 1375,
    2012: 1742
  }, {
    month: 3,
    2010: 1114,
    2011: 1423,
    2012: 1677
  }, {
    month: 4,
    2010: 1150,
    2011: 1486,
    2012: 1650
  }, {
    month: 5,
    2010: 1205,
    2011: 1511,
    2012: 1589
  }, {
    month: 6,
    2010: 1235,
    2011: 1529,
    2012: 1602
  }, {
    month: 7,
    2010: 1193,
    2011: 1573,
    2012: 1593
  }, {
    month: 8,
    2010: 1220,
    2011: 1765,
    2012: 1634
  }, {
    month: 9,
    2010: 1272,
    2011: 1771,
    2012: 1750
  }, {
    month: 10,
    2010: 1345,
    2011: 1672,
    2012: 1745
  }, {
    month: 11,
    2010: 1370,
    2011: 1741,
    2012: 1720
  }, {
    month: 12,
    2010: 1392,
    2011: 1643,
    2012: 1684
  }];


  silverCosts: any[] = [{
    month: 1,
    2010: 17,
    2011: 30,
    2012: 27
  }, {
    month: 2,
    2010: 28,
    2011: 28,
    2012: 33
  }, {
    month: 3,
    2010: 34,
    2011: 34,
    2012: 35
  }, {
    month: 4,
    2010: 37,
    2011: 37,
    2012: 32
  }, {
    month: 5,
    2010: 47,
    2011: 47,
    2012: 30
  }, {
    month: 6,
    2010: 37,
    2011: 37,
    2012: 28
  }, {
    month: 7,
    2010: 34,
    2011: 34,
    2012: 27
  }, {
    month: 8,
    2010: 40,
    2011: 40,
    2012: 27
  }, {
    month: 9,
    2010: 41,
    2011: 41,
    2012: 31
  }, {
    month: 10,
    2010: 30,
    2011: 30,
    2012: 34
  }, {
    month: 11,
    2010: 34,
    2011: 34,
    2012: 31
  }, {
    month: 12,
    2010: 32,
    2011: 32,
    2012: 33
  }];

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
    private _documentationService: DocumentationService) {

    this.router.events
      .filter(e => e.constructor.name === 'RoutesRecognized')
      .pairwise()
      .subscribe((e: any[]) => {
        this.previousUrl = e[0].urlAfterRedirects;
      });

    this.personService.updateListener.subscribe(payload => {
      this.patient.personDetails = payload;
    });
  }

  ngOnInit() {
    this.getForms();
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    // this.route.params.subscribe(params => {
    //   this.routeId = +params['id'];
    //   console.log(params['id']);
    //    //this.routeId = +params['id']; // (+) converts string 'id' to a number
    // });
    this.route.data.subscribe(data => {
      console.log(data);
      data['patient'].subscribe(payload => {
        this.patient = payload;
        this._documentationService.find({ query: { patientId: this.patient._id } }).then(payloadPatient => {
          this.documentations = payloadPatient.data;
          this.setGraph();
        }, error => {
          console.log(error);
        });
        this.getCurrentUser();
      });

      data['loginEmployee'].subscribe(payload => {
        this.loginEmployee = payload.loginEmployee;
        this.minorLocationList = payload.clinicLocations;
        this.employeeDetails = payload.loginEmployee;

        if (payload.loginEmployee !== undefined) {

          this.route.params.subscribe(payloadk => {
            if (payloadk['checkInId'] !== undefined) {
              let isOnList = this.loginEmployee.consultingRoomCheckIn.filter(x => x._id);
              if (isOnList.length > 0) {
                let isOnObj = isOnList[0];
                isOnObj.isOn = true;
                this.employeeService.update(this.loginEmployee).then(payloadu => {
                  this.loginEmployee = payloadu;
                  if (data['appointment'] !== null) {
                    data['appointment'].subscribe(payloada => {
                      this.selectedAppointment = payloada;
                      if (this.selectedAppointment !== undefined) {
                        let isOnList = payload.loginEmployee.consultingRoomCheckIn.filter(x => x.isOn === true);
                        if (isOnList.length > 0) {
                          let isOn = isOnList[0];
                          let minorLocationList = payload.clinicLocations.filter(x => x._id === isOn.minorLocationId);
                          if (minorLocationList.length > 0) {
                            this.clinicInteraction.locationName = minorLocationList[0].name;
                            this.clinicInteraction.startAt = new Date();
                            this.clinicInteraction.employee = this.loginEmployee.employeeDetails;
                          }
                        }
                      }
                    }, error => {
                      this.router.navigateByUrl(this.previousUrl);
                    });
                  }
                });
              }

            }

          });


        }
      });
    });
  }

  setGraph() {
    for (let i = 0; i < this.documentations.length; i++) {
      this.timeVal = this.documentations[i].createdAt;
      let temp = {
        temperature: i,
        0: this.documentations[i].document.temperature
      };
      this.tempChart.push(temp);
      let bp = {
        DiastolicSystolic: i,
        0: this.documentations[i].document.bloodPressure.diastolic,
        1: this.documentations[i].document.bloodPressure.systolic
      };
      this.bpChart.push(bp);
      let wH = {
        WH: i,
        0: this.documentations[i].document.heightWeight.bmi,
        1: this.documentations[i].document.heightWeight.weight,
        2: this.documentations[i].document.heightWeight.height,
      };
      this.wHChart.push(wH);
      let rR = {
        RespiratoryRate: i,
        0: this.documentations[i].document.respiratoryRate
      };
      this.rRChart.push(rR);
      
      let pR = {
        PulseRate: i,
        0: this.documentations[i].document.pulseRate.pulseRateValue
      };
      this.pRChart.push(pR);
    }
  }

  getForms() {
    this.formsService.findAll().then(payload => {
      this.json = payload.data[0].body;
    });
  }
  getCurrentUser() {
    this.userService.find({ query: { personId: this.patient.personId } }).then(payload => {
      if (payload.data.length > 0) {
        this.selectedUser = payload.data[0];
      } else {
        this.selectedUser = <User>{};
      }
    });
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
  close_onClick(message: boolean): void {
    this.changeUserImg = false;
    this.addVitalsPop = false;
    this.addTagsPop = false;
    this.checkoutPatient = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
  }
  menuMedicationHistory_click() {
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = true;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = true;
    this.menuFinance = false;
    this.menuMedicationHistory = false;
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
    this.menuPrescription = false;
    this.menuFinance = true;
    this.menuMedicationHistory = false;
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
      this.clinicInteraction.title = "Doctor's Encounter";
      this.selectedAppointment.clinicInteractions.push(this.clinicInteraction);
      this.appointmentService.update(this.selectedAppointment).then(payload => {

      });
    }
  }

}
