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

    // public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    // public barChartType:string = 'bar';
    // public barChartLegend:boolean = true;
    
    // public barChartData:any[] = [
    //     {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    //     {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
    // ];

    // // PolarArea
    // public polarAreaChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
    // public polarAreaChartData:number[] = [300, 500, 100, 40, 120];
    // public polarAreaLegend:boolean = true;
    
    public polarAreaChartType:string = 'polarArea';

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
        let clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
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
