import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, UserService } from '../../../services/facility-manager/setup/index';
import { Facility, User } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.component.html',
  styleUrls: ['./access-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessManagerComponent implements OnInit {

  searchControl = new FormControl();

  innerMenuShow = false;
  selectedFacility: Facility = <Facility>{};
  users: User[] = [];

  pageSize = 1;
  limit = 10;

  constructor(private locker: CoolLocalStorage, private router: Router,
    public facilityService: FacilitiesService,
    private userService: UserService) { }

  ngOnInit() {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    this.searchControl.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.getUsers(this.limit);
  }
  getUsers(limit) {
    const facilityId = this.selectedFacility._id;
    this.userService.find({ query: { 'facilitiesRole.facilityId': facilityId, $limit: limit } }).then(payload => {
      this.users = payload.data;
      console.log(payload);
    });
  }
  edit(item: any) {
    console.log(item);
    this.router.navigate(['/dashboard/employee-manager/generate-user', item.person._id]);
  }
  empDetail(val: any) {
    this.router.navigate(['/dashboard/employee-manager/employee-manager-detail', val.personId]);
  }
  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id !== 'submenu_ico') {
      this.innerMenuShow = false;
    }
  }

  onScroll() {
    this.pageSize = this.pageSize + 1;
     console.log(this.pageSize);
    const limit = this.limit * this.pageSize;
    this.getUsers(limit);
  }
  onScrollUp() {
    console.log(this.pageSize);
    if (this.pageSize > 1) {
      this.pageSize = this.pageSize - 1;
    }
    const limit = this.limit * this.pageSize;
    this.getUsers(limit);
  }

}
