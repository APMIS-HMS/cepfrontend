import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-person-schedule-appointment',
  templateUrl: './person-schedule-appointment.component.html',
  styleUrls: ['./person-schedule-appointment.component.scss']
})
export class PersonScheduleAppointmentComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  public frm_appointment: FormGroup;
  show = false;
  input_password;

  patient: FormControl;
  clinic: FormControl;
  provider: FormControl;
  type: FormControl;
  status: FormControl;
  category: FormControl;
  checkIn: FormControl;
  teleMed: FormControl;
  timezone: FormControl;
  date = new Date(); // FormControl = new FormControl();
  endDate = new Date();
  startDate = new Date();
  dateCtrl: FormControl = new FormControl(new Date(), [Validators.required]);
  reason: FormControl = new FormControl();

  days: any[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_appointment = this.formBuilder.group({
      hospital: ['', [<any>Validators.required]],
      clinic: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  toggleShow(e) {

  }
  reset() {

  }
  login(valid) {

  }
}
