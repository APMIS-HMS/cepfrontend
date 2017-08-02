import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, User, Person, Patient, Address } from '../../../../../models/index';
import { 
  FacilitiesService, CountriesService, GenderService, PersonService, PatientService
 } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss']
})
export class AddPersonComponent implements OnInit {
  newPersonForm: FormGroup;
  facility: Facility = <Facility>{};
  user: User = <User>{};
  countries: any[] = [];
  states: any[] = [];
  lgas: any[] = [];
  genders: any[] = [];
  saveBtnText: string = 'Save';
  disableSaveBtn: boolean = false;

  constructor(
    private _fb: FormBuilder,
		private _router: Router,
		private _locker: CoolSessionStorage,
    private _facilityService: FacilitiesService,
    private _countryService: CountriesService,
    private _genderService: GenderService,
    private _personService: PersonService,
    private _patientService: PatientService
  ) { }

  ngOnInit() {
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

    this._getCountriesService();
    this._getGenders();
    
    this.newPersonForm = this._fb.group({
      firstName: ['', [<any>Validators.required]],
      lastName: ['', [<any>Validators.required]],
      phone: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      dob: ['', [<any>Validators.required]],
      nationality: ['', [<any>Validators.required]],
      state: ['', [<any>Validators.required]],
      lga: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
    });

    this.newPersonForm.controls['nationality'].valueChanges.subscribe(val => {
      const states = this.countries.filter(x => x._id === val);
      this.states = states[0].states;
    });
    
    this.newPersonForm.controls['state'].valueChanges.subscribe(val => {
      const lgas = this.states.filter(x => x._id === val);
      this.lgas = lgas[0].lgs;
    });

    this._patientService.receivePatient().subscribe((patient: Patient) => {
      console.log(patient);
      this._populatePersonForm(patient.personDetails);
      this._personService.announcePerson(patient.personDetails);
		});
  }

  onClickSavePerson(value: any, valid: boolean) {
    if(valid) {
      console.log(value);
      this.disableSaveBtn = true;
      this.saveBtnText = "Processing... <i class='fa fa-spinner fa-spin'></i>";
      // create person and user
      const personModel = <Person>{
        firstName: value.firstName,
        lastName: value.lastName,
        genderId: value.gender,
        homeAddress: <Address>({
          street: value.address
        }),
        phoneNumber: value.phone,
        lgaOfOriginId: value.lga,
        nationalityId: value.nationality,
        stateOfOriginId: value.state,
        dateOfBirth: value.dob
      };

      this._personService.create(personModel).then((res) => {
        const modifyRes = this._getAge(res);
        // Emit person as an event
        this._personService.announcePerson(modifyRes);
        // Reset form and change button effect.
        this._resetForm();
      })
      .catch(err => { console.log(err); });
    } else {
      this._notification('Info', 'Some fields are empty. Please ensure that you fill in all fields.');
    }
  }

  private _resetForm() {
    this.disableSaveBtn = true;
    this.saveBtnText = "Save";
    this.newPersonForm.reset('firstName');
    this.newPersonForm.reset('lastName');
    this.newPersonForm.reset('phone');
    this.newPersonForm.reset('gender');
    this.newPersonForm.reset('address');
    this.newPersonForm.reset('dob');
  }

  private _populatePersonForm(person: any): void {
    this.newPersonForm.controls['firstName'].setValue(person.firstName);
    this.newPersonForm.controls['lastName'].setValue(person.lastName);
    this.newPersonForm.controls['phone'].setValue(person.phoneNumber);
    this.newPersonForm.controls['gender'].setValue(person.genderId);
    this.newPersonForm.controls['address'].setValue(person.homeAddress.street);
    this.newPersonForm.controls['dob'].setValue(person.dateOfBirth);
    this.newPersonForm.controls['nationality'].setValue(person.nationality._id);
    this.newPersonForm.controls['state'].setValue(person.stateOfOriginId);
    this.newPersonForm.controls['lga'].setValue(person.lgaOfOriginId);
    this.disableSaveBtn = true;
  }

  private _getAge(data) {
    const age = new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear();
    data.age = age;
    return data;
  }

  private _getCountriesService() {
    this._countryService.findAll()
      .then(res => {
        this.countries = res.data;
      })
      .catch(err => { console.log(err); });
  }

  private _getGenders() {
    this._genderService.findAll()
      .then(res => {
        this.genders = res.data;
      })
      .catch(err => { console.log(err); });
  }

  // Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}

}
