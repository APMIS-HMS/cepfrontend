import { Component, OnInit, EventEmitter, Output, OnChanges, Input } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { PatientService, PersonService, FacilitiesService, GenderService, RelationshipService, CountriesService, TitleService } from '../../../../services/facility-manager/setup/index';
import { Facility, Patient, Gender, Relationship, Employee, Person, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-patientmanager-homepage',
  templateUrl: './patientmanager-homepage.component.html',
  styleUrls: ['./patientmanager-homepage.component.scss']
})
export class PatientmanagerHomepageComponent implements OnInit, OnChanges {
  selectedValue: string;
  nextOfKinForm: FormGroup;
  patientEditForm: FormGroup;

  editPatient = false;
  payPlan = false;
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @Output() empDetail: EventEmitter<string> = new EventEmitter<string>();
  @Input() resetData: Boolean;
  @Output() resetDataNew: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  facility: Facility = <Facility>{};
  user: User = <User>{};
  loginEmployee: Employee = <Employee>{};
  patients: Patient[] = [];
  genders: Gender[] = [];
  relationships: Relationship[] = [];
  selectedPatient: Patient = <Patient>{};
  searchControl = new FormControl();
  loading = true;
  countries: any = [];
  states: any = [];
  lgas: any = [];
  cities: any = [];
  titles: any = [];

  pageSize = 1;
  index:any = 0;
  limit:any = 2;
  showLoadMore:Boolean = true;
  total:any = 0;
  updatePatientBtnText: string = 'Update';

  constructor(private patientService: PatientService, private personService: PersonService,
    private facilityService: FacilitiesService, private locker: CoolLocalStorage, private router: Router,
    private route: ActivatedRoute, private toast: ToastsManager, private genderService: GenderService,
    private relationshipService: RelationshipService, private formBuilder: FormBuilder,
    private _countryService: CountriesService,
    private _titleService: TitleService
  ) {
    this.patientService.listner.subscribe(payload => {
      this.getPatients(this.limit);
    });
    this.patientService.createListener.subscribe(payload => {
      console.log(payload);
      this.getPatients();
      let msg = payload.personDetails.lastName +' '+ payload.personDetails.firstName + ' created successfully!';
      this._notification('Success', msg);
    }, error =>{
    
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
  setAppointment(patient) {
    console.log(patient);
    console.log(this.loginEmployee)
    if (patient !== undefined && this.loginEmployee !== undefined) {
      this.router.navigate(['/dashboard/clinic/schedule-appointment', patient._id, this.loginEmployee._id]);
    }

  }
  ngOnInit() {
    this.pageInView.emit('Patient Manager');
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.getGender();
    this.getRelationships();
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.getPatients(this.limit);
    // this._getAllCountries();
    this._getAllTitles();

    this.patientEditForm = this.formBuilder.group({
      title: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      lastName: ['', [<any>Validators.required]],
      email: [{value: '', disabled: true}, [<any>Validators.required]],
      phoneNumber: [{value: '', disabled: true}, [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      country: ['', [<any>Validators.required]],
      state: ['', [<any>Validators.required]],
      city: ['', [<any>Validators.required]],
      lga: ['', [<any>Validators.required]],
      street: ['', [<any>Validators.required]],
      nextOfKin: this.formBuilder.array([])
    });

    this.patientEditForm.controls['country'].valueChanges.subscribe(val => {
      this.states = this.countries.filter(x => x._id === val._id)[0].states;
    });

    this.patientEditForm.controls['state'].valueChanges.subscribe(val => {
      this.lgas = this.states.filter(x => x._id === val._id)[0].lgs;
      this.cities = this.states.filter(x => x._id === val._id)[0].cities;
    });

  }

  ngOnChanges(){
    console.log(this.resetData);
    if(this.resetData === true){
      this.index = 0;
      this.getPatients();
      this.showLoadMore = true;
    }
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
    this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', patient.personId]).then(() => {
      this.patientService.announcePatient(patient);
    })
  }
  getPatients(limit?) {
    this.patientService.find({ 
      query: { 
        facilityId: this.facility._id, 
        $limit: this.limit,
        $skip: this.index * this.limit 
      } 
    }).then(payload => {
      console.log(payload);
      this.loading = false;
      this.total = payload.total;
      if (payload.data.length > 0) {
        if(this.resetData !== true)
        {
          this.patients.push(...payload.data);
        }else{
          this.resetData = false;
          this.resetDataNew.emit(this.resetData);
          this.patients = payload.data;
        }
        if(this.total <= this.patients.length){
          this.showLoadMore = false;
        }
      } else {
        this.patients = [];
      }
    }).catch(errr => {
      console.log(errr);
    });
    this.index++;
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
  loadMore(){
    this.getPatients();
  }
  slideEdit(patient) {
    this.selectedPatient = patient.personDetails;
    console.log(this.selectedPatient);
    this.editPatient = true;
    if (this.selectedPatient.nextOfKin.length > 0) {
      const nextOfKincontrol = <FormArray>this.patientEditForm.controls['nextOfKin'];
      this.selectedPatient.nextOfKin.forEach((nextOfKin, i) => {
        nextOfKincontrol.push(this._populateNextOfKin(nextOfKin));
      });
    }

    this._populateAndSelectData(this.selectedPatient);
  }
  updatePatient(value: any, valid: boolean) {
    this.updatePatientBtnText = 'Updating... <i class="fa fa-spinner fa-spin"></i>';
    const nextOfKinArray = [];
    this.selectedPatient['firstName'] = value.firstName;
    this.selectedPatient['lastName'] = value.lastName;
    this.selectedPatient['personFullName'] = value.firstName + ' ' + value.lastName ;
    this.selectedPatient['gender'] = value.gender;
    this.selectedPatient['genderId'] = value.gender._id;
    this.selectedPatient['nationalityObject'] = {
      country: value.country.name,
      lga: value.lga.name,
      state: value.state.name
    };
    this.selectedPatient['homeAddress'] = {
      city: value.city._id,
      country: value.country._id,
      lga: value.lga._id,
      state: value.state._id,
      street: value.street
    };
    this.selectedPatient['fullAddress'] = value.street + ', ' + value.city.name + ', ' + value.state.name + ', ' + value.country.name;

    if(value.nextOfKin.length > 0) {
      value.nextOfKin.forEach(element => {
        nextOfKinArray.push(element);
      });
    }

    this.selectedPatient['nextOfKin'] = nextOfKinArray;

    this.personService.update(this.selectedPatient).then(res => {
      this.updatePatientBtnText = 'Update';
      this.close_onClick();
      this._notification('Success', 'Patient details has been updated successfully.');
    }).catch(err => {
      this.updatePatientBtnText = 'Update';
      this._notification('Error', 'There was an error updating user record, Please try again later.');
    });
  }

  private _populateAndSelectData(value: any) {
    this.patientEditForm.controls['street'].setValue(value.homeAddress.street);
    
    this.titles.forEach(item => {
      if(item._id === value.title._id) {
        this.patientEditForm.controls['title'].setValue(item);
      }
    });

    this.genders.forEach(item => {
      if(item._id === value.gender._id) {
        this.patientEditForm.controls['gender'].setValue(item);
      }
    });

    this.countries.forEach(item => {
      if(item._id === value.homeAddress.country) {
        this.patientEditForm.controls['country'].setValue(item);
      }
    });

    this.states.forEach(item => {
      if(item._id === value.homeAddress.state) {
        this.patientEditForm.controls['state'].setValue(item);
      }
    });
    
    this.cities.forEach(item => {
      if(item._id === value.homeAddress.city) {
        this.patientEditForm.controls['city'].setValue(item);
      }
    });
    
    this.lgas.forEach(item => {
      if(item._id === value.homeAddress.lga) {
        this.patientEditForm.controls['lga'].setValue(item);
      }
    });
  }

  private _populateNextOfKin(nextOfKin) {
    return this.formBuilder.group({
      address: [nextOfKin.address],
      email: [nextOfKin.email],
      fullName: [nextOfKin.fullName],
      phoneNumber: [nextOfKin.phoneNumber],
      relationship: [nextOfKin.relationship]
    });
  }

  private _initNextOfKin() {
    return this.formBuilder.group({
      address: ['', [<any>Validators.required]],
      email: ['', []],
      fullName: ['', [<any>Validators.required]],
      phoneNumber: ['', [<any>Validators.required]],
      relationship: ['', [<any>Validators.required]]
    });
  }

  addNewNextOfKin() {
    const control = <FormArray>this.patientEditForm.controls['nextOfKin'];
    control.push(this._initNextOfKin());
  }

  payPlanShow(patient) {
    this.selectedPatient = patient;
    this.payPlan = true;
  }

  removeNextOfKin(i: number) {
    const control = <FormArray>this.patientEditForm.controls['nextOfKin'];
    control.removeAt(i);
  }

  close_onClick() {
    this.editPatient = false;
    this.payPlan = false;
    // Reset the next of kin form array
    this.patientEditForm.controls['nextOfKin'] = this.formBuilder.array([]);
  }

  private _getAllCountries() {
    this._countryService.findAll()
      .then(res => {
        this.countries = res.data;
      }).catch(err => console.log(err));
  }
  private _getAllTitles() {
    this._titleService.findAll()
      .then(res => {
        this.titles = res.data;
      }).catch(err => console.log(err));
  }

  // Notification
	private _notification(type: string, text: string): void {
		this.facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
}
