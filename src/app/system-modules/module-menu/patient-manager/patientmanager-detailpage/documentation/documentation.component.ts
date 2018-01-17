import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {
  FormsService, FacilitiesService, DocumentationService, LaboratoryRequestService, BillingService, PrescriptionService,
  PrescriptionPriorityService
} from '../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../services/module-manager/setup/index';
import {
  Facility, Patient, Employee, Documentation, PatientDocumentation, InvestigationModel, BillIGroup, BillItem
} from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../../../shared-module/shared.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit, OnDestroy {
  @Input() patient;
  docDetail_view = false;
  clinicalNote_view = false;
  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;

  showDoc = true;
  showOrderSet = false;

  selectedFacility: Facility = <Facility>{};
  selectedMiniFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};
  documents: PatientDocumentation[] = [];
  auth: any;
  subscription: Subscription;
  priority: any = <any>{};

  constructor(
    private formService: FormsService, private locker: CoolLocalStorage,
    private documentationService: DocumentationService,
    private formTypeService: FormTypeService, private sharedService: SharedService,
    private facilityService: FacilitiesService,
    private requestService: LaboratoryRequestService,
    private billingService: BillingService,
    private _prescriptionService: PrescriptionService,
    private _priorityService: PrescriptionPriorityService
  ) {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.selectedMiniFacility = <Facility>this.locker.getObject('miniFacility');

    this.subscription = this.sharedService.submitForm$.subscribe(payload => {
      console.log(payload);
      const doc: PatientDocumentation = <PatientDocumentation>{};
      doc.document = {
        documentType: this.selectedForm,
        body: payload,
      };

      // limit loginEmployee detail
      const logEmp: any = this.loginEmployee;
      delete logEmp.department;
      delete logEmp.employeeFacilityDetails;
      delete logEmp.role;
      delete logEmp.units;
      delete logEmp.consultingRoomCheckIn;
      delete logEmp.storeCheckIn;
      delete logEmp.unitDetails;
      delete logEmp.professionObject;
      delete logEmp.employeeDetails.countryItem;
      delete logEmp.employeeDetails.homeAddress;
      delete logEmp.employeeDetails.gender;
      delete logEmp.employeeDetails.maritalStatus;
      delete logEmp.employeeDetails.nationality;
      delete logEmp.employeeDetails.nationalityObject;
      delete logEmp.employeeDetails.nextOfKin;

      doc.createdBy = logEmp;
      doc.facilityId = this.selectedMiniFacility;
      doc.patientId = this.patient._id;
      this.patientDocumentation.documentations.push(doc);
      // Get the raw orderset data and send to different destination.
      this._listenAndSaveRawOrderSetData();
      this.documentationService.update(this.patientDocumentation).then(pay => {
        console.log(pay);
        this.getPersonDocumentation();
        this._notification('Success', 'Documentation successfully saved!');
      });
    });
    this.sharedService.newFormAnnounced$.subscribe((payload: any) => {
      this.selectedForm = payload.form;
    })
  }

  ngOnInit() {
    this.getPersonDocumentation();
    this.auth = this.locker.getObject('auth');
    this._getAllPriorities();
  }
  getPersonDocumentation() {
    this.documentationService.find({ query: { 'personId._id': this.patient.personId } }).then((payload: any) => {
      if (payload.data.length === 0) {
        this.patientDocumentation.personId = this.patient.personDetails;
        this.patientDocumentation.documentations = [];
        this.documentationService.create(this.patientDocumentation).subscribe(pload => {
          this.patientDocumentation = pload;
        })
      } else {
        if (payload.data[0].documentations.length === 0) {
          this.patientDocumentation = payload.data[0];
        } else {
          this.documentationService.find({
            query:
              {
                'personId._id': this.patient.personId, 'documentations.patientId': this.patient._id,
                // $select: ['documentations.documents', 'documentations.facilityId']
              }
          }).subscribe((mload: any) => {
            if (mload.data.length > 0) {
              this.patientDocumentation = mload.data[0];
              this.populateDocuments();
              // mload.data[0].documentations[0].documents.push(doct);
            }
          })
        }
      }

    })
  }

  private _listenAndSaveRawOrderSetData() {
    this.sharedService.announceBilledOrderSet$.subscribe((value: any) => {
      console.log(value);
      if (!!value) {
        if (!!value.investigations) {
          this._saveLabRequest(value.investigations);
        }

        if (!!value.medications) {
          this._saveMedication(value.medications);
        }
      }
    });
  }

  private _saveMedication(medications) {
    this.deleteUnncessaryPatientData();
    const prescriptions = {
      priorityId: this.priority._id,
      priorityObject: this.priority,
      facilityId: this.selectedMiniFacility._id,
      employeeId: this.loginEmployee._id,
      employeeObject: this.facilityService.trimEmployee(this.loginEmployee),
      patientId: this.patient._id,
      patientObject: this.patient,
      personId: this.patient.personId,
      prescriptionItems: medications,
      isAuthorised: true,
      billId: undefined,
      totalCost: 0,
      totalQuantity: 0
    };

    // bill model
    const billItemArray = [];
    let totalCost = 0;
    prescriptions.prescriptionItems.forEach(element => {
        if (element.isBilled) {
            const billItem = <BillItem>{
                facilityServiceId: element.facilityServiceId,
                serviceId: element.serviceId,
                facilityId: this.selectedMiniFacility._id,
                patientId: this.patient._id,
                patientObject: this.patient,
                description: element.productName,
                quantity: element.quantity,
                totalPrice: element.totalCost,
                unitPrice: element.cost,
                unitDiscountedAmount: 0,
                totalDiscoutedAmount: 0,
            };

            totalCost += element.totalCost;
            billItemArray.push(billItem);
        }
    });

    const bill = <BillIGroup>{
        facilityId: this.selectedMiniFacility._id,
        patientId: this.patient._id,
        billItems: billItemArray,
        discount: 0,
        subTotal: totalCost,
        grandTotal: totalCost,
    }

    // If any item was billed, then call the billing service
    if (billItemArray.length > 0) {
        // send the billed items to the billing service
        this.billingService.create(bill).then(res => {
            if (res._id !== undefined) {
                prescriptions.billId = res._id;
                // if this is true, send the prescribed drugs to the prescription service
                this._prescriptionService.create(prescriptions).then(pRes => {
                    this._notification('Success', 'Prescription has been sent!');
                }).catch(err => {
                  console.log(err);
                    this._notification('Error', 'There was an error creating prescription. Please try again later.');
                });
            } else {
                this._notification('Error', 'There was an error generating bill. Please try again later.');
            }
        }).catch(err => console.error(err));
    } else {
        // Else, if no item was billed, just save to the prescription table.
        this._prescriptionService.create(prescriptions).then(res => {
            this._notification('Success', 'Prescription has been sent!');
        }).catch(err => {
            this._notification('Error', 'There was an error creating prescription. Please try again later.');
        });
    }
  }

  private _saveLabRequest(labRequests) {
    this.deleteUnncessaryPatientData();

    const logEmp = <any>this.locker.getObject('loginEmployee');
    delete logEmp.department;
    delete logEmp.employeeFacilityDetails;
    delete logEmp.role;
    delete logEmp.units;
    delete logEmp.consultingRoomCheckIn;
    delete logEmp.storeCheckIn;
    delete logEmp.unitDetails;
    delete logEmp.professionObject;
    delete logEmp.workSpaces;
    delete logEmp.employeeDetails.countryItem;
    delete logEmp.employeeDetails.homeAddress;
    delete logEmp.employeeDetails.gender;
    delete logEmp.employeeDetails.maritalStatus;
    delete logEmp.employeeDetails.nationality;
    delete logEmp.employeeDetails.nationalityObject;
    delete logEmp.employeeDetails.nextOfKin;
    delete logEmp.workbenchCheckIn;

    const copyBindInvestigation = labRequests;
    const readyCollection: any[] = [];

    copyBindInvestigation.forEach((item, i) => {
      if (!!item.investigation && item.investigation.investigation.isPanel) {
        delete item.investigation.isChecked;
        item.investigation.investigation.panel.forEach((panel, j) => {
          delete panel.isChecked;
        });
      } else if (!!item.investigation && !item.investigation.investigation.isPanel) {
        delete item.investigation.isChecked;
        delete item.investigation.LaboratoryWorkbenches;
        delete item.investigation.location;
        readyCollection.push(item.investigation);
      } else {
        // readyCollection.push(item);
      }
    });

    const request: any = {
      facilityId: this.selectedMiniFacility,
      patientId: this.patient,
      investigations: readyCollection,
      createdBy: logEmp
    }
    const billGroup: BillIGroup = <BillIGroup>{};
    billGroup.discount = 0;
    billGroup.facilityId = this.selectedMiniFacility._id;
    billGroup.grandTotal = 0;
    billGroup.isWalkIn = false;
    billGroup.patientId = this.patient._id;
    billGroup.subTotal = 0;
    // billGroup.userId = '';
    billGroup.billItems = [];
    readyCollection.forEach(item => {
      if (!item.isExternal) {
        const billItem: BillItem = <BillItem>{};
        billItem.unitPrice = item.investigation.LaboratoryWorkbenches[0].workbenches[0].price;
        billItem.facilityId = this.selectedMiniFacility._id;
        billItem.description = '';
        billItem.facilityServiceId = item.investigation.facilityServiceId;
        billItem.serviceId = item.investigation.serviceId;
        billItem.itemName = item.investigation.name;
        billItem.patientId = this.patient._id;
        billItem.quantity = 1;
        billItem.totalPrice = billItem.quantity * billItem.unitPrice;
        billItem.unitDiscountedAmount = 0;
        billItem.totalDiscoutedAmount = 0;
        billGroup.subTotal = billGroup.subTotal + billItem.totalPrice;
        billGroup.grandTotal = billGroup.subTotal;
        billGroup.billItems.push(billItem);
      }
    })

    if (billGroup.billItems.length > 0) {
      const request$ = Observable.fromPromise(this.requestService.create(request));
      const billing$ = Observable.fromPromise(this.billingService.create(billGroup));
      Observable.forkJoin([request$, billing$]).subscribe((results: any) => {
        // const request = results[0];
        const billing = results[1];
        delete billing.facilityItem;
        delete billing.patientItem;
        billing.billItems.forEach(item => {
          delete item.facilityServiceObject;
          delete item.modifierId;
          delete item.paymentStatus;
          delete item.paments;
          delete item.serviceModifierOject
        });
        results[0].billingId = billing;
        this.requestService.update(results[0]).then(payload => {
          this._notification('Success', 'Request has been sent successfully!');
        }).catch(err => {
          console.log(err);
        });
      });
    } else {
      this.requestService.create(request).then(payload => {
          this._notification('Success', 'Request has been sent successfully!');
      }).catch(err => {
        console.log(err);
      });
    }
  }

  private deleteUnncessaryPatientData() {
    delete this.patient.appointments;
    delete this.patient.encounterRecords;
    delete this.patient.orders;
    delete this.patient.tags;
    delete this.patient.personDetails.addressObj;
    delete this.patient.personDetails.countryItem;
    delete this.patient.personDetails.homeAddress;
    delete this.patient.personDetails.maritalStatus;
    delete this.patient.personDetails.nationality;
    delete this.patient.personDetails.nationalityObject;
    delete this.patient.personDetails.nextOfKin;
    delete this.patient.personDetails.wallet;
  }

  private _getAllPriorities() {
    this._priorityService.findAll().then(res => {
      const priority = res.data.filter(x => x.name.toLowerCase().includes('normal'));
      if (priority.length > 0) {
        this.priority = priority[0];
      } else {
        this.priority = res.data[0];
      }
      console.log(this.priority);
    }).catch(err =>  console.error(err));
  }

  populateDocuments() {
    this.documents = [];
    this.patientDocumentation.documentations.forEach(documentation => {
      if ((documentation.document.documentType && documentation.document.documentType.isSide === false)
        || (documentation.document.documentType && documentation.document.documentType.isSide === undefined)) {
        this.documents.push(documentation);
      } else {
        if (documentation.document.documentType.isSide === true && documentation.document.documentType.title === 'Problems') {
          console.log(documentation);
          this.documents.push(documentation);
        } else {
          console.log(documentation);
          this.documents.push(documentation);
        }
      }
    });
    this.documents.reverse();
  }
  toObject(arr) {
    const rv = {};
    for (let i = 0; i < arr.length; ++i) {
      rv[i] = arr[i];
    }
    return rv;
  }
  analyseObject(object) {
    const props = Object.getOwnPropertyNames(object);
    const docs: any[] = [];
    props.forEach((prop, i) => {
      const property = prop.toString();
      docs.push({ property: object[prop] });
    })


    // const arr = Object.keys(object).map(function (k) { return object[k] });
    // const arr = Object.keys(object).map(function(_) { return object[_]; })
    // const obj = JSON.parse(object);
    // const splitObject = JSON.stringify(object).split(':'); //.replace('{"', '')
    return object;
  }
  trimKey(value) {
    const init = value.replace('{"', '');
    return init.replace('"', '');
  }
  trimValue(value) {
    const init = value.replace('"', '');
    return init.replace('"}', '');
  }
  docDetail_show(document) {
    this.selectedDocument = document;
    this.docDetail_view = true;
  }
  clinicalNote_show() {
    this.clinicalNote_view = !this.clinicalNote_view;
  }
  addProblem_show(e) {
    this.addProblem_view = true;
  }
  addAllergy_show(e) {
    this.addAllergy_view = true;
  }
  addHistory_show(e) {
    this.addHistory_view = true;
  }
  addVitals_show(e) {
    this.addVitals_view = true;
  }

  close_onClick(message: boolean): void {
    this.docDetail_view = false;
    this.clinicalNote_view = false;
    this.addProblem_view = false;
    this.addAllergy_view = false;
    this.addHistory_view = false;
    this.addVitals_view = false;
  }

  showOrderset_onClick(e) {
    this.showDoc = false;
    this.showOrderSet = true;
  }
  showDoc_onClick(e) {
    this.showDoc = true;
    this.showOrderSet = false;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.auth._id],
      type: type,
      text: text
    });
  }
}
