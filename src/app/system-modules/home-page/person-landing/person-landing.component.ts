import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserService } from './../../../services/facility-manager/setup/user.service';
import { AuthFacadeService } from './../../service-facade/auth-facade.service';
import { FacilitiesService } from './../../../services/facility-manager/setup/facility.service';
import { JoinChannelService } from './../../../services/facility-manager/setup/join-channel.service';
import { EmployeeService } from './../../../services/facility-manager/setup/employee.service';
import { Person } from 'app/models/index';
import { Component, OnInit, Input } from '@angular/core';
import { AppointmentService } from '../../../services/facility-manager/setup';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-landing',
  templateUrl: './person-landing.component.html',
  styleUrls: ['./person-landing.component.scss']
})
export class PersonLandingComponent implements OnInit {
  selectedUser: any;
  selectedFacility: any;
  @Input() selectedPerson: Person = <Person>{};
  @Input() listOfFacilities: any[] = [];
  @Input() listOfEmployees: any[] = [];
  schedule_appointment = false;
  myAppointments: any[] = [];
  constructor(private appointmentService:AppointmentService, private employeeService: EmployeeService,
    private joinChannelService:JoinChannelService,private authFacadeService:AuthFacadeService,
    public facilityService: FacilitiesService, private userService:UserService, private router:Router,
    private locker: CoolLocalStorage,) { }

ngOnInit() {
  this.getEmployeeRecords();
}

close_onClick(message: boolean): void {
  this.schedule_appointment = false;
}
set_appointment() {
  this.schedule_appointment = true;
}

getFacilityName(id){
  const facility = this.listOfFacilities.filter(x =>x._id == id);
  if(facility.length > 0){
    return facility[0].name;
  }
  return '';
}

getUnits(units){
  return units.join(' | ');
}

getMyAppointments(){
  this.appointmentService.find({query:{
    doctorId: { $in: this.listOfEmployees.map(x => x._id) }, isFuture:true
  }}).subscribe(payload =>{
    this.myAppointments = payload.data;
  });
}

getEmployeeRecords() {
  this.employeeService.find({query:{personId: this.selectedPerson._id}}).subscribe(payload =>{
    this.listOfEmployees = payload.data;
    this.getMyAppointments();
  });
}

loadFacility(employee){

  this.facilityService.get(employee.facilityId,{}).then(payload =>{
    this.selectedFacility = payload;
    this.locker.setObject("fac", this.selectedFacility._id);
    if (this.selectedFacility.isTokenVerified === false) {
      console.log(this.selectedFacility)
      // this.popup_verifyToken = true;
      // this.popup_listing = false;
    } else {
      // this.locker.setObject("fac",employee.facilityId);
      this.authFacadeService.getLogingUser(employee.facilityId).then(payload =>{
        this.selectedUser = payload;
        this.joinChannelService.create({_id:this.selectedFacility._id, userId:this.selectedUser._id}).then(pay =>{
          // this.popup_listing = true;
          // this.popup_verifyToken = false;
          this.locker.setObject('selectedFacility', this.selectedFacility);
          this.router.navigate(['dashboard']).then( p => {
            this.userService.announceMission('in');
          }).catch(er =>{
          });
        }, err =>{
        })
      }).catch(error =>{
      });
     
      
    }
    // this.locker.setObject('selectedFacility', this.selectedFacility);
    // this.locker.setObject('fac',this.selectedFacility._id);
    // this.logoutConfirm_on = false;
  })
}

}
