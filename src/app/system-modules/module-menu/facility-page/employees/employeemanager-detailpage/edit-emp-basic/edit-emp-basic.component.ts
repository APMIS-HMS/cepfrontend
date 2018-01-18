import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-edit-emp-basic',
	templateUrl: './edit-emp-basic.component.html',
	styleUrls: ['./edit-emp-basic.component.scss']
})
export class EditEmpBasicComponent implements OnInit {
	@Input() selectedPerson: any;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	mainErr = true;
	errMsg = "";

	public facilityForm1: FormGroup;
	userSettings: any = {
		geoCountryRestriction: [GEO_LOCATIONS],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	};

	constructor(private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.facilityForm1 = this.formBuilder.group({

			firstname: [this.selectedPerson.firstName, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			lastname: [this.selectedPerson.lastName, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			othernames: [this.selectedPerson.otherNames, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			email: [this.selectedPerson.email, [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
			// network: ['', [<any>Validators.minLength(2)]],
			status: ['', [<any>Validators.required]],
			dept: ['', [<any>Validators.required]],
			phone: [this.selectedPerson.primaryContactPhoneNo, [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	save(form){

	}

}
