import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-portal',
  templateUrl: './patient-portal.component.html',
  styleUrls: ['./patient-portal.component.scss']
})
export class PatientPortalComponent implements OnInit {

  innerMenuShow = false;

  constructor() { }

  ngOnInit() {
  }

  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }

}
