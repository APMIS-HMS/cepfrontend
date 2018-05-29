import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FacilitiesService, BillingService, PatientService, InvoiceService,
  SearchInvoicesService, PendingBillService, TodayInvoiceService
} from '../../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, BillIGroup, Invoice, User } from '../../../../models/index';
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

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private invoiceService: InvoiceService,
    private _searchInvoicesService: SearchInvoicesService,
    private systemModuleService: SystemModuleService) {
    this.user = <User>this.locker.getObject('auth');
    console.log(this.user);
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getPatientInvoices();

  }

  ngOnInit() {
    this.getPatientInvoices();
  }

  getPatientInvoices() {
    console.log('AM here');
    this.systemModuleService.on();
    console.log(this.selectedFacility);
    console.log(this.selectedFacility);
    this.invoiceService.find({ query: { facilityId: this.selectedFacility._id, $sort: { updatedAt: -1 } } }).then(payload => {
      console.log(payload);
      this.invoiceGroups = payload.data;
      console.log(this.invoiceGroups);
      this.systemModuleService.off();
    }).catch(err => {
      this.systemModuleService.announceSweetProxy("There was a problem getting invoices. Please try again later!", "error");
    });
    
  }

}
