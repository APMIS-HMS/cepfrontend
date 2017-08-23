import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesServiceCategoryService, ServicePriceService, TagService } from '../../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, FacilityServicePrice, Tag } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-new-modefier',
  templateUrl: './new-modefier.component.html',
  styleUrls: ['./new-modefier.component.scss']
})
export class NewModefierComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedFacilityServicePrice: FacilityServicePrice = <FacilityServicePrice>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';
  categories: FacilityService[] = [];
  tags: Tag[] = [];
  selectedCategory: FacilityService = <FacilityService>{};
  services: CustomCategory[] = [];
  facility: Facility = <Facility>{};
  selectedTag: Tag = <Tag>{};
  public frmNewmodefier: FormGroup;

  
  constructor(private formBuilder: FormBuilder,
    private _tagService: TagService,
    private servicePriceService: ServicePriceService,
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private _locker: CoolSessionStorage) { }

  ngOnInit() {
    this.addNew();
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this.getCategories();
    const subscribeForTag = this.frmNewmodefier.controls['tag'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: Tag[]) => this._tagService.find({
        query:
        { search: this.frmNewmodefier.controls['tag'].value, facilityId: this.facility._id }
      }).
        then(payload => {
          if (this.frmNewmodefier.controls['tag'].value.length > 0) {
            this.tags = payload.data;
          } else {
            this.tags = [];
          }
        }));

    subscribeForTag.subscribe((payload: any) => {
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
        this.services = [];
        payload.data.forEach((itemi, i) => {
          itemi.categories.forEach((itemj, j) => {
            if (itemi.facilityId !== undefined) {
              this.categories.push(itemj);
            }
          });
        });
      });
  }
  addNew() {
    this.frmNewmodefier = this.formBuilder.group({
      tag: ['', [<any>Validators.required]],
      value: ['', [<any>Validators.required]],
      valueCheck: ['Percentage', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  onSelectedTag(value: any) {
    this.selectedTag = value;
    this.frmNewmodefier.controls['tag'].setValue(this.selectedTag.name);
  }
  newModefier(value, valid) {
    const modifier: any = <any>{};
    modifier.tagId = this.selectedTag._id;
    modifier.modifierType = this.frmNewmodefier.controls['valueCheck'].value;
    modifier.modifierValue = this.frmNewmodefier.controls['value'].value;
    this.selectedFacilityServicePrice.modifiers.push(modifier);

    this.servicePriceService.update(this.selectedFacilityServicePrice).then(payload => {
      this.selectedFacilityServicePrice = payload;
      this.close_onClick();
    });
  }
}
