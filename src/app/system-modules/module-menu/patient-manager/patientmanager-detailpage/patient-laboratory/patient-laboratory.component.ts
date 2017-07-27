import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-laboratory',
  templateUrl: './patient-laboratory.component.html',
  styleUrls: ['./patient-laboratory.component.scss']
})
export class PatientLaboratoryComponent implements OnInit {

  investigationShow = false;
  clinicalNote_view = false;
  constructor() { }

  ngOnInit() {
  }
  

   investigationView() {
    this.investigationShow = !this.investigationShow;
  }
   clinicalNote_show() {
    this.clinicalNote_view = !this.clinicalNote_view;
    this.investigationShow = !this.investigationShow;
  }
}
