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

    searchInvestigation: FormControl;
    searchPendingInvoices = new FormControl('', []);
    searchPendingBill = new FormControl('', []);

    constructor(private formBuilder: FormBuilder,
        private locker: CoolSessionStorage,
        public facilityService: FacilitiesService,
        private invoiceService: InvoiceService,
        private patientService: PatientService) {
    }
    ngOnInit() {
        this.searchInvestigation = new FormControl('', []);
    }


    public barChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    
    // events
    public chartClicked(e:any):void {
        console.log(e);
    }
    
    public chartHovered(e:any):void {
        console.log(e);
    }
    
    public randomize():void {
        // Only Change 3 values
        let data = [
        Math.round(Math.random() * 100),
        59,
        80,
        (Math.random() * 100),
        56,
        (Math.random() * 100),
        40];
        // let clone = JSON.parse(JSON.stringify(this.barChartData));
        // clone[0].data = data;
        // this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }
    reqDetail(){

    }
    showImageBrowseDlg(){

    }
    onChange(e){

    }
    // public barChartOptions:any = {
    //     scaleShowVerticalLines: false,
    //     responsive: true
    // };
}
