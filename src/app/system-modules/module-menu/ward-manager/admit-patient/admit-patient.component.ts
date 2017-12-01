import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { WardAdmissionService, InPatientService, InPatientListService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility, InPatient, WardTransfer, User} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-admit-patient',
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
	mainErr = true;
	errMsg = 'You have unresolved errors';
	admitBtnText: String = '<i class="fa fa-plus"></i> Admit Patient';
	loadContent: Boolean = true;
	loadAvailableBeds: Boolean = true;
	disableAdmitBtn: Boolean = false;

	constructor(
		private _wardAdmissionService: WardAdmissionService,
		private fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private router: Router,
		private _facilitiesService: FacilitiesService,
		private _inPatientService: InPatientService,
		private _inPatientListService: InPatientListService
	) {
		// this._wardAdmissionService.listenerCreate.subscribe(payload => {
		// 	this.getwardRoomLocationItems();
		// });

		// this._wardAdmissionService.listenerUpdate.subscribe(payload => {
		// 	this.getwardRoomLocationItems();
		// });
	}

	ngOnInit() {
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.miniFacility = <Facility> this._locker.getObject('miniFacility');
		this.employeeDetails = this._locker.getObject('loginEmployee');
		this.user = <User>this._locker.getObject('auth');

		// this.getwardRoomLocationItems();
		this.getWardsDetails();
		console.log(this.inPatientItem);

		this.admitFormGroup = this.fb.group({
			ward: [''],
			room: ['', [<any>Validators.required]],
			bed: ['', [<any>Validators.required]],
			desc: ['', [<any>Validators.required]],
		});

		this.admitFormGroup.controls['ward'].valueChanges.subscribe(val => {
			this.loadAvailableBeds = true;
			this.beds = [];
			this.rooms = [];
			if (val !== '') {
				this.loadAvailableBeds = false;
				this.rooms = this.wards.filter(x => x.minorLocationId._id === val)[0].rooms;
				this.admitFormGroup.controls['room'].setValue('');
				this.admitFormGroup.controls['bed'].setValue('');
			}
		});

		if (!!this.inPatientItem) {
			setTimeout(e => {
				this.admitFormGroup.controls['ward'].setValue(this.inPatientItem.wardId._id);
			}, 1000);
		}

		this.admitFormGroup.controls['room'].valueChanges.subscribe(val => {
			this.loadAvailableBeds = false;
			this.beds = [];
			if (val !== '') {
				this.beds = this.rooms.filter(x => x._id === val._id)[0].beds;
				this.availableBeds = this.beds.filter(x => x.isAvailable);
				this.occupiedBeds = this.beds.filter(x => !x.isAvailable);
			}
		});
	}



	// onWardChange(param) {
	// 	console.log(param);
	// 	this._wardAdmissionService.find({ query: { facilityId: this.facility._id } })
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
	// 	this._wardAdmissionService.find({ query: { facilityId: this.facility._id } }).then(res => {
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
			this.disableAdmitBtn = true;
			this.admitBtnText = 'Admitting... <i class="fa fa-spinner fa-spin"></i>';
			this.mainErr = true;
			if (this.inPatientItem.typeChecker === myGlobals.onAdmission) {
				this._inPatientListService.find({ query: {
					'facilityId._id': this.facility._id,
					'patientId._id': this.inPatientItem.patientId._id,
					isAdmitted: false
				}}).then(payload1 => {
					// Delete Items that are not relevant in the room
					delete value.room.beds;

					delete this.inPatientItem.patientId.personDetails.countryItem;
					delete this.inPatientItem.patientId.personDetails.nationalityObject;
					delete this.inPatientItem.patientId.personDetails.addressObj;
					delete this.inPatientItem.patientId.personDetails.nationality;
					delete this.inPatientItem.patientId.personDetails.maritalStatus;
					delete this.inPatientItem.patientId.personDetails.nextOfKin;
					delete this.inPatientItem.patientId.personDetails.genderId;
					delete this.inPatientItem.patientId.personDetails.homeAddress;

					payload1.data[0].isAdmitted = true;
					payload1.data[0].admittedDate = new Date();
					this._inPatientListService.update(payload1.data[0]).then(callback1 => {
						this.inPatient.facilityId = this.miniFacility;
						this.inPatient.statusId = myGlobals.onAdmission;
						this.inPatient.admitByEmployeeId = this._facilitiesService.trimEmployee(this.employeeDetails);
						this.inPatient.patientId = this.inPatientItem.patientId;
						this._wardTransfer.minorLocationId = value.ward;
						this._wardTransfer.roomId = value.room;
						this._wardTransfer.bedId = value.bed;
						this._wardTransfer.description = value.desc;
						this._wardTransfer.checkInDate = new Date();
						this.inPatient.transfers = [];
						this.inPatient.transfers.push(this._wardTransfer);
						this.inPatient.admissionDate = new Date();
						this._inPatientService.create(this.inPatient).then(callback => {
							console.log(callback);
							let patient = this.inPatientItem.patientId.personDetails.personFullName;
							let text = 'You have successfully admitted ' + patient;
							let wardRoom = ' into ' + value.bed.name + ' in ' + value.room.name;
							const fullText = text + wardRoom;
							console.log(fullText);
							const msgObj = {
								msg: fullText,
								occupant: this.inPatientItem.patientId,
								bed: value.bed,
								room: value.room
							}
							this.updateWardAdissionService(msgObj);
							this.close_onClick();
						});
					});
				});
			} else if (this.inPatientItem.typeChecker === myGlobals.transfer) {
				console.log('Transfer');
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
				// 				console.log(err);
				// 			})
				// 			.catch(err => {
				// 				console.log(err);
				// 			});
				// 	});
			}
		} else {
			this.mainErr = false;
		}
	}

	// getwardRoomLocationItems() {
	// 	if (this.inpatientItem.typeChecker === myGlobals.transfer) {
	// 		this._inPatientService.get(this.inpatientItem._id, {}).then(payload => {
	// 			const rooms = payload.transfers[payload.lastIndex].proposeWard.ward.wardDetails.rooms;
	// 			console.log(rooms);
	// 			// this.wardRoomLocationItems = rooms;
	// 		});
	// 	} else if (this.inpatientItem.typeChecker === myGlobals.onAdmission) {
	// 		this._inPatientListService.get(this.inpatientItem._id, {}).then(payload => {
	// 			console.log(payload);
	// 			// this.wardRoomLocationItems = payload.wardId;
	// 		});
	// 	}
	// }

	getWardsDetails() {
		this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
			if (res.data.length > 0) {
				this.loadContent = false;
				this.wards = res.data[0].locations;
			}
		});
	}

	updateWardAdissionService(value: any) {
		this._wardAdmissionService.find({ query: { 'facilityId._id': this.facility._id } }).then(payload => {
			if (payload.data.length > 0) {
				payload.data[0].locations.forEach(item => {
					item.rooms.forEach(itm => {
						if (itm._id === this.admitFormGroup.controls['room'].value._id) {
							itm.beds.forEach(bed => {
								if (bed._id === this.admitFormGroup.controls['bed'].value._id) {
									bed.isAvailable = false;
									bed.occupant = value.occupant;
									bed.state = 'In-use';
									this._wardAdmissionService.update(payload.data[0]).then(completed => {
										this.admitBtnText = 'Admit';
										this.disableAdmitBtn = false;
										this._notification('Success', value.msg);
									});
								}
							});
						}
					});
				});
			}
		});
	}

	// Notification
	private _notification(type: String, text: String): void {
		this._facilitiesService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
}
