import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FacilitiesServiceCategoryService, TagService } from '../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, Tag } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  facility: Facility = <Facility>{};
  categories: FacilityService[] = [];
  tags: Tag[] = [];
  globalCategories: CustomCategory[] = [];
  searchCategory = new FormControl();
  searchService = new FormControl();
  searchTag = new FormControl();
  newServicePopup = false;
  newCategoryPopup = false;
  newTagPopup = false;

  selectedService: any = <any>{};
  selectedCategory: any = <any>{};

  constructor(private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private _locker: CoolLocalStorage, private _tagService: TagService) {
    this._facilitiesServiceCategoryService.listner.subscribe(payload => {
      this.getCategories();
      this.getTags();
    });
    this._tagService.createListener.subscribe(payload => {
      this.getTags();
    });
    this._facilitiesServiceCategoryService.createListener.subscribe(payload => {
      this.getCategories();
      this.getTags();
    });
  }

  ngOnInit() {
    this.pageInView.emit('Services/Billing Manager');
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this.getCategories();
    this.getTags();

    const subscribeForCategory = this.searchCategory.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: FacilityService[]) => this._facilitiesServiceCategoryService.find({
        query:
        { searchCategory: this.searchCategory.value, facilityId: this.facility._id }
      }).
        then(payload => {
          this.filterOutCategory(payload);
        }));

    subscribeForCategory.subscribe((payload: any) => {
    });




    const subscribeForService = this.searchService.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: FacilityService[]) => this._facilitiesServiceCategoryService.find({
        query:
        { search: this.searchService.value, facilityId: this.facility._id }
      }).
        then(payload => {
          this.filterOutService(payload);
        }));

    subscribeForService.subscribe((payload: any) => {
    });


    const subscribeForTag = this.searchTag.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: Tag[]) => this._tagService.find({
        query:
        { search: this.searchTag.value, facilityId: this.facility._id }
      }).
        then(payload => {
          this.tags = payload.data;
        }));

    subscribeForTag.subscribe((payload: any) => {
    });



  }
  onDoubleClick(value: any) {
    this.selectedService = value;
    this.newServicePopup = true;
  }
  onDoubleClickCategory(value: any) {
    this.selectedCategory = value;
    this.newCategoryPopup = true;
  }
  filterOutCategory(payload) {
    this.categories = [];
    payload.data.forEach((itemi, i) => {
      itemi.categories.forEach((itemj, j) => {
        if (itemi.facilityId !== undefined) {
          this.categories.push(itemj);
        }
      });
    });
  }

  filterOutService(payload) {
    this.globalCategories = [];
    payload.data.forEach((itemi, i) => {
      itemi.categories.forEach((itemj, j) => {
        if (itemi.facilityId !== undefined) {
          // this.categories.push(itemj);
        }
        itemj.services.forEach((itemk, k) => {
          const customCategory: CustomCategory = <CustomCategory>{};
          customCategory.service = itemk.name;
          customCategory.serviceId = itemk._id;
          customCategory.category = itemj.name;
          customCategory.serviceCode = itemk.code;
          if (itemi.facilityId === undefined) {
            customCategory.isGlobal = true;
          } else {
            customCategory.isGlobal = false;
          }
          this.globalCategories.push(customCategory);
        });
      });
    });
  }
  getCategories() {
    this._facilitiesServiceCategoryService.find({
      query: {
        $or: [
          { facilityId: this.facility._id },
          { facilityId: undefined }
        ]
      }
    })
      .then(payload => {
        this.categories = [];
        this.globalCategories = [];
        payload.data.forEach((itemi, i) => {
          itemi.categories.forEach((itemj, j) => {
            if (itemi.facilityId !== undefined) {
              this.categories.push(itemj);
            }
            itemj.services.forEach((itemk, k) => {
              const customCategory: CustomCategory = <CustomCategory>{};
              customCategory.facilityService = itemi;
              customCategory.service = itemk.name;
              customCategory.serviceId = itemk._id;
              customCategory.category = itemj.name;
              customCategory.categoryId = itemj._id;
              customCategory.serviceCode = itemk.code;
              if (itemi.facilityId === undefined) {
                customCategory.isGlobal = true;
              } else {
                customCategory.isGlobal = false;
              }
              this.globalCategories.push(customCategory);
            });
          });
        });
      });
  }

  getTags() {
    this._tagService.find({ query: { facilityId: this.facility._id } }).then(payload => {
      this.tags = payload.data;
    });
  }

  newServicePopup_show() {
    this.selectedService = <any>{};
    this.newServicePopup = true;
  }
  newCategoryPopup_show() {
    this.newCategoryPopup = true;
  }
  newTagPopup_show() {
    this.newTagPopup = true;
  }
  close_onClick(e) {
    this.newServicePopup = false;
    this.newCategoryPopup = false;
    this.newTagPopup = false;
  }

}
