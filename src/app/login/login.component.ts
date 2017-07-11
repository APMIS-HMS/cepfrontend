import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import { FacilitiesService } from '../services/facility-manager/setup/index';
import { Facility } from '../models/index';
import { UserService } from '../services/facility-manager/setup/index';


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
    public facilityService: FacilitiesService,
    private locker: CoolSessionStorage, private router: Router) {
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
    console.log('Login');
    if (valid) {
      this.loadIndicatorVisible = true;
      const query = {
        email: this.frm_login.controls['username'].value,
        password: this.frm_login.controls['password'].value
      };
      this.userService.login(query).then(result => {
        this.locker.setObject('auth', result);
        this.userService.isLoggedIn = true;
        this.userService.announceMission('in');
        this.router.navigate(['/accounts']);
        this.loadIndicatorVisible = false;
      },
        error => {
          console.log(error);
          this.loadIndicatorVisible = false;
          this.mainErr = false;
          this.errMsg = 'wrong login credentials';
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
