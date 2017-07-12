import { Component, OnInit, ViewChild } from '@angular/core';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GenericService } from '../../../../services/facility-manager/setup/index';
import { Facility, Generic } from '../../../../models/index';
import { ProductEmitterService } from '../../../../services/facility-manager/product-emitter.service';

@Component({
  selector: 'app-generic-manager',
  templateUrl: './generic-manager.component.html',
  styleUrls: ['./generic-manager.component.scss']
})
export class GenericManagerComponent implements OnInit {
  genericGroup: FormGroup;
	generics: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedItem: any = <Generic>{};
	btnLabel = 'Create';

	mainErr: Boolean = true;
	errMsg: String = 'You have unresolved errors';

	constructor(
		private _locker: CoolSessionStorage,
		private _fb: FormBuilder,
		private _genericservice: GenericService
	) {
	}

	ngOnInit() {
		this.genericGroup = this._fb.group({
			name: ['', [<any>Validators.required]],
		});
		this.selectedFacility =  <Facility> this._locker.getObject('selectedFacility');
		this.getGenerics();
	}

	onClickAdd(value: any, valid: boolean) {
		if(valid) {
			this.mainErr = true;
			// Check if you are editing an existing or creating a new record
			if(this.selectedItem._id === undefined) {
				value.facilityId = this.selectedFacility._id;
				this._genericservice.create(value)
					.then(payload => {
						this.genericGroup.reset();
						this.generics.push(payload);
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				value = this.selectedItem;
				value.name = this.genericGroup.get('name').value;

				this._genericservice.update(value)
					.then(payload => {
						this.genericGroup.reset();
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
		this.genericGroup.controls['name'].setValue(value.name);
		this.selectedItem = value;
		this.btnLabel = 'Update';
	}

	onClickCancel() {
		this.selectedItem = {};
		this.genericGroup.controls['name'].setValue('');
		this.btnLabel = 'Create';
	}

  onClickIsActive(value) {
		// Updating existing record
		value.isActive = !value.isActive;

		this._genericservice.update(value)
			.then(data => {
          // Do nothing
			})
			.catch(err => {
				console.log(err);
			});
	}

	getGenerics() {
		this._genericservice.find({ query: { facilityId: this.selectedFacility._id }})
			.then(data => {
				this.generics = data.data;
			});
	}

}
