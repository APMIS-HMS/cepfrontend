import { CountryServiceFacadeService } from './../../system-modules/service-facade/country-service-facade.service';
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
	countries: any[] = [];
	states: any[] = [];
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
		private _route: ActivatedRoute,
		private _countryServiceFacade: CountryServiceFacadeService
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
		this.facilityForm1.controls.facilitycountry.valueChanges.subscribe(country => {
			this._countryServiceFacade.getOnlyStates(country).then((payload: any) => {
				console.log(payload);
				this.states = payload;
			}).catch(error => {

			});
		})
		this._getCountries();
	}

	_getCountries() {
		this._countryServiceFacade.getOnlyCountries().then((payload: any) => {
			console.log(payload);
			this.countries = payload;
		}).catch(error => {
			console.log(error);
		});
	}
	close_onClick() {
		this.closeModal.emit(true);
	}
	autoCompleteCallback1(selectedData: any) {
		//do any necessery stuff.
		console.log(selectedData);
		if (selectedData.response) {
			let res = selectedData;
			console.log(res.data.address_components[0].types[0]);
			if (res.data.address_components[0].types[0] === 'route') {
				let streetAddress = res.data.address_components[0].long_name;
				let city = res.data.address_components[1].long_name;
				let country = res.data.address_components[4].long_name;
				let state = res.data.address_components[3].long_name;

				this.facilityForm1.controls.facilitystreet.setValue(streetAddress);
				this.facilityForm1.controls.facilitycity.setValue(city);
				this.facilityForm1.controls.facilitycountry.setValue(country);
				this.facilityForm1.controls.facilitystate.setValue(state);
			} else {
				let streetAddress = res.data.vicinity;
				let city = res.data.address_components[0].long_name;
				let country = res.data.address_components[3].long_name;
				let state = res.data.address_components[2].long_name;

				this.facilityForm1.controls.facilitystreet.setValue(streetAddress);
				this.facilityForm1.controls.facilitycity.setValue(city);
				this.facilityForm1.controls.facilitycountry.setValue(country);
				this.facilityForm1.controls.facilitystate.setValue(state);
			}
		}
	}

	compareState(l1: any, l2: any) {
		return l1.includes(l2);
	  }

	save(form) {
		console.log(form)
	}
}
