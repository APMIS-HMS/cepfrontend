import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthorizationType } from "./../../models/facility-manager/setup/documentation";
import { UserService } from "./../../services/facility-manager/setup/user.service";

@Component({
  selector: "app-pass-continue",
  templateUrl: "./pass-continue.component.html",
  styleUrls: ["./pass-continue.component.scss"]
})
export class PassContinueComponent implements OnInit {
  @Input() headerText = "Confirm password to continue";
  @Input() btnText = "Confirm Password";
  @Input() authorizationType: AuthorizationType = AuthorizationType.Medical;
  @Input() patientId: any;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_conpass: FormGroup;
  authorizationTypeText = "";
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.frm_conpass = this.formBuilder.group({
      otp: ["", [<any>Validators.required]],
      pac: ["", [<any>Validators.required]],
      password: ["", [<any>Validators.required]]
    });
    if (this.authorizationType === AuthorizationType.Patient) {
      this.btnText = "Authorize By Patient";
      this.authorizationTypeText = "Patient";
    } else {
      this.btnText = "Confirm Password";
      this.authorizationTypeText = "Medical";
    }
    this.userService
      .generatePatientAuthorizationToken(this.patientId, "patient")
      .then(payload => {});
  }

  send() {
    if (this.authorizationType === AuthorizationType.Patient) {
      this.userService
        .validatePatientAuthorizationToken(
          this.patientId,
          "patient",
          this.frm_conpass.value.pac
        )
        .then(payload => {
          if (payload.status === "success") {
            this.closeModal.emit(true);
          }
        });
    }
  }
}
