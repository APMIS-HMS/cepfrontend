import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { FacilitiesService, EmployeeService } from '../../../../services/facility-manager/setup/index';
import { Facility, Employee, Department } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-assign-unit',
  templateUrl: './assign-unit.component.html',
  styleUrls: ['./assign-unit.component.scss']
})
export class AssignUnitComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  disableDepartment = false;
  checkBoxValue: boolean;
  searchControl: FormControl = new FormControl();

  public frmNewEmp1: FormGroup;
  checkAll: FormControl = new FormControl();
  selectedFacility: Facility = <Facility>{};
  selectedDepartment: Department = <Department>{};
  selectedUnit: any = undefined;

  departments: Department[] = [];
  units: any[] = [];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedEmployee: any = <any>{};

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private employeeService: EmployeeService,
    public facilityService: FacilitiesService) { }

  ngOnInit() {
    this.frmNewEmp1 = this.formBuilder.group({
      dept: ['', []],
      unit: ['', []]
    });
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.departments = this.selectedFacility.departments;
    if (this.selectedEmployee !== undefined) {
      this.disableDepartment = true;
      const deptList = this.departments.filter(x => x._id === this.selectedEmployee.departmentId);
      if (deptList.length > 0) {
        this.frmNewEmp1.controls['dept'].setValue(deptList[0]);
      }
      this.units = this.frmNewEmp1.controls['dept'].value.units;
      this.selectedEmployee.isChecked = false;
      this.employees.push(this.selectedEmployee);
      this.filteredEmployees = this.employees;
    } else {
      this.disableDepartment = false;
    }

    this.frmNewEmp1.controls['unit'].valueChanges.subscribe((value: any) => {
      this.selectedUnit = value;
      this.filterDownEmployees(this.selectedUnit);
    });
    this.frmNewEmp1.controls['dept'].valueChanges.subscribe((value: Department) => {
      this.selectedDepartment = value;
      this.units = value.units;
      if (this.selectedEmployee === undefined) {
        this.getEmployees(value);
      }

    });
    this.checkAll.valueChanges.subscribe(value => {
      this.checkAllEmployees(value);
    });
  }
  filterDownEmployees(unit: any) {
    const filteredEmployees = [];
    this.employees.forEach((emp, i) => {
      let hasUnit = false;
      if (emp.units !== undefined) {
        emp.units.forEach((itemu, u) => {
          if (unit !== null && itemu === unit._id) {
            hasUnit = true;
          }
        });
      }
      if (!hasUnit) {
        filteredEmployees.push(emp);
      }
    });
    this.filteredEmployees = filteredEmployees;
  }
  checkAllEmployees(value: boolean) {
    this.employees.forEach((itemi, i) => {
      itemi.isChecked = value;
    });
    this.filteredEmployees = this.employees;
  }
  getEmployees(dept: Department) {
    this.employeeService.find({
      query: {
        facilityId: this.selectedFacility._id,
        departmentId: dept._id,
        showsliminfo: true
      }
    }).then(payload => {
      this.employees = payload.data;
      this.employees.forEach((itemi, i) => {
        itemi.isChecked = false;
      });
      this.filteredEmployees = this.employees;
      // this.filterDownEmployees(this.selectedUnit);
    });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  onValueChanged(e, employee: Employee) {
    employee.isChecked = e.value;
  }
  assignUnit(valid, value) {
    console.log(valid);
    const checkedEmployees = this.filteredEmployees.filter(emp => emp.isChecked === true);

    checkedEmployees.forEach((emp, i) => {
      console.log(i);
      if (emp.units === undefined) {
        emp.units = [];
      }
      emp.units.push(this.selectedUnit._id);
    });
    checkedEmployees.forEach((itemi, i) => {
      console.log(i);
      this.employeeService.update(itemi).then(payload => {
        if (this.selectedEmployee === undefined) {
          this.getEmployees(this.selectedDepartment);
        } else {
          this.employees = [];
          this.filteredEmployees = [];
          this.selectedEmployee.isChecked = false;
          this.employees.push(this.selectedEmployee);
          this.frmNewEmp1.controls['unit'].reset();
        }

      }, error => {
      });
    }, error => {
      console.log(error);
    });
    // this.employeeService.updateMany(checkedEmployees).then(payload => {
    // }, error => {
    // });
  }
}
