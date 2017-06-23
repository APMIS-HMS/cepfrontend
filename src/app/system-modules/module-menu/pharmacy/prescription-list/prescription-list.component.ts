import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
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
    private _locker: CoolLocalStorage,
    private _prescriptionService: PrescriptionService,
  ) {

  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
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