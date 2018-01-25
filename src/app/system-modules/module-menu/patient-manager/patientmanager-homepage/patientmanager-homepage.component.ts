import { EMAIL_REGEX } from 'app/shared-module/helpers/global-config';
import { NUMERIC_REGEX, ALPHABET_REGEX } from './../../../../shared-module/helpers/global-config';
import { CountryServiceFacadeService } from './../../../service-facade/country-service-facade.service';
import { TitleGenderFacadeService } from 'app/system-modules/service-facade/title-gender-facade.service';
import { Component, OnInit, EventEmitter, ElementRef, ViewChild, Output, OnChanges, Input } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { PatientService, PersonService, FacilitiesService, GenderService, RelationshipService, CountriesService, TitleService } from '../../../../services/facility-manager/setup/index';
import { Facility, Patient, Gender, Relationship, Employee, Person, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-patientmanager-homepage',
  templateUrl: './patientmanager-homepage.component.html',
  styleUrls: ['./patientmanager-homepage.component.scss']
})
export class PatientmanagerHomepageComponent implements OnInit, OnChanges {
  selectedValue: string;
  nextOfKinForm: FormGroup;
  patientEditForm: FormGroup;

  
  isEdit:boolean = false;
  tabWallet = true;
  tabInsurance = false;
  tabCompany = false;
  tabFamily = false;

  editPatient = false;
  payPlan = false;
  newUpload = false;
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @Output() empDetail: EventEmitter<string> = new EventEmitter<string>();
  @Input() resetData: Boolean;
  @Output() resetDataNew: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @ViewChild('fileInput') fileInput: ElementRef;

  facility: Facility = <Facility>{};
  user: User = <User>{};
  loginEmployee: Employee = <Employee>{};
  patients: Patient[] = [];
  genders: any[] = [];
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
  index: any = 0;
  limit: any = 5;
  showLoadMore: Boolean = true;
  total: any = 0;
  updatePatientBtnText = 'Update';
  loadMoreText = '';

  constructor(private patientService: PatientService, private personService: PersonService,
    private facilityService: FacilitiesService, private locker: CoolLocalStorage, private router: Router,
    private route: ActivatedRoute, private toast: ToastsManager, private genderService: TitleGenderFacadeService,
    private relationshipService: RelationshipService, private formBuilder: FormBuilder,
    private _countryService: CountriesService, private systemService: SystemModuleService,
    private _titleService: TitleService, private countryFacadeService: CountryServiceFacadeService
  ) {
    this.systemService.on();
    this.patientService.listner.subscribe(payload => {
      this.pageSize = 1;
      this.index = 0;
      this.limit = 5;
      this.showLoadMore = true;
      this.total = 0;
      this.patients = [];
      this.getPatients(this.limit);
    });
    this.patientService.createListener.subscribe(payload => {
      this.pageSize = 1;
      this.index = 0;
      this.limit = 5;
      this.showLoadMore = true;
      this.total = 0;
      this.patients = [];
      this.getPatients(this.limit);
      const msg = payload.personDetails.lastName + ' ' + payload.personDetails.firstName + ' created successfully!';
      this._notification('Success', msg);
    }, error => {

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
    this.genderService.getGenders().then((payload: any) => {
      this.genders = payload;
    }, error => {
      this.getGender();
    })
  }
  getRelationships() {
    this.relationshipService.find({}).then(payload => {
      this.relationships = payload.data;
    }, error => {
      this.getRelationships();
    })
  }
  setAppointment(patient) {
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
    this._getAllCountries();
    this._getAllTitles();

    this.patientEditForm = this.formBuilder.group({
      title: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      lastName: ['', [<any>Validators.required]],
      email: [{ value: '', disabled: true }, [<any>Validators.required]],
      phoneNumber: [{ value: '', disabled: true }, [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      country: ['', [<any>Validators.required]],
      state: ['', [<any>Validators.required]],
      city: ['', [<any>Validators.required]],
      lga: ['', [<any>Validators.required]],
      street: ['', [<any>Validators.required]],
      nextOfKin: this.formBuilder.array([])
    });


    //   this.frmNewEmp2.controls['empCountry'].valueChanges.subscribe((value) => {
    //     this.countryFacadeService.getOnlyStates(value, true).then((states: any) => {
    //         this.contactStates = states;
    //     }).catch(err => { });
    // });
    // this.frmNewEmp2.controls['empContactState'].valueChanges.subscribe((value) => {
    //     let country = this.frmNewEmp2.controls['empCountry'].value;
    //     this.countryFacadeService.getOnlyLGAndCities(country, value, true).then((lgsAndCities: any) => {
    //         this.cities = lgsAndCities.cities;
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // });

    this.patientEditForm.controls['country'].valueChanges.subscribe(val => {
      this.countryFacadeService.getOnlyStates(val, true).then((states: any) => {
        this.states = states;
      }).catch(err => { });

    });

    this.patientEditForm.controls['state'].valueChanges.subscribe(val => {
      // if (val !== null && val !== undefined) {
      //   this.lgas = this.states.filter(x => x._id === val._id)[0].lgs;
      //   this.cities = this.states.filter(x => x._id === val._id)[0].cities;
      // }
      let country = this.patientEditForm.controls['country'].value;
      this.countryFacadeService.getOnlyLGAndCities(country, val, true).then((lgsAndCities: any) => {
        this.cities = lgsAndCities.cities;
        this.lgas = lgsAndCities.lgs;
      }).catch(err => {
        console.log(err);
      });
    });

  }

  ngOnChanges() {
    if (this.resetData === true) {
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
    console.log(patient);
    this.locker.setObject('patient', patient);
    this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', patient.personId]).then(() => {
      this.patientService.announcePatient(patient);
    }).catch(err => {
      console.log(err);
    });
  }
  getPatients(limit?) {
    this.loading = true;
    this.systemService.on();
    this.patientService.find({
      query: {
        facilityId: this.facility._id,
        $limit: this.limit,
        $skip: this.index * this.limit,
        $sort: { createdAt: -1 }
      }
    }).then(payload => {
      this.systemService.off();
      this.loading = false;
      this.total = payload.total;
      console.log(payload.data)
      if (payload.data.length > 0) {
        if (this.resetData !== true) {
          this.patients.push(...payload.data);
        } else {
          this.resetData = false;
          this.resetDataNew.emit(this.resetData);
          this.patients = payload.data;
        }
        if (this.total <= this.patients.length) {
          this.showLoadMore = false;
        }
      } else {
        this.patients = [];
      }
      this.getShowing();
    }).catch(errr => {
      this.systemService.off();
      this.loading = false;
    });
    this.index++;
  }
  getShowing() {
    const ret = this.index * this.limit
    if (ret >= this.total && this.index > 0) {
      this.loadMoreText = 'Showing ' + this.total + ' of ' + this.total + ' records';
      return;
    }
    this.loadMoreText = 'Showing ' + ret + ' of ' + this.total + ' records';
  }
  onScroll() {
    this.pageSize = this.pageSize + 1;
    const limit = this.limit * this.pageSize;
    this.getPatients(limit);
  }
  onScrollUp() {
    if (this.pageSize > 1) {
      this.pageSize = this.pageSize - 1;
    }
    const limit = this.limit * this.pageSize;
    this.getPatients(limit);
  }
  loadMore() {
    this.getPatients();
  }
  slideEdit(patient) {
    this.patientService.get(patient._id, {}).then(payload => {
      this.selectedPatient = payload.personDetails;
      this.editPatient = true;
      if (this.selectedPatient.nextOfKin.length > 0) {
        const nextOfKincontrol = <FormArray>this.patientEditForm.controls['nextOfKin'];
        this.selectedPatient.nextOfKin.forEach((nextOfKin, i) => {
          nextOfKincontrol.push(this._populateNextOfKin(nextOfKin));
        });
      }

      this._populateAndSelectData(this.selectedPatient);
    })
  }
  updatePatient(value: any, valid: boolean) {
    console.log(value);
    this.updatePatientBtnText = 'Updating... <i class="fa fa-spinner fa-spin"></i>';
    const nextOfKinArray = [];
    this.selectedPatient['firstName'] = value.firstName;
    this.selectedPatient['lastName'] = value.lastName;
    this.selectedPatient['personFullName'] = value.firstName + ' ' + value.lastName;
    this.selectedPatient['gender'] = value.gender;
    this.selectedPatient['genderId'] = value.gender._id;
    this.selectedPatient['nationalityObject'] = {
      country: value.country.name,
      lga: value.lga.name,
      state: value.state.name
    };
    this.selectedPatient['homeAddress'] = {
      city: value.city,
      country: value.country,
      lga: value.lga,
      state: value.state,
      street: value.street
    };
    this.selectedPatient['fullAddress'] = value.street + ', ' + value.city.name + ', ' + value.state.name + ', ' + value.country.name;

    if (value.nextOfKin.length > 0) {
      value.nextOfKin.forEach(element => {
        console.log(element);
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
    console.log(value);
    this.patientEditForm.controls['street'].setValue(value.homeAddress.street);
    this.patientEditForm.controls['phoneNumber'].setValue(value.primaryContactPhoneNo);

    this.patientEditForm.controls['title'].setValue(value.title);
    this.patientEditForm.controls['gender'].setValue(value.gender);
    this.patientEditForm.controls['country'].setValue(value.homeAddress.country);
    this.patientEditForm.controls['state'].setValue(value.homeAddress.state);
    this.patientEditForm.controls['city'].setValue(value.homeAddress.city);
    this.patientEditForm.controls['lga'].setValue(value.homeAddress.lga);
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
      email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
      fullName: ['', [<any>Validators.required, <any>Validators.pattern(ALPHABET_REGEX)]],
      phoneNumber: ['', [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
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
    this.newUpload = false;
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
    this.genderService.getTitles()
      .then(res => {
        this.titles = res;
      }).catch(err => {
        this._getAllTitles();
      });
  }

  // Notification
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
  onChange(e) {
    //upload stuff
  }
  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  newUpload_show() {
    this.newUpload = true;
  }
  compareState(l1: any, l2: any) {
		return l1.includes(l2);
  }
  


  tabWallet_click() {
    this.tabWallet = true;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = false;
}
tabCompany_click() {
    this.tabWallet = false;
    this.tabCompany = true;
    this.tabFamily = false;
    this.tabInsurance = false;
}
tabFamily_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = true;
    this.tabInsurance = false;
}
tabInsurance_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = true;
}



}
