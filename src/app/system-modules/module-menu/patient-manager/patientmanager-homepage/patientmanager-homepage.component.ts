import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PatientService, PersonService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility, Patient } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
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
    { value: 'steak-0', viewValue: 'male' },
    { value: 'pizza-1', viewValue: 'female' },
  ];

  editPatient = false;
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @Output() empDetail: EventEmitter<string> = new EventEmitter<string>();

  facility: Facility = <Facility>{};
  patients: Patient[] = [];
  searchControl = new FormControl();

  pageSize: number = 1;
  limit: number = 10;

  constructor(private patientService: PatientService, private personService: PersonService,
    private facilityService: FacilitiesService, private locker: CoolLocalStorage, private router: Router,
    private route: ActivatedRoute, private toast: ToastsManager) {
    this.patientService.listner.subscribe(payload => {
      this.getPatients(this.limit);
    });
    this.patientService.createListener.subscribe(payload => {
      console.log(payload);
      this.getPatients(this.limit);
      this.toast.success(payload.personDetails.personFullName + ' created successfully!', 'Success!');
    });

    let away = this.searchControl.valueChanges
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
  ngOnInit() {
    this.pageInView.emit('Patient Manager');
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    this.getPatients(this.limit);
    // this.route.params.subscribe((params: any) => {
    //   this.patientService.find({ query: { personId: params.id, facilityId: this.facility._id } }).then(payload => {
    //     if (payload.data.length > 0) {
    //       this.navEpDetail(payload.data[0]);
    //     }

    //   })
    // })
  }
  sortPatientsByName() {
    let sortedPatient = this.patients;
    sortedPatient.sort(function (x, y) {
      let xLastName = x.personDetails.lastName.toLowerCase();
      let yLastName = y.personDetails.lastName.toLowerCase();
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
    let sortedPatient = this.patients;
    sortedPatient.sort(function (x, y) {
      let xGender = x.personDetails.gender.name.toLowerCase();
      let yGender = y.personDetails.gender.name.toLowerCase();
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
    console.log('event called');
    this.patientService.find({ query: { facilityId: this.facility._id, $limit: limit } }).then(payload => {
      this.patients = payload.data;
      console.log(this.patients);
      console.log(payload);
    });
  }
  onScroll() {
    this.pageSize = this.pageSize + 1;
    let limit = this.limit * this.pageSize;
    this.getPatients(limit);
  }
  onScrollUp() {
    console.log(this.pageSize);
    if (this.pageSize > 1) {
      this.pageSize = this.pageSize - 1;
    }
    let limit = this.limit * this.pageSize;
    this.getPatients(limit);
  }
  slideEdit() {
    this.editPatient = true;
  }
  close_onClick() {
    this.editPatient = false;
  }
}
