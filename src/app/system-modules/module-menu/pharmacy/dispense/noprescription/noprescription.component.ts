import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noprescription',
  templateUrl: './noprescription.component.html',
  styleUrls: ['./noprescription.component.scss']
})
export class NoprescriptionComponent implements OnInit {
  corporateShow = false;
  individualShow = false;
  internalShow = false;
  employees: any[] = [];
  constructor() { }

  ngOnInit() {
  }

}
