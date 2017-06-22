import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profession',
  templateUrl: './profession.component.html',
  styleUrls: ['./profession.component.scss']
})
export class ProfessionComponent implements OnInit {

  newProfession = false;

  constructor() { }

  ngOnInit() {
  }
  professionShow() {
    this.newProfession = true;
  }
  close_onClick($event) {
    this.newProfession = false;
  }
}
