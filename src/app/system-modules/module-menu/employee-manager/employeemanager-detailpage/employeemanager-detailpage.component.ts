import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService, ProfessionService
} from '../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-employeemanager-detailpage',
  templateUrl: './employeemanager-detailpage.component.html',
  styleUrls: ['./employeemanager-detailpage.component.scss']
})
export class EmployeemanagerDetailpageComponent implements OnInit, OnDestroy {
  selectedValue: string;
  selectedProfessionValue:string;


  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() employee: Employee;

  editDepartment = false;
  editProfession = false;
  biodatas = false;
  contacts = false;
  nextofkin = false;

  externalContentArea = false;
  contentSecMenuShow = false;
  reportContentArea = false
  modal_on = false;
  changeUserImg = false;
  logoutConfirm_on = false;
  empDetailPg = true;
  selectedDepartment: any;
  selectedNationality: Country;
  selectedState: any;
  selectedLGA: any;
  selectedPerson: Person;
  selectedFacility: Facility = <Facility>{};
  searchControl = new FormControl();
  countryControl = new FormControl();
  stateControl = new FormControl();
  homeCountryControl = new FormControl();
  homeStateControl = new FormControl();
  employees: Employee[] = [];
  genders: Gender[] = [];
  relationships: Relationship[] = [];
  maritalStatuses: MaritalStatus[] = [];
  countries: Country[] = [];
  states: any[] = [];
  lgs: any[] = [];

  homeCountries: Country[] = [];
  homeStates: any[] = [];
  homeCities: any[] = [];
  homeAddress = '';
  selectedUser: User = <User>{};
  loadIndicatorVisible = false;

  createWorkspace = false;
  assignUnitPop = false;

  employeeSubscription: Subscription;
  departments: any[] = [];
  professions:any[] = [];
  isSaving = false;
  constructor(private countryService: CountriesService,
    private employeeService: EmployeeService,
    private facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private router: Router, private route: ActivatedRoute,
    private toastr: ToastsManager,
    private genderService: GenderService,
    private relationshipService: RelationshipService,
    private maritalStatusService: MaritalStatusService,
    private systemService:SystemModuleService,
    private professionService:ProfessionService,
    private locker: CoolLocalStorage) {
    this.employeeService.listner.subscribe(payload => {
      this.getEmployees();
    });
    this.personService.updateListener.subscribe(payload => {
      this.getEmployee(this.employee);
    });

    this.employeeSubscription = this.employeeService.employeeAnnounced$.subscribe(employee => {
      this.getEmployee(employee);
    });

  }

  ngOnInit() {
    this.prime();
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.departments = this.selectedFacility.departments;
    // this.getEmployees();
    this.countryControl.valueChanges.subscribe(value => {
      const countryFilter = this.countries.filter(x => x._id === value);
      if (countryFilter.length > 0) {
        this.states = countryFilter[0].states;
      }
    });
    this.stateControl.valueChanges.subscribe(value => {
      const stateFilter = this.states.filter(x => x._id === value);
      if (stateFilter.length > 0) {
        this.lgs = stateFilter[0].lgs;
      }
    });


    this.homeCountryControl.valueChanges.subscribe(value => {
      const countryFilter = this.homeCountries.filter(x => x._id === value);
      if (countryFilter.length > 0) {
        this.homeStates = countryFilter[0].states;
      }
    });
    this.homeStateControl.valueChanges.subscribe(value => {
      const stateFilter = this.homeStates.filter(x => x._id === value);
      if (stateFilter.length > 0) {
        this.homeCities = stateFilter[0].cities;
      }
    });

    this.loadRoute();

  }
  prime() {
    this.systemService.on();
    const gender$ = Observable.fromPromise(this.genderService.findAll());
    const relationship$ = Observable.fromPromise(this.relationshipService.findAll());
    const maritalStatus$ = Observable.fromPromise(this.maritalStatusService.findAll());
    const country$ = Observable.fromPromise(this.countryService.findAll());
    const profession$ = Observable.fromPromise(this.professionService.findAll());

    Observable.forkJoin([gender$, relationship$, maritalStatus$, country$, profession$]).subscribe((results: any) => {
      this.genders = results[0].data;
      this.relationships = results[1].data;
      this.maritalStatuses = results[2].data;
      this.countries = results[3].data;
      this.homeCountries = results[3].data;
      this.professions = results[4].data;
      this.systemService.off();
    },error =>{
      this.systemService.off();
    })
  }
  getEmployee(id) {
    this.systemService.on();
    const auth = <any>this.locker.getObject('auth');
    const employee$ = this.employeeService.get(id, {});
    const user$ = this.userService.find({ query: { personId: auth.data.personId } });
    Observable.forkJoin([Observable.fromPromise(employee$), Observable.fromPromise(user$)]).subscribe(results => {
      this.employee = <Employee>{};
      this.selectedPerson = <Person>{};
      this.loadIndicatorVisible = false;
      this.employee = <any>results[0];
      console.log(this.employee);
      this.selectedValue = this.employee.departmentId;
      this.selectedProfessionValue = this.employee.professionId;
      this.selectedPerson = this.employee.employeeDetails;
      this.getCurrentUser(results[1]);
      this.systemService.off();
    }, error =>{
      this.systemService.off();
    });
  }
  getCurrentUser(payload) {
    if (payload.data.length > 0) {
      this.selectedUser = payload.data[0];
    } else {
      this.selectedUser = <User>{};
    }
  }

  generateWorkSpace() {
    this.createWorkspace = !this.createWorkspace;
  }
  generateUnit() {
    this.assignUnitPop = !this.assignUnitPop;
  }
  loadRoute() {
    this.route.params.subscribe((params: any) => {
      this.getEmployee(params.id);
    })
  }
  navEpDetail(val: Employee) {
    this.router.navigate(['/dashboard/employee-manager/employee-manager-detail', val.personId]);
  }
  getEmployees() {
    this.employeeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.employees = payload.data;
    });
  }
  getRelationship(id) {
    const filterRel = this.relationships.filter(x => x._id === id);
    if (filterRel.length > 0) {
      return filterRel[0].name;
    }
    return '';
  }
  getSelectedState() {
    this.selectedNationality.states.forEach((item, i) => {
      if (item._id === this.employee.employeeDetails.stateOfOriginId) {
        this.selectedState = item;
        this.getSelectedLGA();
      }
    });
  }
  getSelectedLGA() {
    this.selectedState.lgs.forEach((item, i) => {
      if (item._id === this.employee.employeeDetails.lgaOfOriginId) {
        this.selectedLGA = item;
      }
    });
  }
  getEmployeeDetail(val: any) {
  }
  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }
  close_onClick(message: boolean): void {
    this.changeUserImg = false;
    this.assignUnitPop = false;
    this.createWorkspace = false;
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
    this.router.navigate(['/dashboard/employee-manager/generate-user', this.employee.employeeDetails._id]);
    this.contentSecMenuShow = false;
  }
  editUserShow() {
    this.router.navigate(['/dashboard/employee-manager/edit-user',
      this.selectedUser._id, this.employee.employeeDetails._id]);
    this.contentSecMenuShow = false;
  }
  toggleActivate() {
    this.employee.isActive = !this.employee.isActive;

    this.employeeService.update(this.employee).then(payload => {
      this.employee = payload;
    },
      error => {
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
  ngOnDestroy() {
    this.employeeSubscription.unsubscribe();
  }
  updateEmployee() {
    this.isSaving = true;
    this.employee.departmentId = this.selectedValue;
    this.employeeService.update(this.employee).then(value => {
      this.employee = value;
      this.isSaving = false;
      this.editDepartment = !this.editDepartment;
    }, error =>{
      this.isSaving = false;
    });
  }
  updateEmployeeProfession() {
    this.isSaving = true;
    this.employee.professionId = this.selectedProfessionValue;
    this.employeeService.update(this.employee).then(value => {
      this.employee = value;
      this.isSaving = false;
      this.editProfession = !this.editProfession;
    },error =>{
      this.isSaving = false;
    });
  }
  UpdatePerson() {
    const person = this.employee.employeeDetails;
    this.biodatas = !this.biodatas;
    this.personService.update(person).subscribe(payload => {
    });
  }
  UpdatePersonContact() {
    const person = this.employee.employeeDetails;
    this.contacts = !this.contacts;
    this.personService.update(person).subscribe(payload => {
    });
  }
  UpdatePersonNextOfKin() {
    const person = this.employee.employeeDetails;
    this.nextofkin = !this.nextofkin;
    this.personService.update(person).subscribe(payload => {
    });
  }
  toggleDepartmentShow() {
    this.editDepartment = !this.editDepartment;
  }
  toggleProfessionShow() {
    this.editProfession = !this.editProfession;
  }
  bioDataShow() {
    this.biodatas = !this.biodatas;
  }

  contactShow() {
    this.contacts = !this.contacts;
  }
  nextofkinShow() {
    this.nextofkin = !this.nextofkin;
  }
}
