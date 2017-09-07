import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FacilitiesService, LaboratoryRequestService, } from '../../../../services/facility-manager/setup/index';
import { Facility, PendingLaboratoryRequest } from '../../../../models/index';

@Component({
  selector: 'app-external-investigations',
  templateUrl: './external-investigations.component.html',
  styleUrls: ['./external-investigations.component.scss']
})
export class ExternalInvestigationsComponent implements OnInit {
  extRequestFormGroup: FormGroup;
  facility: Facility = <Facility>{};
  extRequests: any = [];
  loading: Boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolSessionStorage,
    private _laboratoryRequestService: LaboratoryRequestService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');

    this.extRequestFormGroup = this._fb.group({
      search: [''],
      date: [null]
    });

    this.extRequestFormGroup.controls['search'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.extRequests = [];
        if (value !== null && value.length === 0) {
          this.extRequests = [];
        } else {
          this._laboratoryRequestService.find({
            query:
            {
              $or: [
                { 'patientId.personDetails.personFullName': { $regex: value, '$options': 'i' } },
                { 'patientId.personDetails.apmisId': { $regex: value, '$options': 'i' } },
              ]
            }
          }).then(payload => {
            console.log(payload);
            payload.data.forEach(element => {
              element.investigations.forEach(item => {
                if (item.isExternal) {
                  let pending: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
                  pending.clinicalInformation = element.clinicalInformation;
                  pending.updatedAt = element.updatedAt;
                  pending.diagnosis = element.diagnosis;
                  pending.name = element.patientId.personDetails.personFullName;
                  pending.createdBy = element.createdBy.employeeDetails.personFullName;
                  pending.service = item.investigation.serviceId.name;
                  pending.isExternal = item.isExternal;
                  pending.isUrgent = item.isUrgent;
                  pending.specimen = item.investigation.specimen.name;
                  pending.personId = element.patientId.personDetails._id;
                  this.extRequests.push(pending);
                }
              })

            });
            console.log(this.extRequests);
          })
        }
    });

    this.extRequestFormGroup.controls['date'].valueChanges.subscribe(value => {
      this._laboratoryRequestService.find({ query: { dateExternalInvestigation: true, date: value } }).then(payload => {
        console.log(payload);
      })
    });
  }


  // Get all drugs from generic
  private _getAllRequests() {
    this._laboratoryRequestService.findAll().then(res => {
      console.log(res);
      this.loading = false;
      res.data.forEach(element => {
        element.investigations.forEach(item => {
          let pending: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
          pending.clinicalInformation = element.clinicalInformation;
          pending.updatedAt = element.updatedAt;
          pending.diagnosis = element.diagnosis;
          pending.name = element.patientId.personDetails.personFullName;
          pending.createdBy = element.createdBy.employeeDetails.personFullName;
          pending.service = item.investigation.serviceId.name;
          pending.isExternal = item.investigation.isExternal;
          pending.isUrgent = item.investigation.isUrgent;
          pending.specimen = item.investigation.specimen.name;
          pending.personId = item.patientId.personDetails._id;
          this.extRequests.push(element);
        })

      });
    }).catch(err => console.error(err));
  }

}
