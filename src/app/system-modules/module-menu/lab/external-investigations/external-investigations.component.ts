import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
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
    private _locker: CoolLocalStorage,
    private _laboratoryRequestService: LaboratoryRequestService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this._getAllRequests();

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
          })
        }
    });

    this.extRequestFormGroup.controls['date'].valueChanges.subscribe(value => {
      this._laboratoryRequestService.find({ query: { dateExternalInvestigation: true, date: value } }).then(payload => {
      })
    });
  }


  // Get all drugs from generic
  private _getAllRequests() {
    // this._laboratoryRequestService.findAll().then(res => {
    this._laboratoryRequestService.customFind({
        query: {
          facilityId: this.facility._id
        }
      }).then(res => {
      console.log(res);
      this.loading = false;
      if (res.status === 'success') {
        res.data.forEach(element => {
          element.investigations.forEach(item => {
            console.log(item);
            if (item.isExternal) {
              let pending: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
              pending.clinicalInformation = element.clinicalInformation;
              pending.updatedAt = element.updatedAt;
              pending.diagnosis = element.diagnosis;
              pending.name = `${element.personDetails.firstName} ${element.personDetails.LastName}`;
              pending.createdBy = `${element.employeeDetails.firstName} ${element.employeeDetails.LastName}`;
              pending.service = item.investigation.serviceId.name;
              pending.isExternal = item.investigation.isExternal;
              pending.isUrgent = item.investigation.isUrgent;
              pending.specimen = item.investigation.specimen.name;
              pending.personId = element.personDetails._id;
              this.extRequests.push(element);
              console.log(this.extRequests);
            }
          });
        });
      }
    }).catch(err => console.error(err));
  }

}
