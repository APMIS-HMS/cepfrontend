import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { EMAIL_REGEX } from 'app/shared-module/helpers/global-config';
import { NUMERIC_REGEX, ALPHABET_REGEX } from './../../../../shared-module/helpers/global-config';
import { CountryServiceFacadeService } from './../../../service-facade/country-service-facade.service';
import { TitleGenderFacadeService } from 'app/system-modules/service-facade/title-gender-facade.service';
import { Component, OnInit, EventEmitter, ElementRef, ViewChild, Output, OnChanges, Input, SimpleChanges, SimpleChange } from '@angular/core';
// tslint:disable-next-line:max-line-length
import {
  PatientService, PersonService, FacilitiesService, FacilitiesServiceCategoryService,
  HmoService, GenderService, RelationshipService, CountriesService, TitleService
} from '../../../../services/facility-manager/setup/index';
import { Facility, Patient, Gender, Relationship, Employee, Person, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-patientmanager-homepage',
  templateUrl: './patientmanager-homepage.component.html',
  styleUrls: ['./patientmanager-homepage.component.scss']
})
export class PatientmanagerHomepageComponent implements OnInit, OnChanges {
  selectedValue: string;
  nextOfKinForm: FormGroup;
  patientEditForm: FormGroup;


  isEdit = false;
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
  @Input() searchedPatients: any;
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

  walletPlanPrice = new FormControl('', Validators.required);
  walletPlan = new FormControl('', Validators.required);
  walletPlanCheck = new FormControl('');
  insuranceId = new FormControl('', Validators.required);
  hmoPlan = new FormControl('', Validators.required);
  hmoPlanId = new FormControl('', Validators.required);
  hmoPlanPrice = new FormControl('', Validators.required);
  hmoPlanCheck = new FormControl('');
  ccPlan = new FormControl('', Validators.required);
  ccPlanId = new FormControl('', Validators.required);
  ccPlanCheck = new FormControl('');
  familyPlanId = new FormControl('', Validators.required);
  familyPlanCheck = new FormControl('');
  faPlanPrice = new FormControl('');
  faPlan = new FormControl('');
  isDefault = new FormControl('');
  patient: any;

  filteredHmos: Observable<any[]>;
  hmos;

  services: any;
  servicePricePlans: any;

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
    private authFacadeService: AuthFacadeService, private hmoService: HmoService,
    private _titleService: TitleService, private countryFacadeService: CountryServiceFacadeService,
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService
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

    /* const away = this.searchControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((term: Patient[]) => this.patientService.searchPatient(this.facility._id, this.searchControl.value));

    away.subscribe((payload: any) => {
      this.patients = payload.body;
    }); */

    this.filteredHmos = this.hmoPlanId.valueChanges
      .pipe(
        startWith(''),
        map((hmo: any) => hmo ? this.filterHmos(hmo) : this.hmos.slice())
      );


  }
  /* searchPatients(searchText: string) {
    this.searchControl.setValue(searchText);
  } */
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
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
    })
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.getGender();
    this.getRelationships();
    // this.facility = <Facility>this.locker.getObject('selectedFacility');
    // this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.getPatients(this.limit);
    this._getAllCountries();
    this._getAllTitles();

    this.gethmos();
    this.getCategories();

    this.systemService.currentMessage.subscribe(message => {
      if (message) {
        this.slideEdit(message);
      }
    });

    this.patientEditForm = this.formBuilder.group({
      title: ['', [<any>Validators.required]],
      firstName: ['', [<any>Validators.required]],
      lastName: ['', [<any>Validators.required]],
      email: [{ value: '', disabled: false }, [<any>Validators.required]],
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
      const country = this.patientEditForm.controls['country'].value;
      this.countryFacadeService.getOnlyLGAndCities(country, val, true).then((lgsAndCities: any) => {
        this.cities = lgsAndCities.cities;
        this.lgas = lgsAndCities.lgs;
      }).catch(err => {
      });
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.resetData === true) {
      this.index = 0;
      this.getPatients();
      this.showLoadMore = true;
    }
    if (changes.searchedPatients.currentValue) {
      console.log(changes);
      this.patients = changes.searchedPatients.currentValue;
      this.total = this.patients.length;
      console.log(this.total);
      if (this.total <= this.patients.length) {
        this.showLoadMore = false;
      }
      this.getShowing();
      console.log(this.patients);
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
    this.locker.setObject('patient', patient);
    this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', patient.personId]).then(() => {
      this.patientService.announcePatient(patient);
    }).catch(err => {
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

  getPatientCovers(patientId) {
    this.patientService.find({
      facilityId: this.facility._id,
      patientId: patientId
    }).then(payload => {
    })
  }

  getCategories() {
    this._facilitiesServiceCategoryService.allServices({
      query: {
        facilityId: this.facility._id
      }
    }).then(payload => {
      const categories = payload.data[0].categories;
      const cat = categories.filter(x => x.name === 'Medical Records');
      for (let n = 0; n < cat[0].services.length; n++) {
        cat[0].services[n].facilityServiceId = payload.data[0]._id
      }
      this.services = cat[0].services;
    }, error => {

    });
  }

  getServicePlans(service) {
    this.servicePricePlans = service.price;
  }

  filterHmos(val: any) {
    if (val.hmoName === undefined) {
      return this.hmos.filter(hmo =>
        hmo.hmoName.toLowerCase().indexOf(val.toLowerCase()) === 0);
    } else {
      return this.hmos.filter(hmo =>
        hmo.hmoName.toLowerCase().indexOf(val.hmoName.toLowerCase()) === 0);
    }
  }

  gethmos() {
    this.hmoService.getHmos({
      query: {
        facilityId: this.facility._id
      }
    }).then(payload => {
      this.hmos = payload;
    }).catch(err => {
    });
  }

  displayFn(hmo: any): string {
    return hmo ? hmo.hmoName : hmo;
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
      this.patient = payload;
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
        nextOfKinArray.push(element);
      });
    }
    this.selectedPatient['nextOfKin'] = nextOfKinArray;
<<<<<<< HEAD
=======
    console.log(this.selectedPatient);

>>>>>>> d20feab8ec779c28145be9d8590c3f9391dfffd7
    const patientIndex = this.patients.findIndex(p => p.personDetails._id === this.selectedPatient._id);
    this.personService.patch(this.selectedPatient._id, this.selectedPatient, {}).then(res => {
      console.log(res);
      this.updatePatientBtnText = 'Update';
      this.patients[patientIndex].personDetails = res;
      this.close_onClick();
      this.systemService.announceSweetProxy('Patient details has been updated successfully.', 'Success');
    }).catch(err => {
      console.log(err);
      this.updatePatientBtnText = 'Update';
      this.systemService.announceSweetProxy('There was an error updating user record, Please try again later.', 'Error');
    });
  }

  private _populateAndSelectData(value: any) {
    if (value.homeAddress) {
      this.patientEditForm.controls['street'].setValue(value.homeAddress.street);
      this.patientEditForm.controls['country'].setValue(value.homeAddress.country);
      this.patientEditForm.controls['state'].setValue(value.homeAddress.state);
      this.patientEditForm.controls['city'].setValue(value.homeAddress.city);
      this.patientEditForm.controls['lga'].setValue(value.homeAddress.lga);
    }

    if (value.email !== undefined) {
      this.patientEditForm.controls['email'].disable();
      // this.patientEditForm.get('email').disable();
    }

    this.patientEditForm.controls['phoneNumber'].setValue(value.primaryContactPhoneNo);

    this.patientEditForm.controls['title'].setValue(value.title);
    this.patientEditForm.controls['gender'].setValue(value.gender);
  }

  isEditFn(patient?, cover?) {
    this.isEdit = !this.isEdit;
    if (cover === 'wallet') {
      this.tabWallet_click();
    } else if (cover === 'company') {
      this.tabCompany_click();
    } else if (cover === 'insurance') {
      this.tabInsurance_click();
    } else if (cover === 'family') {
      this.tabFamily_click();
    } else {  }
  }

  backBtn() {
    this.isEdit = false;
  }

  next(cover) {
    this.systemService.on();
    const data = JSON.parse(JSON.stringify(this.patient.paymentPlan));
    const check = data.filter(x => x.planType === cover);
    if (this.isDefault.value === true) {
      const index = data.findIndex(c => c.isDefault === true);
      if (index > -1) {
        data[index].isDefault = false;
      }
    }

    if (check.length < 1) {
      if (cover === 'wallet') {
        data.push({
          planType: cover,
          isDefault: Boolean(this.isDefault.value)
        });
      } else if (cover === 'insurance') {
        data.push({
          planType: cover,
          isDefault: Boolean(this.isDefault.value),
          planDetails: {
            hmoId: this.hmoPlanId.value.hmoId,
            principalId: this.insuranceId.value
          }
        });
      } else if (cover === 'company') {
        data.push({
          planType: cover,
          isDefault: Boolean(this.isDefault.value),
          planDetails: {
            companyId: this.ccPlanId.value.hmoId,
            principalId: this.insuranceId.value
          }
        });
      } else if (cover === 'family') {
        data.push({
          planType: cover,
          isDefault: Boolean(this.isDefault.value),
          planDetails: {
            principalId: this.familyPlanId.value
          }
        });
      }
    }
    this.patientService.patch(this.patient._id, {
      paymentPlan: data
    }, {}).then(payload => {
      this.systemService.off();
      this.patient = payload;
      this.systemService.announceSweetProxy('Payment Methods successfully updated', 'success');
      this.backBtn();
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
    // upload stuff
  }
  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  newUpload_show(patient) {
    this.selectedPatient = patient;
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
