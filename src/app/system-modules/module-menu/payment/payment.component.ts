import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FacilitiesService, PatientService, InvoiceService } from '../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, Invoice } from '../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
    selectedPatient: Patient = <Patient>{};
    selectedFacility: Facility = <Facility>{};
    selectedBillItem: BillItem = <BillItem>{};
    invoice: Invoice = <Invoice>{ billingDetails: [], totalPrice: 0, totalDiscount: 0 };

    constructor(private formBuilder: FormBuilder,
        private locker: CoolSessionStorage,
        public facilityService: FacilitiesService,
        private invoiceService: InvoiceService,
        private patientService: PatientService) {
    }
    ngOnInit() {
    }

}
