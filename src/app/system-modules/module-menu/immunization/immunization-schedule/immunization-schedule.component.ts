import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility } from '../../../../models/index';
import { DrugListApiService } from '../../../../services/facility-manager/setup';

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
  disableBtn: Boolean = false;
  saveScheduleBtn: Boolean = true;
  updateScheduleBtn: Boolean = false;
  showCuDropdown: Boolean = false;
  cuDropdownLoading: Boolean = true;
  drugIndex: Number = 0;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _systemModuleService: SystemModuleService,
    private _drugListAPI: DrugListApiService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');

    this.immunizationScheduleForm = this._fb.group({
      name: ['', [<any>Validators.required]],
      vaccines: this._fb.array([this.initVaccineBuilder()])
    });

    (this.immunizationScheduleForm.get('vaccines') as FormArray).valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      // .switchMap(value => this._drugListAPI.find({ query: { 'text': value[this.drugIndex].name, facilityId: this.facility._id }}))
      .subscribe((res: any) => {
        console.log(res);
        if (res.length > 0) {
          // const text = res[this.drugIndex].name;
          this._drugListAPI.find({ query: { searchtext: 'hepat', method : 'immunization' } }).then(resp => {
            console.log(resp);
            this.cuDropdownLoading = false;
            if (resp.status === 'success') {
              this.results = resp.data;
            }
          });
        }
      });
    // (this.immunizationScheduleForm.get('vaccines') as FormArray).valueChanges.subscribe(values => {
    //   console.log(values);
    //   if (values.length > 0) {
    //     // this.apmisLookupQuery = { 'searchtext': values[0].name };
    //     // .debounceTime(200)
    //     //   .distinctUntilChanged()
    //     //   .switchMap(value => this._drugListAPI.searchProcedure({ query: { 'text': value, facilityId: this.facility._id } }))
    //     //   .subscribe((res: any) => {
    //     //     this.cuDropdownLoading = false;
    //     //     if (res.status === 'success') {
    //     //       this.results = res.data;
    //     //     }
    //     //   });
    //   }
    // });

    console.log(this.immunizationScheduleForm.controls['vaccines']);
  }

  onClickSaveSchedule(valid: boolean, value: any) {
    if (valid) {
      console.log(value);
      console.log(this.immunizationScheduleForm);
    }
  }

  initVaccineBuilder() {
    return this._fb.group({
      name: ['', Validators.required],
      nameCode: ['', Validators.required],
      vaccinationSite: ['', Validators.required],
      intervals: this._fb.array([this.initIntervalBuilder()])
      // numberOfDose: ['', Validators.required],
      // price: ['', Validators.required],
    });
  }

  removeVaccine(i: number) {
    // remove address from the list
    const control = <FormArray>this.immunizationScheduleForm.controls['vaccines'];
    control.removeAt(i);
  }

  initIntervalBuilder() {
    return this._fb.group({
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

  onClickAddInterval(i, j, vaccine) {
    // add interval into the list of vaccines
    const control = <FormArray>vaccine.controls['intervals'];
    control.push(this.initIntervalBuilder());
  }

  onValueChangeResults(control) {
    console.log(control);
  }

  apmisLookupHandleSelectedItem(i, value, vaccine) {
    console.log(value);
    console.log(vaccine);
    vaccine.controls['name'].setValue(value.name);
    // this.selectedProcedure = value;
    // this.addProcedureForm.controls['procedure'].setValue(value.name);
  }

  focusSearch(i) {
    console.log(i);
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
