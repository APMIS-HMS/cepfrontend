import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SupplierService } from '../../../../../services/facility-manager/setup/index';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';
import { Facility } from '../../../../../models/index';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {
  mainErr = true;
  errMsg = 'You have unresolved errors';
  loadIndicatorVisible = false;
  public frm_newSupplier: FormGroup;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedSupplier: any = <any>{};
  selectedFacility: Facility = <Facility>{};
  userSettings: any = {
		geoCountryRestriction: [GEO_LOCATIONS],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	};
  constructor(private formBuilder: FormBuilder, private locker: CoolLocalStorage,
    private supplierService: SupplierService) {
  }


  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frm_newSupplier = this.formBuilder.group({
      name: ['', [<any>Validators.required]],
      contact: ['', [<any>Validators.required]],
      frmState: ['', [<any>Validators.required]],
      frmCountry: ['', [<any>Validators.required]],
      frmCity: ['', [<any>Validators.required]],
      frmContact: ['', [<any>Validators.required]],
      frmStreet: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phoneNumber: ['', [<any>Validators.required]],
      address: ['', [<any>Validators.required]],
      facilityId: [this.selectedFacility._id]
    });
    this.populateSupplier();
  }
  populateSupplier() {
    if (this.selectedSupplier._id !== undefined) {
      this.frm_newSupplier.controls['name'].setValue(this.selectedSupplier.name);
      this.frm_newSupplier.controls['contact'].setValue(this.selectedSupplier.contact);
      this.frm_newSupplier.controls['email'].setValue(this.selectedSupplier.email);
      this.frm_newSupplier.controls['phoneNumber'].setValue(this.selectedSupplier.phoneNumber);
      this.frm_newSupplier.controls['address'].setValue(this.selectedSupplier.address);
    } else {
      this.frm_newSupplier.reset();
    }
  }
  close_onClick() {
    this.selectedSupplier = {};
    this.closeModal.emit(true);
  }
  create(form) {
    if (form.valid) {
      this.mainErr = true;
      // this.supplierService.create(form.value).then(payload => {
      //   this.frm_newSupplier.reset();
      // });

      if (this.selectedSupplier._id === undefined) {
        form.value.facilityId = this.selectedFacility._id;
        this.supplierService.create(form.value).then(payload => {
          this.frm_newSupplier.reset();
        });
      } else {
        form.value._id = this.selectedSupplier._id;
        this.supplierService.update(form.value).then(payload => {
          this.frm_newSupplier.reset();
        });
      }

    } else {
      this.mainErr = false;
    }
  }
}
