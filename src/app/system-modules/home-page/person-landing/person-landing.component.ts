import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-person-landing',
  templateUrl: './person-landing.component.html',
  styleUrls: ['./person-landing.component.scss']
})
export class PersonLandingComponent implements OnInit {

schedule_appointment = false;
constructor() { }

ngOnInit() {
}

close_onClick(message: boolean): void {
  this.schedule_appointment = false;
}
set_appointment(){
  this.schedule_appointment = true;
}

}
