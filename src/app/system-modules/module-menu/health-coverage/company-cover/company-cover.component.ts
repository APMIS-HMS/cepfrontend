import { Component, OnInit, EventEmitter, Output } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FacilitiesService, CompanyHealthCoverService, CountriesService, CompanyCoverCategoryService } from '../../../../services/facility-manager/setup/index';
import { Facility, PersonPrincipal, CompanyHealthCover, Country } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-company-cover',
  templateUrl: './company-cover.component.html',
  styleUrls: ['./company-cover.component.scss']
})
export class CompanyCoverComponent implements OnInit { 

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  coveredDetailView = false;
  personDependants = false;
  addEmployee = false;
  type = 'Company';

  acceptRequest = false;
  newCategory = false;

  tabA = true;
  tabB = false;

  selectedFacility: Facility = <Facility>{};
  selectedActiveCompanyHealthCover: CompanyHealthCover = <CompanyHealthCover>{};
  selectedPendingCompanyHealthCover: CompanyHealthCover = <CompanyHealthCover>{};
  selectedState: any;
  selectedCity: any;
  selectedCountry: Country = <Country>{};
  selectedPersonPrincipal: PersonPrincipal = <PersonPrincipal>{};
  keepPersonPrincipals: PersonPrincipal[] = [];
  pendingCompanyHealthCovers: CompanyHealthCover[] = [];
  activeCompanyHealthCovers: CompanyHealthCover[] = [];
  categories: any[] = [];

  searchControl = new FormControl();
  searchPendingControl = new FormControl();
  searchEmployeeControl = new FormControl();
  selectCategory = new FormControl();
  catInput = new FormControl();

  constructor(private companyHealthCoverService: CompanyHealthCoverService,
    public facilityService: FacilitiesService,
    private countryService: CountriesService,
    private companyCoverCategoryService: CompanyCoverCategoryService,
    private locker: CoolLocalStorage) {
    this.companyHealthCoverService.updatelistner.subscribe(p => {
      this.selectedActiveCompanyHealthCover = p;
      // this.getActiveCompanyHealthCover();
    });
  }

  ngOnInit() {
    this.pageInView.emit('Company Retainership');
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.getPendingCompanyHealthCover();
    this.getActiveCompanyHealthCover();
    this.getCategories();
    const away = this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: CompanyHealthCover[]) => this.companyHealthCoverService.find({
        query:
        { search: this.searchControl.value, facilityId: this.selectedFacility._id, isAccepted: true }
      }).
        then(payload => {
          this.activeCompanyHealthCovers = payload.data;
        }));

    away.subscribe((payload: any) => {
    });

    const awayPending = this.searchPendingControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: CompanyHealthCover[]) => this.companyHealthCoverService.find({
        query:
        { search: this.searchPendingControl.value, facilityId: this.selectedFacility._id, isAccepted: false }
      }).
        then(payload => {
          this.pendingCompanyHealthCovers = payload.data;
        }));

    awayPending.subscribe((payload: any) => {
    });

    this.searchEmployeeControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(payload => {
        const principals: PersonPrincipal[] = [];
        this.selectedActiveCompanyHealthCover.personFacilityPrincipals = this.keepPersonPrincipals;
        this.selectedActiveCompanyHealthCover.personFacilityPrincipals.forEach((item, i) => {
          if (item.personDetails.firstName.toLowerCase().includes(this.searchEmployeeControl.value)) {
            principals.push(item);
          }
        });
        this.selectedActiveCompanyHealthCover.personFacilityPrincipals = principals;
      });
  }

  coveredDetail_show(value: CompanyHealthCover) {
    this.coveredDetailView = true;
    this.selectedActiveCompanyHealthCover = value;
    this.keepPersonPrincipals = this.selectedActiveCompanyHealthCover.personFacilityPrincipals;
    const countryId = this.selectedActiveCompanyHealthCover.corporateFacility.address.country;
    this.getCountry(countryId);
  }
  dependants_popup(model: PersonPrincipal) {
    this.selectedPersonPrincipal = model;
    this.personDependants = true;
     console.log(model);
  }
  close_onClick(e) {
    this.personDependants = false;
    this.addEmployee = false;
    this.acceptRequest = false;
    this.newCategory = false;
  }
  getCountry(value: string) {
    this.countryService.get(value, {}).then(payload => {
      this.selectedCountry = payload;
      // console.log(this.selectedCountry);
      this.getState();
    });
  }
  getState() {
    const stateId = this.selectedActiveCompanyHealthCover.corporateFacility.address.state;
    const cityId = this.selectedActiveCompanyHealthCover.corporateFacility.address.city;
    const filteredState = this.selectedCountry.states.
      filter(x => x._id === stateId);
    if (filteredState.length > 0) {
      this.selectedState = filteredState[0];
      if (this.selectedState.cities.length > 0) {
        const filteredCity = this.selectedState.cities.filter(x => x._id === cityId);
        if (filteredCity.length > 0) {
          this.selectedCity = filteredCity[0];
        }
      }
    }
  }

  getPendingCompanyHealthCover() {
    this.companyHealthCoverService.find({ query: { facilityId: this.selectedFacility._id, isAccepted: false } })
      .then(payload => {
        this.pendingCompanyHealthCovers = payload.data;
      });
  }

  getActiveCompanyHealthCover() {
    this.companyHealthCoverService.find({ query: { facilityId: this.selectedFacility._id, isAccepted: true } })
      .then(payload => {
        if (this.selectedActiveCompanyHealthCover !== undefined && payload.data.length > 0) {
          payload.data.forEach((item, i) => {
            if (item._id === this.selectedActiveCompanyHealthCover._id) {
              this.selectedActiveCompanyHealthCover = item;
            }
          });
        }
        this.activeCompanyHealthCovers = payload.data;
        // this.selectedActiveCompanyHealthCover = payload.data[0];
        // console.log(this.activeCompanyHealthCovers);
      });
  }
  addEmpShow() {
    this.personDependants = false;
    this.addEmployee = true;
    this.acceptRequest = false;
    this.newCategory = false;
  }
  acceptRequest_show(pending: CompanyHealthCover) {
    this.acceptRequest = true;
    this.personDependants = false;
    this.addEmployee = false;
    this.newCategory = false;
    this.selectedPendingCompanyHealthCover = pending;
  }
  newCat_show() {
    this.newCategory = true;
    this.acceptRequest = false;
    this.personDependants = false;
    this.addEmployee = false;
  }
  createCat() {
    this.companyCoverCategoryService.create({ name: this.catInput.value, facilityId: this.selectedFacility._id })
      .then(payload => {
        this.getCategories();
        this.catInput.reset();
      });
  }
  acceptReq() {
    this.selectedPendingCompanyHealthCover.isAccepted = true;
    this.selectedPendingCompanyHealthCover.categoryId = this.selectCategory.value;
    console.log(this.selectedPendingCompanyHealthCover);
    this.companyHealthCoverService.update(this.selectedPendingCompanyHealthCover)
      .then(payload => {
        this.getActiveCompanyHealthCover();
        this.getPendingCompanyHealthCover();
        this.acceptRequest = false;
      });
  }
  getCategories() {
    this.companyCoverCategoryService.find({ query: { facilityId: this.selectedFacility._id } })
      .then(payload => {
        this.categories = payload.data;
      });
  }
  tabA_show() {
    this.tabA = true;
    this.tabB = false;
  }
  tabB_show() {
    this.tabB = true;
    this.tabA = false;
  }

}
