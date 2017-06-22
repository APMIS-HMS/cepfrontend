import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FacilitiesService, FamilyHealthCoverService, CountriesService } from '../../../../services/facility-manager/setup/index';
import { Facility, PersonPrincipal, FamilyHealthCover, Country } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-family-cover',
  templateUrl: './family-cover.component.html',
  styleUrls: ['./family-cover.component.scss']
})
export class FamilyCoverComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  personDependants = false;
  addPrincipalpopup = false;
  selectedFacility: Facility = <Facility>{};
  selectedActiveFamilyHealthCover: FamilyHealthCover = <any>{};
  inActiveFamilyHealthCovers: FamilyHealthCover[] = [];
  activeFamilyHealthCovers: FamilyHealthCover[] = [];
  selectedPersonPrincipal: any;
  type: string = 'Family';

  constructor(private familyHealthCoverService: FamilyHealthCoverService,
    public facilityService: FacilitiesService,
    private countryService: CountriesService,
    private locker: CoolLocalStorage) {
    this.familyHealthCoverService.listner.subscribe(payload => {
      this.getActiveFamilyHealthCover();
      this.getInActiveFamilyHealthCover();
    });
  }

  ngOnInit() {
    this.pageInView.emit('Family Health Cover');
    this.getActiveFamilyHealthCover();
    this.getInActiveFamilyHealthCover();
  }

  personDependants_show(active: any) {
    this.selectedPersonPrincipal = active.familyPrincipalPerson;
    this.selectedActiveFamilyHealthCover = active;
    this.personDependants = true;
  }
  addPrincipalShow() {
    this.addPrincipalpopup = true;
  }
  close_onClick(e) {
    this.personDependants = false;
    this.addPrincipalpopup = false;
  }


  getInActiveFamilyHealthCover() {
    this.familyHealthCoverService.find({ query: { facilityId: this.selectedFacility._id, isActive: false } })
      .then(payload => {
        this.inActiveFamilyHealthCovers = payload.data;
      });
  }

  getActiveFamilyHealthCover() {
    this.familyHealthCoverService.find({ query: { facilityId: this.selectedFacility._id, isActive: true } })
      .then(payload => {
        this.activeFamilyHealthCovers = payload.data;
      });
  }

}
