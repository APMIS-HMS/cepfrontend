import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FacilitiesService, BillingService, PatientService, InvoiceService } from '../../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, BillIGroup, Invoice } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

    public frmAddItem: FormGroup;
    itemEdit = new FormControl('', [Validators.required, <any>Validators.pattern('/^\d+$/')]);
    itemQtyEdit = new FormControl('', [Validators.required, <any>Validators.pattern('/^\d+$/')]);

    addModefierPopup = false;
    addLineModefierPopup = false;
    priceItemDetailPopup = false;
    makePaymentPopup = false;
    addItem = false;
    itemEditShow = false;
    itemEditShow2 = false;
    itemEditShow3 = false;
    itemAmount = '20,000.00';
    itemQty = 2;

    searchPendingInvoice = new FormControl('', []);
    searchPendingBill = new FormControl('', []);

    selectedPatient: Patient = <Patient>{};
    selectedFacility: Facility = <Facility>{};
    selectedBillItem: BillItem = <BillItem>{};
    invoice: Invoice = <Invoice>{ billingDetails: [], totalPrice: 0, totalDiscount: 0 };
    selectedInvoiceGroup: Invoice = <Invoice>{};
    invoiceGroups: Invoice[] = [];
    subscription: Subscription;
    constructor(private formBuilder: FormBuilder,
        private locker: CoolSessionStorage,
        public facilityService: FacilitiesService,
        private invoiceService: InvoiceService,
        private billingService: BillingService,
        private route: ActivatedRoute,
        private patientService: PatientService) {
        this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
        this.patientService.receivePatient().subscribe((payload: Patient) => {
            this.selectedPatient = payload;
            this.selectedInvoiceGroup = <Invoice>{ invoiceNo: '', createdAt: undefined };
            this.getPatientInvoices();
        });
        this.invoiceService.receiveInvoice().subscribe((payload: any) => {
            this.invoice.billingDetails.push(payload);
            this.invoice.billingDetails.forEach((item: any) => {
                this.invoice.totalPrice = this.invoice.totalPrice + item.amount;
            });
        });
    }
    getPatientInvoices() {
        this.invoiceService.find({ query: { patientId: this.selectedPatient._id, facilityId: this.selectedFacility._id } })
            .then(payload => {
                this.invoiceGroups = payload.data;
                console.log(this.invoiceGroups);
            });
    }
    ngOnInit() {
        this.frmAddItem = this.formBuilder.group({
            service: ['', [<any>Validators.required]],
            qty: ['', [<any>Validators.required]]
        });
        this.subscription = this.route.params.subscribe(params => {
            const id = params['id']; // (+) converts string 'id' to a number
            if (id !== undefined) {
                this.patientService.get(id, {}).then(payload => {
                    this.selectedPatient = payload;
                    this.getPatientInvoices();
                });
            }
        });
    }

    onSelectedInvoice(group: Invoice) {
        this.selectedInvoiceGroup = group;
        console.log(this.selectedInvoiceGroup)
    }

    addModefier() {
        this.addModefierPopup = true;
    }
    lineModifier_show() {
        this.addLineModefierPopup = true;
    }
    addItem_show() {
        this.addItem = true;
    }
    makePayment_show() {
        this.makePaymentPopup = true;
    }
    close_onClick(e) {
        this.addModefierPopup = false;
        this.addLineModefierPopup = false;
        this.addItem = false;
        this.priceItemDetailPopup = false;
        this.makePaymentPopup = false;
    }
    itemEditToggle() {
        this.itemEditShow = !this.itemEditShow;
    }
    itemEditToggle2() {
        this.itemEditShow2 = !this.itemEditShow2;
    }
    itemEditToggle3() {
        this.itemEditShow3 = !this.itemEditShow3;
    }
    itemDetail(billItem: BillItem) {
        this.priceItemDetailPopup = true;
        this.selectedBillItem = billItem;
    }
    print(): void {
        let printContents, popupWin;
        printContents = document.getElementById('print-section').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(
            `<html>
                <head>
                <title>Print tab</title>
                <style>
                //........Customized style.......
                @import "../../../../globals/variables.scss";
                @import "../../../../globals/normalize.scss";

                .megaPgWrap{
                    display: flex;
                    justify-content: space-between;
                }
                .feedsWrap{
                    width: 180px;
                    padding: 5px;
                }
                .feedbox{
                    background: #EEEEEE;
                    width: 100%;
                    min-height: 200px;
                    margin-bottom: 10px;
                }
                .feedsWrap input, .feedsWrap select{
                    width: 80%;
                }
                .cta-1{
                    width: 130px;
                    height: 30px;
                    font-size: 12px;
                }
                .feedsWrap .frm-item-wrap{
                    padding-bottom: 10px;
                }
                .contentCol{
                    width: 800px;
                    border: 1px solid #EEEEEE;
                    margin: 0 2px;
                }
                .suggestionFeeds{
                    width: 245px;
                    margin: 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                }
                .suggestedItem{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    max-width: 185px;
                    background: #BDBDBD;
                    border-radius: 20px;
                    padding: 3px;
                    border: 0.5px solid #9E9E9E;
                    margin-top: 5px;
                    margin-left: 3px;
                    cursor: pointer;
                }
                .suggestedItem:hover{
                    background: #9E9E9E;
                }
                .suggetedName {
                    font-size: 12px;
                }
                .billHeader{
                    font-family: $font-titles;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #01579B;
                    padding: 10px;
                    width: 100%;
                    height: 80px;
                    box-sizing: border-box;
                }
                .billHeaderLogoWrap{
                    text-align: center;
                }
                .billHeaderLogoWrap img{
                    width: 40px;
                    border: 5px solid #fff;
                }
                .BillfacilityName{
                    color: #fff;
                    font-size: 16px;
                }
                .billContact{
                    display: flex;
                    align-items: center;
                    color: #03A9F4;
                    font-size: 12px;
                    margin: 5px;
                }
                .billContact i{
                    margin-right: 10px;
                }
                .invoiceLabel{
                    font-size: 25px;
                    color: #BCAAA4;
                }
                .billBody{
                    margin: 20px 0;
                }
                .topsecInnerWrap{
                    font-size: 11px;
                    color: #37474F;
                    line-height: 1.5;
                    margin-left: 10px;
                    min-width: 160px;
                }
                .clientName{
                    font-family: $font-titles;
                    text-transform: uppercase;
                    border-bottom: 1px solid #EEEEEE;
                    padding: 0 0 5px 5px;
                    font-size: 20px;
                    color: #01579B;
                    margin-bottom: 5px;
                }
                .rhsSectA{
                    border-bottom: 1px solid #EEEEEE;
                    padding-left: 5px;
                    padding-bottom: 5px;
                }
                .semiWrapper{
                    display: flex;
                    justify-content: space-between;
                    margin-right: 10px;
                    line-height: 2;
                }
                .semiWrapper .label{
                    padding-right: 20px;
                }
                .semiWrapper .data{
                    font-weight: bold;
                    text-align: right;
                }
                .rhsSectB {
                    text-align: right;
                    font-size: 14px;
                    color: #000;
                    margin: 5px 10px 0 0;
                }
                .topTotal{
                    font-weight: bold;
                }
                .billContentSect{
                    position: relative;
                }
                .btn-addItem{
                    margin: 20px 0 -14px 9px;
                }
                .billContentSect .tblBg{
                    margin: 20px auto;
                    color: #424242;
                    border-collapse: collapse;
                    width: 98%;
                }
                .billContentSect .tblBg td, .billContentSect .tblBg th{
                    min-width: 90px;
                    padding: 15px 10px;
                }
                .billContentSect .tblBg td{
                    border-bottom: 0.1px solid #F5F5F5;
                }
                thead{
                    font-size: 16px;
                    border-bottom: 2px solid #BDBDBD;
                }
                thead .col1{
                    font-weight: normal;
                }
                thead .col2, thead .col3, thead .col4, thead .col4-5, thead .col5{
                    font-weight: bold;
                }
                .col2, .col3, .col4, .col4-5, .col5{
                    text-align: center;
                }
                .col2, .col3, .col4, .col4-5, .col1{
                    cursor: pointer;
                }
                thead .col4, tbody .col4{
                    color: #fff;
                    background: #03A9F4;
                }
                .billContentSect tbody tr:hover{
                    border-left: 5px solid #03A9F4
                }
                .col4-5{
                    color: #fff;
                    background: #1565C0;
                }
                .col1{
                    background: #FAFAFA;
                }
                .col2{
                    background: #E0E0E0;
                }
                .col3{
                    background: #EEEEEE;
                }
                .col5{
                    background: #FF7043;
                    color: #fff;
                }
                .col5 i{
                    cursor: pointer;
                    padding: 3px;
                    margin: 3px;
                    border: 1px solid #FF7043;
                    text-align: center;
                }
                .col2 input, .col3 input{
                    width: 80%;
                    margin: 0;
                    padding: 0 5px;
                }
                .itemName{
                    font-size: 14px;
                    font-weight: bold;
                }
                .itemDesc{
                    font-size: 10px;
                    font-weight: normal;
                    color: #BDBDBD;
                    max-width: 170px;
                }
                .billSummarySect{
                    background: #757575;
                    color: #fff;
                    width: 100%;
                    padding: 10px;
                    box-sizing: border-box;
                    overflow: hidden;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .summaryItems{
                    color: #BDBDBD;
                    border-bottom: 1px solid #BDBDBD;
                    text-align: right;
                }
                .summaryItem, .grandTotalWrap{
                    display: flex;
                    justify-content: space-between;
                    margin-right: 10px;
                    line-height: 2;
                }
                .summaryItem .label, .grandTotalWrap .label{
                    padding-right: 20px;
                    font-size: 12px;
                }
                .summaryItem .data, .grandTotalWrap .data{
                    width: 150px;
                    font-weight: bold;
                    font-size: 16px;
                }
                .grandTotalWrap .label, .grandTotalWrap .data{
                    color: #fff;
                    font-weight: bold;
                    text-align: right;
                }
                .billSummarySect table td{
                    width: 100px;
                    padding: 2px 10px;
                }
                .billFooter{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px 0;
                }
                .billFooter img{
                    width: 15px;
                    margin-right: 10px;
                }
                .BillfooterTxt{
                    font-size: 10px;
                    color: #757575;
                }
                .modal-overlay{
                    position: fixed;
                    left: 0;
                    top: 0;
                }
                .col5 .cta-1{
                    margin: 0;
                    background: transparent;
                    border: 1px solid #fff;
                    width: auto;
                    height: auto;
                    padding: 3px 5px;
                    font-size: 10px;
                }
                .printIco {
                    position: absolute;
                    right: 5px;
                    font-size: 26px;
                    top: 0px;
                    color: #424242;
                    cursor: pointer;
                }
                .printIco:hover{
                    color: #0288D1;
                }
                </style>
                </head>
                <body onload="window.print();window.close()">${printContents}</body>
            </html>`
        );
        popupWin.document.close();
    }

}
