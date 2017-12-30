import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Facility } from '../../models/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-facility-info',
	templateUrl: './facility-info.component.html',
	styleUrls: ['../facility-setup.component.scss']
})
export class FacilityInfoComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() inputFacility: Facility = <Facility>{};

	errMsg: string;
	mainErr = true;

	public facilityForm1: FormGroup;
	userSettings: any = {
		geoCountryRestriction: [GEO_LOCATIONS],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	  };
	constructor(
		private formBuilder: FormBuilder,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this.facilityForm1 = this.formBuilder.group({

			facilityname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			facilityemail: ['', [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
			facilitywebsite: ['', [<any>Validators.required, <any>Validators.pattern(WEBSITE_REGEX)]],
			// network: ['', [<any>Validators.minLength(2)]],
			address: ['', [<any>Validators.required]],
			cac: ['', [<any>Validators.required]],
			facilitystreet: ['', [<any>Validators.required]],
			facilitycity: ['', [<any>Validators.required]],
			facilitystate: ['', [<any>Validators.required]],
			facilitycountry: ['', [<any>Validators.required]],
			facilityphonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	autoCompleteCallback1(selectedData:any) {
		//do any necessery stuff.
		console.log(selectedData);
	}

	save(form){
		console.log(form)
	}
}
