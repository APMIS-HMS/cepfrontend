import { Component, OnInit, EventEmitter, Output, OnChanges, OnDestroy, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, EmployeeService, PersonService } from '../../../../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
@Component({
  selector: 'app-empmanager-homepage',
  templateUrl: './empmanager-homepage.component.html',
  styleUrls: ['./empmanager-homepage.component.scss']
})
export class EmpmanagerHomepageComponent implements OnInit, OnDestroy, OnChanges {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @Output() empDetail: EventEmitter<string> = new EventEmitter<string>();
  @Input() resetData: Boolean;
  @Output() resetDataNew: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  facility: Facility = <Facility>{};
  employees: Employee[] = [];
  searchControl = new FormControl();

  pageSize = 1;
  index:any = 0;
  inde:any = [];
  limit = 2;
  total = 0;
  showLoadMore: Boolean = true;
  loadIndicatorVisible = false;
  constructor(private employeeService: EmployeeService,
    private facilityService: FacilitiesService,
    private personService: PersonService, private locker: CoolLocalStorage,
    private toast: ToastsManager,
    private router: Router, private route: ActivatedRoute, private systemService:SystemModuleService) {
    this.employeeService.listner.subscribe(payload => {
      this.getEmployees(this.limit, true);
    });
    this.employeeService.createListener.subscribe(payload => {
      this.getEmployees(this.limit, true);
      this.toast.success(payload.employeeDetails.personFullName + ' created successfully!', 'Success!');
    });

    const away = this.searchControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((term: Employee[]) => this.employeeService.searchEmployee(this.facility._id, this.searchControl.value, true));


    away.subscribe((payload: any) => {
      this.employees = payload.body;
    });

  }

  ngOnChanges(){
    if(this.resetData === true){
      this.index = 0;
      this.getEmployees();
      this.showLoadMore = true;
    }
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data);
      data['employees'].subscribe((payload) => {
        if (payload !== null) {
          this.total = payload.total;
          this.employees = payload.data;
          this.inde[0] = payload.index;
          if(this.total <= this.employees.length){
            this.showLoadMore = false;
          }
        }

      });
      this.index = this.inde[0];
    });
    this.pageInView.emit('Employee Manager');
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    // this.getEmployees(this.limit);
  }
  searchEmployees(searchText: string) {
    this.searchControl.setValue(searchText);
  }
  filterByDepartment(department: string) {
    this.getByDepartment(department);
  }
  navEpDetail(val) {
    this.router.navigate(['/dashboard/facility/employees', val._id]).then(result => {
      // this.employeeService.announceEmployee(val);
      this.locker.setObject('selectedEmployee', val);
    });
  }
  getByDepartment(departmentId: string) {
    this.loadIndicatorVisible = true;
    this.systemService.on();
    this.employeeService.find({ query: { facilityId: this.facility._id, departmentId: departmentId, showbasicinfo: true, $limit: 100 } })
      .then(payload => {
        this.total = payload.total;
        this.employees = payload.data;
        this.loadIndicatorVisible = false;
      }, error => {
        this.loadIndicatorVisible = false;
        this.systemService.off();
      }).catch(err =>{
        this.systemService.off();
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
  getEmployees(limit?, isUp?) {
    console.log('mmmsd')
    //let skip = this.employees.length;
    this.systemService.on();
    this.loadIndicatorVisible = true;
    this.employeeService.find({ 
      query: { 
        facilityId: this.facility._id, 
        $limit: this.limit, 
        $skip: this.index * this.limit,
      } 
    }).then(payload => {
      console.log(payload);
      this.total = payload.total;
      if(this.resetData !== true)
      {
        this.employees.push(...payload.data);
      }else{
        this.resetData = false;
        this.resetDataNew.emit(this.resetData);
        this.employees = payload.data;
      }
      if(this.total <= this.employees.length){
        this.showLoadMore = false;
      }
      this.loadIndicatorVisible = false;
      this.systemService.off();
    }, error => {
      this.loadIndicatorVisible = false;
      this.systemService.off();
    });
    this.index++;
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
  loadMore(){
    this.getEmployees();
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
