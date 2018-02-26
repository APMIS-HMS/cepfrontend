import { Component, OnInit } from '@angular/core';
import { BillingService,FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';


@Component({
  selector: 'app-hmo-officer',
  templateUrl: './hmo-officer.component.html',
  styleUrls: ['./hmo-officer.component.scss']
})
export class HmoOfficerComponent implements OnInit {

  billDetail_show = false;
  billHistoryDetail_show = false;
  tab1 = true;
  tab2 = false;
  selectedFacility: any = <any>{}
  selectedBill: any = <any>{}
  bills = []

  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private facilitiesService:FacilitiesService
  ) { }

  ngOnInit() {
    this.selectedFacility = this.locker.getObject('selectedFacility');
    this.billingService.find({ query: { facilityId: this.selectedFacility._id, 'billItems.covered.coverType': 'insurance' } }).then(payload => {
      this.bills = payload.data;
      console.log(this.bills);
    });
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
