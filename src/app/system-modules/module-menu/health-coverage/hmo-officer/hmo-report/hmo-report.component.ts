import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BillingService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-hmo-report',
  templateUrl: './hmo-report.component.html',
  styleUrls: ['./hmo-report.component.scss']
})
export class HmoReportComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedBill;
  filterBills = [];
  selectedFacility: any = <any>{}
  startTime = new FormControl();
  endTime = new FormControl();
  seleectHMO = new FormControl();
  dateRange: any;

  constructor(private billingService: BillingService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.filterBills = this.selectedBill.billItems.filter(x => x.covered.isVerify !== undefined);
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  setReturnValue(e){}
  onClickPrintDocument() {
    let printContents = document.getElementById('print-section').innerHTML;
    let popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title></title>
          <style>
            table{
              width: 100%;
              position: relative;
              border-collapse: collapse;
              font-size: 1.2rem;
            }
            table, td { 
                border: 0.5px solid #ddd;
            } 
            th {
                height: 50px;
                background: transparent;
                border: 0.5px solid #ddd;
            }
            td {
                vertical-align: center;
                text-align: left;
                padding: 5px;
            }
            tr:nth-child(even) {background-color: #f8f8f8}
            .print-header{
              display:flex;
              Justify-content:space-between;
              margin-bottom:40px;
              background-color:#eee;
              width:100%;
            }
            .main-fac{
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin:0 10px;
              flex-wrap:wrap;
            }
            .img-wrap{
              width:40px;
              height:40px;
              border-radius:50%;
              display:flex;
              justify-content:center;
              align-items:center;
              overflow:hidden;
              margin:0 auto;
              margin-right:10px;
            }
            .img-wrap img{
              width:100%;
            }
            .fac{
              font-size:1.4rem;
              color:#0288D1;
            }
            .fac-type{
              font-size:1rem;
              color:#ff2500;
            }
            .modal_title {
              font-family: "Josefin Sans", sans-serif;
              font-weight:bold;
              margin: 0px auto;
              font-size: 2rem;
              text-align: center;
          }
          
          .modal_mini_title {
              margin: 0px auto;
              font-size: 1.2rem;
              text-align: center;
              color:#0288D1;
          }
          .doc-title{
            border-bottom:1px solid #0288D1;
            margin-bottom:30px;
            padding-bottom:20px;
          }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

}
