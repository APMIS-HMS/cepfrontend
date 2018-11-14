import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-clinic-attendance',
  templateUrl: './clinic-attendance.component.html',
  styleUrls: ['./clinic-attendance.component.scss']
})
export class ClinicAttendanceComponent implements OnInit {

	searchControl = new FormControl();
	searchCriteria = new FormControl('Search');

  constructor() { }

  ngOnInit() {
  }

}
