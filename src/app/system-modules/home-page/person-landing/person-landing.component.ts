import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-landing',
  templateUrl: './person-landing.component.html',
  styleUrls: ['./person-landing.component.scss']
})
export class PersonLandingComponent implements OnInit {

schedule_appointment = false;
login_on= false;
constructor() { }

ngOnInit() {
}

close_onClick(message: boolean): void {
  this.schedule_appointment = false;
}

}
