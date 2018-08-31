import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rm-request',
  templateUrl: './rm-request.component.html',
  styleUrls: ['./rm-request.component.scss']
})
export class RmRequestComponent implements OnInit {

  request_view = false;
  reqDetail_view = false;
  personAcc_view = false;
  isLaboratory = false;
  searchOpen = false;
  pendingRequests: any;
  loading = false;

  constructor() { }

  ngOnInit() {
  }

  request_show() {
    this.request_view = !this.request_view;
  }
  reqDetail() {
    this.reqDetail_view = true;
  }
  newPerson() {
    this.personAcc_view = true;
  }
  close_onClick(message: boolean): void {
    this.reqDetail_view = false;
    this.personAcc_view = false;
  }

  openSearch() {
    
  }

}
