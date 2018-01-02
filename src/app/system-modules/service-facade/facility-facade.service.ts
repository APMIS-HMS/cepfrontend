import { FacilitiesService } from './../../services/facility-manager/setup/facility.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FacilityFacadeService {

  facilityCreatorApmisID: string;
  facilityCreatorPersonId:string;
  constructor(private _facilityService: FacilitiesService) { }

  saveFacility(facility) {
    let that = this;
    console.log(facility);
    return new Promise(function (resolve, reject) {
      that._facilityService.createFacility(facility).then((payload) => {
        console.log(payload);
        resolve(payload);
      }, error => {
        // console.log(error);
        reject(error);
      });
    });
  }

}
