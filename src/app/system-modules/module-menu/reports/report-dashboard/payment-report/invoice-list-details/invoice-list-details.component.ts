import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list-details',
  templateUrl: './invoice-list-details.component.html',
  styleUrls: ['./invoice-list-details.component.scss']
})
export class InvoiceListDetailsComponent implements OnInit {

  paymentSummary = false;

  toggleInvestigation = false;
  toggleProcedure = false;
  toggleMedication = true;
  toggleNurseingCare = false;
  togglePhysicianOrder = false;
  toggleSheetDetails = false;

  constructor(private _router: Router) { }

  ngOnInit() {
    // const page: string = this._router.url;
    // this.checkPageUrl(page);
  }


  showInvestigation() {
    this.toggleInvestigation = !this.toggleInvestigation;
    this.toggleProcedure = false;
    this.toggleMedication = false;
    this.toggleNurseingCare = false;
    this.togglePhysicianOrder = false;
  }

  showProcedure() {
    this.toggleProcedure = !this.toggleProcedure;
    this.toggleInvestigation = false;
    this.toggleMedication = false;
    this.toggleNurseingCare = false;
    this.togglePhysicianOrder = false;
  }
  showMedication() {
    this.toggleMedication = !this.toggleMedication;
    this.toggleInvestigation = false;
    this.toggleProcedure = false;
    this.toggleNurseingCare = false;
    this.togglePhysicianOrder = false;
  }
  showNursingCare() {
    this.toggleNurseingCare = !this.toggleNurseingCare;
    this.toggleInvestigation = false;
    this.toggleProcedure = false;
    this.toggleMedication = false;
    this.togglePhysicianOrder = false;
  }
  showPhysicianOrder() {
    this.togglePhysicianOrder = !this.togglePhysicianOrder;
    this.toggleInvestigation = false;
    this.toggleProcedure = false;
    this.toggleMedication = false;
    this.toggleNurseingCare = false;
  }

}
