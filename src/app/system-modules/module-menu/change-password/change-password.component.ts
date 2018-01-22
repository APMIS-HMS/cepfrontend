import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  show = false;

  @ViewChild('showhideinput') input;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_changePass: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private userService: UserService) { }

  ngOnInit() {
    this.frm_changePass = this.formBuilder.group({
      oldPass: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      repassword: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
    });
  }

  changePword(valid, val) {
    if (valid) {
      //   let auth = this.locker.getObject('auth');
      //   this.userService.patch(auth.data._id, {
      //     password: this.frm_changePass.controls['password'].value,
      //     oldpassword: this.frm_changePass.controls['oldPass'].value,
      //     _id: auth.data._id
      //   }, {}).then(payload => {
      //     this.userService.logOut();
      //     this.userService.announceMission('out');
      //     this.userService.isLoggedIn = false;
      //   }, error => {
      //   });
      //   this.close_onClick();
      // } else {
      //   this.errMsg = 'you have unresolved errors';
      //   this.mainErr = true;

      const auth: any = this.locker.getObject('auth');
      const id = auth.data._id;
      const oldpassword = this.frm_changePass.controls['oldPass'].value;
      const password = this.frm_changePass.controls['password'].value;
      this.userService.changePassword({ oldpassword: oldpassword, _id: id }).then(payload => {
        if (payload.body === true) {
          this.userService.patch(id, { password: password }, {})
            .then(nPayload => {
              this.userService.logOut();
              this.userService.announceMission('out');
              this.userService.isLoggedIn = false;
            });
        }
      }, error => {
      });
    }
  }
  close_onClick(event) {
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
