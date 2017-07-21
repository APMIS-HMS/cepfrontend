import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService, PersonService } from '../services/facility-manager/setup/index';
import { Person, User } from '../models/index';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  showInfo = true;
  isTokenAvailable: boolean = false;
  selectedPerson: Person = <Person>{};

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loginEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_pwdReset1: FormGroup;
  public frm_pwdReset2: FormGroup;

  modal1_show = true;
  modal2_show = false;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private personService: PersonService) { }

  ngOnInit() {
    this.frm_pwdReset1 = this.formBuilder.group({
      apmisid: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.
        pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phoneNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
    });

    this.frm_pwdReset2 = this.formBuilder.group({
      token: ['', [<any>Validators.required, <any>Validators.minLength(6),
      <any>Validators.maxLength(7)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      repassword: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });

    this.frm_pwdReset1.valueChanges.subscribe(value => {
      this.showInfo = true;
      this.mainErr = true;
    });
  }

  verify(valid, val) {
    if (valid) {
      this.isTokenAvailable = false;
      let apmisId = this.frm_pwdReset1.controls['apmisid'].value;
      let telephone = this.frm_pwdReset1.controls['phoneNo'].value;
      this.personService.find({ query: { apmisId: apmisId, phoneNumber: telephone } })
        .then(payload => {
          console.log(payload.data);
          if (payload.data.length > 0) {
            this.selectedPerson = payload.data[0];
            console.log(this.selectedPerson);
            this.userService.resetPassword({ personId: this.selectedPerson._id }).then(tokenPayload => {
              console.log(tokenPayload);
              this.isTokenAvailable = tokenPayload.text;
              console.log(this.isTokenAvailable);
              if (this.isTokenAvailable !== false) {
                this.modal1_show = false;
                this.modal2_show = true;
              } else {
                this.mainErr = false;
                this.errMsg = 'Error while generating isTokenAvailable, please try again!';
              }
            }, error => {
              console.log(error);
            });

          } else {
            this.mainErr = false;
            this.showInfo = false;
            this.errMsg = 'Invalid APMISID or Telephone Number supplied, correct and try again!';
          }
        });
    } else {
      this.mainErr = false;
      this.showInfo = false;
    }

  }

  reset(valid, val) {
    this.userService.find({ query: { personId: this.selectedPerson._id } }).then(payload => {
      if (payload.length > 0) {
        let user: User = payload[0];
        let inputToken = this.frm_pwdReset2.controls['token'].value;
        let realToken = user.passwordToken;
        if (inputToken === realToken) {
          this.userService.patch(user._id, { password: this.frm_pwdReset2.controls['password'].value }, {})
            .then(ppayload => {
              this.modal1_show = false;
              this.modal2_show = false;
              this.close_onClick();
            });
        }

      }
    }, error => {
      console.log(error);
    });

  }

  back_resetFrm1() {
    this.modal1_show = true;
    this.modal2_show = false;
  }

  login() {
    this.loginEmit.emit(true);
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
