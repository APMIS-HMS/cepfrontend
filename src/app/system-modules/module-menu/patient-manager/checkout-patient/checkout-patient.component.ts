import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import {
	FacilitiesService, InPatientListService, InPatientService, AppointmentService
} from '../../../../services/facility-manager/setup/index';
import { Appointment, Facility, User } from '../../../../models/index';

@Component({
	selector: 'app-checkout-patient',
	templateUrl: './checkout-patient.component.html',
	styleUrls: ['./checkout-patient.component.scss']
})
export class CheckoutPatientComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedAppointment: Appointment = <Appointment>{};
	@Input() patientDetails: any;

	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	user: User = <User>{};
	employeeDetails: any = <any>{};
	employeeId: String = '';
	ward_checkout: Boolean = false;
	admitFormGroup: FormGroup;
	wards: any[] = [];
	admittedWard: any = <any>{};
	admitBtnText: String = 'Send <i class="fa fa-check-circle-o"></i>';
	loading: Boolean = true;

	constructor(
		private _facilitiesService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private _fb: FormBuilder,
		private _router: Router,
		private facilityService: FacilitiesService,
		private _inPatientListService: InPatientListService,
		private _inpatientService: InPatientService,
		private _appointmentService: AppointmentService
	) { }

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.miniFacility = <Facility>this._locker.getObject('miniFacility');
		this.employeeDetails = this._locker.getObject('loginEmployee');
		this.user = <User>this._locker.getObject('auth');

		this.admittedWard.isAdmitted = false;

		this.admitFormGroup = this._fb.group({
			ward: ['', [<any>Validators.required]],
			desc: ['']
		});

		this.getAllWards();
		this._CheckIfPatientIsAdmitted();
	}

	onClickAdmit(value: any, valid: boolean) {
		if (valid) {
			this.admitBtnText = 'Sending... <i class="fa fa-spinner fa-spin"></i>';
			// Delete irrelevant data from employee
			delete this.employeeDetails.workSpaces;
			delete this.employeeDetails.department;
			delete this.employeeDetails.professionObject;
			delete this.employeeDetails.employeeFacilityDetails;
			delete this.employeeDetails.units;
			delete this.employeeDetails.consultingRoomCheckIn;
			delete this.employeeDetails.storeCheckIn;
			delete this.employeeDetails.workbenchCheckIn;
			delete this.employeeDetails.wardCheckIn;
			delete this.employeeDetails.employeeDetails.countryItem;
			delete this.employeeDetails.employeeDetails.nationalityObject;
			delete this.employeeDetails.employeeDetails.nationality;
			delete this.employeeDetails.employeeDetails.homeAddress;
			delete this.employeeDetails.employeeDetails.gender;
			delete this.employeeDetails.employeeDetails.maritalStatus;
			delete this.employeeDetails.employeeDetails.nextOfKin;

			const patient = {
				employeeId: this.employeeDetails,
				patientId: this.patientDetails,
				facilityId: this.miniFacility,
				clinicId: (!!this.selectedAppointment.clinicId) ? this.selectedAppointment.clinicId : null,
				unitId: this.employeeDetails.unitDetails[0],
				wardId: value.ward,
				description: value.desc
			};

			this._inPatientListService.create(patient).then(res => {
				// Get Appointment
				this._appointmentService.find({ query: {
					'facilityId._id': this.facility._id,
					'patientId._id': this.patientDetails._id,
					// 'clinicId._id': (!!this.selectedAppointment.clinicId) ? this.selectedAppointment.clinicId._id : null,
					isCheckedOut: false
				}}).then(clinicRes => {
					if (clinicRes.length > 0) {
						let updateData = clinicRes.data[0];
						updateData.isCheckedOut = true;
						updateData.attendance.dateCheckOut = new Date();

						this._appointmentService.update(updateData).then(updateRes => {
							this.admitFormGroup.reset();
							this.admitBtnText = 'Send <i class="fa fa-check-circle-o"></i>';
							let text = this.patientDetails.personDetails.personFullName + ' has been sent to ' + value.ward.name + ' ward for admission';
							res.isAdmitted = true;
							res.msg = text;
							this.admittedWard = res;
							this._notification('Success', text);
						}).catch(err => console.log(err));
					} else {
						this.admitFormGroup.reset();
						this.admitBtnText = 'Send <i class="fa fa-check-circle-o"></i>';
						let text = this.patientDetails.personDetails.personFullName + ' has been sent to ' + value.ward.name + ' ward for admission';
						res.isAdmitted = true;
						res.msg = text;
						this.admittedWard = res;
						this._notification('Success', text);
					}
				}).catch(err => console.log(err));
			}).catch(err => console.log(err));
		} else {
			this._notification('Error', 'Please select a ward for patient to be admitted into.');
		}
	}

	private _CheckIfPatientIsAdmitted() {
		this._inPatientListService.find({ query: {
			'facilityId._id': this.facility._id,
			'patientId._id': this.patientDetails._id
		}}).then(res => {
			this.loading = false;
			if (res.data.length > 0) {
				this._inpatientService.find({ query: {
					'facilityId._id': this.facility._id,
					'patientId._id': this.patientDetails._id,
					isDischarged: false
				}}).then(resp => {
					const patientName = this.patientDetails.personDetails.personFullName;
					if (resp.data.length > 0) {
						const locationIndex = (resp.data[0].transfers.length > 0) ? resp.data[0].transfers.length - 1 : resp.data[0].transfers.length;
						let text = patientName + ' has been admitted to ' + resp.data[0].tranfers[locationIndex].name + ' ward';
						resp.data[0].isAdmitted = true;
						resp.data[0].msg = text;
						this.admittedWard = resp.data[0];
					} else {
						let text = patientName + ' has been sent to ' + res.data[0].wardId.name + ' ward for admission.';
						res.data[0].isAdmitted = true;
						res.data[0].msg = text;
						this.admittedWard = res.data[0];
					}
				}).catch(err => this._notification('Error', 'There was a problem getting admitted patient. Please try again later.'));
			} else {
				this._inpatientService.find({ query: {
					'facilityId._id': this.facility._id,
					'patientId._id': this.patientDetails._id,
					isDischarged: false
				}}).then(resp => {
					if (resp.data.length > 0) {
						let text = this.patientDetails.personDetails.personFullName + ' has been admitted to ' + res.data[0].wardId.name + ' ward';
						resp.data[0].isAdmitted = true;
						resp.data[0].msg = text;
						this.admittedWard = resp.data[0];
					} else {
						this.admittedWard.isAdmitted = false;
					}
				}).catch(err => this._notification('Error', 'There was a problem getting admitted patient. Please try again later.'));
			}
		}).catch(err => this._notification('Error', 'There was a problem getting admitted patient. Please try again later.'));
	}

	getAllWards() {
		this._facilitiesService.get(this.facility._id, {}).then(res => {
			this.wards = res.wards;
		}).catch(err => this._notification('Error', 'There was a problem getting all wards. Please try again later.'));
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}

	checkoutWard() {
		this.ward_checkout = true;
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
