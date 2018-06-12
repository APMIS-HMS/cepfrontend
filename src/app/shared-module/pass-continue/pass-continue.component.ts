import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-pass-continue',
  templateUrl: './pass-continue.component.html',
  styleUrls: ['./pass-continue.component.scss']
})
export class PassContinueComponent implements OnInit {

  public frm_conpass: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_conpass = this.formBuilder.group({
      otp: ["", [<any>Validators.required]],
      pac: ["", [<any>Validators.required]],
      password: ["", [<any>Validators.required]]
    });
  }

}
