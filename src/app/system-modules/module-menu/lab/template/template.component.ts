import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationService, TemplateService
} from '../../../../services/facility-manager/setup/index';
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
    templateBtnText: String = 'Create Template';

    constructor(
        private _fb: FormBuilder,
        private _locker: CoolSessionStorage,
        private _facilityService: FacilitiesService,
        private _investigationService: InvestigationService,
        private _templateService: TemplateService
    ) { }

    ngOnInit() {
        this.facility = <Facility>this._locker.getObject('selectedFacility');
        this.miniFacility = <Facility>this._locker.getObject('miniFacility');
        this.employeeDetails = this._locker.getObject('loginEmployee');
        this.user = <User>this._locker.getObject('auth');
        this.selectedLab = <any>this._locker.getObject('workbenchCheckingObject');

        this.templateFormGroup = this._fb.group({
            investigation: ['', [Validators.required]],
            name: ['', [Validators.required]],
            result: ['', [Validators.required]],
            outcome: ['', [Validators.required]],
            conclusion: ['', [Validators.required]],
            recommendation: ['', [Validators.required]]
        });

        this._getAllInvestigations();
    }

    createTemplate(valid: boolean, value: any) {
        if(!!this.selectedLab.typeObject || this.selectedLab.typeObject !== undefined) {
            if (valid) {
                console.log(value);
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
                    minorLocation: this.selectedLab.typeObject.minorLocationObject,
                    createdBy: this.employeeDetails.employeeDetails,
                    name: value.name,
                    result: value.result,
                    outcome: value.outcome,
                    conclusion: value.conclusion,
                    recommendation: value.recommendation,
                };
    
                this._templateService.create(template).then(res => {
                  console.log(res);
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
            console.log(res);
            this.investigations = res.data;
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
