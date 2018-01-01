import { Title } from './../models/facility-manager/setup/title';
import { TitleGenderFacadeService } from './../system-modules/service-facade/title-gender-facade.service';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CountriesService, GenderService, PersonService, UserService, FacilitiesService } from '../services/facility-manager/setup/index';
import { Gender, User, Person, Address } from '../models/index';
import { EMAIL_REGEX, PHONE_REGEX } from 'app/shared-module/helpers/global-config';

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
  titles: Title[] = [];
  errMsg: string;
  mainErr = true;
  success = false;

  public frmPerson: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private titleGenderFacadeService: TitleGenderFacadeService,
    private personService: PersonService,
    private userService: UserService,
    private facilitiesService: FacilitiesService
  ) { }

  ngOnInit() {
    this.getGenders();
    this.getTitles();
    this.frmPerson = this.formBuilder.group({
      persontitle: [new Date(), [<any>Validators.required]],
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      gender: [[<any>Validators.minLength(2)]],
      dob: [new Date(), [<any>Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern(EMAIL_REGEX)]],
      phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]]
    });

    this.frmPerson.valueChanges.subscribe(value => {
      this.success = false;
      this.mainErr = true;
      this.errMsg = '';
    })
  }


  getGenders() {
    this.titleGenderFacadeService.getGenders().then((payload: any) => {
      this.genders = payload;
    })
  }

  getTitles() {
    this.titleGenderFacadeService.getTitles().then((payload: any) => {
      this.titles = payload;
    })
  }
  onNationalityChange(value: any) {
    const country = this.countries.find(item => item._id === value);
    this.selectedCountry = country;
  }

  submit(valid, val) {
    console.log(valid);
    console.log(val);
    if (valid) {
      const personModel = <any>{
        title: this.frmPerson.controls['persontitle'].value,
        firstName: this.frmPerson.controls['firstname'].value,
        lastName: this.frmPerson.controls['lastname'].value,
        gender: this.frmPerson.controls['lastname'].value,
        dateOfBirth: this.frmPerson.controls['dob'].value,
        email: this.frmPerson.controls['email'].value,
        phoneNumber: this.frmPerson.controls['phone'].value
      };

      this.personService.create(personModel).then((ppayload) => {
        const userModel = <User>{
          email: ppayload.apmisId
        };
        userModel.personId = ppayload._id;
        this.userService.create(userModel).then((upayload) => {
          this.frmPerson.reset();
          this.success = true;
          this.facilitiesService.announceNotification({
            type: 'Success',
            text: this.frmPerson.controls['firstname'].value + ' '
              + this.frmPerson.controls['lastname'].value + ' '
              + 'added successful'
          });
        }, error => {
          console.log(error);
          // this.mainErr = false;
          // this.errMsg = 'An error has occured, please check and try again!';
        });
      }, err => {
        console.log(err);
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
