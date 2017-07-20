import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { PatientService, PersonService, FacilitiesService, GenderService, RelationshipService } from '../../../../services/facility-manager/setup/index';
import { Facility, Patient, Gender, Relationship } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-patientmanager-homepage',
  templateUrl: './patientmanager-homepage.component.html',
  styleUrls: ['./patientmanager-homepage.component.scss']
})
export class PatientmanagerHomepageComponent implements OnInit {
  selectedValue: string;

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  nextOfKinForm: FormGroup;

  editPatient = false;
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @Output() empDetail: EventEmitter<string> = new EventEmitter<string>();

  facility: Facility = <Facility>{};
  patients: Patient[] = [];
  genders: Gender[] = [];
  relationships: Relationship[] = [];
  selectedPatient: Patient = <Patient>{};
  searchControl = new FormControl();
  loading: boolean = true;

  pageSize = 1;
  limit = 10;

  constructor(private patientService: PatientService, private personService: PersonService,
    private facilityService: FacilitiesService, private locker: CoolSessionStorage, private router: Router,
    private route: ActivatedRoute, private toast: ToastsManager, private genderService: GenderService,
    private relationshipService: RelationshipService, private formBuilder: FormBuilder) {
    this.patientService.listner.subscribe(payload => {
      this.getPatients(this.limit);
    });
    this.patientService.createListener.subscribe(payload => {
      console.log(payload);
      this.getPatients(this.limit);
      this.toast.success(payload.personDetails.personFullName + ' created successfully!', 'Success!');
    });

    const away = this.searchControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((term: Patient[]) => this.patientService.searchPatient(this.facility._id, this.searchControl.value));

    away.subscribe((payload: any) => {
      this.patients = payload.body;
    });
  }
  searchPatients(searchText: string) {
    this.searchControl.setValue(searchText);
  }
  getGender() {
    this.genderService.findAll().subscribe(payload => {
      this.genders = payload.data;
    })
  }
  getRelationships() {
    this.relationshipService.findAll().subscribe(payload => {
      this.relationships = payload.data;
    })
  }
  ngOnInit() {
    this.pageInView.emit('Patient Manager');
    this.getGender();
    this.getRelationships();
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    this.getPatients(this.limit);
  }
  addNewNextOfKin() {
    this.nextOfKinForm = this.formBuilder.group({
      address: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.required]],
      fullName: ['', [<any>Validators.required]],
      phoneNumber: ['', [<any>Validators.required]],
      relationship: ['', [<any>Validators.required]]
    });
  }
  sortPatientsByName() {
    const sortedPatient = this.patients;
    sortedPatient.sort(function (x, y) {
      const xLastName = x.personDetails.lastName.toLowerCase();
      const yLastName = y.personDetails.lastName.toLowerCase();
      if (xLastName < yLastName) {
        return -1;
      }
      if (xLastName > yLastName) {
        return 1;
      }
      return 0;
    });
  }
  sortPatientsByAge() {
    this.patients.sort(function (x, y) {
      return x.personDetails.age - y.personDetails.age;
    });
  }
  sortPatientsByGender() {
    const sortedPatient = this.patients;
    sortedPatient.sort(function (x, y) {
      const xGender = x.personDetails.gender.name.toLowerCase();
      const yGender = y.personDetails.gender.name.toLowerCase();
      if (xGender < yGender) {
        return -1;
      }
      if (xGender > yGender) {
        return 1;
      }
      return 0;
    });
  }
  navEpDetail(patient) {
    this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', patient.personId]);
  }
  getPatients(limit) {
    this.patientService.find({ query: { facilityId: this.facility._id, $limit: limit } }).then(payload => {
      console.log(payload);
      this.loading = false;
      if(payload.data.length > 0) {
        this.patients = payload.data;
      } else {
        this.patients = [];
      }
    });
  }
  onScroll() {
    this.pageSize = this.pageSize + 1;
    const limit = this.limit * this.pageSize;
    this.getPatients(limit);
  }
  onScrollUp() {
    console.log(this.pageSize);
    if (this.pageSize > 1) {
      this.pageSize = this.pageSize - 1;
    }
    const limit = this.limit * this.pageSize;
    this.getPatients(limit);
  }
  slideEdit(patient) {
    this.selectedPatient = patient.personDetails;
    console.log(this.selectedPatient);
    this.editPatient = true;
    if (this.selectedPatient.nextOfKin.length === 0) {
      this.addNewNextOfKin();
    }
  }
  updatePatient() {
    if (this.selectedPatient.nextOfKin.length === 0) {
      console.log(this.nextOfKinForm.value);
      this.selectedPatient.nextOfKin.push(this.nextOfKinForm.value);
      this.personService.update(this.selectedPatient).subscribe(payload => {
        console.log(payload);
        this.close_onClick();
      });
    } else {
      console.log(this.selectedPatient);
      this.personService.update(this.selectedPatient).subscribe(payload => {
        console.log(payload);
         this.close_onClick();
      });
    }
  }
  close_onClick() {
    this.editPatient = false;
  }
}
