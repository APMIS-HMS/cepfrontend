import { Component, OnInit } from '@angular/core';
import { BillingService, FacilitiesService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';



@Component({
  selector: 'app-facility-family-cover',
  templateUrl: './facility-family-cover.component.html',
  styleUrls: ['./facility-family-cover.component.scss']
})
export class FacilityFamilyCoverComponent implements OnInit {

  billDetail_show = false;
  billHistoryDetail_show = false;
  tab1 = true;
  tab2 = false;
  selectedFacility: any = <any>{}
  selectedBill: any = <any>{}
  bills = []
  historyBills = []

  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private facilitiesService: FacilitiesService) { }

  ngOnInit() {
    this.selectedFacility = this.locker.getObject('selectedFacility');
    this.getBills();
  }

  getBills() {
    this.billingService.find({
      query: {
        facilityId: this.selectedFacility._id,
        'billItems.covered.coverType': 'family'
      }
    }).then(payload => {
      console.log(payload);
      payload.data.forEach(element => {
        const index = element.billItems.filter(x => x.covered.isVerify !== undefined);
        if (index.length === 0) {
          element.isPending = true;
        } else {
          element.isPending = false;
        }
      });
      this.bills = payload.data.filter(x => x.isPending === true);
      console.log(this.bills);
      this.historyBills = payload.data.filter(x => x.isPending === false);
    });
  }

  onRefreshBills(value) {
    this.getBills();
  }

  billDetail(bill) {
    this.selectedBill = bill;
    this.billDetail_show = true;
  }
  billHistoryDetail(bill) {
    this.selectedBill = bill;
    this.billHistoryDetail_show = true;
  }
  close_onClick() {
    this.billDetail_show = false;
    this.billHistoryDetail_show = false;
  }
  tab1_click() {
    this.tab1 = true;
    this.tab2 = false;
  }
  tab2_click() {
    this.tab1 = false;
    this.tab2 = true;
  }

}
