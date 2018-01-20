import { Component, OnInit } from '@angular/core';
import { FacilitiesServiceCategoryService, TagService } from '../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, Tag } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  facility: Facility = <Facility>{};
  tags: Tag[] = [];
  searchTag = new FormControl();
  newServicePopup = false;
  newCategoryPopup = false;
  newTagPopup = false;
  constructor(private _locker: CoolLocalStorage, private _tagService: TagService) {
    this._tagService.createListener.subscribe(payload => {
      this.getTags();
    });
  }

  ngOnInit() {

    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.getTags();

    const subscribeForTag = this.searchTag.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(value => this._tagService.serach({
        query:
          { search: this.searchTag.value, facilityId: this.facility._id }
      }).
        then(payload => {
          this.tags = payload.data;
        }));

    subscribeForTag.subscribe((payload: any) => {
    });

  }
  getTags() {
    this._tagService.find({ query: { facilityId: this.facility._id } }).then(payload => {
      this.tags = payload.data;
    });
  }
  newTagPopup_show() {
    this.newTagPopup = true;
  }

  onTagValueChange() {
    this.getTags();
  }

  close_onClick(e) {
    this.newServicePopup = false;
    this.newCategoryPopup = false;
    this.newTagPopup = false;
  }
}
