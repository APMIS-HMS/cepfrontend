import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import {
  User, Person,
  AccessControl, Facility, Employee
} from '../../../../../models/index';
import { UserService, EmployeeService, FacilitiesService, PersonService } from '../../../../../services/facility-manager/setup/index';
import { FeatureModuleService } from '../../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  @Output() selectedEmployee: EventEmitter<Employee> = new EventEmitter<Employee>();
  // employee: Employee = <Employee>{};
  selectedPerson: Person = <Person>{};
  selectedFacility: Facility = <Facility>{};
  selectedUser: User = <User>{};
  selectedAccessControl: AccessControl = <AccessControl>{};
  accessControlList: string[] = [];

  modal_on = false;

  employeeSubscription: Subscription;

  constructor(private featureModuleService: FeatureModuleService,
    private locker: CoolLocalStorage,
    private employeeService: EmployeeService,
    public facilityService: FacilitiesService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private accessControlService: AccessControlService) {
    this.employeeSubscription = this.employeeService.employeeAnnounced$.subscribe(payload => {
      console.log(payload);
      // console.log(this.locker.getObject('auth'));
      this.userService.find({ query: { personId: payload.personId } }).then(payload2 => {
        console.log(payload2);
        if (payload2.data.length > 0) {
          this.selectedUser = payload2.data[0];
          this.selectedPerson = this.selectedUser.person;
          console.log(this.selectedUser);
          this.accessControlList = [];
          this.selectedUser.facilitiesRole.forEach((item, i) => {
            console.log('here and her');
            if (!this.checkAccessControlList(item.feature.accessControlId)) {
              this.accessControlList.push(item.feature.accessControlId);
            }
          });
        } else {
          this.router.navigate(['/modules/facility-manager/employee-manager/generate-user', payload.personId]);
        }

      });
      // this.getPerson(payload.personId);
    });
    this.route.params.subscribe(params => {
      const id = params['id'];
      const personId = params['personId'];
      if (isNaN(id)) {
        this.getUser(id);
      }
      if (isNaN(personId)) {
        this.getPerson(personId);
      }
    });
  }
  getPerson(personId) {
    this.personService.get(personId, {}).then(payload => {
      this.selectedPerson = payload;
    }, error => {
      console.log(error);
    });
  }
  getUser(id) {
    this.userService.get(id, {}).then(
      payload => {
        this.selectedUser = payload;
        console.log(this.selectedUser);
        this.selectedUser.facilitiesRole.forEach((item, i) => {
          if (!this.checkAccessControlList(item.feature.accessControlId)) {
            this.accessControlList.push(item.feature.accessControlId);
          }
        });
      },
      error => {
        console.log(error);
      }
    );
  }
  goToEdit() {
    this.router.navigate(['/modules/employee-manager/generate-user', this.selectedPerson._id]);
  }
  checkAccessControlList(id: string) {
    const result = this.accessControlList.filter(x => x === id);
    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  ngOnInit() {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
  }

  navEpDetail(val: Employee) {
    this.router.navigate(['/modules/employee-manager/generate-user', this.selectedPerson._id]);
  }

  ngOnDestroy() {
    this.employeeSubscription.unsubscribe();
  }

}
