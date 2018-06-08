import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../../../services/facility-manager/setup/index';
import { Facility, Invoice } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  user: any = <any>{};

  selectedFacility: Facility = <Facility>{};
  invoice: Invoice = <Invoice>{ billingDetails: [], totalPrice: 0, totalDiscount: 0 };
  selectedInvoiceGroup: Invoice = <Invoice>{};
  invoiceGroups: Invoice[] = [];
  subscription: Subscription;
  paymentTxn: any = <any>[];

  constructor(
    private _route: Router,
    private _router: ActivatedRoute,
    private locker: CoolLocalStorage,
    private invoiceService: InvoiceService,
    private systemModuleService: SystemModuleService
  ) {
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getPatientInvoices();
  }

  onClickViewDetails(item) {
    if (!!item._id) {
      this.systemModuleService.on();
      this._route.navigate([`/dashboard/payment/history/${item._id}`]).then(res => {
        this.systemModuleService.off();
      });
    }
  }

  getPatientInvoices() {
    this.systemModuleService.on();
    this.invoiceService.find({ query: { facilityId: this.selectedFacility._id, $sort: { updatedAt: -1 } } }).then(payload => {
      if (!!payload.data && payload.data.length > 0) {
        this.invoiceGroups = payload.data;
      }
      this.systemModuleService.off();
    }).catch(err => {
      this.systemModuleService.announceSweetProxy('There was a problem getting invoices. Please try again later!', 'error');
    });

  }

}
