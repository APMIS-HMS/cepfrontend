import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CountriesService, EmployeeService, FormsService,
  FacilitiesService, UserService, PersonService,
  PatientService, AppointmentService, DocumentationService
} from '../../../../../services/facility-manager/setup/index';
import {
  Facility, User, Patient, Employee, MinorLocation, Appointment, Country, ClinicInteraction,
  Documentation
} from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-summary',
  templateUrl: './patient-summary.component.html',
  styleUrls: ['./patient-summary.component.scss']
})
export class PatientSummaryComponent implements OnInit, OnDestroy {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient: Patient;
  // @Input() vitalDocuments: any;


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
  homeAddress = '';
  selectedUser: User = <User>{};
  loginEmployee: Employee = <Employee>{};
  clinicInteraction: ClinicInteraction = <ClinicInteraction>{};
  previousUrl = '/';
  minorLocationList: MinorLocation[] = [];
  selectedAppointment: Appointment = <Appointment>{};
  json: any = {};


  constructor(private countryService: CountriesService,
    private patientService: PatientService,
    private userService: UserService,
    public facilityService: FacilitiesService,
    private appointmentService: AppointmentService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private formsService: FormsService,
    private router: Router, private route: ActivatedRoute,
    private locker: CoolLocalStorage) {

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
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.route.data.subscribe(data => {
      data['patient'].subscribe(payload => {
        this.patient = payload;
        // this._documentationService.find({ query: { patientId: this.patient._id } }).then(payloadPatient => {
        // });
        this.getCurrentUser();
      });
      // this.documentations = this.vitalDocuments;
      data['loginEmployee'].subscribe(payload => {
        this.loginEmployee = payload.loginEmployee;
        this.minorLocationList = payload.clinicLocations;

        if (payload.loginEmployee !== undefined) {

          this.route.params.subscribe(payloadk => {
            if (payloadk['checkInId'] !== undefined) {
              const isOnList = this.loginEmployee.consultingRoomCheckIn.filter(x => x._id);
              if (isOnList.length > 0) {
                const isOnObj = isOnList[0];
                isOnObj.isOn = true;
                this.employeeService.update(this.loginEmployee).then(payloadu => {
                  this.loginEmployee = payloadu;
                  if (data['appointment'] !== null) {
                    data['appointment'].subscribe(payloada => {
                      this.selectedAppointment = payloada;
                      if (this.selectedAppointment !== undefined) {
                        const isOnList = payload.loginEmployee.consultingRoomCheckIn.filter(x => x.isOn === true);
                        if (isOnList.length > 0) {
                          const isOn = isOnList[0];
                          const minorLocationList = payload.clinicLocations.filter(x => x._id === isOn.minorLocationId);
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
    this.router.navigate(['/modules/patient-manager/patient-manager-detail', val.personId]);
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
    this.router.navigate(['/modules/patient-manager/generate-user', this.patient._id]);
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

}
