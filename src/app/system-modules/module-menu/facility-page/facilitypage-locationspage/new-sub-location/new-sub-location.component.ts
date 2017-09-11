import { Component, OnInit, NgZone, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { FacilitiesService, FacilityModuleService, TagService } from '../../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../../services/module-manager/setup/index';
import { FacilityModule, Facility, Location, MinorLocation, Tag } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-new-sub-location',
  templateUrl: './new-sub-location.component.html',
  styleUrls: ['./new-sub-location.component.scss']
})
export class NewSubLocationComponent implements OnInit {
  @Input() locations: Location[];
  @Input() location: Location = <Location>{};
  @Input() subLocation: MinorLocation = <MinorLocation>{};
  ActionButton: string = 'Submit';
  mainErr = true;
  errMsg = 'You have unresolved errors';

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  facilityObj: Facility = <Facility>{};
  public frmNewSubLoc: FormGroup;

  tags: Tag[] = [];

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private locationService: LocationService,
    private tagService: TagService,
    public facilityService: FacilitiesService) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
      this.locker.setObject('selectedFacility', payload);
    });
  }

  ngOnInit() {
    this.facilityObj = <Facility>this.locker.getObject('selectedFacility');
    this.addNew();
    this.frmNewSubLoc.controls['sublocParent'].setValue(this.location._id);
    if (this.subLocation._id !== undefined) {
      this.ActionButton = 'Update';
      this.frmNewSubLoc.controls['sublocName'].setValue(this.subLocation.name);
      this.frmNewSubLoc.controls['sublocAlias'].setValue(this.subLocation.shortName);
      this.frmNewSubLoc.controls['sublocDesc'].setValue(this.subLocation.description);
    }
    this.getTags();
  }
  addNew() {
    this.frmNewSubLoc = this.formBuilder.group({
      sublocName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      sublocAlias: ['', [<any>Validators.minLength(2)]],
      sublocParent: ['', [<any>Validators.required]],
      sublocDesc: ['', [<any>Validators.required, <any>Validators.minLength(10)]]
    });
  }
  getTags() {
    this.tagService.find({ query: { tagType: 'Laboratory Location' } }).then(payload => {
      console.log(payload);
      this.tags = payload.data;
    })
  }

  newSubLocation(valid, val) {
    if (valid) {
      if (val.sublocName === '' || val.sublocName === ' ' || val.sublocAlias === ''
        || val.sublocAlias === ' ' || val.sublocDesc === '' || val.sublocDesc === ' ') {
        this.mainErr = false;
        this.errMsg = 'You left out a required field';
      } else if (this.subLocation._id === undefined) {
        const tag: Tag = <Tag>{};
        tag.facilityId = this.facilityObj._id;
        tag.name = val.sublocName;
        tag.tagType = 'Laboratory Location';

        const authObj: any = this.locker.getObject('auth');
        const auth: any = authObj.data;
        tag.createdBy = auth._id;
        const model: MinorLocation = <MinorLocation>{
          name: val.sublocName,
          shortName: val.sublocAlias,
          description: val.sublocDesc,
          locationId: val.sublocParent
        };
        this.facilityObj.minorLocations.push(model);
        this.facilityService.update(this.facilityObj).then((payload) => {
          this.tagService.update(tag).then(pay => {
            this.addNew();
          });
        });
        this.mainErr = true;
      } else {
        const tags = this.tags.filter(x => x.name === this.subLocation.name);
        if (tags.length === 0) {
          const tag: Tag = <Tag>{};
          tag.facilityId = this.facilityObj._id;
          tag.name = val.sublocName;
          tag.tagType = 'Laboratory Location';

          const authObj: any = this.locker.getObject('auth');
          const auth: any = authObj.data;
          tag.createdBy = auth._id;

          this.subLocation.description = val.sublocDesc;
          this.subLocation.name = val.sublocName;
          this.subLocation.shortName = val.sublocAlias;
          const index = this.facilityObj.minorLocations.findIndex((obj => obj._id == this.subLocation._id));
          this.facilityObj.minorLocations.splice(index, 1, this.subLocation);
          this.facilityService.update(this.facilityObj).then((payload) => {
            this.tagService.create(tag).then(pay => {
              this.addNew();
            });

          });

        } else {
          const tagIndex = this.tags.findIndex(x => x.name === this.subLocation.name);
          this.subLocation.description = val.sublocDesc;
          this.subLocation.name = val.sublocName;
          this.subLocation.shortName = val.sublocAlias;
          const index = this.facilityObj.minorLocations.findIndex((obj => obj._id == this.subLocation._id));
          this.facilityObj.minorLocations.splice(index, 1, this.subLocation);
          this.facilityService.update(this.facilityObj).then((payload) => {
            let tag = this.tags[tagIndex];
            tag.name = this.subLocation.name;
            this.tagService.update(tag).then(pay => {
              this.addNew();
            });
          });
        }
      }
    } else {
      this.mainErr = false;
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.subLocation = <MinorLocation>{};
  }

}
