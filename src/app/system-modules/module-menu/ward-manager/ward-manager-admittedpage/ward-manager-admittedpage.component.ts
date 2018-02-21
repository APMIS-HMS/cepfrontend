import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BedOccupancyService, InPatientService, FacilitiesService, InPatientListService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, User } from './../../../../models/index';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import * as myGlobals from '../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-ward-manager-admittedpage',
	templateUrl: './ward-manager-admittedpage.component.html',
	styleUrls: ['./ward-manager-admittedpage.component.scss']
})

export class WardManagerAdmittedpageComponent implements OnInit {
	@Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
	public frmNewAdmit: FormGroup;
	dischargePatient = false;
	filterFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	user: User = <User>{};
	employeeDetails: any = <any>{};
	admittedPatient: any[] = [];
	filterAdmittedPatient: any[];
	wardRoomLocationItems: any[] = [];
	wardRoomBedLocationItems: any[] = [];
	wardLocationItems: any[] = [];
	wardVal = new FormControl();
	roomVal = new FormControl();
	searchControl = new FormControl();
	loading: Boolean = false;
	selectedWard: any;

	constructor(private fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _wardEventEmitter: WardEmitterService,
		private _inPatientService: InPatientService,
		private _bedOccupancyService: BedOccupancyService,
    private _facilitiesService: FacilitiesService,
    private _authFacadeService: AuthFacadeService,
    private _systemModuleService: SystemModuleService,
    private _inPatientListService: InPatientListService
		// private gvariable: globalConfig
	) {
		// this._inPatientService.listenerCreate.subscribe(payload => {
		// 	this.getAdmittedItems(this.selectedWard);
		// });

		// this._inPatientService.listenerUpdate.subscribe(payload => {
		// 	this.getAdmittedItems(this.selectedWard);
    // });
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      if (!!res._id) {
        this.employeeDetails = res;
      }
    }).catch(err => { });
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this._wardEventEmitter.setRouteUrl('Admitted Patients');

		this._wardEventEmitter.announceWard.subscribe(val => {
      console.log(val);
			this.selectedWard = val;
			this.getAdmittedItems(val);
			this.getwardLocationItems(val);
		});

		if (this.selectedWard === undefined) {
      console.log(this.employeeDetails);
      if (!!this.employeeDetails._id) {
        const wardCheckedIn = this.employeeDetails.wardCheckIn.filter(x => x.isOn)[0];
        const wardType = {
          type: 'ward',
          typeObject: wardCheckedIn
        }
        this.getAdmittedItems(wardType);
        this.getwardLocationItems(wardType);
      }
		}

		// this.searchControl.valueChanges.subscribe(searchText => {
		// 	this.filterInPatientList(searchText);
		// });
	}

	onWardChange(param) {
		this.filterAdmittedPatient = [];
		this._bedOccupancyService.find({ query: {'facilityId._id': this.facility._id }}).then(payload => {
			if (payload.data.length > 0) {
				this.admittedPatient = [];
				payload.data[0].locations.forEach(item => {
					if (item.minorLocationId === param) {
						this.wardRoomLocationItems = item.rooms;
						this._inPatientService.find({ query: {'facilityId._id': this.facility._id}}).then(res => {
							res.data.forEach(inPatientItem => {
								inPatientItem.transfers.forEach(transferItem => {
									if (transferItem.minorLocationId === param) {
										this.filterAdmittedPatient.push(inPatientItem);
									}
								})
								if (this.filterAdmittedPatient.length === 0) {
									this.getAdmittedItems(this.selectedWard);
								}else {
									this.admittedPatient = this.filterAdmittedPatient;
								}
							});
						});
					}
				});
			}
		});
	}

	onRoomChange(param) {
		this.filterAdmittedPatient = [];
		this._bedOccupancyService.find({ query: { 'facilityId._id': this.facility._id } }).then(payload => {
			if (payload.data !== []) {
				this.admittedPatient = []
				payload.data[0].locations.forEach(item => {
					item.rooms.forEach(itm => {
						if (itm._id.toString() === param.toString()) {
							this.wardRoomBedLocationItems = itm.beds;
							this._inPatientService.find({ query: { facilityId: this.facility._id } }).then(payload2 => {
								payload2.data.forEach(inPatientItem => {
									inPatientItem.transfers.forEach(transferItem => {
										if (transferItem.roomId.toString() === param.toString()) {
											this.filterAdmittedPatient.push(inPatientItem);
										}
									});
								});

								if (this.filterAdmittedPatient.length === 0) {
									this.getAdmittedItems(this.selectedWard);
								} else {
									this.admittedPatient =
									this.admittedPatient = this.filterAdmittedPatient;
								}
							});
						}
					});
				});
			}
		});
	}

	filterInPatientList(param) {
		this._bedOccupancyService.find({ query: { 'facilityId': this.facility._id } }).then(res => {
			if (res.data !== []) {
        this.admittedPatient = []
        console.log(res);
				// res.data[0].locations.forEach(item => {
				// 	item.rooms.forEach(itm => {
				// 		if (itm._id === this.roomVal.value) {
				// 			this.wardRoomBedLocationItems = itm.beds;
				// 			this._inPatientService.find({ query: { 'facilityId._id': this.facility._id } }).then(res2 => {
				// 				res2.data.forEach(inPatientItem => {
				// 					if (inPatientItem.patientDetails.personDetails.personFullName.includes(param)
				// 						|| inPatientItem.patientDetails.personDetails.age.toString() === param
				// 						|| inPatientItem.patientDetails.personDetails.personFullName.gender.name === param) {
				// 						this.admittedPatient.push(inPatientItem);
				// 					}
				// 				});
				// 			});
				// 		}
				// 	});
				// });
			}
		});
	}

	onClickDischargePatient() {
		this.dischargePatient = true;
	}

	close_onClick() {
		this.dischargePatient = false;
	}

	getAdmittedItems(wardCheckedIn: any) {
    this._inPatientListService.customGet({ action: 'getAdmittedPatients' }, {
      query: {
        facilityId: this.facility._id,
        currentWard: wardCheckedIn.typeObject.minorLocationId._id,
        status: myGlobals.onAdmission
      }
    }).then(res => {
        this.loading = false;
        console.log(res);
				if (res.data.length > 0) {
          this.admittedPatient = res.data
					// res.data.forEach(item => {
					// 	if (item.discharge == null) {
					// 		// wardDetails.ward = res.data.transfers[res.data.lastIndex].name;
					// 		// wardDetails.room = res.data.transfers[res.data.lastIndex].room;
					// 		// wardDetails.bed = res.data.transfers[res.data.lastIndex].bed;

					// 		this.admittedPatient = res.data;
					// 		// this.admittedPatient.wardItem = res.data.transfers[res.data.lastIndex];
					// 		// this.admittedPatient.wardDetails = res.data.transfers[res.data.lastIndex];
					// 		// this.admittedPatient.wardDetails = wardDetails;
					// 	}
					// });
				}
			});
	}

	getwardLocationItems(wardCheckedIn: any) {
		this._facilitiesService.find({ query: { _id: this.facility._id }}).then(res => {
			// if (res.data.length !== 0) {
			// 	this.wardLocationItems = res.data[0].wards;
			// }
		});
	}


}
