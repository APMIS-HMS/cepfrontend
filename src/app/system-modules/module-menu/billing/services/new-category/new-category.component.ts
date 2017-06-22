import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, FacilityService, ServiceCategory, ServiceItem } from '../../../../../models/index';
import { FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  facility: Facility = <Facility>{};
  categories: ServiceCategory = <ServiceCategory>{};

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedCategory;
  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewcat: FormGroup;
  btnTitle = 'CREATE CATEGORY';

  constructor(private formBuilder: FormBuilder,
    private _locker: CoolLocalStorage,
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService) { }

  ngOnInit() {
    this.btnTitle = 'CREATE CATEGORY';
    this.addNew();
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    console.log(this.selectedCategory);
    if (this.selectedCategory.name !== undefined && this.selectedCategory.name.length > 1) {
      this.btnTitle = 'UPDATE CATEGORY';
      this.frmNewcat.controls['catName'].setValue(this.selectedCategory.name);
    }
  }
  addNew() {
    this.frmNewcat = this.formBuilder.group({
      catName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  newcat(model: any, valid: boolean) {
    if (valid) {
      this._facilitiesServiceCategoryService.find({
        query: {
          facilityId: this.facility._id
        }
      }).then(payload => {
        const facilityServiceModel: FacilityService = <FacilityService>{};
        const facilityCategoryeModel: ServiceCategory = <ServiceCategory>{};
        facilityServiceModel.facilityId = this.facility._id;
        facilityCategoryeModel.name = this.frmNewcat.controls['catName'].value;
        facilityCategoryeModel.services = [];
        facilityServiceModel.categories = [];
        if (payload.data.length === 0) {
          facilityServiceModel.categories.push(facilityCategoryeModel);
          console.log(facilityServiceModel);
          this._facilitiesServiceCategoryService.create(facilityServiceModel).then(callback => {
            this.frmNewcat.reset();
          });
        } else {
          payload.data[0].categories.push(facilityCategoryeModel);
          this._facilitiesServiceCategoryService.update(payload.data[0]).then(callback => {
            this.frmNewcat.reset();
          });
        }
      });


    }

  }
}
