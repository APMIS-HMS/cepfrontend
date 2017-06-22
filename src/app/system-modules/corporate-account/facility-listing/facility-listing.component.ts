import { Component, OnInit, Input } from '@angular/core';
import { FacilitiesService, CorporateFacilityService } from '../../../services/facility-manager/setup/index';
import { Facility } from '../../../models/index';
@Component({
  selector: 'app-facility-listing',
  templateUrl: './facility-listing.component.html',
  styleUrls: ['./facility-listing.component.scss']
})
export class FacilityListingComponent implements OnInit {
  @Input() selectedFacility = <Facility>{};
  state = '';
  constructor(public facilityService: FacilitiesService) { }

  ngOnInit() {
    if (this.selectedFacility !== undefined) {
      const stateId = this.selectedFacility.address.state;
      const states: any[] = this.selectedFacility.countryItem.states;
      const selectedState = states.filter(x => x._id === stateId);
      if (selectedState.length > 0) {
        this.state = selectedState[0].name;
      }
    }
  }

}
