import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
<<<<<<< HEAD
import { Facility } from '../../../../models/index';
=======
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
>>>>>>> a32a2281083d392e3ce1cfe36b93bf605c47cbd6

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})
export class WorkbenchComponent implements OnInit {

  apmisLookupUrl = '';
  apmisLookupText = '';
  apmisLookupQuery = {};
<<<<<<< HEAD
  apmisLookupDisplayKey = "";

  selectedFacility: Facility = <Facility>{};
=======
  apmisLookupDisplayKey = '';
  selectedFacility: Facility = <Facility>{};
  selectedMajorLocation: Location = <Location>{};

  minorLocations: MinorLocation[] = [];
>>>>>>> a32a2281083d392e3ce1cfe36b93bf605c47cbd6

  workbench_view = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewWorkbench: FormGroup;

  constructor(private formBuilder: FormBuilder, private locker: CoolSessionStorage, private locationService: LocationService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    console.log(this.selectedFacility)
    this.frmNewWorkbench = this.formBuilder.group({
<<<<<<< HEAD
      minorLocations: ['', [Validators.required]],
      benchName: ['', [Validators.required]]
    })
  }

=======
      minorLocation: ['', [Validators.required]],
      benchName: ['', [Validators.required]],
      isActive: [true, [Validators.required]]
    });
    this.getLaboratoryMajorLocation();
  }

  getLaboratoryMajorLocation() {
    this.locationService.find({ query: { name: 'Laboratory' } }).then(payload => {
      console.log(payload);
      if (payload.data.length > 0) {
        this.selectedMajorLocation = payload.data[0];
        this.minorLocations = this.selectedFacility.minorLocations.
          filter(x => x.locationId === this.selectedMajorLocation._id);
        console.log(this.minorLocations);
      }
    })
  }
>>>>>>> a32a2281083d392e3ce1cfe36b93bf605c47cbd6
  apmisLookupHandleSelectedItem(value) {

  }
  workbench_show() {
    this.workbench_view = !this.workbench_view;
  }
<<<<<<< HEAD

  close_onClick(message: boolean): void {

=======
  patientDisplayFn(minor: any) {
    return minor ? minor.name : minor;
  }
  close_onClick(message: boolean): void {

  }
  createWorkbench(valid, value) {
    console.log(valid);
    console.log(value);
>>>>>>> a32a2281083d392e3ce1cfe36b93bf605c47cbd6
  }
}
