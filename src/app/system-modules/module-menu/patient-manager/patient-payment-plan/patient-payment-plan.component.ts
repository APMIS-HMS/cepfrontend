import { User } from './../../../../models/facility-manager/setup/user';
import { FacilitiesService } from './../../../../services/facility-manager/setup/facility.service';
import { Facility } from './../../../../models/facility-manager/setup/facility';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { HmoService } from './../../../../services/facility-manager/setup/hmo.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-patient-payment-plan',
  templateUrl: './patient-payment-plan.component.html',
  styleUrls: ['./patient-payment-plan.component.scss']
})
export class PatientPaymentPlanComponent implements OnInit {
  selectedHMOClient: any;
  selectedHMO: any;

  mainErr = true;
  errMsg = 'You have unresolved errors';

  tabWallet = true;
  tabInsurance = false;
  tabCompany = false;
  tabFamily = false;

  walletPlan = new FormControl('', Validators.required);
  hmo = new FormControl('', Validators.required);
  hmoPlan = new FormControl('', Validators.required);
  hmoPlanId = new FormControl('', Validators.required);
  ccPlan = new FormControl('', Validators.required);
  ccPlanId = new FormControl('', Validators.required);
  familyPlanId = new FormControl('', Validators.required);

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedFacility: Facility = <Facility>{};
  hmos: any[] = [];
  plans: any[] = [];
  user: User = <User>{};
  insurancePlanForm: FormGroup;
<<<<<<< HEAD

  insuranceFormArrayIndex = 0;
  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private locker: CoolSessionStorage,
=======
  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private locker: CoolLocalStorage,
>>>>>>> 2846fdb9222c2ad9ea0f0caa4baf36c7ffb8fcb5
    private facilityService: FacilitiesService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.hmoService.hmos(this.selectedFacility._id).then(payload => {
      if (payload.body.length > 0) {
        console.log(payload.body[0].hmos);
        this.hmos = payload.body[0].hmos;
      }
    });
    this.addInsurancePlan();
    this.subscribeToValueChanges();
  }
  addInsurancePlan() {
    this.insurancePlanForm = this.formBuilder.group({
      'insurancePlanArray': this.formBuilder.array([
        this.formBuilder.group({
          hmo: ['', [<any>Validators.required]],
          hmoPlan: ['', [<any>Validators.required]],
          hmoPlanId: ['', [<any>Validators.required]],
          plans: [''],
          client: [''],
          readOnly: [false]
        })
      ])
    });
  }
  subscribeToValueChanges() {
    (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['hmo'].valueChanges.subscribe(value => {
      this.selectedHMO = value;
      this.hmoService.hmos(this.selectedFacility._id, value).then(payload => {
        console.log(payload.body);
        this.plans = payload.body;
        (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['plans'].setValue(this.plans, { onlySelf: true });
      });
    });
    (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['hmoPlanId'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        console.log(value);
        this.selectedHMO = (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['hmo'].value;
        if (this.selectedHMO === undefined) {
          this._notification('Warning', 'Please select an HMO to search from and try again!');
        } else {
          this.hmoService.hmos(this.selectedFacility._id, this.selectedHMO, value).then(payload => {
            console.log(payload);
            if (payload.body !== null) {
              this.selectedHMOClient = payload.body;
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['client'].setValue(payload.body);
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['hmoPlan'].setValue(payload.body.plan);
            } else {
              this.selectedHMOClient = undefined;
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['hmoPlanId'].setErrors({ idNotFound: true });
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['hmoPlan'].reset();
            }
          })
        }
      });
  }
  pushNewInsurancePlan() {
    (<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
      .push(
      this.formBuilder.group({
        hmo: ['', [<any>Validators.required]],
        hmoPlan: ['', [<any>Validators.required]],
        hmoPlanId: ['', [<any>Validators.required]],
        plans: [''],
        client: [''],
        readOnly: [false]
      })
      );
    const index = (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length - 1;
    this.insuranceFormArrayIndex = index;
    this.subscribeToValueChanges();
    (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).markAsPristine();
  }
  onSubmit(insurance, i) {
    this.selectedHMO = (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
      .controls[this.insuranceFormArrayIndex]).controls['readOnly'].setValue(true);
    console.log(insurance)
  }
  isLastChild(i) {
    const len = (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length;
    console.log(i);
    console.log(len)

    if (i === (len - 1)){
      console.log('on')
      return true;
    }
    console.log('off')
    return false;
  }
  closeInsurancePlan(insurance, i) {
    (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.splice(i, 1);
    if ((<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length === 0) {
      this.insuranceFormArrayIndex = 0;
      this.addInsurancePlan()
    }
  }
  formArrayControlChanges(insurance, i) {
    this.insuranceFormArrayIndex = i;
    console.log(i)
  }
  getRole(client) {
    if (client !== undefined) {

      let filNo = client.filNo;
      if (filNo !== undefined) {
        const filNoLength = filNo.length;
        const lastCharacter = filNo[filNoLength - 1];
        return isNaN(lastCharacter) ? 'D' : 'P';
      }
    } else {
      return '';
    }
  }
  tabWallet_click() {
    this.tabWallet = true;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabCompany_click() {
    this.tabWallet = false;
    this.tabCompany = true;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabFamily_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = true;
    this.tabInsurance = false;
  }
  tabInsurance_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = true;
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
