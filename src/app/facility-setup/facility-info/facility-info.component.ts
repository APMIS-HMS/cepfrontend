import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	CountriesService, FacilityTypesService, FacilitiesService
} from '../../services/facility-manager/setup/index';
import { FacilityOwnershipService } from '../../services/module-manager/setup/index';
import { Facility } from '../../models/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'

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
		this.facilityForm1 = this.formBuilder.group({

			facilityname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			network: ['', [<any>Validators.minLength(2)]],
			cac: ['', [<any>Validators.required]],
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

}
