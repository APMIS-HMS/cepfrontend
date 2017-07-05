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
  selectedState: any = <any>{};
  genders: Gender[] = [];
  errMsg: string;
  mainErr = true;

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
      password: ['', [<any>Validators.required, <any>Validators.minLength(6), <any>Validators.maxLength(20)]],
      repassword: ['', [<any>Validators.required, <any>Validators.minLength(6), <any>Validators.maxLength(20)]],
      gender: [[<any>Validators.minLength(2)]],
      dob: [new Date(), [<any>Validators.required]],
      nationality: ['', [<any>Validators.required]],

      state: ['', [<any>Validators.required]],
      lga: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]]
    });

    this.frmPerson.controls['state'].valueChanges.subscribe((value: any) => {
      this.selectedState = value;
    })
  }


  getGenders() {
    this.genderService.findAll().then((payload) => {
      this.genders = payload.data;
      console.log(this.genders);
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
    if (valid) {
      if (this.frmPerson.controls['repassword'].value === this.frmPerson.controls['password'].value) {
        console.log('Started');
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
        console.log(personModel);
        const userModel = <User>{
          email: this.frmPerson.controls['email'].value,
          password: this.frmPerson.controls['password'].value
        };
        console.log(userModel);
        this.personService.create(personModel).then((ppayload) => {
          userModel.personId = ppayload._id;
          console.log('Person');
          this.userService.create(userModel).then((upayload) => {
            console.log('user created');
          }, error => {
            this.mainErr = false;
            this.errMsg = 'An error has occured, please check and try again!';
          });
          this.facilitiesService.announceNotification({
            type: 'Success',
            text: this.frmPerson.controls['firstname'].value + ' '
            + this.frmPerson.controls['othernames'].value + ' '
            + this.frmPerson.controls['lastname'].value + ' '
            + 'added successful'
          });
        }, err => {
          console.log(err);
        });
      }
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
