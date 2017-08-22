import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, InvestigationService, LaboratoryRequestService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation, Investigation, InvestigationModel } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-lab-requests',
  templateUrl: './lab-requests.component.html',
  styleUrls: ['./lab-requests.component.scss']
})
export class LabRequestsComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  selelctedFacility: Facility = <Facility>{};
  apmisLookupUrl = 'patient';
  apmisLookupText = '';
  apmisLookupQuery: any = {};
  apmisLookupDisplayKey = 'personDetails.personFullName';
  apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';

  apmisInvestigationLookupUrl = 'investigations';
  apmisInvestigationLookupText = '';
  apmisInvestigationLookupQuery: any = {};
  apmisInvestigationLookupDisplayKey = 'name';
  apmisInvestigationLookupImgKey = '';
  apmisLookupOtherKeys = ['personDetails.email', 'personDetails.dateOfBirth'];

  request_view = false;
  reqDetail_view = false;
  personAcc_view = false;
  mainErr = true;
  paymentStatus = false;
  sampleStatus = true;
  recievedStatus = true;
  resultStatus = false;

  checkedValues: any[] = [];
  requests: any[] = [];

  selectedPatient: any = <any>{};
  errMsg = 'You have unresolved errors';

  public frmNewRequest: FormGroup;
  searchInvestigation: FormControl;

  selectedFacility: Facility = <Facility>{};

  investigations: InvestigationModel[] = [];
  bindInvestigations: InvestigationModel[] = [];
  movedInvestigations: any[] = [];
  constructor(private formBuilder: FormBuilder, private renderer: Renderer, private locker: CoolSessionStorage,
    private investigationService: InvestigationService, private requestService: LaboratoryRequestService) {

  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('miniFacility')
    this.searchInvestigation = new FormControl('', []);
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      clinicalInfo: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      investigation: ['']
    });

    this.frmNewRequest.controls['patient'].valueChanges.subscribe(value => {
      this.apmisLookupQuery = {
        'facilityid': this.selelctedFacility._id,
        'searchtext': value
      };
    });
    this.frmNewRequest.controls['investigation'].valueChanges.subscribe(value => {
      if (value !== null && value.length === 0) {
        this.apmisInvestigationLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          name: { $regex: -1, '$options': 'i' },
        }
      } else {
        this.apmisInvestigationLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          name: { $regex: value, '$options': 'i' },
        }
      }
    })
    this.getLaboratoryRequest();
    this.getInvestigations();
  }
  getInvestigations() {
    this.investigationService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then(payload => {
      payload.data.forEach(item => {
        const investigation: InvestigationModel = <InvestigationModel>{};
        investigation.investigation = item;
        investigation.isExternal = false;
        investigation.isUrgent = false;
        investigation.isChecked = false;
        const listItems: any[] = [];
        if (item.isPanel) {
          item.panel.forEach(inItem => {
            const innerChild = <InvestigationModel>{};
            innerChild.investigation = inItem;
            innerChild.isExternal = false;
            innerChild.isUrgent = false;
            innerChild.isChecked = false;
            listItems.push(innerChild);
          });
          investigation.investigation.panel = listItems;
          this.investigations.push(investigation);
        } else {
          this.investigations.push(investigation);
        }

      });
    })
  }
  getLaboratoryRequest() {
    this.requestService.find({ query: { 'facilityId._id': this.selelctedFacility._id } }).then(payload => {
      this.requests = payload.data;
    })
  }
  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  onChange() {
    //upload file
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.personDetails.personFullName;
    this.selectedPatient = value;
  }
  apmisInvestigationLookupHandleSelectedItem(value) {
    if (value.action !== undefined) {
      if (value.action === 'cancel' && value.clear === true) {
        this.checkedValues = [];
        this.apmisInvestigationLookupText = '';
        this.frmNewRequest.controls['investigation'].setValue('');
      } else if (value.action === 'ok') {
        this.apmisInvestigationLookupText = '';
        this.frmNewRequest.controls['investigation'].setValue('');
      }
    } else {
      if (value.checked === true) {
        if (this.checkedValues.filter((item => item.name === value.object.name)).length === 0) {
          this.checkedValues.push(value.object);
        }
      } else {
        if (this.checkedValues.filter((item => item.name === value.object.name)).length > 0) {
          const index = this.checkedValues.findIndex((item => item.name === value.object.name));
          this.checkedValues.splice(index, 1);
        }
      }
      this.apmisInvestigationLookupText = value.object.name;
    }

  }
  request_show() {
    this.request_view = !this.request_view;
  }
  reqDetail() {
    this.reqDetail_view = true;
  }
  newPerson() {
    this.personAcc_view = true;
  }
  close_onClick(message: boolean): void {
    this.reqDetail_view = false;
    this.personAcc_view = false;
  }
  investigationChanged($event, investigation: InvestigationModel,
    childInvestigation?: InvestigationModel, isChild = false) {
    if ($event.checked || childInvestigation !== undefined) {
      if (investigation.investigation.isPanel) {
        // isPanel
        if (childInvestigation !== undefined) {
          //also send child investigation
          childInvestigation.isChecked = true;
          let found = false;
          const childIndex = investigation.investigation.panel.findIndex(x => x.investigation._id === childInvestigation.investigation._id);
          if (childIndex > -1) {
            let copyInvestigation = JSON.parse(JSON.stringify(investigation));
            investigation.investigation.panel.forEach((item, i) => {
              if (i !== childIndex) {
                copyInvestigation.investigation.panel.splice(i, 1);
              }

            });
            const isInBind = this.bindInvestigations.findIndex(x => x.investigation._id === copyInvestigation.investigation._id);
            if (isInBind > -1) {
              if ($event.checked) {
                if (this.bindInvestigations[isInBind].investigation.panel
                  .findIndex(x => x._id === copyInvestigation.investigation.panel[0]._id) >= 0) {
                  this.bindInvestigations[isInBind].investigation.panel.push(copyInvestigation.investigation.panel[0]);
                  if (this.bindInvestigations[isInBind].investigation.panel.length === investigation.investigation.panel.length) {
                    investigation.isChecked = true;
                  } else {
                    investigation.isChecked = false;
                  }
                }
              } else {
                console.log('slice 3')
                const indexToRemove = this.bindInvestigations[isInBind].investigation.panel
                  .findIndex(x => x.investigation._id === childInvestigation.investigation._id);
                this.bindInvestigations[isInBind].investigation.panel.splice(indexToRemove, 1);
                childInvestigation.isChecked = false;

                if (this.bindInvestigations[isInBind].investigation.panel.length === 0 || investigation.isChecked) {
                  if (!investigation.isChecked) {
                    this.bindInvestigations.splice(0, 1);
                  }

                  investigation.isChecked = false;
                }
              }

            } else {
              this.bindInvestigations.push(copyInvestigation);
            }

          }
        } else {
          console.log('first in')
          // without child investigation
          let copyInvestigation = JSON.parse(JSON.stringify(investigation));
          const isInBind = this.bindInvestigations.findIndex(x => x.investigation._id === copyInvestigation.investigation._id);
          if (isInBind > -1) {
            if ($event.checked) {
              // investigation.isChecked = true;
              console.log('in')
              console.log(this.bindInvestigations[isInBind].investigation.panel)
              console.log(copyInvestigation.investigation.panel)
              investigation.investigation.panel.forEach((child, k) => {
                if (this.bindInvestigations[isInBind].investigation.panel
                  .findIndex(x => x.investigation._id === child.investigation._id) < 0) {
                  console.log('ininin')
                  child.isChecked = true;
                  console.log(child)
                  this.bindInvestigations[isInBind].investigation.panel.push(child);
                  if (this.bindInvestigations[isInBind].investigation.panel.length === investigation.investigation.panel.length) {
                    investigation.isChecked = true;
                  } else {
                    investigation.isChecked = false;
                  }
                }
              })



            } else {

            }
          } else {
            investigation.isChecked = true;
            let copyInvestigation = JSON.parse(JSON.stringify(investigation));
            this.bindInvestigations.push(copyInvestigation);
            // check all children
            console.log('check all children')
            if (investigation.investigation.isPanel) {
              investigation.investigation.panel.forEach((child, k) => {
                console.log(child);
                child.isChecked = true;
              });
            }
          }

        }

      } else {
        if ($event.checked) {
          this.bindInvestigations.push(investigation);
        } else {
          console.log('slice 1')
          const indexToRemove = this.bindInvestigations.findIndex(x => x.investigation._id === investigation.investigation._id);
          this.bindInvestigations.splice(indexToRemove, 1)
        }
      }
    } else {
      console.log('slice 2')
      const indexToRemove = this.bindInvestigations.findIndex(x => x.investigation._id === investigation.investigation._id);
      this.bindInvestigations.splice(indexToRemove, 1);
      // unchecked panel and uncheched all children
      console.log('uncheck panel')
      if (investigation.investigation.isPanel) {
        investigation.investigation.panel.forEach((child, k) => {
          child.isChecked = false;
        });
      }

    }
  }
  save(valid, value) {
    delete this.selectedPatient.appointments;
    delete this.selectedPatient.encounterRecords;
    delete this.selectedPatient.orders;
    delete this.selectedPatient.tags;
    delete this.selectedPatient.personDetails.addressObj;
    delete this.selectedPatient.personDetails.countryItem;
    delete this.selectedPatient.personDetails.homeAddress;
    delete this.selectedPatient.personDetails.maritalStatus;
    delete this.selectedPatient.personDetails.nationality;
    delete this.selectedPatient.personDetails.nationalityObject;
    delete this.selectedPatient.personDetails.nextOfKin;

    const selectedFacility = this.locker.getObject('miniFacility');



    let copyBindInvestigation = JSON.parse(JSON.stringify(this.bindInvestigations));
    copyBindInvestigation.forEach((item, i) => {
      if (item.investigation.isPanel) {
        delete item.isChecked;
        item.investigation.panel.forEach((panel, j) => {
          delete panel.isChecked;
        })
      } else {
        delete item.isChecked;
      }
    })

    console.log(copyBindInvestigation);
    console.log(this.bindInvestigations);
    let request: any = {
      facilityId: selectedFacility,
      patientId: this.selectedPatient,
      labNumber: this.frmNewRequest.controls['labNo'].value,
      clinicalInformation: this.frmNewRequest.controls['clinicalInfo'].value,
      diagnosis: this.frmNewRequest.controls['diagnosis'].value,
      investigations: copyBindInvestigation
    }
    console.log(request);
    this.requestService.create(request).then(payload => {
      console.log(payload)
    })
  }
  externalChanged($event, investigation) {
    console.log(investigation)
    investigation.isExternal = $event.checked;
  }
  urgentChanged($event, investigation) {
    investigation.isUrgent = $event.checked;
  }
}
