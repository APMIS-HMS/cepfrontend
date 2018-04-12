import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilitiesService, BillingService, InvoiceService,
    PendingBillService, TodayInvoiceService, LocSummaryCashService } from '../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, Invoice, BillModel, User } from '../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
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
    loadingPendingBills = true;
    loadingLocAmountAccrued = true;
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
    public barChartData: any[] = [{ 'data': [0], 'label': '' }];

    constructor(
        private formBuilder: FormBuilder,
        private billingService: BillingService,
        private facilityService: FacilitiesService,
        private invoiceService: InvoiceService,
        private _pendingBillService: PendingBillService,
        private locker: CoolLocalStorage,
        private router: Router,
        private _todayInvoiceService: TodayInvoiceService,
        private _locSummaryCashService: LocSummaryCashService,
        private systemModuleService: SystemModuleService
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
                this._todayInvoiceService.get(this.selectedFacility._id, {
                    query: {
                        'isQuery': true,
                        'name': value
                    }
                }).then(payload => {
                    this.invoiceGroups = payload.invoices;
                    this.isLoadingInvoice = false;
                }).catch(err => this._notification('Error', 'There was a problem getting pending bills. Please try again later!'));
            });

        this.searchPendingBill.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(value => {
                this.loadingPendingBills = true;
                this._pendingBillService.get(this.selectedFacility._id, {
                    query: {
                        'isQuery': true,
                        'name': value
                    }
                }).then((res: any) => {
                    this.pendingBills = res.bills;
                    this.loadingPendingBills = false;
                }).catch(err => {
                    this._notification('Error', 'There was a problem getting pending bills. Please try again later!');
                });
            });
    }

    private _getInvoices() {
        this.systemModuleService.on;
        this._todayInvoiceService.get(this.selectedFacility._id, {
            query: {
                'isQuery': false
            }
        }).then(payload => {
            this.systemModuleService.off();
            this.invoiceGroups = payload.invoices;
            this.totalAmountReceived = payload.amountReceived;
            this.isLoadingInvoice = false;
            this._getLocAmountAccrued();
        }).catch(err => {
            this.systemModuleService.off();
            this.isLoadingInvoice = false;
            this._notification('Error', 'There was a problem getting invoices, Please try again later!');
        });
    }

    private _getBills() {
        this.systemModuleService.on();
        this._pendingBillService.get(this.selectedFacility._id, {
            query: {
                'isQuery': false
            }
        }).then((res: any) => {
            console.log(res);
            this.systemModuleService.off();
            this.pendingBills = res.bills;
            console.log(this.pendingBills);
            this.totalAmountBilled = res.amountBilled;
            this.loadingPendingBills = false;
        }).catch(err => {
            console.log(err);
            this.systemModuleService.off();
            this.loadingPendingBills = false;
            this._notification('Error', err);
        });
    }

    private _getLocAmountAccrued() {
        this._locSummaryCashService.get(this.selectedFacility._id, {})
            .then(payload2 => {
                console.log(payload2);
                this.systemModuleService.off();
                if (payload2 != null) {
                    if (payload2.barChartData !== undefined) {
                        this.barChartLabels = payload2.barChartLabels;
                        if (payload2.barChartData.length > 0) {
                            this.barChartData.splice(0, 1);
                        }
                        for (let k = 0; k < payload2.barChartData.length; k++) {
                            this.barChartData.push({ 'data': [0], 'label': '' });
                        }
                        for (let i = 0; i < payload2.barChartData.length; i++) {
                            for (let j = 0; j < payload2.barChartData[i].data.length; j++) {
                                this.barChartData[i].data.push(payload2.barChartData[i].data[j]);
                            }
                            this.barChartData[i].label = payload2.barChartData[i].label;
                        }
                    }
                }
            }).catch(err => {
                this._notification('Error', 'There was a problem getting location accrued amount bills. Please try again later!')
            });
    }

    onSelectedInvoice(invoice) {
        this.router.navigate(['/dashboard/payment/invoice', invoice.patientId]);
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
    }

    public chartHovered(e: any): void {
    }
}
