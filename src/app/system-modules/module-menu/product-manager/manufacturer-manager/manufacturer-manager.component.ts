import { Component, OnInit, ViewChild } from '@angular/core';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ManufacturerService } from '../../../../services/facility-manager/setup/index';
import { Facility, Manufacturer } from '../../../../models/index';


@Component({
  selector: 'app-manufacturer-manager',
  templateUrl: './manufacturer-manager.component.html',
  styleUrls: ['./manufacturer-manager.component.scss']
})
export class ManufacturerManagerComponent implements OnInit {
    manufacturerGroup: FormGroup;
	selectedFacility: Facility = <Facility>{};
	manufacturers: any[] = [];
	selectedItem: any = <Manufacturer>{};
	btnLabel = 'Create';

	mainErr: Boolean = true;
	errMsg: String = 'You have unresolved errors';

	constructor(
		private _locker: CoolSessionStorage,
		private _fb: FormBuilder,
		private _manufacturerService: ManufacturerService
	) {
	}

	ngOnInit() {
		this.manufacturerGroup = this._fb.group({
			name: ['', [<any>Validators.required]]
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getManufacturer();
	}

	onClickAdd(value: any, valid: boolean) {
		if(valid) {
			this.mainErr = true;
			// Check if you are editing an existing or creating a new record
			if(this.selectedItem._id === undefined) {
				// Creating new record
				value.facilityId = this.selectedFacility._id;
				this._manufacturerService.create(value)
					.then(data => {
						this.manufacturerGroup.reset();
						this.manufacturers.push(data);
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				// Updating existing record
				value = this.selectedItem;
				value.name = this.manufacturerGroup.get('name').value;

				this._manufacturerService.update(value)
					.then(data => {
						this.manufacturerGroup.reset();
						this.selectedItem = {};
						this.btnLabel = 'Create';
					})
					.catch(err => {
						console.log(err);
					});
			}
			
		} else {
			this.mainErr = false;
		}
	}

	onClickEdit(value: any) {
		this.manufacturerGroup.controls['name'].setValue(value.name);
		this.selectedItem = value;
		this.btnLabel = 'Update';
	}

	onClickCancel() {
		this.selectedItem = {};
		this.manufacturerGroup.controls['name'].setValue('');
		this.btnLabel = 'Create';
	}

	onClickIsActive(value) {
		// Updating existing record
		value.isActive = !value.isActive;

		this._manufacturerService.update(value)
			.then(data => {
				// Do nothing for now
			})
			.catch(err => {
				console.log(err);
			});
	}

	getManufacturer() {
		this._manufacturerService.find({ query: { facilityId: this.selectedFacility._id }})
			.then(data => {
				this.manufacturers = data.data;
			});
	}
}
