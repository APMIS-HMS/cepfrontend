import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-workbench-setup',
  templateUrl: './workbench-setup.component.html',
  styleUrls: ['./workbench-setup.component.scss']
})
export class WorkbenchSetupComponent implements OnInit {
  openModal: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  showModal() {
    this.openModal = true;
  }

  close_onClick(e) {
    this.openModal = false;
  }
}
