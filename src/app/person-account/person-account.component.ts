import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserFacadeService } from './../system-modules/service-facade/user-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Title } from './../models/facility-manager/setup/title';
import { TitleGenderFacadeService } from './../system-modules/service-facade/title-gender-facade.service';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
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
  isSuccessful = false;

  counterSubscription: Subscription;
  countDown = 10;
  public frmPerson: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private titleGenderFacadeService: TitleGenderFacadeService,
    private personService: PersonService,
    private userService: UserService,
    private userServiceFacade: UserFacadeService,
    private facilitiesService: FacilitiesService,
    private systemModuleService: SystemModuleService,
    private vcr: ViewContainerRef, private toastr: ToastsManager
  ) {
    this.toastr.setRootViewContainerRef(vcr);
  }

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
      if (!this.mainErr) {
        this.isSuccessful = false;
      }

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
    if (valid) {
      this.systemModuleService.on();
      const personModel = <any>{
        title: this.frmPerson.controls['persontitle'].value,
        firstName: this.frmPerson.controls['firstname'].value,
        lastName: this.frmPerson.controls['lastname'].value,
        gender: this.frmPerson.controls['lastname'].value,
        dateOfBirth: this.frmPerson.controls['dob'].value,
        email: this.frmPerson.controls['email'].value,
        primaryContactPhoneNo: this.frmPerson.controls['phone'].value
      };
      console.log(personModel);
      // const userModel = <User>{
      //   email: personModel.apmisId
      // };
      // userModel.personId = ppayload._id;
      let body = {
        person: personModel
      }

      this.personService.createPerson(body).then((ppayload) => {

        this.isSuccessful = true;
        let text = this.frmPerson.controls['firstname'].value + ' '
          + this.frmPerson.controls['lastname'].value + ' '
          + 'added successful'
        this.success(text);
        this.frmPerson.reset();
        this.systemModuleService.off();

        this.counterSubscription = Observable.interval(1000).throttleTime(1000).subscribe(rx => {
          this.countDown = this.countDown - 1;
          console.log(this.countDown);
          if (rx === 9) {
            this.close_onClick();
            this.counterSubscription.unsubscribe();
          }

        });
        // this.userService.create(userModel).then((upayload) => {

        // }, error => {
        //   console.log(error);
        //   this.systemModuleService.off();
        //   // this.mainErr = false;
        //   // this.errMsg = 'An error has occured, please check and try again!';
        // });
      }, err => {
        console.log(err);
        this.systemModuleService.off();
      });
    } else {
      this.mainErr = false;
      this.errMsg = 'An error has occured, please check and try again!';
      this.systemModuleService.off();
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
  success(text) {
    this.toastr.success(text, 'Success!');
  }
  error(text) {
    this.toastr.error(text, 'Error!');
  }
  info(text) {
    this.toastr.info(text, 'Info');
  }
  warning(text) {
    this.toastr.warning(text, 'Warning');
  }
}
