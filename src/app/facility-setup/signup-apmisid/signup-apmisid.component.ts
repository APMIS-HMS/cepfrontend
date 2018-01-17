import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'
import { PersonService } from 'app/services/facility-manager/setup';
import { FacilityFacadeService } from 'app/system-modules/service-facade/facility-facade.service';

@Component({
	selector: 'app-signup-apmisid',
	templateUrl: './signup-apmisid.component.html',
	styleUrls: ['./signup-apmisid.component.scss']
})
export class SignupApmisid implements OnInit {

	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() facilityInfo: EventEmitter<boolean> = new EventEmitter<boolean>();

	errMsg: string;
	mainErr = true;

	public facilityForm1: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _personService: PersonService,
		private _facilityFacadeService:FacilityFacadeService
	) { }

	ngOnInit() {
		this.facilityForm1 = this.formBuilder.group({
			apmisId: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]]
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	facilityInfo_show(form) {
		this._personService.find({
			query: {
				'apmisId': form.apmisId
			}
		}).then(payload => {
			this._facilityFacadeService.facilityCreatorApmisID = '';
			this._facilityFacadeService.facilityCreatorPersonId = '';
			console.log(payload);
			if(payload.data.length > 0){
				this._facilityFacadeService.facilityCreatorApmisID = form.apmisId;
				this._facilityFacadeService.facilityCreatorPersonId = payload.data[0]._id;
				this.facilityInfo.emit(true);
			}
		}, error => {
			this._facilityFacadeService.facilityCreatorApmisID = '';
			this._facilityFacadeService.facilityCreatorPersonId = '';
		});
		
	}

}
