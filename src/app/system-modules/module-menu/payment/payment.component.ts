import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilitiesService, BillingService, InvoiceService, PendingBillService, TodayInvoiceService, LocSummaryCashService } from '../../../services/facility-manager/setup/index';
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
    loadingLocAmountAccrued: Boolean = true;
    isLoadingInvoice = false;
    totalAmountReceived = 0;
    totalAmountBilled = 0;
    pendingBills: any[] = [];
    locAmountAccrued: any[] = [];
    invoiceGroups: any[] = [];
    user: User = <User>{};

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: String[] = [];
    public barChartType: String = 'bar';
    public barChartLegend: Boolean = true;
    public barChartData: any[] = [{ "data": [0], "label": "" }];

    constructor(
        private formBuilder: FormBuilder,
        private billingService: BillingService,
        private facilityService: FacilitiesService,
        private invoiceService: InvoiceService,
        private _pendingBillService: PendingBillService,
        private locker: CoolLocalStorage,
        private router: Router,
        private _todayInvoiceService: TodayInvoiceService,
        private _locSummaryCashService: LocSummaryCashService
    ) {

    }
    ngOnInit() {
        this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
        this.user = <User>this.locker.getObject('auth');
        this.searchInvestigation = new FormControl('', []);

        this._getBills();
        this._getInvoices();

        this.searchPendingInvoices.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(value => {
                this.isLoadingInvoice = true;
                var facility = {
                    "_id": this.selectedFacility._id,
                    "isQuery": true,
                    "name": value
                }
                this._todayInvoiceService.get(facility).then(payload => {
                    this.invoiceGroups = payload.data.invoices;
                    this.isLoadingInvoice = false;
                }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
            });

        this.searchPendingBill.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(value => {
                this.loadingPendingBills = true;
                var facility = {
                    "_id": this.selectedFacility._id,
                    "isQuery": true,
                    "name": value
                }
                this._pendingBillService.get(facility)
                    .then(res => {
                        this.pendingBills = res.data.bills;
                        this.loadingPendingBills = false;
                    }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
            });
    }

    private _getInvoices() {
        this.isLoadingInvoice = true;
        var facility = {
            "_id": this.selectedFacility._id,
            "isQuery": false
        }
        this._todayInvoiceService.get(facility).then(payload => {
            console.log(payload.data);
            this.invoiceGroups = payload.data.invoices;
            this.totalAmountReceived = payload.data.amountReceived;
            this.isLoadingInvoice = false;
            this._getLocAmountAccrued();
        }).catch(err => this._notification('Error', 'There was a problem getting invoices, Please try again later!'));
    }

    private _getBills() {
        this.loadingPendingBills = true;
        var facility = {
            "_id": this.selectedFacility._id,
            "isQuery": false
        }
        this._pendingBillService.get(facility)
            .then(res => {
                console.log(res.data);
                this.pendingBills = res.data.bills;
                this.totalAmountBilled = res.data.amountBilled;
                this.loadingPendingBills = false;
            }).catch(err => {
                this._notification('Error', 'There was a problem getting pending bills. Please try again later!')
            });
    }

    private _getLocAmountAccrued() {
        this.loadingLocAmountAccrued = true;
        var facility = {
            "_id": this.selectedFacility._id
        }
        this._locSummaryCashService.get(facility)
            .then(payload2 => {
                this.barChartLabels = payload2.data.barChartLabels;
                this.barChartData.splice(0, 1);
                for (let k = 0; k < payload2.data.barChartData.length; k++) {
                    this.barChartData.push({ "data": [0], "label": "" });
                }
                for (let i = 0; i < payload2.data.barChartData.length; i++) {
                    for (let j = 0; j < payload2.data.barChartData[i].data.length; j++) {
                        this.barChartData[i].data.push(payload2.data.barChartData[i].data[j]);
                    }
                    this.barChartData[i].label = payload2.data.barChartData[i].label;
                }
                this.loadingLocAmountAccrued=false;
            }).catch(err => {
                this._notification('Error', 'There was a problem getting location accrued amount bills. Please try again later!')
            });
    }

    onSelectedInvoice(invoice){
        this.router.navigate(['/dashboard/payment/invoice', invoice.personDetails._id]);
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
