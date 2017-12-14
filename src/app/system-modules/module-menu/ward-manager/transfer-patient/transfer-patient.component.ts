import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { WardAdmissionService, FacilitiesService, InPatientService } from '../../../../services/facility-manager/setup/index';
import { Facility, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-transfer-patient',
	templateUrl: './transfer-patient.component.html',
	styleUrls: ['./transfer-patient.component.scss']
})
export class TransferPatientComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedPatient: any;
	transferFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	user: User = <User>{};
	employeeDetails: any = <any>{};
	inPatientId: string;
	mainErr = true;
	errMsg = 'you have unresolved errors';
	wards: any[];
	disableTransferBtn: boolean = false;
	transferBtnText: String = '<i class="fa fa-share" aria-hidden="true"></i> Transfer Patient';

	constructor(
		private fb: FormBuilder,
		private _route: Router,
		private _router: ActivatedRoute,
		private _facilitiesService: FacilitiesService,
		private _wardAdmissionService: WardAdmissionService,
		private _locker: CoolLocalStorage,
		private _inPatientService: InPatientService
	) { }

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.miniFacility = <Facility>this._locker.getObject('miniFacility');
		this.employeeDetails = this._locker.getObject('loginEmployee');
		this.user = <User>this._locker.getObject('auth');

		this.transferFormGroup = this.fb.group({
			ward: ['', [<any>Validators.required]]
		});

		this._router.params.subscribe(params => {
			this.inPatientId = params.id;
		});

		this.getFacilityWard();
	}

	onTransfer(value: any, valid: boolean) {
		if (valid) {
			console.log(value);
			this.disableTransferBtn = true;
			this.transferBtnText = 'Transfering... <i class="fa fa-spinner fa-spin"></i>';
			this._inPatientService.find({ query: { _id: this.inPatientId }}).then(payload => {
				payload.data[0].statusId = myGlobals.transfer;
				this._inPatientService.update(payload.data[0]).then(payload2 => {
					this.disableTransferBtn = false;
					this.transferBtnText = '<i class="fa fa-share" aria-hidden="true"></i> Transfer Patient';
					const name = this.selectedPatient.patientId.personDetails.personFullName;
					let text = 'You have successfully transfered ' + name + ' to ' + value.ward;
					this._notification('Success', text);
					this.close_onClick();
					setTimeout(e => {
						this._route.navigate(['/dashboard/ward-manager/admitted']);
					}, 2000);
				});
			});
		}
	}

	getFacilityWard() {
		this._facilitiesService.get(this.facility._id, {}).then(payload => {
			this.wards = payload.wards;
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

	onWardChange(param) {
		console.log(param);
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
