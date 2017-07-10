import { Component, OnInit } from '@angular/core';
import { FacilitiesService } from '../../services/facility-manager/setup/index';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private facilityService: FacilitiesService, private toast: ToastsManager, private locker: CoolLocalStorage) {
    this.facilityService.notificationAnnounced$.subscribe((obj: any) => {
      if (obj.users !== undefined && obj.users.length > 0) {
        const auth: any = this.locker.getObject('auth');
        if (auth !== undefined) {
          const userId = auth._id;
          const isUserIdIncluded = obj.users.filter(x => x === userId).length > 0;
          if (isUserIdIncluded === true) {
            if (obj.type === 'Success') {
              this.success(obj.text);
            } else if (obj.type === 'Error') {
              this.error(obj.text);
            } else if (obj.type === 'Info') {
              this.info(obj.text);
            }
          }
        }
      }

    });
  }

  ngOnInit() {
  }
  success(text) {
    this.toast.success(text, 'Success!');
  }
  error(text) {
    this.toast.error(text, 'Error!');
  }
  info(text) {
    this.toast.info(text, 'Info');
  }
}
