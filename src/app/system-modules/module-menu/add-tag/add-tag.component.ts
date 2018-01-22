import { Component, OnInit } from '@angular/core';
import { FacilitiesServiceCategoryService, TagService } from '../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, Tag } from '../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { error } from 'util';
import swal from 'sweetalert2';

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
  editedTag =<any>{};
  constructor(private _locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService,
    private _tagService: TagService) {
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
    this.systemModuleService.on;
    this._tagService.find({ query: { facilityId: this.facility._id } }).then(payload => {
      this.systemModuleService.off;
      this.tags = payload.data;
    });
  }
  newTagPopup_show() {
    this.newTagPopup = true;
  }

  onTagValueChange() {
    this.getTags();
  }

  onTagEdit(tag) {
    console.log(tag);
    let text = "You are about to edit " + tag.name.toUpperCase() + " tag";
    this.systemModuleService.announceSweetProxy(text, 'info', this);
    this.editedTag = tag;
    this.newTagPopup = true;
  }

  onTagRemove(tag) {
    this.systemModuleService.on;
    this.systemModuleService.announceSweetProxy('', 'warning', this);
    this.editedTag = tag;
    // swal({                                                  //Temporary line of code for Warning alert pending the time 
    //   title: 'Are you sure?',                               // SystemModuleService warning alert callback is resolved
    //   text: "You won't be able to revert this!",
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Yes, delete it!'
    // }).then((result) => {
    //   if (result) {
    //     this._tagService.remove(tag._id, {}).then(callback_remove => {
    //       this.systemModuleService.announceSweetProxy(tag.name + " is deleted", 'success', this);
    //       this.systemModuleService.off;
    //       this.getTags();
    //     }, error => {
    //       this.systemModuleService.off;
    //     });
    //   }
    // });
  }
  sweetAlertCallback(result) {
    console.log(result);
    this._tagService.remove(this.editedTag._id, {}).then(callback_remove => {
      this.systemModuleService.announceSweetProxy(this.editedTag.name + " is deleted", 'success', this);
      this.systemModuleService.off;
      this.getTags();
    }, error => {
      this.systemModuleService.off;
    });
  }


  close_onClick(e) {
    this.newServicePopup = false;
    this.newCategoryPopup = false;
    this.newTagPopup = false;
    this.editedTag = {};
  }
}
