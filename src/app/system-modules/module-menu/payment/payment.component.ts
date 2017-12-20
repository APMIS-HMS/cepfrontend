import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FacilitiesService, BillingService } from '../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, Invoice, BillModel, User } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})

export class PaymentComponent implements OnInit {

    searchInvestigation: FormControl;
    searchPendingInvoices = new FormControl('', []);
    searchPendingBill = new FormControl('', []);
    selectedFacility: Facility = <Facility>{};
    loadingPendingBills: Boolean = true;
    pendingBills: any[] = [];
    user: User = <User>{};

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: String[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public barChartType: String = 'bar';
    public barChartLegend: Boolean = true;

    public barChartData: any[] = [
        {data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40], label: 'Registration'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Appointment'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Ward'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Clinic'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Pharmacy'},
        {data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90], label: 'Lab'}
    ];

    constructor(
        private formBuilder: FormBuilder,
        private billingService: BillingService,
        private facilityService: FacilitiesService,
        private locker: CoolLocalStorage
    ) {
    }
    ngOnInit() {
        this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
        this.user = <User>this.locker.getObject('auth');
        this.searchInvestigation = new FormControl('', []);

        this._getAllPendingBills();
    }

    private _getAllPendingBills() {
        this.billingService.find({ query: { facilityId: this.selectedFacility._id }})
            .then(res => {
                console.log(res);
                this.loadingPendingBills = false;
                const billings = res.data;
                const result = [];

                for (let i = 0; i < billings.length; i++) {
                    const val = billings[i];
                    const index = result.filter(x => x.patientId === val.patientId);

                    if (index.length > 0) {
                        index[0].billItems = index[0].billItems.concat(val.billItems);
                        index[0].subTotal += val.subTotal;
                        index[0].grandTotal += val.grandTotal;
                    } else {
                        result.push(val);
                    }
                }

                if (result.length > 0) {
                    this.pendingBills = result;
                    console.log(this.pendingBills);
                } else {
                    this.pendingBills = [];
                }
            }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
    }

    // Notification
    private _notification(type: string, text: string): void {
        this.facilityService.announceNotification({
        users: [this.user._id],
        type: type,
        text: text
        });
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }
}
