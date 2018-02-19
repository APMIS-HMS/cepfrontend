import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import {
	FacilitiesService, InPatientListService, InPatientService, AppointmentService
} from './../../services/facility-manager/setup/index';
import { Appointment, Facility, User } from './../../models/index';
import { LocationService } from '../../services/module-manager/setup';
import { AuthFacadeService } from '../../system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from '../../services/module-manager/setup/system-module.service';

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
	user: any = <User>{};
	employeeDetails: any = <any>{};
	employeeId: String = '';
	ward_checkout: Boolean = false;
	death_checkout: Boolean = false;
	admitFormGroup: FormGroup;
	deathFormGroup: FormGroup;
	wards: any[] = [];
  admittedWard: any = <any>{};
  admitBtn = true;
  admittingBtn = false;
  disableAdmissionBtn = false;

	loading: Boolean = true;

	constructor(
		private _facilitiesService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private _fb: FormBuilder,
    private _router: Router,
    private _systemModuleService: SystemModuleService,
		private facilityService: FacilitiesService,
		private _inPatientListService: InPatientListService,
    private _inpatientService: InPatientService,
    private _locationService: LocationService,
    private _authFacadeService: AuthFacadeService,
		private _appointmentService: AppointmentService
	) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      console.log(res);
      this.employeeDetails = res;
    }).catch(err => console.log(err));
  }

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <any>this._locker.getObject('auth');

    console.log(this.facility);

		this.admittedWard.isAdmitted = false;

		this.admitFormGroup = this._fb.group({
			ward: ['', [<any>Validators.required]],
			desc: ['']
		});

		this.deathFormGroup = this._fb.group({
			deathTime: [new Date(), [<any>Validators.required]],
			desc: ['']
		});

    console.log(this.patientDetails);
    console.log(this.employeeDetails);
		this._getWardLocation();
		this._CheckIfPatientIsAdmitted();
	}

	onClickAdmit(value: any, valid: boolean) {
		if (valid) {
      if (!!this.employeeDetails._id && !!this.patientDetails._id) {
        console.log(value);
        this.admitBtn = false;
        this.admittingBtn = true;
        this.disableAdmissionBtn = true;

        const patient = {
          action: 'sendForAdmission',
          employeeId: this.employeeDetails._id,
          patientId: this.patientDetails._id,
          facilityId: this.facility._id,
          clinicId: (!!this.selectedAppointment.clinicId) ? this.selectedAppointment.clinicId : null,
          minorLocationId: value.ward,
          description: value.desc
        };

        console.log(patient);

        this._inpatientService.customCreate(patient).then(res => {
          console.log(res);
          if (res.status === 'success') {
            this.admitFormGroup.reset();
            this.admitBtn = true;
            this.admittingBtn = false;
            this.disableAdmissionBtn = true;
            let text = this.patientDetails.personDetails.firstName + ' has been sent to ' + value.ward.name + ' ward for admission';
            res.isAdmitted = true;
            res.msg = text;
            this.admittedWard = res;
            this._systemModuleService.announceSweetProxy(text, 'success');
          }
        }).catch(err => {
          console.log(err);
        });
        // this._inPatientListService.create(patient).then(res => {
        // 	// Get Appointment
        // 	this._appointmentService.find({ query: {
        // 		'facilityId._id': this.facility._id,
        // 		'patientId._id': this.patientDetails._id,
        // 		// 'clinicId._id': (!!this.selectedAppointment.clinicId) ? this.selectedAppointment.clinicId._id : null,
        // 		isCheckedOut: false
        // 	}}).then(clinicRes => {
        // 		if (clinicRes.length > 0) {
        // 			let updateData = clinicRes.data[0];
        // 			updateData.isCheckedOut = true;
        // 			updateData.attendance.dateCheckOut = new Date();

        // 			this._appointmentService.update(updateData).then(updateRes => {
        // 				this.admitFormGroup.reset();
        // 				this.admitBtnText = 'Send <i class=\'fa fa-check-circle-o\'></i>';
        // 				let text = this.patientDetails.personDetails.firstName + ' has been sent to ' + value.ward.name + ' ward for admission';
        // 				res.isAdmitted = true;
        // 				res.msg = text;
        // 				this.admittedWard = res;
        // 				this._notification('Success', text);
        // 			}).catch(err => console.log(err));
        // 		} else {
        // 			this.admitFormGroup.reset();
        // 			this.admitBtnText = 'Send <i class=\'fa fa-check-circle-o\'></i>';
        // 			let text = this.patientDetails.personDetails.personFullName + ' has been sent to ' + value.ward.name + ' ward for admission';
        // 			res.isAdmitted = true;
        // 			res.msg = text;
        // 			this.admittedWard = res;
        // 			this._notification('Success', text);
        // 		}
        // 	}).catch(err => console.log(err));
        // }).catch(err => console.log(err));
      } else {
        this._notification('Error', 'There was a problem getting required data to admit patient. Please try again later.');
      }
		} else {
			this._notification('Error', 'Please select a ward for patient to be admitted into.');
		}
	}

	checkOutPatient(type, formData?, formDataValid?) {
		this.loading = true;
		let checkoutData;
		if (type === 'No Futher Appointment') {
			checkoutData = {
				type: 'NFA',
				checkOutTime: new Date(),
				person: this.user.data.person
			};

		} else if (type === 'Follow-Up With Appointment') {
			checkoutData = {
				type: 'FUWA',
				checkedOutTime: new Date(),
				person: this.user.data.person
			}
		} else if (type === 'death'){
			if (formDataValid){
				checkoutData = {
					type: 'Death',
					checkedOutTime: new Date(),
					person: this.user.data.person,
					deathTime: formData.deathTime,
					desc: formData.desc
				}
			}
		}

		this._appointmentService.find({ query: { '_id': this.selectedAppointment._id }}).then(clinicRes => {
			if (clinicRes.data.length > 0) {
				let updateData = clinicRes.data[0];
				updateData.isCheckedOut = true;
				updateData.checkedOut = checkoutData;
				this._appointmentService.update(updateData).then((updateRes) => {
					this._notification('Success', 'Patient Has Successfully Been Checked Out ');
					if (checkoutData.type === 'FUWA') {
						this._router.navigate(['/dashboard/clinic/schedule-appointment', updateRes._id], { queryParams: { checkedOut: true } });
					} else {
						this._router.navigate(['/dashboard/clinic/appointment']).then(() => {
						});
					}
					this.loading = false;
				});
			}
		});

	}

	private _CheckIfPatientIsAdmitted() {
    this._inPatientListService.find({ query: { facilityId: this.facility._id, patientId: this.patientDetails._id, isAdmitted: false }}).then(res => {
      this.loading = false;
      console.log(res);
			if (res.data.length > 0) {
				this._inpatientService.find({ query: { facilityId: this.facility._id, patientId: this.patientDetails._id, isDischarged: false }}).then(resp => {
          console.log(resp);
          const patientName = `${this.patientDetails.personDetails.firstName} ${this.patientDetails.personDetails.firstName}`;
					if (resp.data.length > 0) {
						const locationIndex = (resp.data[0].transfers.length > 0) ? resp.data[0].transfers.length - 1 : resp.data[0].transfers.length;
						let text = patientName + ' has been admitted to ' + resp.data[0].tranfers[locationIndex].name + ' ward';
						resp.data[0].isAdmitted = true;
						resp.data[0].msg = text;
						this.admittedWard = resp.data[0];
          } else {
            console.log('Got here');
            console.log(res.data);
            // Get minorLocation name from facility.
            let text = patientName + ' has been sent to ' + res.data[0].minorLocationId.name + ' ward for admission.';
						res.data[0].isAdmitted = true;
						res.data[0].msg = text;
						this.admittedWard = res.data[0];
					}
				}).catch(err => this._notification('Error', 'There was a problem getting admitted patient. Please try again later.'));
			} else {
				this._inpatientService.find({ query: {facilityId: this.facility._id, patientId: this.patientDetails._id, isDischarged: false }}).then(resp => {
          console.log(resp);
					if (resp.data.length > 0) {
            const minorLocation = this.facility.minorLocations.filter(x => x._id === res.data[0].minorLocationId);
						let text = this.patientDetails.personDetails.personFullName + ' has been admitted to ' + minorLocation[0].name + ' ward';
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

	getAllWards(majorLocationId) {
		this._facilitiesService.get(this.facility._id, {}).then(res => {
      this.wards = res.minorLocations.filter(x => x.locationId === majorLocationId);
      console.log(this.wards);
		}).catch(err => this._notification('Error', 'There was a problem getting all wards. Please try again later.'));
  }

  private _getWardLocation() {
    this._locationService.find({ query: { name: 'Ward' } }).then(res => {
      if (res.data.length > 0) {
        this.getAllWards(res.data[0]._id);
      }
    }).catch(err => console.log(err));
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
		this.death_checkout = false;
		this.ward_checkout = true;
	}

	deathCheckout(){
		this.death_checkout = true;
		this.ward_checkout = false;
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
