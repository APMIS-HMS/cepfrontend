import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})
export class WorkbenchComponent implements OnInit {

  apmisLookupUrl = '';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = '';
  selectedFacility: Facility = <Facility>{};
  selectedMajorLocation: Location = <Location>{};

  minorLocations: MinorLocation[] = [];

  workbench_view = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewWorkbench: FormGroup;

  constructor(private formBuilder: FormBuilder, private locker: CoolSessionStorage, private locationService: LocationService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    console.log(this.selectedFacility)
    this.frmNewWorkbench = this.formBuilder.group({
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
  apmisLookupHandleSelectedItem(value) {

  }
  workbench_show() {
    this.workbench_view = !this.workbench_view;
  }
  patientDisplayFn(minor: any) {
    return minor ? minor.name : minor;
  }
  close_onClick(message: boolean): void {

  }
  createWorkbench(valid, value) {
    console.log(valid);
    console.log(value);
  }
}
