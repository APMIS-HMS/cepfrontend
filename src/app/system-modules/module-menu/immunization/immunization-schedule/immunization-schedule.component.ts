import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility } from '../../../../models/index';
import { DrugListApiService } from '../../../../services/facility-manager/setup';
import { DurationUnits } from '../../../../shared-module/helpers/global-config';
import { ImmunizationScheduleService } from '../../../../services/facility-manager/setup/immunization-schedule.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';

@Component({
  selector: 'app-immunization-schedule',
  templateUrl: './immunization-schedule.component.html',
  styleUrls: ['./immunization-schedule.component.scss']
})
export class ImmunizationScheduleComponent implements OnInit {
  immunizationScheduleForm: FormGroup;
  facility: Facility = <Facility>{};
  results: any = <any>[];
  apmisLookupQuery = {};
  apmisLookupText = '';
  apmisLookupUrl = 'drug-generic-list';
  apmisLookupDisplayKey = 'name';
  disableBtn: boolean = false;
  saveScheduleBtn: boolean = true;
  updateScheduleBtn: boolean = false;
  savingScheduleBtn: boolean = false;
  updatingScheduleBtn:boolean = false;
  showCuDropdown: boolean = false;
  cuDropdownLoading: boolean = true;
  drugIndex: number;
  durationUnits = DurationUnits;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _systemModuleService: SystemModuleService,
    private _drugListAPI: DrugListApiService,
    private _immunizationScheduleService: ImmunizationScheduleService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');

    // Index of the APMIS component that was clicked.
    this.drugIndex = 0;
    this.immunizationScheduleForm = this._fb.group({
      name: ['', [<any>Validators.required]],
      price: ['', [<any>Validators.required]],
      vaccines: this._fb.array([this.initVaccineBuilder()])
    });

    const immuneSch = <FormArray>this.immunizationScheduleForm.controls['vaccines'];
    const vaccine = <FormArray>immuneSch.controls[this.drugIndex];
    const intervals = <FormArray>vaccine.controls['intervals'];
    (this.immunizationScheduleForm.get('vaccines') as FormArray).valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      // .switchMap(value => this._drugListAPI.find({ query: { 'text': value[this.drugIndex].name, facilityId: this.facility._id }}))
      .subscribe((res: any) => {
        console.log(res);
        if (res.length > 0) {
          const text = res[this.drugIndex].name;
          const intervalLength = intervals.length
          // Get the length from interval and assign numberOfDosage
          vaccine.controls['numberOfDosage'].setValue(intervalLength);

          this._drugListAPI.find({ query: { searchtext: text, method : 'immunization' } }).then(resp => {
            this.cuDropdownLoading = false;
            if (resp.status === 'success') {
              this.results = resp.data;
            }
          });
        }
      });

    // if (intervals.length > 0) {
    //   (this.immunizationScheduleForm.get('intervals') as FormArray).valueChanges
    //     .subscribe(res => {
    //       console.log(res);
    //     });
    // }
  }

  onClickSaveSchedule(valid: boolean, value: any) {
    if (valid) {
      this.disableBtn = true;
      this.saveScheduleBtn = false;
      this.updateScheduleBtn = false;
      this.savingScheduleBtn = true;
      this.updatingScheduleBtn = false;

      const payload = {
        action: 'create',
        facilityId: this.facility._id,
        name: value.name,
        vaccines: value.vaccines,
        price: value.price
      };
      console.log(payload);
      this._immunizationScheduleService.create(payload).then(res => {
        console.log(res);
        if (res.status === 'success') {
          const text = `${value.name} immunization schedule has been created successfully!`;
          this._systemModuleService.announceSweetProxy('success', text);
          this.immunizationScheduleForm.reset();
          this.disableBtn = false;
          this.saveScheduleBtn = true;
          this.updateScheduleBtn = false;
          this.savingScheduleBtn = false;
          this.updatingScheduleBtn = false;
        } else {
          this._systemModuleService.announceSweetProxy('success', res.message);
          this.disableBtn = false;
          this.saveScheduleBtn = true;
          this.updateScheduleBtn = false;
          this.savingScheduleBtn = false;
          this.updatingScheduleBtn = false;
        }
      });
    }
  }

  initVaccineBuilder() {
    return this._fb.group({
      name: ['', Validators.required],
      nameCode: ['', Validators.required], // drug code
      code: ['', Validators.required],
      vaccinationSite: ['', Validators.required],
      numberOfDosage: [{ value: '', disabled: true }, Validators.required],
      dosage: ['', Validators.required],
      price: ['', Validators.required],
      intervals: this._fb.array([this.initIntervalBuilder()]),
    });
  }

  removeVaccine(i: number) {
    // remove address from the list
    const control = <FormArray>this.immunizationScheduleForm.controls['vaccines'];
    control.removeAt(i);
  }

  initIntervalBuilder() {
    return this._fb.group({
      sequence: ['', Validators.required],
      unit: ['', Validators.required],
      duration: ['', Validators.required],
    });
  }

  // private _populateInvestigation(result, investigation) {
  //   return this._fb.group({
  //     result: [result],
  //     investigation: investigation
  //   });
  // }

  onClickAddVaccine() {
    // add vaccine to list
    const control = <FormArray>this.immunizationScheduleForm.controls['vaccines'];
    control.push(this.initVaccineBuilder());
  }

  onClickAddInterval(i, vaccine, action) {
    const control = <FormArray>vaccine.controls['intervals'];
    if (action === 'add') {
      // add interval into the list of vaccines.
      control.push(this.initIntervalBuilder());
    } else {
      // Remove interval from the list of vaccines.
      control.removeAt(control.length - 1);
    }
  }

  onValueChangeResults(control) {
    console.log(control);
  }

  apmisLookupHandleSelectedItem(i, value, vaccine) {
    vaccine.controls['name'].setValue(value.name);
    vaccine.controls['nameCode'].setValue(value.code);
  }

  focusSearch(i) {
    this.drugIndex = i;
    this.showCuDropdown = !this.showCuDropdown;
  }

  focusOutSearch(i) {
    setTimeout(() => {
      this.drugIndex = i;
      this.showCuDropdown = !this.showCuDropdown;
    }, 300);
  }

}
