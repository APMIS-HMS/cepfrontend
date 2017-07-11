import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FacilitiesService, PatientService, InvoiceService } from '../../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, Invoice } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedBillItem: BillItem = <BillItem>{};
  constructor() { }

  ngOnInit() {
    console.log(this.selectedBillItem)
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
