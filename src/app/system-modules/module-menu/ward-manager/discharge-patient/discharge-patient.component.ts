import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
  WardDischargeTypesService, InPatientService, WardAdmissionService, BillingService, FacilitiesService
} from '../../../../services/facility-manager/setup/index';
import { ActivatedRoute } from '@angular/router';
import { WardDischarge, Facility, BillModel, BillItem, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';

@Component({
  selector: 'app-discharge-patient',
  templateUrl: './discharge-patient.component.html',
  styleUrls: ['./discharge-patient.component.scss']
})
export class DischargePatientComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedPatient: any;
  dischargeFormGroup: FormGroup;
  mainErr = true;
  errMsg = 'You have unresolved errors';
  dischargeTypeItems: any[];
  inPatientId: string;
  discharge: any = <any>{};
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  user: User = <User>{};
  employeeDetails: any = <any>{};
  bill: BillModel = <BillModel>{};
  disableBtn = false;
  dischargeText = true;
  dischargingText = false;

  constructor(
    private fb: FormBuilder,
    private _wardDischargeTypesService: WardDischargeTypesService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _locker: CoolLocalStorage,
    private _inPatientService: InPatientService,
    private _wardAdmissionService: WardAdmissionService,
    private _billingService: BillingService,
    private _facilityService: FacilitiesService
  ) {}

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this._locker.getObject('miniFacility');
    this.employeeDetails = this._locker.getObject('loginEmployee');
    this.user = <User>this._locker.getObject('auth');

    this.dischargeFormGroup = this.fb.group({
      dischargeType: ['', [<any>Validators.required]],
      comment: ['', [<any>Validators.required]]
    });

    this._route.params.subscribe(params => {
      this.inPatientId = params.id;
    });

    this._wardDischargeTypesService.findAll().then(payload => {
      this.dischargeTypeItems = payload.data;
    });
  }

  onDischarge(value: any, valid: boolean) {
    if (valid) {
      this.disableBtn = true;
      this.dischargeText = false;
      this.dischargingText = true;

      let payload = {
        discharge: value,
        inPatientId: this.selectedPatient._id,
        status: myGlobals.discharge
      };

      this._inPatientService.discharge(payload).then(res => {
        if (res.status === 'success') {
          this._notification('Success', 'Patient has been discharged successfully.');
          setTimeout(e => {
            this._router.navigate(['/dashboard/ward-manager/admitted']);
          }, 2000);
        } else {
          this._notification('Error', 'There was a problem discharging patient. Please try again later.');
        }
      }).catch(err => {
      });

      // this._inPatientService.get(this.inPatientId, {}).then(payload => {
      // 	const inPatientVal = payload;
      // 	this.discharge.dischargeTypeId = this.dischargeFormGroup.controls['dischargeType'].value;
      // 	this.discharge.Reason = this.dischargeFormGroup.controls['comment'].value;
      // 	payload.discharge = this.discharge;
      // 	payload.statusId = myGlobals.discharge;
      // 	payload.transfers[payload.lastIndex].checkOutDate = new Date();
      // 	this._inPatientService.update(payload).then(payload2 => {
      // 		this.close_onClick();
      // 		const currentWard = payload.transfers[payload.lastIndex];
      // 		this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id }}).then(payload3 => {
      // 				payload3.data[0].locations.forEach(location => {
      // 					if (location.minorLocationId._id === currentWard.minorLocationId) {
      // 						location.rooms.forEach(room => {
      // 							if (room.roomId._id === currentWard.roomId) {
      // 								room.beds.forEach(bed => {
      // 									if (bed.bedId._id === currentWard.bedId) {
      // 										bed.isAvailable = true;
      // 										bed.state = 'Available';
      // 										delete bed.occupant;
      // 										this._wardAdmissionService.update(payload3.data[0]).then(payload4 => {
      // 											this._router.navigate(['/dashboard/ward-manager/admitted']);
      // 										});
      // 									}
      // 								});
      // 							}
      // 						});
      // 					}
      // 				});
      // 			})
      // 	}, error => {
      // 	});
      // });
    }
  }

  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  onDischargeTypeChange(param) {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
