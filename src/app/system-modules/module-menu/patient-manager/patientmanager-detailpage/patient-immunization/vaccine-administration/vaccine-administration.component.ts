import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vaccine-administration',
  templateUrl: './vaccine-administration.component.html',
  styleUrls: ['./vaccine-administration.component.scss']
})
export class VaccineAdministrationComponent implements OnInit {

  expanded = false;

  constructor() { }

  ngOnInit() {
  }

  node_toggle(){
    this.expanded= !this.expanded;
  }

}
