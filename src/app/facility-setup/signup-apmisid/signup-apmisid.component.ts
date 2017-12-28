import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'

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
	) { }

	ngOnInit() {
		this.facilityForm1 = this.formBuilder.group({
			facilityname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]]
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	facilityInfo_show(){
		this.facilityInfo.emit(true);
	}

}
