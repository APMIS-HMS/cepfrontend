import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';

import {
	CountriesService, FacilitiesService, UserService,
	PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
  } from '../../../../../../services/facility-manager/setup/index';
  import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../../models/index';
  import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-edit-emp-basic',
	templateUrl: './edit-emp-basic.component.html',
	styleUrls: ['./edit-emp-basic.component.scss']
})
export class EditEmpBasicComponent implements OnInit {
	@Input() selectedPerson: any;
	@Input() departmentBool: Boolean;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	mainErr = true;
	errMsg = "";

	facility;
	departments:any;
	selectedEmployee;
	loading:any;

	public facilityForm1: FormGroup;
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
		private personService: PersonService,
		private locker: CoolLocalStorage) { }

	ngOnInit() {
		this.facility = <any>this.locker.getObject("selectedFacility");
		if (this.departmentBool) {
			this.facilityForm1 = this.formBuilder.group({

				firstname: [{
					value: this.selectedPerson.firstName, 
					disabled: this.departmentBool
				}, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
				lastname: [{
					value: this.selectedPerson.lastName,
					disabled: this.departmentBool
				}, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
				othernames: [{
					value: this.selectedPerson.otherNames,
					disabled: this.departmentBool
				}, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
				email: [{
					value: this.selectedPerson.email,
					disabled: this.departmentBool
				}, [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
				// network: ['', [<any>Validators.minLength(2)]],
				status: ['', [<any>Validators.required]],
				dept: ['', [<any>Validators.required]],
				phone: [{
					value: this.selectedPerson.primaryContactPhoneNo,
					disabled: this.departmentBool
				}, [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
			});
		} else {
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

		this.getDepartments();
		this.selectedEmployee = this.locker.getObject("selectedEmployee");
	}

	close_onClick() {
		this.closeModal.emit(true);
		this.departmentBool = false;
	}
	save() {
		this.loading = true;
		this.selectedEmployee.departmentId = this.facilityForm1.controls["dept"].value;
		
		this.employeeService.update(this.selectedEmployee).then(payload => {
			this.loading = true;
			this.close_onClick();
		});
	}

	getDepartments(){
		this.facilityService.get(this.facility._id, {}).then(payload => {
			this.departments = payload.departments;
		}).catch(err => {
			console.log(err);
		});
	}



}
