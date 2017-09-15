import { FacilityCompanyCoverService } from './../../../../services/facility-manager/setup/facility-company-cover.service';
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
  selectedCompanyCover: any;
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
  companies: any[] = [];
  plans: any[] = [];
  user: User = <User>{};
  insurancePlanForm: FormGroup;
  companyCoverPlanForm:FormGroup;

  insuranceFormArrayIndex = 0;  
  companyFormArrayIndex = 0;
  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private companyService: FacilityCompanyCoverService,
    private locker: CoolLocalStorage, private facilityService: FacilitiesService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.hmoService.hmos(this.selectedFacility._id).then(payload => {
      if (payload.body.length > 0) {
        // console.log(payload.body[0].hmos);
        this.hmos = payload.body[0].hmos;
      }
    });
    this.companyService.companycovers(this.selectedFacility._id).then(payload =>{
      console.log(payload);
      this.companies = payload.body[0].companyCovers;
    })
    this.addInsurancePlan();
    this.addCompanyCoverPlan();
    this.subscribeToValueChanges();
    this.subscribeToCompanyCoverValueChanges();
  }
  addInsurancePlan() {
    this.insurancePlanForm = this.formBuilder.group({
      'insurancePlanArray': this.formBuilder.array([
        this.formBuilder.group({
          hmo: ['', [<any>Validators.required]],
          hmoPlan: ['', [<any>Validators.required]],
          hmoPlanId: ['', [<any>Validators.required]],
          plans: [''],
          client: [null],
          readOnly: [false],
          addToHMOPlan: [false],
          isPrincipal: [false]
        })
      ])
    });
  }

  addCompanyCoverPlan() {
    this.companyCoverPlanForm = this.formBuilder.group({
      'companyCoverPlanArray': this.formBuilder.array([
        this.formBuilder.group({
          company: ['', [<any>Validators.required]],
          companyPlan: ['', [<any>Validators.required]],
          companyPlanId: ['', [<any>Validators.required]],
          plans: [''],
          client: [null],
          readOnly: [false],
          addToCompanyPlan: [false],
          isPrincipal: [false]
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
  subscribeToCompanyCoverValueChanges() {
    (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['company'].valueChanges.subscribe(value => {
      this.selectedCompanyCover = value;
      console.log(value)
      this.companyService.companycovers(this.selectedFacility._id, value).then(payload => {
        console.log(payload.body);
        this.plans = payload.body;
        (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['plans'].setValue(this.plans, { onlySelf: true });
      });
    });


    (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['addToCompanyPlan'].valueChanges.subscribe(value => {
      if(value===true){
        (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['companyPlanId'].setErrors(null);
      }
    });


    (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['companyPlanId'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        console.log(value);
        this.selectedCompanyCover = (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['company'].value;
        if (this.selectedCompanyCover === undefined) {
          this._notification('Warning', 'Please select a Company to search from and try again!');
        } else {
          this.companyService.companycovers(this.selectedFacility._id, this.selectedCompanyCover, value).then(payload => {
            console.log(payload);
            if (payload.body !== null) {
              this.selectedCompanyCover = payload.body;
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['client'].setValue(payload.body);
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['companyPlan'].setValue(payload.body.category);
            } else {
              this.selectedCompanyCover = undefined;
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['companyPlanId'].setErrors({ idNotFound: true });
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['companyPlan'].reset();
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
        client: [null],
        readOnly: [false],
        addToHMOPlan: [false],
        isPrincipal: [false]
      })
      );
    const index = (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length - 1;
    this.insuranceFormArrayIndex = index;
    this.subscribeToValueChanges();
    console.log((<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
      .controls[this.insuranceFormArrayIndex]));
  }

  pushNewCompanyCoverPlan() {
    (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
      .push(
      this.formBuilder.group({
        company: ['', [<any>Validators.required]],
        companyPlan: ['', [<any>Validators.required]],
        companyPlanId: ['', [<any>Validators.required]],
        plans: [''],
        client: [null],
        readOnly: [false],
        addToCompanyPlan: [false],
        isPrincipal: [false]
      })
      );
    const index = (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length - 1;
    this.companyFormArrayIndex = index;
    this.subscribeToCompanyCoverValueChanges();
    console.log((<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
      .controls[this.companyFormArrayIndex]));
  }
  onSubmit(insurance, i) {
    this.selectedHMO = (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
      .controls[this.insuranceFormArrayIndex]).controls['readOnly'].setValue(true);
    console.log(insurance)
  }
  onSubmitCompanyCover(company, i) {
    this.selectedHMO = (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
      .controls[this.companyFormArrayIndex]).controls['readOnly'].setValue(true);
    console.log(company)
  }
  isLastChild(i) {
    const len = (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length;
    if (i === (len - 1)) {
      return true;
    }
    return false;
  }
  isCompanyLastChild(i) {
    const len = (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length;
    if (i === (len - 1)) {
      return true;
    }
    return false;
  }
  closeInsurancePlan(insurance, i) {
    (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.splice(i, 1);
    if ((<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length === 0) {
      this.insuranceFormArrayIndex = 0;
      this.addInsurancePlan();
    }
  }
  closeCompanyPlan(company, i) {
    (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.splice(i, 1);
    if ((<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length === 0) {
      this.companyFormArrayIndex = 0;
      this.addCompanyCoverPlan()
    }
  }
  formArrayControlChanges(insurance, i) {
    this.insuranceFormArrayIndex = i;
  }
  companyFormArrayControlChanges(insurance, i) {
    this.companyFormArrayIndex = i;
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
