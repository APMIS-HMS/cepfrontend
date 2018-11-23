import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { IDateRange } from 'ng-pick-daterange';
import { PharmacyTabGroup, PharmacySearchCriteria } from 'app/models/reports/pharmacy-report';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DispenseReportService, PrescriptionReportService } from 'app/services/reports';

@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss']
})
export class PharmacyReportComponent implements OnInit {

  searchControl = new FormControl();
  prescriberSearchCtr = new FormControl();
  searchCriteria = new FormControl('Search');

  prescriberFilter = false;
  prescriberSearch = false;
  dispenseFilter = false;

  pageInView = 'Pharmacy Report';
  dateRange: any;
  activeTabIndex: number;
  currentFacility: Facility = <Facility>{};
  dispenses;
  prescriptions;
  isDispenseLoading = true;
  isPrescriptionLoading = true;
  filterType = '';
  searchCriteriaOptions;
  selectedSearchCriteria = '';
  userName = '';
  productName = '';

  constructor(private _router: Router, private locker: CoolLocalStorage,
    private dispenseService: DispenseReportService,
      private prescriptionService: PrescriptionReportService) { }

  ngOnInit() {
    this.dispenseFilter = true;
    this.activeTabIndex = 0;
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.onTabClick(this.activeTabIndex);
    this.searchCriteriaOptions = this.getObjeckKeys(PharmacySearchCriteria);
    this.initialiseDateRange();

    this.searchControl.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(val => {
        if (this.selectedSearchCriteria === PharmacySearchCriteria.ByUser && this.searchControl.value.length > 2) {
            this.userName = val;
            this.isDispenseLoading = true;
            this.dispenseService.find({
              query: {
                facilityId: this.currentFacility._id,
                userName: this.userName,
                productName: this.productName,
                startDate: this.dateRange.from,
                endDate: this.dateRange.to
              }
            }).then(payload => {
              this.dispenses = payload;
              this.isDispenseLoading = false;
            });
        } else if (this.selectedSearchCriteria === PharmacySearchCriteria.ByProduct && this.searchControl.value.length > 2) {
            this.productName = val;
            this.isDispenseLoading = true;
            this.dispenseService.find({
              query: {
                facilityId: this.currentFacility._id,
                userName: this.userName,
                productName: this.productName,
                startDate: this.dateRange.from,
                endDate: this.dateRange.to
              }
            }).then(paydata => {

            });
        }
    });


  }

  pageInViewLoader(title) {
		this.pageInView = title;
  }
  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }

onclick_prescribe() {
  this.prescriberFilter = true;
  this.dispenseFilter = false;
}

onclick_dispense() {
  this.prescriberFilter = false;
  this.dispenseFilter = true;
  }

  initialiseDateRange() {
    if (this.dateRange === undefined) {
      this.dateRange = {
        from: new Date(),
        to: new Date()
        };
    }
  }
  setFilterByDateRange(dateRange: IDateRange): any {
    this.dateRange = dateRange;
		if (dateRange !== null) {
      if (this.activeTabIndex === PharmacyTabGroup.Prescription) {
        
      } else if (this.activeTabIndex === PharmacyTabGroup.Dispense) {

      }
    } else { }
  }
  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
    if (this.activeTabIndex === PharmacyTabGroup.Prescription) {
        this.onclick_prescribe();
        this.filterType = 'Filter by Prescription';
        this.getFacilityPrescriptionList();
    } else if (this.activeTabIndex === PharmacyTabGroup.Dispense) {
        this.onclick_dispense();
        this.filterType = 'Filter by Group';
        this.getFacilityDispenseList();
    }
  }
  setSearchFilter(data) {
    this.selectedSearchCriteria = data;
    this.searchControl.setValue('');
  }
  getFacilityDispenseList() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== undefined) {
      this.isDispenseLoading = true;
        this.dispenseService.find({
          query: {
            facilityId: this.currentFacility._id
          }
        }).then(payload => {
          this.dispenses = payload;
          //this.dispenses = payload.data;
          this.isDispenseLoading = false;
        });
    }
  }

  getFacilityPrescriptionList() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== undefined) {
      this.isPrescriptionLoading = true;
      this.prescriptionService.find( {
        query: {
          facilityId: this.currentFacility._id
        }
      }).then(payload => {
        //this.prescriptions = payload.data;
        this.prescriptions = payload;
        this.isPrescriptionLoading = false;
      });
    }
  }

  getObjeckKeys(obj) {
    return Object.keys(obj).map(val => obj[val]);
  }

}
