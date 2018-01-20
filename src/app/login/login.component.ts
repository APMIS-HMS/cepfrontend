import { UserFacadeService } from 'app/system-modules/service-facade/user-facade.service';
import { SystemModuleService } from './../services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import { FacilitiesService } from '../services/facility-manager/setup/index';
import { Facility } from '../models/index';
import { UserService } from '../services/facility-manager/setup/index';
import { JoinChannelService } from 'app/services/facility-manager/setup/join-channel.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loadIndicatorVisible = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';

  show = false;

  @ViewChild('showhideinput') input;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pwordReset: EventEmitter<boolean> = new EventEmitter<boolean>();


  input_username;
  input_password;
  public frm_login: FormGroup;
  facilityObj: Facility = <Facility>{};

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private userServiceFacade:UserFacadeService,
    public facilityService: FacilitiesService,
    private systemModule: SystemModuleService,
    private locker: CoolLocalStorage, private router: Router) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
    });
  }

  ngOnInit() {
    this.frm_login = this.formBuilder.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]]
    });

    this.frm_login.valueChanges.subscribe(payload => {
      if (this.frm_login.dirty) {
        this.mainErr = true;
      }
    });
  }
  login(valid) {
    if (valid) {
      this.systemModule.on();
      const query = {
        email: this.frm_login.controls['username'].value,
        password: this.frm_login.controls['password'].value
      };
      this.userService.login(query).then(result => {
        this.userServiceFacade.authenticateResource().then(payload => {
          console.log(payload)
          let auth = {
            data: result.user
          };
          this.locker.setObject('auth', auth);

          this.router.navigate(['/accounts']).then(pay => {
            this.userService.isLoggedIn = true;
            this.userService.announceMission('in');
            this.systemModule.off();
            this.frm_login.controls['password'].reset();
          });
        }, error => {
          this.systemModule.off();
          console.log(error);
        }).catch(merr => {
          this.systemModule.off();
          this.frm_login.controls['password'].reset();
          console.log(merr);
        });
      },
        error => {
          this.loadIndicatorVisible = false;
          this.mainErr = false;
          this.errMsg = 'wrong login credentials';
          this.frm_login.controls['password'].reset();
          this.systemModule.off();
        });
      // this.userService.login(query).then(result => {
      //   this.locker.setObject('auth', result);
      //   this.userService.isLoggedIn = true;
      //   this.userService.reload();
      //   this.getFacility();
      //   this.router.navigate(['/modules']);

      // },
      //   error => {
      //     this.mainErr = false;
      //     this.errMsg = 'wrong login credentials';
      //   });
    } else {
      this.mainErr = false;
    }
  }

  reset() {
    this.pwordReset.emit(true);
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
