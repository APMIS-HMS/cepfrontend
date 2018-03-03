import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BillingService, FacilitiesService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-hmo-bill-detail',
  templateUrl: './hmo-bill-detail.component.html',
  styleUrls: ['./hmo-bill-detail.component.scss']
})
export class HmoBillDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshBills: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedBill;

  workspace:any;
  authCode_show = false;
  hmoPaymentType = [];
  hmoTypeControl: FormControl = new FormControl();
  authCodeControl: FormControl = new FormControl();
  bill: any = <any>{};
  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private facilitiesService: FacilitiesService) { }

  ngOnInit() {
    this.hmoPaymentType = [{
      name: 'Capitation',
      id: 0
    }, {
      name: 'Fee For Service',
      id: 1
    }];
    this.hmoTypeControl.setValue(this.hmoPaymentType[0]);

    this.hmoTypeControl.valueChanges.subscribe(value => {
      if (value === 0) {
        this.authCode_show = false;
      } else if (value === 1) {
        this.authCode_show = true;
      }
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  confirmBill_onClick(bill) {
    this.bill = bill;
    this.bill.acceptFunction = true;
    this.systemModuleService.announceSweetProxy('You are about to confirm this bill', 'question', this)
  }
  sweetAlertCallback(result) {
    if (result.value) {
      if (this.bill.acceptFunction === true) {
        this.hmoConfirmBill(true);
      } else {
        this.hmoConfirmBill(false);
      }
    }
  }

  hmoConfirmBill(isAccept: boolean) {
    if (this.hmoTypeControl.value === 1 && isAccept === true) {
      if (this.authCodeControl.value !== null) {
        const index = this.selectedBill.billItems.filter(x => x._id.toString() === this.bill._id.toString());
        index[0].covered.authorizationCode = this.authCodeControl.value;
        index[0].covered.isVerify = true;
        if (isAccept) {
          index[0].covered.billAccepted = true;
        }
        index[0].covered.verifiedAt = new Date();
        this.billingService.patch(this.selectedBill._id, this.selectedBill, {}).then(payload => {
          this.systemModuleService.announceSweetProxy('Service successfully cleared', 'success');
          this.refreshBills.emit(true);
        });
      } else {
        this.systemModuleService.announceSweetProxy('This service require an authorization code', 'error');
      }
    } else if (this.hmoTypeControl.value === 0 || isAccept === false) {
      const index = this.selectedBill.billItems.filter(x => x._id.toString() === this.bill._id.toString());
      index[0].covered.isVerify = true;
      if (isAccept) {
        index[0].covered.billAccepted = true;
      } else {
        index[0].covered.billAccepted = false;
      }
      index[0].covered.verifiedAt = new Date();
      this.billingService.patch(this.selectedBill._id, this.selectedBill, {}).then(payload => {
        this.systemModuleService.announceSweetProxy('Service successfully cleared', 'success');
        this.refreshBills.emit(true);
      });
    }else {
      this.systemModuleService.announceSweetProxy('Please select a cover type', 'error');
    }
  }

  declineBill_onClick(bill) {
    this.bill = bill;
    this.bill.acceptFunction = false;
    this.systemModuleService.announceSweetProxy('You are about to DECLINE this bill', 'question', this)
  }

  newWorkspace_onClick() {}

  deletion_popup() {}

}
