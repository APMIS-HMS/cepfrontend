import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConsultingRoomService, EmployeeService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee } from '../../../../models/index';
import { ClinicHelperService } from '../services/clinic-helper.service';

@Component({
  selector: 'app-consulting-room-checkin',
  templateUrl: './consulting-room-checkin.component.html',
  styleUrls: ['./consulting-room-checkin.component.scss']
})
export class ConsultingRoomCheckinComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  loginEmployee: Employee = <Employee>{};

  public roomCheckin: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() selectedEmployee: Employee = <Employee>{};
  selectedConsultingRoom: ConsultingRoomModel = <ConsultingRoomModel>{};

  constructor(private formBuilder: FormBuilder,
    public clinicHelperService: ClinicHelperService,
    public facilityService: FacilitiesService,
    private consultingRoomService: ConsultingRoomService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.roomCheckin = this.formBuilder.group({
      location: ['', []],
      room: ['', []],
      isDefault: [false, []]
    });
    this.roomCheckin.controls['location'].valueChanges.subscribe(value => {
      this.consultingRoomService.find({ query: { minorLocationId: value } }).then(payload => {
        if (payload.data.length > 0) {
          this.selectedConsultingRoom = payload.data[0];
        } else {
          this.selectedConsultingRoom = <ConsultingRoomModel>{};
        }
      });
    });

     this.roomCheckin.controls['room'].valueChanges.subscribe(value => {
    });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  checkIn(valid, value) {
    let checkIn: any = <any>{};
    checkIn.minorLocationId = value.location;
    checkIn.roomId = value.room;
    checkIn.lastLogin = new Date();
    checkIn.isOn = true;
    checkIn.isDefault = value.isDefault;
    if (this.clinicHelperService.loginEmployee.consultingRoomCheckIn === undefined) {
      this.clinicHelperService.loginEmployee.consultingRoomCheckIn = [];
    }
    this.clinicHelperService.loginEmployee.consultingRoomCheckIn.forEach((itemi, i) => {
      itemi.isOn = false;
      if (value.isDefault === true) {
        itemi.isDefault = false;
      }
    });
    this.loginEmployee = this.clinicHelperService.loginEmployee;
    this.loginEmployee.consultingRoomCheckIn.push(checkIn);
    this.employeeService.update(this.clinicHelperService.loginEmployee).then(payload => {
      this.clinicHelperService.loginEmployee = payload;
      this.close_onClick();
    });
  }
  changeRoom(checkIn: any) {
    let keepCheckIn = undefined;
    this.clinicHelperService.loginEmployee.consultingRoomCheckIn.forEach((itemi, i) => {
      itemi.isOn = false;
      if (itemi._id === checkIn._id) {
        itemi.isOn = true;
        keepCheckIn = itemi;
      }
    });
    this.employeeService.update(this.clinicHelperService.loginEmployee).then(payload => {
      this.clinicHelperService.loginEmployee = payload;
      this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'clinic' });
      this.close_onClick();
    });
  }
}
