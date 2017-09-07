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
  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private locker: CoolLocalStorage,
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
    (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[0]).controls['hmo'].valueChanges.subscribe(value => {
      this.selectedHMO = value;
      this.hmoService.hmos(this.selectedFacility._id, value).then(payload => {
        console.log(payload.body);
        this.plans = payload.body;
        (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[0]).controls['hmoPlan'].setValue(this.plans);
      });
    });
    (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[0]).controls['hmoPlanId'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        console.log(value);
        this.selectedHMO =  (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[0]).controls['hmo'].value;
        if (this.selectedHMO === undefined) {
          this._notification('Warning', 'Please select an HMO to search from and try again!');
        } else {
          this.hmoService.hmos(this.selectedFacility._id, this.selectedHMO, value).then(payload => {
            console.log(payload);
            if (payload.body !== null) {
              this.selectedHMOClient = payload.body;
              this.selectedHMO =  (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[0]).controls['hmoPlan'].setValue(payload.body.plan);
            } else {
              this.selectedHMOClient = undefined;
              this.hmoPlan.reset();
            }
          })
        }
      });
  }
  addInsurancePlan() {
    this.insurancePlanForm = this.formBuilder.group({
      'insurancePlanArray': this.formBuilder.array([
        this.formBuilder.group({
          hmo: ['', [<any>Validators.required]],
          hmoPlan: ['', [<any>Validators.required]],
          hmoPlanId: ['', [<any>Validators.required]],
          readOnly: [false]
        })
      ])
    });
  }
  getRole() {
    if (this.selectedHMOClient !== undefined) {

      let filNo = this.selectedHMOClient.filNo;
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
