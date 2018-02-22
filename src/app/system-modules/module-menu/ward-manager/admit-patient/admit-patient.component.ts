import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { BedOccupancyService, InPatientService, InPatientListService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility, InPatient, WardTransfer, User} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
// import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
  selector: "app-admit-patient",
  templateUrl: './admit-patient.component.html',
  styleUrls: ['./admit-patient.component.scss']
})
export class AdmitPatientComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() inPatientItem: any;
  admitFormGroup: FormGroup;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  user: User = <User>{};
  employeeDetails: any = <any>{};
  inPatient: InPatient = <InPatient>{};
  _wardTransfer: WardTransfer = <WardTransfer>{};
  wards: any[] = [];
  rooms: any[] = [];
  beds: any[] = [];
  selectedBeds: any[] = [];
  availableBeds: any[] = [];
  occupiedBeds: any[] = [];
  admitPatient = false;
  admitBtn: boolean = true;
  admittingBtn: boolean = false;
  loadContent: Boolean = true;
  loadAvailableBeds: Boolean = true;
  disableAdmitBtn: Boolean = false;
  loggedInWard;

  constructor(
    private _bedOccupancyService: BedOccupancyService,
    private fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private router: Router,
    private _facilitiesService: FacilitiesService,
    private _inPatientService: InPatientService,
    private _inPatientListService: InPatientListService,
    private _authFacadeService: AuthFacadeService,
    private _systemModuleService: SystemModuleService
  ) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      if (!!res._id) {
        this.employeeDetails = res;
      }
    }).catch(err => {});
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

    // this.getwardRoomLocationItems();
    this.getWardsDetails();

    this.admitFormGroup = this.fb.group({
      ward: ['', [<any>Validators.required]],
      room: ['', [<any>Validators.required]],
      bed: ['', [<any>Validators.required]],
      desc: ['']
    });

    this.admitFormGroup.controls['ward'].valueChanges.subscribe(val => {
      console.log(val);
      this.loadAvailableBeds = true;
      this.beds = [];
      this.rooms = [];
      if (val !== '') {
        this.loadAvailableBeds = false;
        const wards = this.wards.filter(x => x._id === val);
        if (wards.length > 0 && !!wards[0].wardSetup) {
          this.rooms = wards[0].wardSetup.rooms;
          this.admitFormGroup.controls['room'].setValue('');
          this.admitFormGroup.controls['bed'].setValue('');
        }
      }
    });

    if (!!this.inPatientItem) {
      if (!!this.inPatientItem.minorLocationId) {
        setTimeout(e => {
          this.admitFormGroup.controls['ward'].setValue(this.inPatientItem.minorLocationId);
        }, 1000);
      } else if (this.inPatientItem.typeChecker === myGlobals.transfer) {
        setTimeout(e => {
          this.admitFormGroup.controls['ward'].setValue(this.inPatientItem.proposedWard);
        }, 1000);
      } else {
        setTimeout(e => {
          this.admitFormGroup.controls['ward'].setValue(this.inPatientItem.transfers[0].minorLocationId);
        }, 1000);
      }
    }

    this.admitFormGroup.controls['room'].valueChanges.subscribe(val => {
      this.loadAvailableBeds = false;
      this.beds = [];
      if (val !== '') {
        const rooms = this.rooms.filter(x => x._id === val._id);
        if (rooms.length > 0) {
          const payload = {
            action: 'getAvailableBeds',
            facilityId: this.facility._id,
            minorLocationId: this.admitFormGroup.controls['ward'].value,
            roomId: val._id
          };

          this._bedOccupancyService.customGet(payload, {}).then(res => {
            if (res.status === 'success') {
              this.beds = res.data;
            } else {
              this.beds = [];
            }
          }).catch(err => {});
        }
      }
    });
  }

  // onWardChange(param) {
  // 	this._bedOccupancyService.find({ query: { facilityId: this.facility._id } })
  // 		.then(payload => {
  // 			if (payload.data != []) {
  // 				payload.data[0].locations.forEach(item => {
  // 					if (item.minorLocationId.toString() === param.toString()) {
  // 						this.wardRoomLocationItems = item.rooms;
  // 					}
  // 				})
  // 			}
  // 		});
  // }

  // onRoomChange(param) {
  // 	this._bedOccupancyService.find({ query: { facilityId: this.facility._id } }).then(res => {
  // 		if (res.data !== []) {
  // 			res.data[0].locations.forEach(item => {
  // 				item.rooms.forEach(itm => {
  // 					if (itm._id.toString() === param.toString()) {
  // 						this.beds = itm.availableBed;
  // 					}
  // 				});
  // 			})
  // 		}
  // 	});
  // }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onAdmit(value: any, valid: boolean) {
    if (valid) {
      console.log(value);
      this.admitBtn = false;
      this.admittingBtn = true;
      this.disableAdmitBtn = true;
      // payload to send to the server;
      let payload = {
        inPatientId: this.inPatientItem._id,
        facilityId: this.facility._id,
        patientId: '',
        status: '',
        action: '',
        employeeId: this.employeeDetails._id,
        minorLocationId: value.ward,
        roomId: value.room._id,
        bedId: value.bed._id,
        desc: value.desc,
        type: ''
      };

      // Patient is coming in on admission.
      if (this.inPatientItem.typeChecker === myGlobals.onAdmission) {
        payload.type = 'admitPatient';
        payload.action = 'admitPatient';
        payload.status = myGlobals.onAdmission;
        payload.patientId = this.inPatientItem.patientId;

        this._inPatientService.customCreate(payload).then(res => {
          if (res.status === 'success') {
            let patient = `${this.inPatientItem.personDetails.firstName} ${this.inPatientItem.personDetails.lastName}`;
            let text = `You have successfully admitted ${patient} into ${value.bed.name} bed in ${value.room.name} room`;
            // this._notification('Success', fullText);
            this._systemModuleService.announceSweetProxy(text, 'success');
            this.close_onClick();
          } else {
            this._notification('Error', 'There was a admitting patient. Please try again later.');
          }
        }).catch(err => {});
        // this._inPatientListService.find({
        //     query: {
        //       'facilityId._id': this.facility._id,
        //       'patientId._id': this.inPatientItem.patientId._id,
        //       isAdmitted: false
        //     }
        //   }).then(payload1 => {
        //     // Delete Items that are not relevant in the room
        //     delete value.room.beds;

        //     delete this.inPatientItem.patientId.personDetails.countryItem;
        //     delete this.inPatientItem.patientId.personDetails.nationalityObject;
        //     delete this.inPatientItem.patientId.personDetails.addressObj;
        //     delete this.inPatientItem.patientId.personDetails.nationality;
        //     delete this.inPatientItem.patientId.personDetails.maritalStatus;
        //     delete this.inPatientItem.patientId.personDetails.nextOfKin;
        //     delete this.inPatientItem.patientId.personDetails.genderId;
        //     delete this.inPatientItem.patientId.personDetails.homeAddress;
        //     delete this.inPatientItem.patientId.personDetails.wallet;

        //     payload1.data[0].isAdmitted = true;
        //     payload1.data[0].admittedDate = new Date();
        //     this._inPatientListService.update(payload1.data[0]).then(callback1 => {
        //         this.inPatient.facilityId = this.miniFacility;
        //         this.inPatient.statusId = myGlobals.onAdmission;
        //         this.inPatient.admitByEmployeeId = this._facilitiesService.trimEmployee(
        //           this.employeeDetails
        //         );
        //         this.inPatient.patientId = this.inPatientItem.patientId;
        //         this._wardTransfer.minorLocationId = value.ward;
        //         this._wardTransfer.roomId = value.room;
        //         this._wardTransfer.bedId = value.bed;
        //         this._wardTransfer.description = value.desc;
        //         this._wardTransfer.checkInDate = new Date();
        //         this.inPatient.transfers = [];
        //         this.inPatient.transfers.push(this._wardTransfer);
        //         this.inPatient.admissionDate = new Date();
        //         this.inPatient.prevWard = callback1.wardId;
        //         this._inPatientService.create(this.inPatient).then(callback => {
        //           let patient = this.inPatientItem.patientId.personDetails
        //             .personFullName;
        //           let text = 'You have successfully admitted ' + patient;
        //           let wardRoom =
        //             ' into ' + value.bed.name + ' in ' + value.room.name;
        //           const fullText = text + wardRoom;
        //           const msgObj = {
        //             msg: fullText,
        //             occupant: this.inPatientItem.patientId,
        //             bed: value.bed,
        //             room: value.room
        //           };
        //           this.admitBtnText =
        //             'Navigating... <i class="fa fa-spinner fa-spin"></i>';
        //           this.updateWardAdissionService(msgObj);
        //           setTimeout(e => {
        //             this.close_onClick();
        //             this.router.navigate(['/dashboard/ward-manager/admitted']);
        //           }, 2000);
        //         });
        //       });
        //   });
      } else if (this.inPatientItem.typeChecker === myGlobals.transfer) {
        payload.type = 'acceptTransfer';
        payload.status = myGlobals.transfer;
        payload.action = 'admitPatient';
        payload.patientId = this.inPatientItem.patientId;

        this._inPatientService.customCreate(payload).then(res => {
          if (res.status === 'success') {
            let patient = `${this.inPatientItem.personDetails.firstName} ${this.inPatientItem.personDetails.lastName}`;
            let text = `You have successfully admitted ${patient} into ${value.bed.name} bed in ${value.room.name} room`;
            // this._notification('Success', fullText);
            this._systemModuleService.announceSweetProxy(text, 'success');
            this.close_onClick();
          } else {
            this._notification('Error', 'There was a admitting patient. Please try again later.');
          }
        }).catch(err => {});
        // this._inPatientService.admit(payload).then(res => {
        //   if (res.status === 'success') {
        //     this._notification('Success', 'Patient has been accepted successfully.');
        //     setTimeout(e => {
        //       this.router.navigate(['/dashboard/ward-manager/admitted']);
        //     }, 2000);
        //   } else {
        //     this._notification('Error', 'There was a problem discharging patient. Please try again later.');
        //   }
        // }).catch(err => {
        // });
        // this._inPatientService.get(this.inPatientItem._id, {})
        // 	.then(payload => {
        // 		payload.statusId = myGlobals.onAdmission;
        // 		payload.transfers[payload.lastIndex].checkOutDate = new Date();
        // 		this._wardTransfer.minorLocationId = payload.transfers[payload.lastIndex].proposeWard.minorLocationId;
        // 		this._wardTransfer.roomId = this.admitFormGroup.controls['room'].value;
        // 		this._wardTransfer.bedId = this.admitFormGroup.controls['bed'].value;
        // 		this._wardTransfer.description = this.admitFormGroup.controls['desc'].value;
        // 		this._wardTransfer.checkInDate = new Date();
        // 		payload.transfers.push(this._wardTransfer);
        // 		// Update the checkOutDate of the last tranfer
        // 		this._inPatientService.update(payload)
        // 			.then(payload1 => {
        // 				this.router.navigate(['/dashboard/ward-manager/admitted']);
        // 			}, err => {
        // 			})
        // 			.catch(err => {
        // 			});
        // 	});
      }
    } else {
      this._notification('Error', 'Please fill in all required fields.');
    }
  }

  // getwardRoomLocationItems() {
  // 	if (this.inpatientItem.typeChecker === myGlobals.transfer) {
  // 		this._inPatientService.get(this.inpatientItem._id, {}).then(payload => {
  // 			const rooms = payload.transfers[payload.lastIndex].proposeWard.ward.wardDetails.rooms;
  // 			// this.wardRoomLocationItems = rooms;
  // 		});
  // 	} else if (this.inpatientItem.typeChecker === myGlobals.onAdmission) {
  // 		this._inPatientListService.get(this.inpatientItem._id, {}).then(payload => {
  // 			// this.wardRoomLocationItems = payload.wardId;
  // 		});
  // 	}
  // }

  getWardsDetails() {
    this.wards = this.facility.minorLocations.filter(x => x.locationId === this.inPatientItem.loggedInWard.minorLocationId.locationId);
    this.loadContent = false;
    // this._bedOccupancyService.find({ query: { facilityId: this.facility._id } }).then(res => {
    //   if (res.data.length > 0) {
    //     if (!!this.inPatientItem) {
    //       // Filter the wards to the current logged ward.
    //       this.wards = res.data[0].locations.filter(x => x.minorLocationId._id === this.inPatientItem.loggedInWard.minorLocationId._id);
    //     }
    //   }
    // });
  }

  // updateWardAdissionService(value: any) {
  //   this._bedOccupancyService
  //     .find({ query: { 'facilityId._id': this.facility._id } })
  //     .then(payload => {
  //       if (payload.data.length > 0) {
  //         payload.data[0].locations.forEach(item => {
  //           item.rooms.forEach(itm => {
  //             if (itm._id === this.admitFormGroup.controls['room'].value._id) {
  //               itm.beds.forEach(bed => {
  //                 if (
  //                   bed._id === this.admitFormGroup.controls['bed'].value._id
  //                 ) {
  //                   bed.isAvailable = false;
  //                   bed.occupant = value.occupant;
  //                   bed.state = 'In-use';
  //                   this._bedOccupancyService
  //                     .update(payload.data[0])
  //                     .then(completed => {
  //                       this.admitBtnText = 'Admit';
  //                       this.disableAdmitBtn = false;
  //                       this._notification('Success', value.msg);
  //                     });
  //                 }
  //               });
  //             }
  //           });
  //         });
  //       }
  //     });
  // }

  // Notification
  private _notification(type: String, text: String): void {
    this._facilitiesService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
