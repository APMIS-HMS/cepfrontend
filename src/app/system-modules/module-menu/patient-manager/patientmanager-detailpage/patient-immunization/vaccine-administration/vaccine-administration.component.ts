import { Component, OnInit, Input } from '@angular/core';
import { ImmunizationRecordService } from '../../../../../../services/facility-manager/setup';
import { Facility } from '../../../../../../models/index';
import * as format from 'date-fns/format';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as differenceInDays from 'date-fns/difference_in_days';
import * as isPast from 'date-fns/is_past';
import * as isToday from 'date-fns/is_today';
import { SystemModuleService } from '../../../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../../../service-facade/auth-facade.service';

@Component({
  selector: 'app-vaccine-administration',
  templateUrl: './vaccine-administration.component.html',
  styleUrls: ['./vaccine-administration.component.scss']
})
export class VaccineAdministrationComponent implements OnInit {
  @Input() patient;
  currentDocument: any;
  facility: Facility = <Facility>{};
  employeeDetails: any;
  expanded = false;
  immunizationRecord: any = <any>{};
  immunizationRecords: any = <any>[];
  onAdminister = true;
  onAdministering = false;
  disableAdminister = false;

  constructor(
    private _locker: CoolLocalStorage,
    private _immunizationRecordService: ImmunizationRecordService,
    private _systemModuleService: SystemModuleService,
    private _authFacadeService: AuthFacadeService
  ) {
    this._authFacadeService.getLogingEmployee().then(res => {
      console.log(res);
      this.employeeDetails = res;
    }).catch(err => { });
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    if (!!this.patient && !!this.patient._id) {
      this._getImmunizationRecords(this.patient._id);
    }
    console.log(isToday(new Date('2018-06-19T14:25:20.515Z')));
  }

  onClickAdministerOrSuspendRecord(record: any) {
    console.log(record);
    if (!!record._id) {
      this.onAdminister = false;
      this.disableAdminister = true;
      this.onAdministering = true;
      const immunizationRecord = this.immunizationRecord;
      const patientName = `${this.patient.personDetails.firstName} ${this.patient.personDetails.lastName}`;
      // Add a footprint to the record
      for (const immune of immunizationRecord.immunizations) {
        console.log(immune);
          if (immune._id === record._id) {
            immune.administered = true;
            immune.administeredBy = this.employeeDetails._id;
            break;
          }
      }

      // Update this record on immunization record.
      this._immunizationRecordService.patch(immunizationRecord).then(res => {
        if (!!res._id) {
          this.onAdminister = true;
          this.disableAdminister = false;
          this.onAdministering = false;
          const msg = `You have successfully administered ${record.vaccine.code} ${record.sequence} to ${patientName}`;
          this._systemModuleService.announceSweetProxy(msg, 'success');
        }
      }).catch(e => {
        this.onAdminister = true;
        this.disableAdminister = false;
        this.onAdministering = false;
        this._getImmunizationRecords(this.patient._id);
        const msg = `There is an error trying to administer ${record.vaccine.code} ${record.sequence} to ${patientName}`;
        this._systemModuleService.announceSweetProxy(msg, 'error');
      });
    } else {
      this._systemModuleService.announceSweetProxy('There is an error with this data.', 'error');
    }
  }

  // node_toggle(){
  //   this.expanded= !this.expanded;
  // }

  private _getImmunizationRecords(patientId) {
    this._immunizationRecordService.find({ query: { facilityId: this.facility._id, patientId: patientId  }}).then(res => {
      console.log(res);
      // Check if data has a value and if there exists immunizations as a property and if the length is greater than 0.
      if (!!res.data && res.data.length > 0 && !!res.data[0].immunizations && res.data[0].immunizations.length > 0) {
        this.immunizationRecord = res.data[0];
        const reverseDocuments = res.data[0].immunizations.reverse();
        console.log(reverseDocuments);
        const grouped = this._groupBy(reverseDocuments, reverseDocument => format(reverseDocument.appointmentDate, 'DD/MM/YYYY'));
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

  checkIfRecordIsToday(recordDate: string): boolean {
    return isToday(new Date(recordDate))
  }

  checkIfTodayIsGreater(today: string|number = Date.now(), recordDate: string): boolean {
    return isPast(recordDate);
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
