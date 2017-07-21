import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, UserService } from '../../../services/facility-manager/setup/index';
import { Facility, User } from '../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.component.html',
  styleUrls: ['./access-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AccessManagerComponent implements OnInit {

  searchControl = new FormControl();

  innerMenuShow = false;
  selectedFacility: Facility = <Facility>{};
  users: any[] = [];

  pageSize = 1;
  limit = 100;

  constructor(private locker: CoolSessionStorage, private router: Router,
    public facilityService: FacilitiesService,
    private userService: UserService) { }

  ngOnInit() {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    // this.searchControl.valueChanges.subscribe(value => {
    //   // do something with value here
    // });
    this.getUsers(this.limit);
  }
  getUsers(limit) {
    const facilityId = this.selectedFacility._id;
    this.userService.find({ query: { 'facilitiesRole.facilityId': facilityId, $limit: limit } }).then(payload => {
      this.users = payload.data;
    });
  }
  edit(item: any) {
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

  // onScroll() {
  //   this.pageSize = this.pageSize + 1;
  //    console.log(this.pageSize);
  //   const limit = this.limit * this.pageSize;
  //   this.getUsers(limit);
  // }
  // onScrollUp() {
  //   console.log(this.pageSize);
  //   if (this.pageSize > 1) {
  //     this.pageSize = this.pageSize - 1;
  //   }
  //   const limit = this.limit * this.pageSize;
  //   this.getUsers(limit);
  // }

}
