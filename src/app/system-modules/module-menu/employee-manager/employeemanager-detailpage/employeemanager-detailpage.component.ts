import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService
} from '../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country } from '../../../../models/index';
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

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() employee: Employee;

  editDepartment = false;
  biodatas = false;
  contacts = false;

  contentSecMenuShow = false;
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
  employees: Employee[] = [];
  homeAddress: string = '';
  selectedUser: User = <User>{};
  loadIndicatorVisible: boolean = false;

  createWorkspace: boolean = false;
  assignUnitPop: boolean = false;

  employeeSubscription: Subscription;
  constructor(private countryService: CountriesService,
    private employeeService: EmployeeService,
    private facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private router: Router, private route: ActivatedRoute,
    private toastr: ToastsManager,
    private locker: CoolLocalStorage) {
    this.employeeService.listner.subscribe(payload => {
      this.getEmployees();
    });
    this.personService.updateListener.subscribe(payload => {
      // this.loadRoute();
      console.log(payload);
      this.getEmployee(this.employee);
      console.log(this.employee);
    });

    this.employeeSubscription = this.employeeService.employeeAnnounced$.subscribe(employee => {
      this.getEmployee(employee);
    });

  }

  ngOnInit() {
    this.selectedFacility = this.locker.get('selectedFacility');
    // this.getEmployees();
    this.searchControl.valueChanges.subscribe(value => {
    });
    this.loadRoute();
  }
  getEmployee(employee) {
    this.loadIndicatorVisible = true;
    let employee$ = this.employeeService.get(employee._id, {});
    let user$ = this.userService.find({ query: { personId: employee.personId } });
    Observable.forkJoin([Observable.fromPromise(employee$), Observable.fromPromise(user$)]).subscribe(results => {
      this.employee = <Employee>{};
      this.selectedPerson = <Person>{};
      this.loadIndicatorVisible = false;
      this.employee = <any>results[0];
      this.selectedPerson = this.employee.employeeDetails;
      this.getCurrentUser(results[1]);
    });
    // this.employeeService.get(employee._id, {}).subscribe(payload => {
    //   console.log(payload);
    //   this.employee = payload;
    //   this.selectedPerson = this.employee.employeeDetails;
    //   this.getCurrentUser();
    // });
  }
  getCurrentUser(payload) {
    // this.userService.reload();
    if (payload.data.length > 0) {
      this.selectedUser = payload.data[0];
    } else {
      this.selectedUser = <User>{};
    }
    // this.userService.find({ query: { personId: this.employee.personId } }).then(payload => {
    //   console.log(payload);
    //   if (payload.data.length > 0) {
    //     this.selectedUser = payload.data[0];
    //   } else {
    //     this.selectedUser = <User>{};
    //   }
    // });
  }

  generateWorkSpace() {
    this.createWorkspace = !this.createWorkspace;
  }
  generateUnit() {
    this.assignUnitPop = !this.assignUnitPop;
  }
  loadRoute() {
    // this.route.params.subscribe(payload => {
    //   console.log(payload);
    //   if (payload.id !== undefined) {
    //     // this.employeeService.announceEmployee()
    //   }
    // })
    // this.route.params.subscribe((params: any) => {
    //   this.employeeService.find({ query: { personId: params.id, facilityId: this.selectedFacility._id } }).then(payload => {
    //     if (payload.data.length > 0) {
    //       this.employee = payload.data[0];
    //       this.selectedPerson = this.employee.employeeDetails;
    //       this.getCurrentUser();
    //       this.employee.employeeFacilityDetails.departments.forEach((item, i) => {
    //         if (item._id === this.employee.departmentId) {
    //           this.selectedDepartment = item;
    //         }
    //       });
    //       this.selectedNationality = this.employee.employeeDetails.nationality;
    //       this.getSelectedState();
    //       this.countryService.get(this.employee.employeeDetails.homeAddress.country, {}).then((countryPayload: Country) => {
    //         let countryName = countryPayload.name;
    //         let stateName = '';
    //         let cityName = '';
    //         let inEmployee = this.employee;

    //         countryPayload.states.forEach((item, i) => {
    //           if (item._id === inEmployee.employeeDetails.homeAddress.state) {
    //             stateName = item.name;
    //             let cities: [any] = item.cities;
    //             cities.forEach((cityItem, j) => {
    //               if (cityItem._id === inEmployee.employeeDetails.homeAddress.city) {
    //                 cityName = cityItem.name;
    //                 this.homeAddress = inEmployee.employeeDetails.homeAddress.street + ', ' + cityName + ', '
    //                   + stateName + ', ' + countryName;
    //               }
    //             });
    //           }
    //         });

    //       });
    //     }
    //   });
    // });
  }
  navEpDetail(val: Employee) {
    this.router.navigate(['/modules/facility-manager/employee-manager/employee-manager-detail', val.personId]);
  }
  getEmployees() {
    this.employeeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.employees = payload.data;
    });
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
    this.router.navigate(['/modules/facility-manager/employee-manager/generate-user', this.employee.employeeDetails._id]);
    this.contentSecMenuShow = false;
  }
  editUserShow() {
    this.router.navigate(['/modules/facility-manager/employee-manager/edit-user',
      this.selectedUser._id, this.employee.employeeDetails._id]);
    this.contentSecMenuShow = false;
  }
  toggleActivate() {
    this.employee.isActive = !this.employee.isActive;

    this.employeeService.update(this.employee).then(payload => {
      this.employee = payload;
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
  ngOnDestroy() {
    this.employeeSubscription.unsubscribe();
  }
  toggleDepartmentShow() {
    this.editDepartment = !this.editDepartment;
  }
  bioDataShow() {
    this.biodatas = !this.biodatas;
  }
  contactShow(){
    this.contacts = !this.contacts;
  }
}