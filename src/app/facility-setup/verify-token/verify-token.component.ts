import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../services/facility-manager/setup/index';
import { Facility } from '../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verify-token',
  templateUrl: './verify-token.component.html',
  styleUrls: ['../facility-setup.component.scss']
})
export class VerifyTokenComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() inputFacility: Facility = <Facility>{};
  @Input() backBtnVisible: boolean;
@Input() tokenValue = "";
  frm_numberVerifier: FormGroup;
  facility: Facility = <Facility>{};
  InputedToken: string;
  errMsg: string;
  verify_show = true;
  back_verify_show = false;
  sg3_show = false;
  mainErr = true;

  constructor(
    private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _facilityService: FacilitiesService,
  ) { }

  ngOnInit() {
    this.frm_numberVerifier = this.formBuilder.group({
      txt_numberVerifier: ['', [<any>Validators.required, <any>Validators.minLength(6), <any>Validators.maxLength(6), <any>Validators.pattern('^[0-9]+$')]]
    });
    this.InputedToken = this.tokenValue;
  }

  numberVerifier(valid) {
    if (valid) {
      console.log('1');
      if (this.InputedToken === '' || this.InputedToken === ' ') {
        this.mainErr = false;
        console.log('2');
        this.errMsg = 'Kindly key in the code sent to your mobile phone';
      } else if (true) {
        console.log('3');
        this._facilityService.find({ query: { 'verificationToken': this.InputedToken } }).then((payload) => {
          console.log('4');
          if (payload.data.length > 0) {
            console.log('5');
            this.mainErr = true;
            this.errMsg = '';
            this.sg3_show = true;
            this.verify_show = false;
            this.inputFacility.isTokenVerified = true;
            this._facilityService.update(this.inputFacility).then(payload2 => { });
          } else {
            this.mainErr = false;
            this.errMsg = 'Wrong Token, try again.';
          }
        });
      }
    } else {
      this.mainErr = false;
    }
  }

  back_verifier() {
    this.sg3_show = false;
    this.verify_show = false;
    this.back_verify_show = true;
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
