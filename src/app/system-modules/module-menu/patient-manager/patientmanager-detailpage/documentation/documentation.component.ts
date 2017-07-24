import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {

  docDetail_view = false;
  clinicalNote_view = false;
  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;

  constructor() { }

  ngOnInit() {
  }

  docDetail_show(){
    this.docDetail_view = true;
  }
  clinicalNote_show(){
    this.clinicalNote_view = !this.clinicalNote_view;
  }
  addProblem_show(){
    this.addProblem_view = true;
  }
  addAllergy_show(){
    this.addAllergy_view = true;
  }
  addHistory_show(){
    this.addHistory_view = true;
  }
  addVitals_show(){
    this.addVitals_view = true;
  }

  close_onClick(message: boolean): void {
    this.docDetail_view = false;
    this.clinicalNote_view = false;
    this.addProblem_view = false;
    this.addAllergy_view = false;
    this.addHistory_view = false;
    this.addVitals_view = false;
  }

}
