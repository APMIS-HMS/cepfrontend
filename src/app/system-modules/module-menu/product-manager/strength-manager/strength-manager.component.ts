import { Component, OnInit } from '@angular/core';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { StrengthService } from '../../../../services/facility-manager/setup/index';
import { Facility, Strength } from '../../../../models/index';

@Component({
	selector: 'app-strength-manager',
	templateUrl: './strength-manager.component.html',
	styleUrls: ['./strength-manager.component.scss']
})
export class StrengthManagerComponent implements OnInit {
	strengthGroup: FormGroup;
	strengths: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedItem: any = <Strength>{};
	btnLabel = 'Create';

	mainErr: Boolean = true;
	errMsg: String = 'You have unresolved errors';

	constructor(
		private _locker: CoolSessionStorage,
		private _fb: FormBuilder,
		private _strengthService: StrengthService
	) {
	}

	ngOnInit() {
		this.strengthGroup = this._fb.group({
			strength: ['', [<any>Validators.required]],
		});
		this.selectedFacility = <Facility> this._locker.getObject('selectedFacility');
		this.getStrengths();
	}

	onClickAdd(value: any, valid: boolean) {
		if (valid) {
			this.mainErr = true;
			// Check if you are editing an existing or creating a new record
			if (this.selectedItem._id === undefined) {
				value.facilityId = this.selectedFacility._id;
				console.log(value);
				this._strengthService.create(value)
					.then(payload => {
						this.strengthGroup.reset();
						this.strengths.push(payload);
					})
					.catch(err => {
						console.log(err);
					});
			} else {
				value = this.selectedItem;
				value.strength = this.strengthGroup.get('strength').value;

				this._strengthService.update(value)
					.then(payload => {
						this.strengthGroup.reset();
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
		this.strengthGroup.controls['strength'].setValue(value.strength);
		this.selectedItem = value;
		this.btnLabel = 'Update';
	}

	onClickCancel() {
		this.selectedItem = {};
		this.strengthGroup.controls['strength'].setValue('');
		this.btnLabel = 'Create';
	}

	onClickIsActive(value) {
		// Updating existing record
		value.isActive = !value.isActive;

		this._strengthService.update(value)
			.then(data => {
				// Do nothing for now
			})
			.catch(err => {
				console.log(err);
			});
	}

	getStrengths() {
		this._strengthService.find({ query: { facilityId: this.selectedFacility._id } })
			.then(data => {
				this.strengths = data.data;
			});
	}
}
