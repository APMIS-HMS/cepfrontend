import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-antenatal-pg1',
  templateUrl: './antenatal-pg1.component.html',
  styleUrls: ['./antenatal-pg1.component.scss', '../../../../nhmis-summary/nhmis-summary.component.scss', '../../register-entry/register-entry.component.scss']
})
export class AntenatalPg1Component implements OnInit {

  @Output() switch: EventEmitter<number> = new EventEmitter<number>();

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  back_registers(){
    this._router.navigate(['/dashboard/reports/register']);
  }
  switcher_onClick() {
    this.switch.emit(2);
  }

}
