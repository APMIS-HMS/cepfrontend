import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {

    searchInvestigation: FormControl;
    searchPendingInvoices = new FormControl('', []);
    searchPendingBill = new FormControl('', []);

    public barChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels:string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
    
    public barChartData:any[] = [
        {data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40], label: 'Registration'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Appointment'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Ward'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Clinic'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Pharmacy'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Lab'}
    ];

    constructor(private formBuilder: FormBuilder) {
    }
    ngOnInit() {
        this.searchInvestigation = new FormControl('', []);
    }

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }
    
    public chartHovered(e:any):void {
        console.log(e);
    }
}
