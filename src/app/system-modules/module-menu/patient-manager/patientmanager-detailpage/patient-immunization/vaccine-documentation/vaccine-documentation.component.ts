import { Component, OnInit, Input } from '@angular/core';
import { ImmunizationRecordService } from '../../../../../../services/facility-manager/setup';
import { Facility } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-vaccine-documentation',
  templateUrl: './vaccine-documentation.component.html',
  styleUrls: ['./vaccine-documentation.component.scss']
})
export class VaccineDocumentationComponent implements OnInit {
  @Input() patient;
  facility: Facility = <Facility>{};

  constructor(
    private locker: CoolLocalStorage,
    private immunizationRecordService: ImmunizationRecordService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this.locker.getObject('selectedFacility');
  }


}
