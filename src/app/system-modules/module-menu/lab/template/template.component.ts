import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationService, TemplateService
} from '../../../../services/facility-manager/setup/index';
import { ScopeLevelService } from '../../../../services/module-manager/setup/index';
import { Facility, User } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
    templateFormGroup: FormGroup;
    investigations: any = <any>[];
    facility: Facility = <Facility>{};
    miniFacility: Facility = <Facility>{};
    user: User = <User>{};
    employeeDetails: any = <any>{};
    selectedLab: any = <any>{};
    scopeLevels: any = <any>[];
    templateBtnText: String = 'Create Template';

    constructor(
        private _fb: FormBuilder,
        private _locker: CoolSessionStorage,
        private _facilityService: FacilitiesService,
        private _investigationService: InvestigationService,
        private _templateService: TemplateService,
        private _scopeLevelService: ScopeLevelService
    ) { }

    ngOnInit() {
        this.facility = <Facility>this._locker.getObject('selectedFacility');
        this.miniFacility = <Facility>this._locker.getObject('miniFacility');
        this.employeeDetails = this._locker.getObject('loginEmployee');
        this.user = <User>this._locker.getObject('auth');
        this.selectedLab = <any>this._locker.getObject('workbenchCheckingObject');
        console.log(this.miniFacility);

        this.templateFormGroup = this._fb.group({
            scopeLevel: ['', [Validators.required]],
            investigation: ['', [Validators.required]],
            name: ['', [Validators.required]],
            result: ['', [Validators.required]],
            conclusion: ['', [Validators.required]],
            recommendation: ['', [Validators.required]]
        });

        this.templateFormGroup.controls['investigation'].valueChanges.subscribe(val => {
            this._templateService.find({ query: { 'facility._id': this.miniFacility._id }}).then(res => {
                const containsSelected = res.data.filter(x => x.investigation._id === val._id);
                if (containsSelected.length > 0) {
                    console.log(containsSelected[0]);
                    // Fill the other fields with the data
                    this.templateBtnText = 'Edit Template';
                    this.templateFormGroup.controls['scopeLevel'].setValue(containsSelected[0].scopeLevel);
                    this.templateFormGroup.controls['name'].setValue(containsSelected[0].name);
                    this.templateFormGroup.controls['recommendation'].setValue(containsSelected[0].recommendation);
                    this.templateFormGroup.controls['result'].setValue(containsSelected[0].result);
                    this.templateFormGroup.controls['conclusion'].setValue(containsSelected[0].conclusion);
                } else {
                    this.templateBtnText = 'Create Template';
                    this.templateFormGroup.controls['name'].setValue('');
                    this.templateFormGroup.controls['recommendation'].setValue('');
                    this.templateFormGroup.controls['result'].setValue('');
                    this.templateFormGroup.controls['conclusion'].setValue('');
                }
            }).catch(err => this._notification('Error', 'There was an error creating Template. Please try again later!'));
        });

        this._getAllInvestigations();
        this._getAllScopeLevels();
    }

    createTemplate(valid: boolean, value: any) {
        if (!!this.selectedLab.typeObject || this.selectedLab.typeObject !== undefined) {
            if (valid) {
                delete this.employeeDetails.employeeDetails.countryItem;
                delete this.employeeDetails.employeeDetails.nationalityObject;
                delete this.employeeDetails.employeeDetails.nationality;
                delete value.investigation.serviceId;
                delete value.investigation.facilityServiceId;
                delete value.investigation.facilityId;
                delete value.investigation.LaboratoryWorkbenches;

                const template = {
                    facility: this.miniFacility,
                    investigation: value.investigation,
                    scopeLevel: value.scopeLevel,
                    minorLocation: this.selectedLab.typeObject.minorLocationObject,
                    createdBy: this.employeeDetails.employeeDetails,
                    name: value.name,
                    result: value.result,
                    outcome: value.outcome,
                    conclusion: value.conclusion,
                    recommendation: value.recommendation,
                };

                this._templateService.create(template).then(res => {
                    this.templateFormGroup.reset();
                    this._notification('Success', 'Template has been created successfully!');
                }).catch(err => this._notification('Error', 'There was an error creating Template. Please try again later!'));
            } else {
              this._notification('Error', 'Some fields are empty. Please fill all required fields');
            }
        } else {
            this._notification('Error', 'Please select the location and workspace you want to work in.');
        }
    }

    private _getAllInvestigations() {
        this._investigationService.find({ query: { 'facilityId._id': this.facility._id }}).then(res => {
            this.investigations = res.data;
        }).catch(err => this._notification('Error', 'There was a problem getting investigations'));
    }

    private _getAllScopeLevels() {
        this._scopeLevelService.findAll().then(res => {
            this.scopeLevels = res.data;
        }).catch(err => this._notification('Error', 'There was a problem getting investigations'));
    }

    // Notification
    private _notification(type: String, text: String): void {
        this._facilityService.announceNotification({
          users: [this.user._id],
          type: type,
          text: text
        });
    }
}
