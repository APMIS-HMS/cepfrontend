import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss', '../nhmis-summary/nhmis-summary.component.scss']
})
export class RegistersComponent implements OnInit {
  
  @Output() switch: EventEmitter<number> = new EventEmitter<number>();
  showModal = false;
  constructor(private _router: Router) { }

  ngOnInit() {
  }

  call_register() {
    this._router.navigate(['/dashboard/reports/register/register-entries']);
  }
  call_antenatal() {
    this._router.navigate(['/dashboard/reports/register/antenatal']);
  }
  call_opd() {
    this._router.navigate(['/dashboard/reports/register/opd']);
  }
  call_fpr() {
    this._router.navigate(['/dashboard/reports/register/fpr']);
  }
  call_IRTS() {
    this._router.navigate(['/dashboard/reports/register/irts']);
  }

  call_gmp(){
    this._router.navigate(['/dashboard/reports/register/gmp']);
  }
  call_ldr(){
    this._router.navigate(['/dashboard/reports/register/ldr']);
  }



  irts_modal() {
    this.showModal = true;
  }
  close_onClick(e) {
    this.showModal = false;
  }
}
