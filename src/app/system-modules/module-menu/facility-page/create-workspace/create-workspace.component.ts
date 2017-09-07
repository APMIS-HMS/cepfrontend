import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, EmployeeService, WorkSpaceService } from '../../../../services/facility-manager/setup/index';
import { Facility, Employee, MinorLocation, Location, WorkSpace, Department } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocationService } from '../../../../services/module-manager/setup/location.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss']
})
export class CreateWorkspaceComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  checkBoxValue: boolean;
  searchControl: FormControl = new FormControl();
  checkAll: FormControl = new FormControl();

  public frmNewEmp1: FormGroup;
  loadIndicatorVisible = false;
  disableDepartment = false;
  selectedFacility: Facility = <Facility>{};
  selectedDepartment: Department = <Department>{};
  selectedMajorLocation: Location = <Location>{};
  selectedMinorLocation: MinorLocation = <MinorLocation>{};
  selectedUnit: any = <any>{};

  departments: Department[] = [];
  units: any[] = [];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  majorLocations: Location[] = [];
  minorLocations: MinorLocation[] = [];
  workSpaces: WorkSpace[] = [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedEmployee: any = <any>{};

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private workspaceService: WorkSpaceService,
    public facilityService: FacilitiesService) { }

  ngOnInit() {
    this.frmNewEmp1 = this.formBuilder.group({
      dept: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      majorLoc: ['', [Validators.required]],
      minorLoc: ['', [Validators.required]]
    });
    this.frmNewEmp1.controls['dept'].valueChanges.subscribe((value: Department) => {
      this.selectedDepartment = value;
      this.units = value.units;
      this.employees = [];
      this.filteredEmployees = [];
    });
    this.frmNewEmp1.controls['unit'].valueChanges.subscribe((value: any) => {
      this.selectedUnit = value;
      this.employees = [];
      this.filteredEmployees = [];
      this.getEmployees(this.selectedDepartment, this.selectedUnit);
    });
    this.frmNewEmp1.controls['majorLoc'].valueChanges.subscribe((value: Location) => {
      this.selectedMajorLocation = value;
      this.selectedMinorLocation = undefined;
      this.getMinorLocation(this.selectedMajorLocation);
      this.filteredEmployees = this.employees;
      // this.getWorkSpace();
    });
    this.frmNewEmp1.controls['minorLoc'].valueChanges.subscribe((value) => {
      console.log(value);
      this.selectedMinorLocation = value;
      this.getWorkSpace();
    });
    this.checkAll.valueChanges.subscribe(value => {
      this.checkAllEmployees(value);
    });
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.departments = this.selectedFacility.departments;
    this.getMajorLocations();



    if (this.selectedEmployee !== undefined && this.selectedEmployee._id !== undefined) {
      console.log(this.selectedEmployee);
      this.disableDepartment = true;
      const deptList = this.departments.filter(x => x._id === this.selectedEmployee.department._id);
      if (deptList.length > 0) {
        this.frmNewEmp1.controls['dept'].setValue(deptList[0]);
      }
      console.log(this.selectedEmployee);
      this.frmNewEmp1.controls['dept'].value.units.forEach((item, i) => {
        console.log(2);
        console.log(item);
        console.log(this.selectedEmployee.units);
        const unitsList = this.selectedEmployee.units.filter(x => x._id === item._id);
        if (unitsList.length > 0) {
          console.log(i);
          this.units.push(unitsList[0]);
        }
      });
      // this.units = this.frmNewEmp1.controls['dept'].value.units;
      this.selectedEmployee.isChecked = false;
      this.employees.push(this.selectedEmployee);
      this.filteredEmployees = this.employees;
    } else {
      this.disableDepartment = false;
    }
  }
  checkAllEmployees(value: boolean) {
    this.employees.forEach((itemi, i) => {
      itemi.isChecked = value;
    });
  }
  getEmployees(dept: Department, unit: any) {
    this.loadIndicatorVisible = true;
    this.employeeService.find({
      query: {
        facilityId: this.selectedFacility._id,
        departmentId: dept._id,
        units: unit._id,
        showbasicinfo: true
      }
    }).then(payload => {
      this.employees = payload.data;
      this.employees.forEach((itemi, i) => {
        itemi.isChecked = false;
      });
      this.filteredEmployees = this.employees;
      this.loadIndicatorVisible = false;
    }, error => {
      this.loadIndicatorVisible = false;
    });

  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  getMajorLocations() {
    this.locationService.findAll().then(payload => {
      this.majorLocations = payload.data;
    });
  }
  getMinorLocation(majorLocation: Location) {
    this.facilityService.get(this.selectedFacility._id, {}).then(payload => {
      this.locker.setObject('selectedFacility', payload);
      this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
      this.minorLocations = this.selectedFacility.minorLocations.filter(x => x.locationId === majorLocation._id);
      this.getWorkSpace();
    });
  }
  onValueChanged(e, employee: Employee) {
    employee.isChecked = e.checked;
  }
  getWorkSpace() {
    if (this.selectedEmployee === undefined || this.selectedEmployee._id === undefined) {
      const minorLocationId = this.frmNewEmp1.controls['minorLoc'].value._id;
      this.filteredEmployees = this.employees;
      this.checkAllEmployees(false);
      if (minorLocationId !== undefined) {
        this.loadIndicatorVisible = true;
        this.workspaceService.find({
          query:
          {
            facilityId: this.selectedFacility._id,
            'locations.minorLocationId._id': minorLocationId, $limit: 100
          }
        }).then(payload => {
          console.log(payload);
          const filteredEmployee: Employee[] = [];
          this.filteredEmployees.forEach((emp, i) => {
            let workInSpace = false;
            payload.data.forEach((work, j) => {
              if (work.employeeId._id === emp._id) {
                workInSpace = true;
              }
            });
            if (!workInSpace) {
              filteredEmployee.push(emp);
            }
          });
          this.filteredEmployees = filteredEmployee;
          this.loadIndicatorVisible = false;
        }, error => {
          this.loadIndicatorVisible = false;
        });
      } else {
        this.workSpaces = [];
        this.loadIndicatorVisible = false;
      }
    }
  }
  isAnyChecked() {
    const checkedItems = this.filteredEmployees.filter(x => x.isChecked);
    return checkedItems.length > 0;
  }
  getEmployeeIdFromFiltered(filtered: Employee[]) {
    const retVal: string[] = [];
    filtered.forEach((itemi, i) => {
      retVal.push(itemi._id);
    });
    return retVal;
  }
  setWorkspace(valid: boolean, value: any) {
    if (valid) {
      this.loadIndicatorVisible = true;
      const filtered = this.filteredEmployees.filter(x => x.isChecked);
      const employeesId = this.getEmployeeIdFromFiltered(filtered);
      console.log(employeesId);
      const createArrays: Employee[] = [];
      const updateArrays: Employee[] = [];
      this.workspaceService.find({
        query:
        { facilityId: this.selectedFacility._id, 'employeeId._id': { $in: employeesId }, $limit: 100 }
      }).then(payload => {
        console.log(payload);
        filtered.forEach((iteme, e) => {
          let hasRecord = false;
          if (payload.data.filter(x => x.employeeId._id === iteme._id).length > 0) {
            hasRecord = true;
          }
          console.log(hasRecord);
          if (hasRecord) {
            updateArrays.push(iteme);
          } else {
            createArrays.push(iteme);
          }
        });

        const workSpaces$ = [];
        {
          const workSpaces: WorkSpace[] = [];
          console.log(createArrays);
          console.log(updateArrays);
          createArrays.forEach((emp, i) => {
            const space: WorkSpace = <WorkSpace>{};
            space.employeeId = emp;
            space.facilityId = this.selectedFacility._id;
            space.locations = [];
            const locationModel = <any>{};
            locationModel.majorLocationId = this.frmNewEmp1.controls['majorLoc'].value;
            locationModel.minorLocationId = this.frmNewEmp1.controls['minorLoc'].value;
            space.locations.push(locationModel);
            workSpaces.push(space);
            console.log(workSpaces);
            workSpaces$.push(Observable.fromPromise(this.workspaceService.create(space)));
          });
        }

        {
          payload.data.forEach((work: WorkSpace, i) => {
            const locationModel = <any>{};
            locationModel.majorLocationId = this.frmNewEmp1.controls['majorLoc'].value;
            locationModel.minorLocationId = this.frmNewEmp1.controls['minorLoc'].value;
            work.locations.push(locationModel);
            workSpaces$.push(Observable.fromPromise(this.workspaceService.update(work)));
          });
        }
        Observable.forkJoin(workSpaces$).subscribe(results => {
          this.getWorkSpace();
          this.loadIndicatorVisible = false;
        }, error => {
          this.loadIndicatorVisible = false;
        });
      }, error => {
        console.log(error);
      });
    } else {
      this.mainErr = false;
      this.errMsg = 'An error occured while setting the workspace, please try again!';
    }
  }

}