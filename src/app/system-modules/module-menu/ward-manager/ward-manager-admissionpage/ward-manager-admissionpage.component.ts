import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { InPatientListService, InPatientService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility, InPatient, WardTransfer, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';

@Component({
  selector: 'app-ward-manager-admissionpage',
  templateUrl: './ward-manager-admissionpage.component.html',
  styleUrls: ['./ward-manager-admissionpage.component.scss']
})
export class WardManagerAdmissionpageComponent implements OnInit {
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @Input() selectInpatient: any;
  admitPatient = false;
  transferReqShow = false;
  transferInShow = false;
  transferOutShow = false;
  newAdmissionShow = true;
  dischargeShow = false;
  _wardTransfer: WardTransfer = <WardTransfer>{};
  selectedWard: any;
  typeChecker: any = myGlobals;
  listPatientAdmissionWaiting: any[] = [];
  listPatientTransferWaiting: any[] = [];
  listPatientTransferOutWaiting: any[] = [];
  listPatientDischarge: any[] = [];
  facility: Facility = <Facility>{};
  user: User = <User>{};
  employeeDetails: any = <any>{};
  newAdmissionLoading = true;
  transferInLoading = true;
  transferOutLoading = true;
  dischargeLoading = true;
  disableAdmitBtn = false;
  admitBtnText = '<i class="fa fa-bed" aria-hidden="true"></i> Admit';
  inPatientWaitingItem: any;

  constructor(
    private _inPatientListService: InPatientListService,
    private _locker: CoolLocalStorage,
    private _wardEventEmitter: WardEmitterService,
    private _inPatientService: InPatientService,
    private facilityService: FacilitiesService,
    private _authFacadeService: AuthFacadeService
  ) {
    // this._inPatientListService.listenerCreate.subscribe(payload => {
    //   // this.getWaitingList(this.selectedWard);
    // });
    // this._inPatientListService.listenerUpdate.subscribe(payload => {
    //   // this.getWaitingList(this.selectedWard);
    // });

    this.facility = <Facility>this._locker.getObject('selectedFacility');

    this._authFacadeService.getLogingEmployee().then((res: any) => {
      if (!!res._id) {
        this.employeeDetails = res;
        if (this.employeeDetails.wardCheckIn.length > 0) {
          const wardCheckedIn = this.employeeDetails.wardCheckIn.filter(x => x.isOn)[0];

          const wardType = {
            type: 'ward',
            typeObject: wardCheckedIn
          };
          console.log(wardType);
          this.selectedWard = wardType;
          this.getWaitingList(wardType);
          this.getTransferInList(wardType);
          this.getDischargeList(wardType);
          this.getTransferOutList(wardType);
        }
      } else {
        this._notification('Error', 'Couldn\'t get Logged in user! Please try again later');
      }
    }).catch(err => {
      console.log(err);
    });
  }

  ngOnInit() {
    this._wardEventEmitter.setRouteUrl('Admission waiting list');
    this.user = <User>this._locker.getObject('auth');

    // Subscribe to the event when ward changes.
    this._wardEventEmitter.announceWard.subscribe(val => {
      this.selectedWard = val;
      this.getWaitingList(val);
      this.getTransferInList(val);
      this.getDischargeList(val);
      this.getTransferOutList(val);
    });
  }

  admitPatient_onClick(value: any, typeChecker = myGlobals) {
    if (!!this.selectedWard && !!this.selectedWard.typeObject) {
      this.selectInpatient = value;
      this.selectInpatient.typeChecker = typeChecker.onAdmission;
      // Pass the loggedInWard to the selectedInpatient.
      this.selectInpatient.loggedInWard = this.selectedWard.typeObject;
      this.admitPatient = true;
    } else {
      this._notification('Error', 'There was problem getting selected ward.');
    }
  }

  transferAdmitPatient_onClick(model: any, typeChecker = myGlobals) {
    if (!!this.selectedWard && !!this.selectedWard.typeObject) {
      this.selectInpatient = model;
      this.selectInpatient.typeChecker = typeChecker.transfer;
      // Pass the loggedInWard to the selectedInpatient.
      this.selectInpatient.loggedInWard = this.selectedWard.typeObject;
      this.admitPatient = true;
    }
  }

  close_onClick() {
    this.admitPatient = false;
    this.getWaitingList(this.selectedWard);
    this.getTransferInList(this.selectedWard);
    this.getDischargeList(this.selectedWard);
    this.getTransferOutList(this.selectedWard);
  }

  onClickDeclineTransfer(inpatientItem) {
    this._inPatientService.get(inpatientItem._id, {}).then(payload => {
      payload.statusId = myGlobals.onAdmission;
      payload.transfers[payload.lastIndex].proposedWard = undefined;
      // Update the checkOutDate of the last tranfer
      this._inPatientService.update(payload).then(res => {
          this.getTransferInList(this.selectedWard);
      }).catch(err => {});
    });
  }

  getWaitingList(checkedInWard: any) {
    this._inPatientListService.customGet({ action: 'getInPatientWaitingList'}, { query: {
        'facilityId': this.facility._id,
        'minorLocationId': checkedInWard.typeObject.minorLocationId._id,
        isAdmitted: false,
        $sort: { createdAt: -1 }
      }
    }).then(res => {
      console.log(res);
      this.newAdmissionLoading = false;
      if (res.status === 'success') {
        this.listPatientAdmissionWaiting = res.data;
      }
    });
  }

  getTransferInList(checkedInWard: any) {
    this._inPatientListService.customGet({ action: 'getInPatientTransferList' }, {
      query: {
        facilityId: this.facility._id,
        proposedWard: checkedInWard.typeObject.minorLocationId._id,
        status: myGlobals.transfer,
        isDischarged: false,
        $sort: { createdAt: -1 }
      }
    }).then(res => {
      this.transferInLoading = false;
      if (res.status === 'success') {
        this.listPatientTransferWaiting = res.data;
      }
    });
  }

  getTransferOutList(checkedInWard: any) {
    this._inPatientListService.customGet({ action: 'getInPatientTransferList' }, {
      query: {
        facilityId: this.facility._id,
        currentWard: checkedInWard.typeObject.minorLocationId._id,
        status: myGlobals.transfer,
        isDischarged: false,
        $sort: { createdAt: -1 }
      }
    }).then(res => {
      this.transferOutLoading = false;
      if (res.status === 'success') {
        this.listPatientTransferOutWaiting = res.data;
      }
    });
  }

  getDischargeList(checkedInWard: any) {
    this._inPatientListService.customGet({ action: 'getDischargedPatients' }, {
      query: {
        facilityId: this.facility._id,
        currentWard: checkedInWard.typeObject.minorLocationId._id,
        status: myGlobals.discharge,
        isDischarged: true,
        $sort: { createdAt: -1 }
      }
    }).then(res => {
      console.log(res);
      this.dischargeLoading = false;
      if (res.status === 'success') {
        this.listPatientDischarge = res.data;
      }
    }).catch(err => console.log(err));
  }
  navEpDetail(item) {}
  // Notification
  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
