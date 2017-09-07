import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { WorkbenchService } from '../../../../services/facility-manager/setup/index';

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
  workbenches: any[] = []
  selectedWorkBench: any = <any>{};

  workbench_view = false;
  Active = true;
  Inactive = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';
  btnText = 'Create Workbench';
  reqDetail_view = false;
  personAcc_view = false;
  loading: Boolean = true;

  public frmNewWorkbench: FormGroup;

  constructor(private formBuilder: FormBuilder, private locker: CoolSessionStorage, private locationService: LocationService,
    private workBenchService: WorkbenchService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frmNewWorkbench = this.formBuilder.group({
      minorLocation: ['', [Validators.required]],
      benchName: ['', [Validators.required]],
      isActive: [true, [Validators.required]]
    });
    this.getLaboratoryMajorLocation();
    this.getWorkBenches();
  }
  getWorkBenches() {
    this.workBenchService.find({ query: { 'facilityId._id': this.selectedFacility._id, $limit: 100 } }).then(payload => {
      this.loading = false;
      this.workbenches = payload.data;
    })
  }
  getLaboratoryMajorLocation() {
    this.locationService.find({ query: { name: 'Laboratory' } }).then(payload => {
      if (payload.data.length > 0) {
        this.selectedMajorLocation = payload.data[0];
        this.minorLocations = this.selectedFacility.minorLocations.
          filter(x => x.locationId === this.selectedMajorLocation._id);
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
    if (valid) {
      if (this.selectedWorkBench._id === undefined) {
        const workBench = {
          name: value.benchName,
          facilityId: this.locker.getObject('miniFacility'),
          laboratoryId: value.minorLocation
        }
        this.workBenchService.create(workBench).then(payload => {
          this.workbenches.push(payload);
          this.frmNewWorkbench.reset();
          this.frmNewWorkbench.controls['isActive'].setValue(true);
          this.selectedWorkBench = <any>{};
        }, error => {
        })
      } else {
        this.selectedWorkBench.name = this.frmNewWorkbench.controls['benchName'].value;
        this.selectedWorkBench.laboratoryId = this.frmNewWorkbench.controls['minorLocation'].value;
        this.selectedWorkBench.isActive = this.frmNewWorkbench.controls['isActive'].value;
        this.workBenchService.update(this.selectedWorkBench).then(payload => {
          this.workbench_view = false;
          this.btnText = 'Create Workbench';
          this.selectedWorkBench = <any>{};
          this.frmNewWorkbench.reset();
          this.frmNewWorkbench.controls['isActive'].setValue(true);
          const index = this.workbenches.findIndex((obj => obj._id === payload._id));
          this.workbenches.splice(index, 1, payload);
        }, error => {
          this.btnText = 'Create Workbench';
          this.frmNewWorkbench.reset();
          this.frmNewWorkbench.controls['isActive'].setValue(true);
        })
      }
    }
  }

  editWorkBench(bench) {
    this.selectedWorkBench = bench;
    this.frmNewWorkbench.controls['benchName'].setValue(this.selectedWorkBench.name);
    this.frmNewWorkbench.controls['minorLocation'].setValue(this.selectedWorkBench.laboratoryId);
    this.frmNewWorkbench.controls['isActive'].setValue(this.selectedWorkBench.isActive);
    this.btnText = 'Update Workbench';
    this.workbench_view = true;
  }
  toggleActivate(bench) {
    bench.isActive = !bench.isActive;
    this.selectedWorkBench = bench;
    this.frmNewWorkbench.controls['benchName'].setValue(bench.name);
    this.frmNewWorkbench.controls['minorLocation'].setValue(bench.laboratoryId);
    this.frmNewWorkbench.controls['isActive'].setValue(bench.isActive);
    this.createWorkbench(this.frmNewWorkbench.valid, bench);
  }
}