import { UpperCasePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CoolLocalStorage } from "angular2-cool-storage";
import { UserFacadeService } from "app/system-modules/service-facade/user-facade.service";
import { AES, enc } from "crypto-ts";
import { Facility } from "../models/index";
import { FacilitiesService } from "../services/facility-manager/setup/index";
import { UserService } from "../services/facility-manager/setup/index";

import { SystemModuleService } from "./../services/module-manager/setup/system-module.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loadIndicatorVisible = false;
  mainErr = true;
  errMsg = "you have unresolved errors";

  show = false;

  @ViewChild("showhideinput") input;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() pwordReset: EventEmitter<boolean> = new EventEmitter<boolean>();

  input_username;
  input_password;
  public frm_login: FormGroup;
  facilityObj: Facility = <Facility>{};
  inProgress = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private userServiceFacade: UserFacadeService,
    public facilityService: FacilitiesService,
    private systemModule: SystemModuleService,
    private upperCasePipe: UpperCasePipe,
    private locker: CoolLocalStorage,
    private router: Router
  ) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
    });
  }

  ngOnInit() {
    this.frm_login = this.formBuilder.group({
      username: ["", [<any>Validators.required]],
      password: ["", [<any>Validators.required]]
    });

    this.frm_login.valueChanges.subscribe(payload => {
      if (this.frm_login.dirty) {
        this.mainErr = true;
      }
    });
    this.locker.clear();
  }
  login(valid) {
    if (valid) {
      this.inProgress = true;
      this.systemModule.on();
      const query = {
        email: AES.encrypt(
          this.upperCasePipe.transform(
            this.frm_login.controls["username"].value
          ),
          "endurance@pays@alot"
        ),
        password: AES.encrypt(
          this.frm_login.controls["password"].value,
          "endurance@pays@alot"
        )
      };
      this.userService.login(query).then(
        result => {
          this.userServiceFacade
            .authenticateResource()
            .then(
              payload => {
                let auth = { data: result.user };
                this.locker.setObject("auth", auth);
                this.locker.setObject("token", result.accessToken);

                this.router.navigate(["/accounts"]).then(pay => {
                  this.userService.isLoggedIn = true;
                  this.userService.announceMission("in");
                  this.systemModule.off();
                  this.frm_login.controls["password"].reset();
                  this.inProgress = false;
                });
              },
              error => {
                console.log(error);
                this.systemModule.off();
                this.inProgress = false;
              }
            )
            .catch(merr => {
              this.systemModule.off();
              this.frm_login.controls["password"].reset();
              this.inProgress = false;
            });
        },
        error => {
          this.inProgress = false;
          this.errMsg = "Wrong login credentials";
          this.systemModule.announceSweetProxy(this.errMsg, "error");
          this.loadIndicatorVisible = false;
          this.mainErr = false;
          this.frm_login.controls["password"].reset();
          this.systemModule.off();
        }
      );
    } else {
      this.inProgress = false;
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
      this.input.nativeElement.type = "text";
    } else {
      this.input.nativeElement.type = "password";
    }
  }
}
