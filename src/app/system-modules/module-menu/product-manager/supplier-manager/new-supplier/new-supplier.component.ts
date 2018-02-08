import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SupplierService } from '../../../../../services/facility-manager/setup/index';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';
import { FacilityFacadeService } from 'app/system-modules/service-facade/facility-facade.service';
import { CountryServiceFacadeService } from 'app/system-modules/service-facade/country-service-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
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
  selectedLocation: any = <any>{};
  countries: any[] = [];
  states: any[] = [];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshSupplier: EventEmitter<boolean> = new EventEmitter<boolean>();
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
    private _countryServiceFacade: CountryServiceFacadeService,
    private _systemModuleService: SystemModuleService,
    private supplierService: SupplierService) {
  }


  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frm_newSupplier = this.formBuilder.group({
      name: ['', [<any>Validators.required]],
      frmState: ['', [<any>Validators.required]],
      frmCountry: ['', [<any>Validators.required]],
      frmCity: ['', [<any>Validators.required]],
      frmContact: ['', [<any>Validators.required]],
      frmStreet: ['', [<any>Validators.required]],
      email: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      facilityId: [this.selectedFacility._id]
    });
    this.populateSupplier();

    this.frm_newSupplier.controls['frmCountry'].valueChanges.subscribe(country => {
      this._countryServiceFacade.getOnlyStates(country).then((payload: any) => {
        this.states = payload;
      }).catch(error => {

      });
    })
    this._getCountries();
  }
  populateSupplier() {
    if (this.selectedSupplier._id !== undefined) {
      this.frm_newSupplier.controls['name'].setValue(this.selectedSupplier.name);
      this.frm_newSupplier.controls['email'].setValue(this.selectedSupplier.email);
      this.frm_newSupplier.controls['frmContact'].setValue(this.selectedSupplier.phoneNumber);
      this.frm_newSupplier.controls['frmState'].setValue(this.selectedSupplier.address.state);
      this.frm_newSupplier.controls['frmCountry'].setValue(this.selectedSupplier.address.country);
      this.frm_newSupplier.controls['frmStreet'].setValue(this.selectedSupplier.address.street);
      this.frm_newSupplier.controls['frmCity'].setValue(this.selectedSupplier.address.city);
    } else {
      this.frm_newSupplier.reset();
    }
  }
  close_onClick() {
    this.selectedSupplier = {};
    this.closeModal.emit(true);
  }

  _getCountries() {
    this._countryServiceFacade.getOnlyCountries().then((payload: any) => {
      this.countries = payload;
    }).catch(error => {
      console.log(error);
    });
  }

  autoCompleteCallback(selectedData: any) {
    console.log(selectedData);
    if (selectedData.response) {
      let res = selectedData;
      console.log("A-A");
      this.selectedLocation = res.data;
      console.log("A-B");
      console.log(res.data.address_components[0].types[0]);
      if (res.data.address_components[0].types[0] === 'route') {
        let streetAddress = res.data.formatted_address;
        let city = res.data.address_components[1].long_name;
        let country = res.data.address_components[5].long_name;
        let state = res.data.address_components[4].long_name;

        this.frm_newSupplier.controls['frmState'].setValue(state);
        this.frm_newSupplier.controls['frmCountry'].setValue(country);
        this.frm_newSupplier.controls['frmStreet'].setValue(streetAddress);
        this.frm_newSupplier.controls['frmCity'].setValue(city);
      } else {
        let streetAddress = res.data.formatted_address;
        let city = res.data.address_components[2].long_name;
        let country = res.data.address_components[6].long_name;
        let state = res.data.address_components[3].long_name;

        this.frm_newSupplier.controls['frmState'].setValue(state);
        this.frm_newSupplier.controls['frmCountry'].setValue(country);
        this.frm_newSupplier.controls['frmStreet'].setValue(streetAddress);
        this.frm_newSupplier.controls['frmCity'].setValue(city);
      }
    }
  }

  compareCountry(l1: any, l2: any) {
    return l1.includes(l2);
  }

  compareState(l1: any, l2: any) {
    return l1.includes(l2);
  }

  create(form) {
    if (form.valid) {
      this._systemModuleService.on();
      this.mainErr = true;
      // this.supplierService.create(form.value).then(payload => {
      //   this.frm_newSupplier.reset();
      // });
      let value: any = {
        facilityId: this.selectedFacility._id,
        name: this.frm_newSupplier.controls['name'].value,
        contact: this.frm_newSupplier.controls['frmContact'].value,
        email: this.frm_newSupplier.controls['email'].value,
        address: {
          street: this.frm_newSupplier.controls['frmStreet'].value,
          state: this.frm_newSupplier.controls['frmState'].value,
          country: this.frm_newSupplier.controls['frmCountry'].value,
          city: this.frm_newSupplier.controls['frmCity'].value,
          details: this.selectedLocation
        }
      }

      if (this.selectedSupplier._id === undefined) {
        this.supplierService.create(value).then(payload => {
          this.frm_newSupplier.reset();
          this.userSettings['inputString'] = '';
          this._systemModuleService.off();
          this._systemModuleService.announceSweetProxy('Supplier created successfully', 'success',this);
        },err=>{
          this._systemModuleService.announceSweetProxy('There was an error while creating supplier, try again!', 'error');
          console.log(err);
          this._systemModuleService.off();
        });
      } else {
        value._id = this.selectedSupplier._id;
        this.supplierService.patch(value._id, {
          facilityId: value.facilityId,
          name: value.name,
          contact: value.contact,
          email: value.email,
          address: value.address
        }).then(payload => {
          this.frm_newSupplier.reset();
          this.userSettings['inputString'] = '';
          this._systemModuleService.off();
          this._systemModuleService.announceSweetProxy('Supplier updated successfully', 'success',this);
        },err=>{
          this._systemModuleService.announceSweetProxy('There was an error while updating supplier, try again!', 'error');
          this._systemModuleService.off();
        });
      }

    } else {
      this.mainErr = false;
    }
  }
  sweetAlertCallback(result) {
    console.log(result);
    this.refreshSupplier.emit(true);
  }
}
