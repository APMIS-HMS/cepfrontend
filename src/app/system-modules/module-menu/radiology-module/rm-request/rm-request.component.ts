import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rm-request',
  templateUrl: './rm-request.component.html',
  styleUrls: ['./rm-request.component.scss']
})
export class RmRequestComponent implements OnInit {

  request_new = true;
  request_list = false;
  reqDetail_view = false;
  personAcc_view = false;
  isLaboratory = false;
  searchOpen = false;
  pendingRequests = false;
  loading = false;

  constructor() { }

  ngOnInit() {
  }

  requestNew_show() {
    this.request_new = true;
    this.request_list = false;
  }
  requestList_show() {
    this.request_new = false;
    this.request_list = true;
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

}
