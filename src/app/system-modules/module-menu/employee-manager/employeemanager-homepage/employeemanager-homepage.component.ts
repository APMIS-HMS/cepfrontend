import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, EmployeeService, PersonService } from '../../../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-employeemanager-homepage',
  templateUrl: './employeemanager-homepage.component.html',
  styleUrls: ['./employeemanager-homepage.component.scss']
})
export class EmployeemanagerHomepageComponent implements OnInit, OnDestroy {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @Output() empDetail: EventEmitter<string> = new EventEmitter<string>();

  facility: Facility = <Facility>{};
  employees: Employee[] = [];
  searchControl = new FormControl();

  pageSize = 1;
  limit = 100;
  total = 0;
  loadIndicatorVisible = false;
  constructor(private employeeService: EmployeeService,
    public facilityService: FacilitiesService,
    private personService: PersonService, private locker: CoolLocalStorage,
    private toast: ToastsManager,
    private router: Router, private route: ActivatedRoute) {
    this.employeeService.listner.subscribe(payload => {
      this.getEmployees(this.limit, true);
    });
    this.employeeService.createListener.subscribe(payload => {
      // this.employees.push(payload);
      // console.log(this.employees.length);
      this.getEmployees(this.limit, true);
      this.toast.success(payload.employeeDetails.personFullName + ' created successfully!', 'Success!');
    });

    const away = this.searchControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()

      .switchMap((term: Employee[]) => this.employeeService.searchEmployee(this.facility._id, this.searchControl.value, false));


    away.subscribe((payload: any) => {
      this.employees = payload.body;
    });

  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      data['employees'].subscribe((payload) => {
        this.total = payload.total;
        this.employees = payload.data;
        console.log(this.employees);
      });
    });
    this.pageInView.emit('Employee Manager');
    this.facility =  <Facility> this.locker.getObject('selectedFacility');
    // this.getEmployees(this.limit);
  }
  searchEmployees(searchText: string) {
    this.searchControl.setValue(searchText);
  }
  filterByDepartment(department: string) {
    this.getByDepartment(department);
  }
  navEpDetail(val) {
    this.router.navigate(['/modules/facility-manager/employee-manager/employee-manager-detail']).then(result => {
      this.employeeService.announceEmployee(val);
    });
  }
  getByDepartment(departmentId: string) {
    this.loadIndicatorVisible = true;
    this.employeeService.find({ query: { facilityId: this.facility._id, departmentId: departmentId, showbasicinfo: true, $limit: 100 } })
      .then(payload => {
        this.total = payload.total;
        this.employees = payload.data;
        this.loadIndicatorVisible = false;
      }, error => {
        this.loadIndicatorVisible = false;
      });
  }
  getByUnit(departmentId: string, unitId: string) {
    this.loadIndicatorVisible = true;
    this.employeeService.find({
      query: {
        facilityId: this.facility._id, departmentId: departmentId, showbasicinfo: true,
        $limit: 100, 'units': unitId
      }
    }).then(payload => {
      this.total = payload.total;
      this.employees = payload.data;
      this.loadIndicatorVisible = false;
    }, error => {
      this.loadIndicatorVisible = false;
    });
  }
  getEmployees(limit, isUp) {
    let skip = this.employees.length;
    if (isUp) {
      limit = this.limit;
      skip = 0;
    }
    this.employeeService.find({ query: { facilityId: this.facility._id, $limit: 100, showbasicinfo: true } }).then(payload => {
      this.total = payload.total;
      this.employees = payload.data;
      console.log(this.employees);
    }, error => {
      this.loadIndicatorVisible = false;
    });
  }
  contactEmployees(employeeData: Employee[]) {
    const newEmployees: Employee[] = [];
    this.employees.forEach((employee, i) => {
      let found = false;
      let newEmp: Employee = <Employee>{};
      employeeData.forEach((empData, j) => {
        newEmp = empData;
        if (employee._id === empData._id) {
          employee = empData;
          found = true;
        }
      });
      if (!found) {
        newEmployees.push(newEmp);
      }
    });
    this.employees.concat(newEmployees);
  }
  onScroll() {
    this.pageSize = this.pageSize + 1;
    const limit = this.limit * this.pageSize;
    if (this.employees.length !== this.total) {
      this.getEmployees(limit, false);
    }

  }
  onScrollUp() {
    if (this.pageSize > 1) {
      this.pageSize = this.pageSize - 1;
    }
    const limit = this.limit * this.pageSize;

    if (this.employees.length !== this.total) {
      this.getEmployees(limit, true);
    }
  }
  ngOnDestroy() {

  }
}
