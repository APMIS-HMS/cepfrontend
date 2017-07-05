import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	CountriesService, FacilityTypesService, FacilitiesService, GenderService,
	PersonService, TitleService, UserService, MaritalStatusService, FacilityModuleService
} from '../../services/facility-manager/setup/index';
import { Address, Role, Facility, Gender, ModuleViewModel, User, Title, MaritalStatus, Person } from '../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-contact-info',
	templateUrl: './contact-info.component.html',
	styleUrls: ['../facility-setup.component.scss', './contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() inputFacility: Facility = <Facility>{};


	selectedCountry_key = []; //states of the selected country load key
	stateAvailable = false; //boolean variable to check if the list of user selected state exists in code

	show = false;
	@ViewChild('showhideinput') input;

	countries: any[] = [];
	titles: Title[] = [];
	genders: Gender[] = [];
	cities: any[] = [];
	lgas: any[] = [];
	maritalStatuses: MaritalStatus[] = [];
	facilityTypes: any[] = [];
	ownerships: any[] = [];
	selectedFacilityType: any = {};
	selectedCountry: any = {};
	selectedFacility: Facility = <Facility>{};

	frm_numberVerifier: FormGroup;
	InputedToken: string;
	errMsg: string;
	mainErr = true;
	sg1_2_show = true;
	back_key_show = false;
	next_key_show = false;

	public facilityForm1_1: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private countriesService: CountriesService,
		private genderService: GenderService,
		private titleService: TitleService,
		private maritalStatusService: MaritalStatusService,
		private userService: UserService,
		private personService: PersonService,
		private facilityTypeService: FacilityTypesService,
		private facilityModuleService: FacilityModuleService,
		public facilityService: FacilitiesService
	) { }

	ngOnInit() {
		console.log(this.inputFacility);
		this.getTitles();
		this.getGenders();
		this.getMaritalStatus();

		this.facilityForm1_1 = this.formBuilder.group({
			facilitystate: ['', [<any>Validators.required]],
			facilitylga: ['', [<any>Validators.required]],
			facilitycity: ['', [<any>Validators.required]],
			facilityaddress: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
			facilitylandmark: ['', [<any>Validators.required]],

			contactFName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.pattern('^[a-zA-Z ]+$')]],
			contactLName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.pattern('^[a-zA-Z ]+$')]],
			facilityphonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
			password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
			repass: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
		});

		this.facilityForm1_1.controls['facilitystate'].valueChanges.subscribe(payload => {
			this.cities = payload.cities;
			this.lgas = payload.lgs;
		})



		this.countriesService.findAll().then((payload) => {
			this.countries = payload.data;
			this.stateAvailable = false;
			console.log(this.countries);
			let country = this.countries.find(item => item._id === this.inputFacility.address.country);
			this.selectedCountry = country;
			console.log(this.selectedCountry);
			if (this.selectedCountry.states.length > 0) {
				this.stateAvailable = true;
			}
		})

		this.facilityForm1_1.controls['facilitystate'].valueChanges.subscribe(payload => {
			this.cities = payload.cities;
			this.lgas = payload.lgs;
		})
	}

	facilitySetup1_1(valid, val) {
		if (valid) {
			if (val.facilitystate === '' || val.facilitystate === ' ' || val.facilitylga === '' || val.facilitylga === ' ' ||
				val.facilitycity === '' || val.facilitycity === ' ' || val.facilityaddress === ' ' ||
				val.facilityaddress === '' || val.facilitylandmark === ' ' || val.facilitylandmark === '' || val.contactFName === ''
				|| val.contactFName === ' ' || val.contactLName === ''
				|| val.contactLName === ' ' || val.facilityphonNo === '' || val.facilityphonNo === ' ' || val.password === '' ||
				val.password === ' ' || val.repass === '' || val.repass === ' ') {
				this.mainErr = false;
				this.errMsg = 'you left out a required field';
			} else if (val.password !== val.repass) {
				this.mainErr = false;
				this.errMsg = 'your passwords do not match';
			} else {
				this.sg1_2_show = false;
				this.next_key_show = true;
				this.back_key_show = false;
				this.mainErr = true;

				let model: Facility = <Facility>{
					name: this.inputFacility.name,
					email: this.inputFacility.email,
					contactPhoneNo: val.facilityphonNo,
					contactFullName: val.contactLName + ' ' + val.contactFName,
					facilityTypeId: this.inputFacility.facilityTypeId,
					facilityClassId: this.inputFacility.facilityClassId,
					address: <Address>({
						state: this.facilityForm1_1.controls['facilitystate'].value._id,
						lga: this.facilityForm1_1.controls['facilitylga'].value,
						city: this.facilityForm1_1.controls['facilitycity'].value,
						street: this.facilityForm1_1.controls['facilityaddress'].value,
						landmark: this.facilityForm1_1.controls['facilitylandmark'].value,
						country: this.inputFacility.address.country,
					}),
					website: this.inputFacility.website,
					shortName: this.inputFacility.shortName,

				}
				this.facilityService.create(model).then((payload) => {
					this.selectedFacility = payload;

					// create person and user
					let personModel = <Person>{
						titleId: this.titles[0]._id,
						firstName: this.facilityForm1_1.controls['contactFName'].value,
						lastName: this.facilityForm1_1.controls['contactLName'].value,
						genderId: this.genders[0]._id,
						homeAddress: model.address,
						phoneNumber: model.contactPhoneNo,
						lgaOfOriginId: this.facilityForm1_1.controls['facilitylga'].value,
						nationalityId: this.inputFacility.address.country,
						stateOfOriginId: this.facilityForm1_1.controls['facilitystate'].value._id,
						email: model.email,
						maritalStatusId: this.maritalStatuses[0]._id
					};
					let userModel = <User>{
						email: model.email,
						password: this.facilityForm1_1.controls['password'].value
					};

					this.personService.create(personModel).then((ppayload) => {
						userModel.personId = ppayload._id;
						console.log("Person");
						if (userModel.facilitiesRole === undefined) {
							userModel.facilitiesRole = [];
							console.log("facilitiesRole is undefine");
						}
						userModel.facilitiesRole.push(<Role>{ facilityId: payload._id })
						this.userService.create(userModel).then((upayload) => {
							console.log("user created");
						});


					});
				},
					error => {
						console.log(error);
					});

			}
		} else {
			this.mainErr = false;
		}
	}

	getTitles() {
		this.titleService.findAll().then((payload: any) => {
			this.titles = payload.data;
		})
	}

	getGenders() {
		this.genderService.findAll().then((payload) => {
			this.genders = payload.data;
		})
	}

	getMaritalStatus() {
		this.maritalStatusService.findAll().then((payload: any) => {
			this.maritalStatuses = payload.data;
		})
	}

	getCountries() {
		this.countriesService.findAll().then((payload) => {
			this.countries = payload.data;
			console.log(this.countries);
		})
	}

	back_facilityForm1_1() {
		this.sg1_2_show = false;
		this.back_key_show = true;
		this.next_key_show = false;
	}

	onStateChange(value: any) {
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	toggleShow(e) {
		this.show = !this.show;
		if (this.show) {
			this.input.nativeElement.type = 'text';
		} else {
			this.input.nativeElement.type = 'password';
		}
	}

}
