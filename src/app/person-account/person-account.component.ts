import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CountriesService, GenderService, PersonService, UserService, FacilitiesService } from '../services/facility-manager/setup/index';
import { Gender, User, Person, Address } from '../models/index';

@Component({
  selector: 'app-person-account',
  templateUrl: './person-account.component.html',
  styleUrls: ['./person-account.component.scss']
})
export class PersonAccountComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('showhideinput') input;

  show = false;

  countries: any[] = [];
  selectedCountry: any = <any>{};
  genders: Gender[] = [];
  errMsg: string;
  mainErr = true;
  success = false;

  public frmPerson: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private countriesService: CountriesService,
    private genderService: GenderService,
    private personService: PersonService,
    private userService: UserService,
    private facilitiesService: FacilitiesService
  ) { }

  ngOnInit() {
    this.getGenders();
    this.getCountries();
    this.frmPerson = this.formBuilder.group({

      firstname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      othernames: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(200)]],
      // password: ['', [<any>Validators.required, <any>Validators.minLength(6), <any>Validators.maxLength(20)]],
      // repassword: ['', [<any>Validators.required, <any>Validators.minLength(6), <any>Validators.maxLength(20)]],
      gender: [[<any>Validators.minLength(2)]],
      dob: [new Date(), [<any>Validators.required]],
      nationality: ['', [<any>Validators.required]],

      state: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]]
    });

    this.frmPerson.controls['state'].valueChanges.subscribe((value: any) => {
      this.selectedState = value;
    })

    this.frmPerson.valueChanges.subscribe(value =>{
      this.success = false;
    })
  }

  getGenders() {
    this.genderService.findAll().then((payload) => {
      this.genders = payload.data;
    })
  }

  getCountries() {
    this.countriesService.findAll().then((payload) => {
      this.countries = payload.data;
    })
  }

  onNationalityChange(value: any) {
    const country = this.countries.find(item => item._id === value);
    this.selectedCountry = country;
  }

  submit(valid, val) {
    console.log(valid);
    console.log(val)
    if (valid) {
      const personModel = <any>{
        firstName: this.frmPerson.controls['firstname'].value,
        lastName: this.frmPerson.controls['lastname'].value,
        otherNames: this.frmPerson.controls['othernames'].value,
        genderId: this.genders[0]._id,
        dateOfBirth: this.frmPerson.controls['dob'].value,
        homeAddress: <Address>({
          street: this.frmPerson.controls['address'].value,
        }),
        email: this.frmPerson.controls['email'].value,
        phoneNumber: this.frmPerson.controls['phone'].value,
        nationalityId: this.frmPerson.controls['nationality'].value,
        stateOfOriginId: this.frmPerson.controls['state'].value._id,
        lgaOfOriginId: this.frmPerson.controls['lga'].value
      };

      this.personService.create(personModel).then((ppayload) => {
        console.log('person created')
        const userModel = <User>{
          email: ppayload.apmisId
        };
        userModel.personId = ppayload._id;
        this.userService.create(userModel).then((upayload) => {
          console.log('user created')
          this.frmPerson.reset();
          this.success = true;
          this.facilitiesService.announceNotification({
            type: 'Success',
            text: this.frmPerson.controls['firstname'].value + ' '
            + this.frmPerson.controls['othernames'].value + ' '
            + this.frmPerson.controls['lastname'].value + ' '
            + 'added successful'
          });
        }, error => {
          this.mainErr = false;
          this.errMsg = 'An error has occured, please check and try again!';
        });
      }, err => {
      });
    } else {
      this.mainErr = false;
      this.errMsg = 'An error has occured, please check and try again!';
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  toggleShow(e) {
    this.show = !this.show;
    if (this.show) {
      this.input.nativeElement.type = 'text';
    } else {
      this.input.nativeElement.type = 'password';
    }
  }

}
