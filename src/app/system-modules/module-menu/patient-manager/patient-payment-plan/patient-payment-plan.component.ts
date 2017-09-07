import { Facility } from './../../../../models/facility-manager/setup/facility';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { HmoService } from './../../../../services/facility-manager/setup/hmo.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-payment-plan',
  templateUrl: './patient-payment-plan.component.html',
  styleUrls: ['./patient-payment-plan.component.scss']
})
export class PatientPaymentPlanComponent implements OnInit {
  selectedHMO: any;

  mainErr = true;
  errMsg = 'you have unresolved errors';

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

  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private locker: CoolSessionStorage) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.hmoService.hmos(this.selectedFacility._id).then(payload => {
      if (payload.body.length > 0) {
        console.log(payload.body[0].hmos);
        this.hmos = payload.body[0].hmos;
      }
    });

    this.hmo.valueChanges.subscribe(value => {
      this.selectedHMO = value;
      this.hmoService.hmos(this.selectedFacility._id, value).then(payload => {
        console.log(payload.body);
        this.plans = payload.body;
      });
    });

    this.hmoPlanId.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        console.log(value);
        this.hmoService.hmos(this.selectedFacility._id, this.selectedHMO, value).then(payload => {
          console.log(payload);
        })
      })
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

}
