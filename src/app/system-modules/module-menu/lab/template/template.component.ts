import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationService, TemplateService
} from '../../../../services/facility-manager/setup/index';
import { ScopeLevelService } from '../../../../services/module-manager/setup/index';
import { Facility, User, LabTemplate } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

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
    selectedScopeLevel: any = <any>{};
    scopeLevels: any = <any>[];
    templates: LabTemplate = <any>[];
    templateBtnText: String = 'Create Template';
    template_view: Boolean = false;
    loading: Boolean = true;

    constructor(
        private _fb: FormBuilder,
        private _locker: CoolLocalStorage,
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

        this.templateFormGroup = this._fb.group({
            apmisScopeLevel: ['', [Validators.required]],
            investigation: ['', [Validators.required]],
            name: ['', [Validators.required]],
            result: ['', [Validators.required]],
            conclusion: ['', [Validators.required]],
            recommendation: ['', [Validators.required]]
        });

        this.templateFormGroup.controls['investigation'].valueChanges.subscribe(val => {
            if (!!val || val === undefined) {
                this._templateService.find({ query: { 'facility._id': this.miniFacility._id }}).then(res => {
                    const containsSelected = res.data.filter(x => x.investigation._id === val._id);
                    if (containsSelected.length > 0) {
                        // Fill the other fields with the data
                        this.templateBtnText = 'Edit Template';
                        this.templateFormGroup.controls['name'].setValue(containsSelected[0].name);
                        this.templateFormGroup.controls['recommendation'].setValue(containsSelected[0].recommendation);
                        this.templateFormGroup.controls['result'].setValue(containsSelected[0].result);
                        this.templateFormGroup.controls['conclusion'].setValue(containsSelected[0].conclusion);
                    } else {
                        this.templateBtnText = 'Create Template';
                        // this.templateFormGroup.controls['name'].setValue('');
                        // this.templateFormGroup.controls['recommendation'].setValue('');
                        // this.templateFormGroup.controls['result'].setValue('');
                        // this.templateFormGroup.controls['conclusion'].setValue('');
                    }
                }).catch(err => this._notification('Error', 'There was an error getting Template. Please try again later!'));
            }
        });

        this._getAllTemplates();
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

                const myTemplate = <LabTemplate> {
                    facility: this.miniFacility,
                    investigation: value.investigation,
                    scopeLevel: value.apmisScopeLevel,
                    minorLocation: this.selectedLab.typeObject.minorLocationObject,
                    createdBy: this.employeeDetails.employeeDetails,
                    name: value.name,
                    result: value.result,
                    outcome: value.outcome,
                    conclusion: value.conclusion,
                    recommendation: value.recommendation,
                };

                // Check if this uses has created a template before.
                this._templateService.find({ query: { 'facility._id': this.miniFacility._id }}).then(res => {
                    const containsSelected = res.data.filter(x => x.investigation._id === value.investigation._id);
                    if (containsSelected.length > 0) {
                        this.templateBtnText = 'Updating Template...';
                        this._templateService.update(containsSelected[0]).then(res => {
                            this._getAllTemplates();
                            this.templateFormGroup.reset();
                            this.templateBtnText = 'Create Template';
                            this._notification('Success', 'Template has been updated successfully!');
                        }).catch(err => this._notification('Error', 'There was an error getting Template. Please try again later!'));
                    } else {
                        this.templateBtnText = 'Creating Template...';
                        this._templateService.create(myTemplate).then(res => {
                            this._getAllTemplates();
                            this.templateFormGroup.reset();
                            this.templateBtnText = 'Create Template';
                            this._notification('Success', 'Template has been created successfully!');
                        }).catch(err => this._notification('Error', 'There was an error creating Template. Please try again later!'));
                    }
                }).catch(err => this._notification('Error', 'There was an error creating Template. Please try again later!'));
            } else {
              this._notification('Error', 'Some fields are empty. Please fill all required fields');
            }
        } else {
            this._notification('Error', 'Please select the location and workspace you want to work in.');
        }
    }

    editTemplate(template: LabTemplate) {
        this.template_view = true;
        this.templateFormGroup.controls['investigation'].setValue(template.investigation.name);
        this.templateFormGroup.controls['apmisScopeLevel'].setValue(template.scopeLevel.name);
        this.templateFormGroup.controls['name'].setValue(template.name);
        this.templateFormGroup.controls['result'].setValue(template.result);
        this.templateFormGroup.controls['recommendation'].setValue(template.recommendation);
        this.templateFormGroup.controls['conclusion'].setValue(template.conclusion);
    }

    private _getAllTemplates() {
        this._templateService.find({ query: { 'facility._id': this.miniFacility._id }}).then(res => {
            this.loading = false;
            this.templates = res.data;
        }).catch(err => this._notification('Error', 'There was a problem getting templates'));
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

    template_show() {
        this.template_view = !this.template_view;
    }
}
