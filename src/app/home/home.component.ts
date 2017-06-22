import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  login_on = false;
  pwdReset_on = false;

  constructor() { }

  ngOnInit() {
  }
  login_show() {
    this.login_on = true;
    this.pwdReset_on = false;
  }
  pwdReset_show() {
    this.pwdReset_on = true;
    this.login_on = false;
  }
  overlay_onClick(e) {
    if (e.srcElement.id === 'form-modal') {
    }
  }

  close_onClick(message: boolean): void {
    this.login_on = false;
    this.pwdReset_on = false;
  }

}
