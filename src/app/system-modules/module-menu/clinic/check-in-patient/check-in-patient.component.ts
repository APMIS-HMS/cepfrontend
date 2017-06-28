import { Component, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// tslint:disable-next-line:max-line-length
import { FacilitiesService, EmployeeService, ConsultingRoomService, ProfessionService, WorkSpaceService, AppointmentService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import {
  Appointment, ClinicModel, Profession, Timeline, Employee, Facility, Location, MinorLocation, Patient
} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClinicHelperService } from '../services/clinic-helper.service';
import { Observable, Subscription } from 'rxjs/Rx';
@Component({
  selector: 'app-check-in-patient',
  templateUrl: './check-in-patient.component.html',
  styleUrls: ['./check-in-patient.component.scss'],
})
export class CheckInPatientComponent implements OnInit, AfterContentChecked, OnDestroy {
  patientItem: any;
  addVital = false;
  slideTimeline = false;
  searchControl = new FormControl();
  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  loadIndicatorVisible = true;

  checkedInAppointments: Appointment[] = [];
  selectedCheckedInAppointment: Appointment = <Appointment>{};
  selectedFacility: Facility = <Facility>{};
  timelines: Timeline[] = [];
  employees: Employee[] = [];
  professions: Profession[] = [];
  clinics: any[] = [];
  clinicLocations: MinorLocation[] = [];
  loginEmployee: Employee = <Employee>{};
  selectedProfession: Profession = <Profession>{};
  clinic: Location = <Location>{};

  isDoctor = false;
  counter = 0;
  subscription: Subscription;
  constructor(private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private workSpaceService: WorkSpaceService,
    private professionService: ProfessionService,
    private consultingRoomService: ConsultingRoomService,
    private locationService: LocationService,
    public clinicHelperService: ClinicHelperService,
    private locker: CoolLocalStorage, public facilityService: FacilitiesService) {
    this.clinicHelperService.getConsultingRoom();
    this.subscription = this.employeeService.listner.subscribe(payload => {
      this.loginEmployee = payload;
    });
    this.subscription = this.appointmentService.updatelistner.subscribe(payload => {
      this.selectedCheckedInAppointment = payload;
    });
    this.subscription = this.appointmentService.timelineAnnounced$.subscribe(value => {
      if (value === true) {
        this.slideTimeline = false;
      }
    });
  }

  ngOnInit() {
    // this.getProfessions();
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const auth: any = this.locker.getObject('auth');
    // this.getCheckedInPatients();
    // this.getLoginEmployee();
    // this.getClinicMajorLocation();
    this.route.data.subscribe(data => {
      //  data.loginEmployee.subscribe(me=>{
      //    console.log(me);
      //  })
      this.subscription = data['checkInPatients'].subscribe((payload: any[]) => {
        // data['loginEmployee'].subscribe(payloadl => {
        //   console.log(payloadl);
        //   this.loginEmployee = payloadl.loginEmployee;

        //   //code here

        //   this.loadIndicatorVisible = false;
        // });
        const emp$ = Observable.fromPromise(this.employeeService.find({
          query: {
            facilityId: this.selectedFacility._id, personId: auth.data.personId, showbasicinfo: true
          }
        }));
        // tslint:disable-next-line:max-line-length
        this.subscription = emp$.mergeMap((emp: any) => Observable.forkJoin([Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
        ]))
          .subscribe((results: any) => {
            this.loginEmployee = results[0];
            if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name === 'Doctor') {
              payload.forEach((itemch, ch) => {
                this.loginEmployee.unitDetails.forEach((itemu, u) => {
                  itemu.clinics.forEach((itemc, c) => {
                    if (itemc._id === itemch.clinicId) {
                      this.checkedInAppointments.push(itemch);
                    }
                  });
                });
              });
            } else if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name !== 'Doctor') {
              payload.forEach((itemch, ch) => {
                this.loginEmployee.workSpaces.forEach((itemu, u) => {
                  itemu.locations.forEach((itemc, c) => {
                    if (itemc.minorLocationId === itemch.locationId) {
                      this.checkedInAppointments.push(itemch);
                    }
                  });
                });
              });
            }
            this.loadIndicatorVisible = false;
            this.getClinics();
          });
      });

    });



  }
  // getClinicMajorLocation() {
  //   this.locationService.findAll().then(payload => {
  //     payload.data.forEach((itemi, i) => {
  //       if (itemi.name === 'Clinic') {
  //         this.clinic = itemi;
  //         this.getClinicLocation();
  //       }
  //     });
  //   });
  // }
  getClinics() {
    this.clinics = [];
    this.selectedFacility.departments.forEach((itemi, i) => {
      itemi.units.forEach((itemj, j) => {
        itemj.clinics.forEach((itemk, k) => {
          if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name === 'Doctor') {
            this.loginEmployee.units.forEach((itemu, u) => {
              if (itemu === itemj._id) {
                const clinicModel: ClinicModel = <ClinicModel>{};
                clinicModel.clinic = itemk;
                clinicModel.department = itemi;
                clinicModel.unit = itemj;
                clinicModel._id = itemk._id;
                clinicModel.clinicName = itemk.clinicName;
                this.clinics.push(clinicModel);
              }
            });
          } else if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name !== 'Doctor') {
            this.loginEmployee.workSpaces.forEach((itemw, w) => {
              itemw.locations.forEach((iteml, l) => {
                if (iteml.minorLocationId === itemk.clinicLocation) {
                  const clinicModel: ClinicModel = <ClinicModel>{};
                  clinicModel.clinic = itemk;
                  clinicModel.department = itemi;
                  clinicModel.unit = itemj;
                  clinicModel._id = itemk._id;
                  clinicModel.clinicName = itemk.clinicName;
                  this.clinics.push(clinicModel);
                }
              });
            });
          }


        });
      });
    });
  }
  // getClinicLocation() {
  //   this.clinicLocations = [];
  //   let minors = this.selectedFacility.minorLocations.filter(x => x.locationId === this.clinic._id);
  //   minors.forEach((itemi, i) => {
  //     let minorLocation: MinorLocation = <MinorLocation>{};
  //     minorLocation._id = itemi._id;
  //     minorLocation.description = itemi.description;
  //     minorLocation.locationId = itemi.locationId;
  //     minorLocation.name = itemi.name;
  //     minorLocation.shortName = itemi.shortName;
  //     minorLocation.text = itemi.name;
  //     this.clinicLocations.push(minorLocation);

  //   });

  //   let workspace = this.locker.getObject('auth').data.workSpace;
  //   if (workspace !== undefined && this.selectedProfession._id !== undefined) {
  //     let locationList: string[] = [];
  //     workspace.locations.forEach((loc, i) => {
  //       locationList.push(loc.minorLocationId);
  //     });
  //   } else {
  //     let locationList: string[] = [];
  //     if (workspace !== undefined) {
  //       workspace.locations.forEach((loc, i) => {
  //         locationList.push(loc.minorLocationId);
  //       });
  //     } else {
  //     }
  //   }
  // }
  // getLoginEmployee() {
  //   let auth = this.locker.getObject('auth');
  //   this.employeeService.find({
  //     query:
  //     {
  //       facilityId: this.selectedFacility._id, personId: auth.data.personId
  //     }
  //   }).then(payload => {
  //     if (payload.data.length > 0) {
  //       this.loginEmployee = payload.data[0];
  //       if (this.loginEmployee.professionObject.name === 'Doctor') {
  //         this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
  //         this.isDoctor = true;
  //       } else { this.isDoctor = false; }
  //       this.getEmployees();
  //     }
  //   });
  // }

  close_onClick(e) {
    this.addVital = false;
  }
  sortPatientsByName() {
    this.checkedInAppointments.sort(function (x: any, y: any) {
      const xLastName = x.patientDetails.personDetails.lastName.toLowerCase();
      const yLastName = y.patientDetails.personDetails.lastName.toLowerCase();
      if (xLastName < yLastName) {
        return -1;
      }
      if (xLastName > yLastName) {
        return 1;
      }
      return 0;
    });
  }
  getCheckedInPatients() {
    this.appointmentService.find({ query: { facilityId: this.selectedFacility._id, attendance: { $exists: true } } })
      .then(payload => {
        this.checkedInAppointments = payload.data;
        if (this.checkedInAppointments.length > 0) {
          this.selectedCheckedInAppointment = this.checkedInAppointments[0];
        }
      });
  }
  getProfessions() {
    this.professionService.findAll().then(payload => {
      payload.data.forEach((itemi, i) => {
        this.professions.push(itemi);
      });
    });
  }
  getEmployees() {
    this.employees = [];
    if (this.isDoctor) {
      this.employeeService.find({
        query: {
          facilityId: this.selectedFacility._id,
          professionId: this.selectedProfession._id, units: { $in: this.loginEmployee.units }
        }
      })
        .then(payload => {
          payload.data.forEach((itemi, i) => {
            this.employees.push(itemi);
            if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
            }
          });

          if (this.loginEmployee !== undefined && this.selectedProfession._id !== undefined) {
            this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } }).then(payloade => {
            });
          }
        });
    } else {
      this.employeeService.find({
        query: {
          facilityId: this.selectedFacility._id,
          professionId: this.selectedProfession._id
        }
      })
        .then(payload => {
          payload.data.forEach((itemi, i) => {
            this.employees.push(itemi);
          });

          if (this.loginEmployee !== undefined && this.selectedProfession._id !== undefined) {
            this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } }).then(payloade => {
            });
          }
        });
    }

  }
  getCheckedInTimeLine() {
    if (this.selectedCheckedInAppointment !== undefined) {
      const timeline: Timeline = <Timeline>{};
      timeline.startTime = this.selectedCheckedInAppointment.attendance.dateCheckIn;
      timeline.endTime = this.selectedCheckedInAppointment.attendance.dateCheckIn;
      timeline.person = this.selectedCheckedInAppointment.attendance.employeeObject;
      timeline.label = 'Check In';
      this.timelines.push(timeline);
      this.getOtherTimeLines();
    }
  }
  getOtherTimeLines() {
    if (this.selectedCheckedInAppointment.clinicInteractions !== undefined) {
      this.appointmentService.get(this.selectedCheckedInAppointment._id, {})
        .then(payload => {
          if (payload !== undefined) {
            this.selectedCheckedInAppointment = payload;
            payload.clinicInteractions.forEach((itemi, i) => {
              const timeline: Timeline = <Timeline>{};
              timeline.startTime = itemi.startAt;
              timeline.endTime = itemi.endAt;
              timeline.person = itemi.employee;
              timeline.label = itemi.title;
              this.timelines.push(timeline);
            });
          }
        });

    }
  }
  ngAfterContentChecked() {
    console.log('erro');
    // if (this.clinicHelperService.loginEmployee._id !== undefined) {
    //   if (this.counter === 0) {
    //     this.getEmployees();
    //   }
    //   this.counter++;
    // }
  }
  show_addVital() {
    this.addVital = true;
  }
  getConsultingRoom(appointment) {
    let retVal = '';
    if (appointment.employeeDetails.consultingRoomCheckIn !== undefined) {
      appointment.employeeDetails.consultingRoomCheckIn.forEach((itemr, r) => {
        if (itemr.isOn === true) {
          this.clinicHelperService.consultingRooms.forEach((itemk, k) => {
            itemk.rooms.forEach((itemp, p) => {
              if (itemp._id === itemr.roomId) {
                retVal = 'Consulting Room(' + itemp.name + ')';
              }
            });
          });
        }
      });
    }

    return retVal;
  }
  dontGo() {
    this.slideTimeline = false;
  }
  goToPatientPage(appointment, append) {
    if (append === true) {
      const isOnList = this.loginEmployee.consultingRoomCheckIn.filter(x => x.isOn === true);
      if (isOnList.length > 0) {
        this.router.navigate(['/modules/patient-manager/patient-manager-detail',
          appointment.employeeDetails.personId, { appId: appointment._id, checkInId: isOnList[0]._id }]);
      } else {
        this.router.navigate(['/modules/patient-manager/patient-manager-detail',
          appointment.employeeDetails.personId, { appId: appointment._id }]);
      }
    } else {
      this.router.navigate(['/modules/patient-manager/patient-manager-detail',
        appointment.employeeDetails.personId]);
    }

  }
  slideTimeline_toggle(value, event) {
    this.slideTimeline = !this.slideTimeline;
    this.selectedCheckedInAppointment = value;
    this.timelines = [];
    this.getCheckedInTimeLine();
    event.stopPropagation();
  }
  showVital(appointment) {
    this.addVital = true;
    this.selectedCheckedInAppointment = appointment;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
