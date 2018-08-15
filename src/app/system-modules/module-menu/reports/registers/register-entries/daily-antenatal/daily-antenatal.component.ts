import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-antenatal',
  templateUrl: './daily-antenatal.component.html',
  styleUrls: ['./daily-antenatal.component.scss', '../../../nhmis-summary/nhmis-summary.component.scss', '../register-entry/register-entry.component.scss']
})
export class DailyAntenatalComponent implements OnInit {

  showNewEntry = false;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  newEntry(){
    this.showNewEntry = true;
  }
  close_onClick(e){
    this.showNewEntry = false;
  }
  back_registers(){
    this._router.navigate(['/dashboard/reports/register']);
  }
}
