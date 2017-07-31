import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { OrderStatusService } from '../../../../../../services/module-manager/setup/index';
import { OrderStatus } from '../../../../../../models/index';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Rx';
import { SharedService } from '../../../../../../shared-module/shared.service';

@Component({
    selector: 'app-right-tab',
    templateUrl: './right-tab.component.html',
    styleUrls: ['./right-tab.component.scss']
})
export class RightTabComponent implements OnInit {

    @Output() addProblem: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() addAllergy: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() addHistory: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() addVitals: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() patient;

    selectedFacility: Facility = <Facility>{};
    loginEmployee: Employee = <Employee>{};
    selectedForm: any = <any>{};
    selectedDocument: PatientDocumentation = <PatientDocumentation>{};
    patientDocumentation: Documentation = <Documentation>{};

    problems: any[] = [];
    allergies: any[] = [];

    constructor(private orderStatusService: OrderStatusService,
        private formService: FormsService, private locker: CoolSessionStorage,
        private documentationService: DocumentationService,
        private formTypeService: FormTypeService, private sharedService: SharedService,
        private facilityService: FacilitiesService) {
        this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    }

    ngOnInit() {
        console.log(this.patient)
        this.getPersonDocumentation();
    }
    getPersonDocumentation() {
        Observable.fromPromise(this.documentationService.find({ query: { 'personId._id': this.patient.personId } }))
            .subscribe((payload: any) => {
                if (payload.data.length === 0) {
                    this.patientDocumentation.personId = this.patient.personDetails;
                    this.patientDocumentation.documentations = [];
                    this.documentationService.create(this.patientDocumentation).subscribe(pload => {
                        this.patientDocumentation = pload;
                        console.log(this.patientDocumentation);
                    });
                    this.getProblems();
                } else {
                    if (payload.data[0].documentations.length === 0) {
                        this.patientDocumentation = payload.data[0];
                    } else {
                        Observable.fromPromise(this.documentationService.find({
                            query:
                            {
                                'personId._id': this.patient.personId, 'documentations.patientId': this.patient._id,
                                // $select: ['documentations.documents', 'documentations.facilityId']
                            }
                        })).subscribe((mload: any) => {
                            if (mload.data.length > 0) {
                                this.patientDocumentation = mload.data[0];
                                console.log(this.patientDocumentation);
                                this.getProblems();
                                this.getAllergies()
                            }
                        })
                    }

                }

            })
    }
    getProblems() {
        this.problems = [];
        this.patientDocumentation.documentations.forEach(documentation => {
            if (documentation.document.documentType.title === 'Problems') {
                documentation.document.body.problems.forEach(problem => {
                    this.problems.push(problem);
                })
            }
        });
    }
    getAllergies() {
        this.allergies = [];
        this.patientDocumentation.documentations.forEach(documentation => {
            if (documentation.document.documentType.title === 'Allergies') {
                documentation.document.body.allergies.forEach(allergy => {
                    this.allergies.push(allergy);
                })
            }
        });
        console.log(this.allergies);
    }
    addProblem_show() {
        this.addProblem.emit(true);
    }
    addAllergy_show() {
        this.addAllergy.emit(true);
    }
    addHistory_show() {
        this.addHistory.emit(true);
    }
    addVitals_show() {
        this.addVitals.emit(true);
    }

}
