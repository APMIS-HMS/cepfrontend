import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	CountriesService, FacilityTypesService, FacilitiesService
} from '../../services/facility-manager/setup/index';
import { FacilityOwnershipService } from '../../services/module-manager/setup/index';
import { Facility } from '../../models/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx'

@Component({
	selector: 'app-facility-info',
	templateUrl: './facility-info.component.html',
	styleUrls: ['../facility-setup.component.scss']
})
export class FacilityInfoComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() inputFacility: Facility = <Facility>{};

	facility: Facility = <Facility>{};
	InputedToken: string;
	errMsg: string;
	mainErr = true;
	sg1_show = true;
	sg1_1_show = false;
	isEmailExist = true;

	stateAvailable = false;
	selectedCountry: any = {};

	countries: any[] = [];
	facilityTypes: any[] = [];
	ownerships: any[] = [];
	selectedFacilityType: any = {};
	facilityInfoData: any = {};

	public facilityForm1: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private facilityOwnershipService: FacilityOwnershipService,
		private countriesService: CountriesService,
		private facilityTypeService: FacilityTypesService,
		public facilityService: FacilitiesService
	) { }

	ngOnInit() {
		this.prime();
		this.facilityForm1 = this.formBuilder.group({

			facilityname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			facilityalias: ['', [<any>Validators.minLength(2)]],
			facilitytype: ['', [<any>Validators.required]],
			facilitycategory: ['', [<any>Validators.required]],

			facilityownership: ['', [<any>Validators.required]],
			facilityemail: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			facilitywebsite: ['', [<any>Validators.pattern('^[a-zA-Z0-9\-\.]+\.(com|org|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
			facilitycountry: ['', [<any>Validators.required]]
		});

		this.facilityForm1.controls['facilitycountry'].valueChanges.subscribe((value: any) => {
			this.stateAvailable = false;
			const country = this.countries.find(item => item._id === value);
			this.selectedCountry = country;
			if (this.selectedCountry.states.length > 0) {
				this.stateAvailable = true;
			}

		});

		this.facilityForm1.controls['facilityemail'].valueChanges.subscribe(value => {
			this.onCheckEmailAddress(value);
		});
		this.facilityForm1.controls['facilitytype'].valueChanges.subscribe(value => {
			this.selectedFacilityType = value;
		})
	}

	onCheckEmailAddress(value) {
		this.facilityService.find({ query: { email: value } }).then(payload => {
			if (payload.data.length > 0) {
				this.isEmailExist = false;
			} else {
				this.isEmailExist = true;
			}
		})
	}

	facilitySetup1(valid, val, selectedCountry) {
		if (valid) {
			if (val.facilityname === '' || val.facilityname === ' ' || val.facilityownership === '' ||
				val.facilityownership === ' ' || val.facilitytype === '' || val.facilitytype === ' ' ||
				val.facilitycategory === ' ' || val.facilitycategory === '' || val.facilityemail === ' ' ||
				val.facilityemail === '' || val.facilitycountry === '' || val.facilitycountry === ' ') {
				this.mainErr = false;
				this.errMsg = 'you left out a required field';
			} else {
				this.inputFacility.name = this.facilityForm1.controls['facilityname'].value;
				this.inputFacility.shortName = this.facilityForm1.controls['facilityalias'].value;
				this.inputFacility.facilityTypeId = this.facilityForm1.controls['facilitytype'].value._id;
				this.inputFacility.facilityClassId = this.facilityForm1.controls['facilitycategory'].value;
				this.inputFacility.email = this.facilityForm1.controls['facilityemail'].value;
				this.inputFacility.website = this.facilityForm1.controls['facilitywebsite'].value;
				this.inputFacility.facilityOwnershipId = this.facilityForm1.controls['facilityownership'].value;
				if (this.inputFacility.address === undefined) {
					this.inputFacility.address = {};
				}

				this.inputFacility.address.country = this.facilityForm1.controls['facilitycountry'].value;

				this.sg1_show = false;
				this.mainErr = true;
				this.sg1_1_show = true;


			}
		} else {
			this.mainErr = false;
		}
	}
	prime() {
		const ownership$ = Observable.fromPromise(this.facilityOwnershipService.findAll());
		const country$ = Observable.fromPromise(this.countriesService.findAll());
		const facilityType$ = Observable.fromPromise(this.facilityTypeService.findAll());

		Observable.forkJoin([ownership$, country$, facilityType$]).subscribe((results: any) => {
			this.ownerships = results[0].data;
			this.countries = results[1].data;
			this.facilityTypes = results[2].data;

			if (this.inputFacility.name !== undefined && this.inputFacility.name.length > 0) {
				this.facilityForm1.controls['facilityname'].setValue(this.inputFacility.name);
				this.facilityForm1.controls['facilityalias'].setValue(this.inputFacility.shortName)
				if (this.facilityTypes.length > 0) {
					const filterFacilityTypes = this.facilityTypes.filter(x => x._id === this.inputFacility.facilityTypeId);
					if (filterFacilityTypes.length > 0) {
						this.facilityForm1.controls['facilitytype'].setValue(filterFacilityTypes[0]);
					}
				}

				this.facilityForm1.controls['facilitycategory'].setValue(this.inputFacility.facilityClassId);
				this.facilityForm1.controls['facilityemail'].setValue(this.inputFacility.email);
				this.facilityForm1.controls['facilitywebsite'].setValue(this.inputFacility.website);
				this.facilityForm1.controls['facilityownership'].setValue(this.inputFacility.facilityOwnershipId);
				// this.inputFacility.address = {};
				this.facilityForm1.controls['facilitycountry'].setValue(this.inputFacility.address.country);
			}
		}
		)
	}


	onFacilityTypeChange(value: any) {
		const facilityType = this.facilityTypes.find(item => item._id === value);
		this.selectedFacilityType = facilityType;
	}


	close_onClick() {
		this.closeModal.emit(true);
	}

}
