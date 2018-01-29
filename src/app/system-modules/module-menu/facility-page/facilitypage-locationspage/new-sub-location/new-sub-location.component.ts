import { Component, OnInit, NgZone, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import {
  FacilitiesService, FacilityModuleService, TagService, WardAdmissionService
} from '../../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../../services/module-manager/setup/index';
import { FacilityModule, Facility, Location, MinorLocation, Tag, User } from '../../../../../models/index';
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
  ActionButton: String = 'Create';
  mainErr = true;
  disableNewMinorLoc: boolean = false;
  errMsg = 'You have unresolved errors';

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  selectedForm: any = <any>{};
  user: User = <User>{};
  employeeDetails: any = <any>{};
  public frmNewSubLoc: FormGroup;

  tags: Tag[] = [];

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private locationService: LocationService,
    private tagService: TagService,
    public facilityService: FacilitiesService,
    private _wardDetailsService: WardAdmissionService
  ) {
    this.facilityService.listner.subscribe(payload => {
      this.facility = payload;
      this.locker.setObject('selectedFacility', payload);
    });
  }

  ngOnInit() {
    this.facility = <Facility>this.locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this.locker.getObject('miniFacility');
    this.employeeDetails = this.locker.getObject('loginEmployee');
    this.user = <User>this.locker.getObject('auth');

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
    this.tagService.find({ query: { tagType: 'Laboratory Location' } }).then(res => {
      this.tags = res.data;
    })
  }

  newSubLocation(valid, val) {
    if (valid) {
      if (val.sublocName === '' || val.sublocName === ' ' || val.sublocAlias === ''
        || val.sublocAlias === ' ' || val.sublocDesc === '' || val.sublocDesc === ' ') {
        this.mainErr = false;
        this.errMsg = 'You left out a required field';
      } else if (this.subLocation._id === undefined) {
        this.disableNewMinorLoc = true;
        this.ActionButton = 'Creating... <i class="fa fa-spinner fa-spin"></i>';
        const tag: Tag = <Tag>{};
        tag.facilityId = this.facility._id;
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

        // First check if that name already exist in the minorlocation
        this.facilityService.get(this.facility._id, {}).then(res => {
          const minorLocation = res.minorLocations.filter(x => x.name.toLowerCase() === val.sublocName.toLowerCase());

          if (minorLocation.length === 0) {
            this.facility.minorLocations.push(model);
            // Update minorLocation in the facility.
            this.facilityService.update(this.facility).then(updateFR => {
              const locations = this.locations.filter(t => t._id === val.sublocParent);
              // If minorLocation is ward, we want to also create minorLocation in wardDetails service.
              if (locations.length > 0 && locations[0].name.toLowerCase() === 'ward') {
                // Also create minor location in wardDetails
                this._wardDetailsService.find({ query: {'facilityId._id': this.facility._id}}).then(wardFindRes => {
                  const newWard = updateFR.minorLocations.filter(x => x.name.toLowerCase() === val.sublocName.toLowerCase());
                  const wardMinorLocation = {
                    minorLocationId: newWard[0],
                    rooms: []
                  };
                  // If wardDetails has already been created,
                  // Just push the minorLocation into locations in wardDetails
                  if (wardFindRes.data.length > 0) {
                    let wardRes = wardFindRes.data[0];
                    wardRes.locations.push(wardMinorLocation);
                    // Update wardDetails
                    this._wardDetailsService.update(wardRes).then(wardUpdateRes => {
                      this.addNew();
                      this.disableNewMinorLoc = false;
                      this.ActionButton = 'Create';
                      const text = val.sublocName + ' has been created successfully';
                      this._notification('Success', text);
                    });
                  } else {
                    const locationsArray = [];
                    locationsArray.push(wardMinorLocation);
                    const wardDetails = {
                      facilityId: this.miniFacility,
                      locations: locationsArray
                    };
                    // Create WardDetails
                    this._wardDetailsService.create(wardDetails).then(wardCreateRes => {
                      this.addNew();
                      this.disableNewMinorLoc = false;
                      this.ActionButton = 'Create';
                      const text = val.sublocName + ' has been created successfully';
                      this._notification('Success', text);
                    });
                  }
                });
              } else if (locations.length > 0 && locations[0].name.toLowerCase() === 'laboratory') {
                // If Laboratory, create Laboratory service tag.
                this.tagService.create(tag).then(pay => {
                  this.addNew();
                  this.disableNewMinorLoc = false;
                  this.ActionButton = 'Create';
                  const text = val.sublocName + ' has been created successfully';
                  this._notification('Success', text);
                }).catch(err => console.log(err));
              } else {
                this.addNew();
                this.disableNewMinorLoc = false;
                this.ActionButton = 'Create';
                const text = val.sublocName + ' has been created successfully';
                this._notification('Success', text);
              }
            });
          } else {
            const text = 'This minor location "' + val.sublocName + '" already exist';
            this._notification('Info', text);
            this.ActionButton = 'Create';
          }
        });
        this.mainErr = true;
      } else {
        this.disableNewMinorLoc = true;
        this.ActionButton = 'Updating... <i class="fa fa-spinner fa-spin"></i>';
        // Check if it's ward you are trying to update
        const locations = this.locations.filter(t => t._id === val.sublocParent);
        // If location is ward.
        if (locations.length > 0 && locations[0].name.toLowerCase() === 'ward') {
          this.subLocation.description = val.sublocDesc;
          this.subLocation.name = val.sublocName;
          this.subLocation.shortName = val.sublocAlias;
          const index = this.facility.minorLocations.findIndex((obj => obj._id === this.subLocation._id));
          this.facility.minorLocations.splice(index, 1, this.subLocation);

          this.facilityService.update(this.facility).then((payload) => {
            this._wardDetailsService.find({ query: {'facilityId._id': this.facility._id}}).then(wardFindRes => {
              const wardDetails = wardFindRes.data[0];
              const wardIndex = wardDetails.locations.filter(x => x.minorLocationId._id === this.subLocation._id);
              wardIndex[0].minorLocationId.name = val.sublocName;
              wardIndex[0].minorLocationId.shortName = val.sublocAlias;
              wardIndex[0].minorLocationId.description = val.sublocDesc;

              this._wardDetailsService.update(wardDetails).then(wardUpdateRes => {
                this.disableNewMinorLoc = false;
                this.ActionButton = 'Create';
                const text = this.subLocation.name + ' has been updated to ' + val.sublocName + ' successfully';
                this._notification('Success', text);
              });
            });
          });
        } else if (locations.length > 0 && locations[0].name.toLowerCase() === 'laboratory') {
          // If Laboratory.
          const tags = this.tags.filter(x => x.name === this.subLocation.name);

          if (tags.length === 0) {
            const tag: Tag = <Tag>{};
            tag.facilityId = this.facility._id;
            tag.name = val.sublocName;
            tag.tagType = 'Laboratory Location';

            const authObj: any = this.locker.getObject('auth');
            const auth: any = authObj.data;
            tag.createdBy = auth._id;

            this.subLocation.description = val.sublocDesc;
            this.subLocation.name = val.sublocName;
            this.subLocation.shortName = val.sublocAlias;
            const index = this.facility.minorLocations.findIndex((obj => obj._id === this.subLocation._id));
            this.facility.minorLocations.splice(index, 1, this.subLocation);

            this.facilityService.update(this.facility).then((payload) => {
              this.tagService.create(tag).then(pay => {
                this.addNew();
                this.disableNewMinorLoc = false;
                this.ActionButton = 'Create';
                const text = this.subLocation.name + ' has been updated to ' + val.sublocName + ' successfully';
                this._notification('Success', text);
              });
            });
          } else {
            const tagIndex = this.tags.findIndex(x => x.name === this.subLocation.name);
            this.subLocation.description = val.sublocDesc;
            this.subLocation.name = val.sublocName;
            this.subLocation.shortName = val.sublocAlias;
            const index = this.facility.minorLocations.findIndex((obj => obj._id === this.subLocation._id));
            this.facility.minorLocations.splice(index, 1, this.subLocation);

            this.facilityService.update(this.facility).then((payload) => {
              let tag = this.tags[tagIndex];
              tag.name = this.subLocation.name;
              this.tagService.update(tag).then(pay => {
                this.addNew();
                this.disableNewMinorLoc = false;
                this.ActionButton = 'Create';
                const text = this.subLocation.name + ' has been updated to ' + val.sublocName + ' successfully';
                this._notification('Success', text);
              });
            });
          }
        } else {
          this.subLocation.description = val.sublocDesc;
          this.subLocation.name = val.sublocName;
          this.subLocation.shortName = val.sublocAlias;
          const index = this.facility.minorLocations.findIndex((obj => obj._id === this.subLocation._id));
          this.facility.minorLocations.splice(index, 1, this.subLocation);

          this.facilityService.update(this.facility).then((payload) => {
            this.disableNewMinorLoc = false;
            this.ActionButton = 'Create';
            const text = this.subLocation.name + ' has been updated to ' + val.sublocName + ' successfully';
            this._notification('Success', text);
          });
        }
      }
    } else {
      this.mainErr = false;
      this._notification('Error', 'Some fields that are required has not been filled');
    }
  }

  // Notification
  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.subLocation = <MinorLocation>{};
  }

}
