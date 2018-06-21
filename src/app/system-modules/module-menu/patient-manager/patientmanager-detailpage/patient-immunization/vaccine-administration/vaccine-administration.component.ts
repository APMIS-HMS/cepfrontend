import { Component, OnInit, Input } from '@angular/core';
import { ImmunizationRecordService } from '../../../../../../services/facility-manager/setup';
import { Facility } from '../../../../../../models/index';
import * as format from 'date-fns/format';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-vaccine-administration',
  templateUrl: './vaccine-administration.component.html',
  styleUrls: ['./vaccine-administration.component.scss']
})
export class VaccineAdministrationComponent implements OnInit {
  @Input() patient;
  currentDocument: any;
  facility: Facility = <Facility>{};
  expanded = false;
  immunizationRecords: any = <any>[];

  constructor(
    private locker: CoolLocalStorage,
    private immunizationRecordService: ImmunizationRecordService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    console.log(this.patient);
    if (!!this.patient && !!this.patient._id) {
      this._getImmunizationRecords(this.patient._id);
    }
  }

  // node_toggle(){
  //   this.expanded= !this.expanded;
  // }

  private _getImmunizationRecords(patientId) {
    this.immunizationRecordService.find({ query: { facilityId: this.facility._id, patientId: patientId  }}).then(res => {
      console.log(res);
      // Check if data has a value and if there exists immunizations as a property and if the length is greater than 0.
      if (!!res.data && res.data.length > 0 && !!res.data[0].immunizations && res.data[0].immunizations.length > 0) {
        const reverseDocuments = res.data[0].immunizations.reverse();
        console.log(reverseDocuments);
        const grouped = this._groupBy(reverseDocuments, reverseDocument => format(reverseDocument.createdAt, 'DD/MM/YYYY'));
        console.log(grouped);
        this.immunizationRecords = Array.from(grouped);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  private _groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  node_toggle(document) {
    console.log(document);
    if (this.currentDocument !== undefined && document === this.currentDocument) {
      this.currentDocument = undefined;
    } else {
      this.currentDocument = document;
    }
  }

  should_show(document) {
    return this.currentDocument === undefined ? false : this.currentDocument._id === document._id;
  }
}
