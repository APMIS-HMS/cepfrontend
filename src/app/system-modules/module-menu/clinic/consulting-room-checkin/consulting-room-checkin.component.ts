import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConsultingRoomService, EmployeeService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee } from '../../../../models/index';
import { ClinicHelperService } from '../services/clinic-helper.service';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-consulting-room-checkin',
  templateUrl: './consulting-room-checkin.component.html',
  styleUrls: ['./consulting-room-checkin.component.scss']
})
export class ConsultingRoomCheckinComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  loginEmployee: Employee = <Employee>{};
  locations: any[] = [];

  public roomCheckin: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() selectedEmployee: Employee = <Employee>{};
  selectedConsultingRoom: ConsultingRoomModel = <ConsultingRoomModel>{};

  constructor(private formBuilder: FormBuilder,
    public clinicHelperService: ClinicHelperService,
    public facilityService: FacilitiesService,
    private consultingRoomService: ConsultingRoomService,
    private employeeService: EmployeeService,
    private locker: CoolSessionStorage
  ) { }

  ngOnInit() {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.loginEmployee.workSpaces.forEach(work => {
      work.locations.forEach(loc => {
        this.locations.push(loc.minorLocationId);
      })
    })
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
    if (this.loginEmployee.consultingRoomCheckIn === undefined) {
      this.loginEmployee.consultingRoomCheckIn = [];
    }
    this.loginEmployee.consultingRoomCheckIn.forEach((itemi, i) => {
      itemi.isOn = false;
      if (value.isDefault === true) {
        itemi.isDefault = false;
      }
    });
    this.loginEmployee.consultingRoomCheckIn.push(checkIn);
    this.employeeService.update(this.loginEmployee).then(payload => {
      this.loginEmployee.consultingRoomCheckIn = payload.consultingRoomCheckIn;
      const workspaces = <any>this.locker.getObject('workspaces');
      this.loginEmployee.workSpaces = workspaces;
      this.locker.setObject('loginEmployee', this.loginEmployee);
      this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true) {
          itemr.isOn = true;
          itemr.lastLogin = new Date();
          this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
        }
      });
      this.close_onClick();
    });
  }
  changeRoom(checkIn: any) {
    let keepCheckIn;
    this.loginEmployee.consultingRoomCheckIn.forEach((itemi, i) => {
      itemi.isOn = false;
      if (itemi._id === checkIn._id) {
        itemi.isOn = true;
        keepCheckIn = itemi;
      }
    });
    this.employeeService.update(this.loginEmployee).then(payload => {
      this.loginEmployee = payload;
      const workspaces = <any>this.locker.getObject('workspaces');
      this.loginEmployee.workSpaces = workspaces;
      this.locker.setObject('loginEmployee', this.loginEmployee);
      this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'clinic' });
      this.close_onClick();
    });
  }
}
