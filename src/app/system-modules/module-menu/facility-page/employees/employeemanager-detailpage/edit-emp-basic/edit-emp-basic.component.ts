import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';
import { Observable } from 'rxjs/Observable';

import {
	CountriesService, FacilitiesService, UserService,
	PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService, TitleService
} from '../../../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-edit-emp-basic',
	templateUrl: './edit-emp-basic.component.html',
	styleUrls: ['./edit-emp-basic.component.scss']
})
export class EditEmpBasicComponent implements OnInit {
	@Input() selectedPerson: any;
	@Input() departmentBool: Boolean;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	mainErr = false;
	errMsg = "";
	editEmployeeDetails = false;

	facility;
	departments: any;
	selectedEmployee;
	loading: any;

	countries: any;
	states: any;
	cities;
	lgas;
	lgasOfOrigin;
	titles;
	genders;
	maritalStatuses;

	stateAvailable;
	selectedCountry;

	public facilityForm1: FormGroup;
	public facilityForm2: FormGroup;

	userSettings: any = {
		geoCountryRestriction: [GEO_LOCATIONS],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	};

	constructor(private formBuilder: FormBuilder,
		private employeeService: EmployeeService,
		public facilityService: FacilitiesService,
		private userService: UserService,
		private countryService: CountriesService,
		private genderService: GenderService,
		private titleService: TitleService,
		private maritalStatusService: MaritalStatusService,
		private personService: PersonService,
		private locker: CoolLocalStorage,
	private systemModulesService: SystemModuleService) { }

	ngOnInit() {
		console.log(this.selectedPerson);
		this.prime();
		this.facility = <any>this.locker.getObject("selectedFacility");
		this.selectedEmployee = this.locker.getObject("selectedEmployee");

		this.facilityForm1 = this.formBuilder.group({
			dept: ['', [<any>Validators.required]],
		});

		this.facilityForm2 = this.formBuilder.group({
			title: ['', [<any>Validators.required]],
			firstname: [this.selectedPerson.firstName, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			lastname: [this.selectedPerson.lastName, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			othernames: [this.selectedPerson.otherNames, []],
			gender: [this.selectedPerson.gender, [<any>Validators.required]],
			maritalStatus: [this.selectedPerson.maritalStatus, [<any>Validators.required]],
			date: [this.selectedPerson.dateOfBirth, [<any>Validators.required]],
			nationality: [this.selectedPerson.nationality, [<any>Validators.required]],
			stateofOrigin: [this.selectedPerson.stateofOrigin, [<any>Validators.required]],
			localgovtarea: [this.selectedPerson.lgaOfOrigin, [<any>Validators.required]],
			homeaddress: [this.selectedPerson.homeAddress.street, [<any>Validators.required]],
			stateofresidence: [this.selectedPerson.homeAddress.state, [<any>Validators.required]],
			lgaofresidence: [this.selectedPerson.homeAddress.lga, [<any>Validators.required]],
			//phone: ['', [<any>Validators.required]],
			email: [this.selectedPerson.email, [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
			// network: ['', [<any>Validators.minLength(2)]],
			//status: ['', [<any>Validators.required]],
			phoneno: [this.selectedPerson.primaryContactPhoneNo, [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
		});

		this.facilityForm2.controls['gender'].setValue(this.selectedPerson.gender);
		this.facilityForm2.controls['maritalStatus'].setValue(this.selectedPerson.maritalStatus);
		this.facilityForm2.controls['nationality'].setValue(this.selectedPerson.nationality);
		this.facilityForm2.controls['stateofOrigin'].setValue(this.selectedPerson.stateOfOrigin);
		this.facilityForm2.controls['localgovtarea'].setValue(this.selectedPerson.lgaOfOrigin);

		this.getDepartments();
		/* this.getCountries();
		this.getTitles();
		this.getGenders();
		this.maritalStatuses(); */

		this.facilityForm2.controls["stateofOrigin"].valueChanges.subscribe(payload => {
			//this.cities = payload.cities;
			this.lgasOfOrigin = payload.lgs;
			console.log(payload);
		});
		this.facilityForm2.controls["stateofresidence"].valueChanges.subscribe(payload => {
			//this.cities = payload.cities;
			this.lgas = payload.lgs;
			console.log(payload);
		});
	}

	prime() {

		const title$ = Observable.fromPromise(this.titleService.findAll());
		const gender$ = Observable.fromPromise(this.genderService.findAll());
		const maritalStatus$ = Observable.fromPromise(this.maritalStatusService.findAll());
		const country$ = Observable.fromPromise(this.countryService.findAll());

		Observable.forkJoin([title$, gender$, maritalStatus$, country$]).subscribe((results: any) => {
			this.titles = results[0].data;
			this.genders = results[1].data;
			this.maritalStatuses = results[2].data;

			console.log(this.maritalStatuses);

			this.countries = results[3].data;
			console.log(this.countries);
			this.stateAvailable = false;
			const country = this.countries.filter(item => item.name === this.selectedPerson.homeAddress.country);
			this.selectedCountry = country[0];
			// let lgs = this.selectedCountry.states.filter(item => item.name == this.);
			console.log(this.selectedCountry);
			/* if (this.selectedCountry.states.length > 0) {
				this.stateAvailable = true;
			} */


		})
	}

	close_onClick() {
		this.closeModal.emit(true);
		this.departmentBool = false;
	}
	saveDepartment() {
		this.loading = true;
		this.selectedEmployee.departmentId = this.facilityForm1.controls["dept"].value;

		this.employeeService.update(this.selectedEmployee).then(payload => {
			this.loading = false;
			this.systemModulesService.announceSweetProxy('Department Successfully Updated.', 'success');
			this.close_onClick();
		}).catch(err => {
			this.systemModulesService.announceSweetProxy('Department Successfully Updated.', 'success');
		});
	}

	savePerson() {
		if (!this.facilityForm2.valid) {
			this.mainErr = true;
			this.errMsg = "A required field has been left empty";
		} else {
			this.loading = true;
			let person = {
				_id: this.selectedPerson._id,
				title: this.facilityForm2.controls["title"].value.name,
				apmisId: this.selectedPerson.apmisId,
				firstName: this.facilityForm2.controls["firstname"].value,
				lastName: this.facilityForm2.controls["lastname"].value,
				otherNames: this.facilityForm2.controls["othernames"].value,
				gender: this.facilityForm2.controls["gender"].value.name,
				maritalStatus: this.facilityForm2.controls['maritalStatus'].value.name,
				dateOfBirth: this.facilityForm2.controls['date'].value,
				nationality: this.facilityForm2.controls['nationality'].value.name,
				stateOfOrigin: this.facilityForm2.controls['stateofOrigin'].value.name,
				lgaOfOrigin: this.facilityForm2.controls['localgovtarea'].value.name,
				homeAddress: {
					street: this.facilityForm2.controls['homeaddress'].value,
					state: this.facilityForm2.controls['stateofresidence'].value.name,
					lga: this.facilityForm2.controls['lgaofresidence'].value.name,
					country: this.facilityForm2.controls['nationality'].value.name
				},
				email: this.facilityForm2.controls['email'].value,
				//secondaryContactPhoneNo: this.facilityForm2.controls['phone'].value,
				primaryContactPhoneNo: this.facilityForm2.controls['phoneno'].value,

			}
			console.log(person);
			this.personService.update(person).then(payload => {
				console.log(payload);
				this.selectedEmployee.personDetails = payload;
				this.locker.setObject('selectedEmployee', this.selectedEmployee);
				this.systemModulesService.announceSweetProxy('Person Information Successfully Saved.', 'success');
				this.loading = false;
				this.close_onClick();
			}).catch(err => {
				this.systemModulesService.announceSweetProxy('Error occured while saving information, please check it and try again.', 'error');
			});
		}
	}

	getDepartments() {
		this.facilityService.get(this.facility._id, {}).then(payload => {
			this.departments = payload.departments;
		}).catch(err => {
			console.log(err);
		});
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
		this.countryService.findAll().then((payload) => {
			this.countries = payload.data;
		})
	}

	getStates(country) {
		this.countryService.find({
			query: {

			}
		})
	}



}
