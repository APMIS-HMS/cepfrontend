import { Component, OnInit } from '@angular/core';
import { Locker } from 'angular2-locker';
import { FacilitiesService, PrescriptionService } from '../../../../services/facility-manager/setup/index';
import { Facility, Prescription, PrescriptionItem } from '../../../../models/index';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {
  facility: Facility = <Facility>{};
  status: string[];
  prescriptionLists: any[] = [];

  constructor(
    private _locker: Locker,
    private _prescriptionService: PrescriptionService,
  ) {

  }

  ngOnInit() {
    this.facility = this._locker.get('selectedFacility');
    this.getAllPrescriptions();
  }

  // Get all drugs from generic
  getAllPrescriptions() {
    this._prescriptionService.get(this.facility._id, {})
      .then(res => {
        console.log(res);
        this.prescriptionLists = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

}