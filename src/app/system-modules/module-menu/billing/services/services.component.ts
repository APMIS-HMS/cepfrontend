import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FacilitiesServiceCategoryService, TagService, FacilityPriceService } from '../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, Tag, FacilityServicePrice } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  searchShowc = false;
  searchShow = false;
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  facility: Facility = <Facility>{};
  prices: FacilityServicePrice[] = [];
  categories: FacilityService[] = [];
  tags: Tag[] = [];
  globalCategories: CustomCategory[] = [];
  globalCategoriesToBePaginated: CustomCategory[] = [];
  selectedServices = [];
  searchCategory = new FormControl();
  searchService = new FormControl();
  searchTag = new FormControl();
  newServicePopup = false;
  newCategoryPopup = false;
  newTagPopup = false;
  newModefierPopup = false;
  serviceDetail = false;
  newPricePopup = false;
  selectedFacilityServicePrice = FacilityPriceService;


  selectedService: any = <any>{};
  selectedCategory: any = <any>{};

  index = 1;
  pageSize = 10;

  showLoadMore: Boolean = true;

  constructor(
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private _locker: CoolLocalStorage, private _tagService: TagService) {

  }

  ngOnInit() {
    this.pageInView.emit('Services/Billing Manager');
    this.facility = <Facility>this._locker.getObject('selectedFacility');
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
          console.log(payload);
        }));

    subscribeForService.subscribe((payload: any) => {
      console.log(payload);
    });


    const subscribeForTag = this.searchTag.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: Tag[]) => this._tagService.find({
        query:
          { search: this.searchTag.value, facilityId: this.facility._id }
      }).then(payload => {
          console.log(payload)
          this.tags = payload.data;
        }));

    subscribeForTag.subscribe((payload: any) => {
    });
  }

  selectCategory(category) {
    console.log(category);
    this.selectedServices = category.services;
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
    this._facilitiesServiceCategoryService.allServices({
      query: {
        facilityId: this.facility._id
      }
    }).then(payload => {
      this.categories = payload.data[0].categories;
      this.selectedServices = payload.data[0].categories[0].services;
    });

    // this._facilitiesServiceCategoryService.find({
    //   query: {
    //     $or: [
    //       { facilityId: this.facility._id }
    //       // { facilityId: undefined }
    //     ]
    //   }
    // }).then(payload => {
    //   this.categories = [];
    //   let goo = [];
    //   console.log(payload);
    //   payload.data.forEach((itemi, i) => {
    //     itemi.categories.forEach((itemj, j) => {
    //       if (itemi.facilityId !== undefined) {
    //         this.categories.push(itemj);
    //       }
    //       itemj.services.forEach((itemk, k) => {
    //         const customCategory: CustomCategory = <CustomCategory>{};
    //         customCategory.facilityService = itemi;
    //         customCategory.service = itemk.name;
    //         customCategory.serviceId = itemk._id;
    //         customCategory.category = itemj.name;
    //         customCategory.categoryId = itemj._id;
    //         customCategory.serviceCode = itemk.code;
    //         if (itemi.facilityId === undefined) {
    //           customCategory.isGlobal = true;
    //         } else {
    //           customCategory.isGlobal = false;
    //         }
    //         this.globalCategoriesToBePaginated.push(customCategory);

    //       });
    //     });
    //     if (this.globalCategoriesToBePaginated.length <= this.globalCategories.length) {
    //       this.showLoadMore = false;
    //     }
    //     console.log(this.globalCategoriesToBePaginated);
    //     this.globalCategories = this.paginate(this.globalCategoriesToBePaginated, this.pageSize, this.index);
    //     console.log(this.globalCategories);
    //     this.selectCategory(this.categories[0]);
    //   });
    // });
  }

  getCategory() {
    this._facilitiesServiceCategoryService.find({
      query:
        { searchCategory: "Medical Records", facilityId: this.facility._id }
    }).
      then(payload => {
        //this.filterOutCategory(payload);
        //this.categories = [];
        let cat: any = [];
        payload.data.forEach((itemi, i) => {
          itemi.categories.forEach((itemj, j) => {
            if (itemi.facilityId !== undefined) {
              cat.push(itemj);
            }
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

  addModifierPopup_show() {
    this.newModefierPopup = false;
    this.serviceDetail = false;
  }
  newModefierPopup_show(price: FacilityServicePrice) {
    this.newModefierPopup = true;
    this.newPricePopup = false;
    this.serviceDetail = false;
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
    this.newModefierPopup = false;
  }

  serviceDetail_show(price) {
    this.serviceDetail = true;
    this.newPricePopup = false;
    this.newModefierPopup = false;
    this.selectedFacilityServicePrice = price;
  }
  paginate(array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  }

  loadMoreGlobalCategories() {
    if (this.globalCategoriesToBePaginated.length <= this.globalCategories.length) {
      this.showLoadMore = false;
    } else {
      let goo = this.paginate(this.globalCategoriesToBePaginated, this.pageSize, this.index);
      console.log(goo);
      this.globalCategories.push(...goo);
      this.index++;
    }
    console.log(this.index);
  }

  showSearch() {
    this.searchShow = true;
  }

  closeSearch() {
    this.searchShow = false;
  }

  showSearchc() {
    this.searchShowc = true;
  }

  closeSearchc() {
    this.searchShowc = false;
  }
}
