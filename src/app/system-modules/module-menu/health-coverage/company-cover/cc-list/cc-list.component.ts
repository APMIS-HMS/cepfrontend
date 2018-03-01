import { Router } from '@angular/router';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FacilityCompanyCoverService } from './../../../../../services/facility-manager/setup/facility-company-cover.service';
import { FacilityTypesService } from './../../../../../services/facility-manager/setup/facility-types.service';
import { User } from './../../../../../models/facility-manager/setup/user';
import { FacilityType } from './../../../../../models/facility-manager/setup/facilitytype';
import { Facility } from './../../../../../models/facility-manager/setup/facility';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-cc-list',
  templateUrl: './cc-list.component.html',
  styleUrls: ['./cc-list.component.scss']
})
export class CcListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frmAddCompany: FormGroup;
  addCompany = false;
  apmisLookupUrl = 'corperate-facilities';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = 'name';
  apmisLookupOtherKeys = []

  selelctedFacility: Facility = <Facility>{};
  selectedCompanyCover: Facility = <Facility>{};
  selectedFacilityType: FacilityType = <FacilityType>{};
  loginHMOListObject: any = <any>{};
  user: User = <User>{};
  // tslint:disable-next-line:max-line-length
  constructor(private formBuilder: FormBuilder, private companyCoverService: FacilityCompanyCoverService, private facilityService: FacilitiesService,
    private facilityTypeService: FacilityTypesService, private locker: CoolLocalStorage, private router: Router) {

  }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.frmAddCompany = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.frmAddCompany.controls['name'].valueChanges.subscribe(value => {

      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          name: { $regex: -1, '$options': 'i' },
          $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'website', 'addressObj']
        }
      } else {
        this.apmisLookupQuery = {
          name: { $regex: value, '$options': 'i' },
          $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'website', 'addressObj']
        }
      }
    });
    this.getLoginHMOList();
  }
  public upload(e, companyCover) {

    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('excelfile', fileBrowser.files[0]);
      formData.append('companyCoverId', companyCover._id);
      this.facilityService.upload(formData, this.selectedCompanyCover._id).then(res => {
        const enrolleeList: any[] = [];
        if (res.body !== undefined && res.body.error_code === 0) {
          res.body.data.Sheet1.forEach(row => {
            const rowObj: any = <any>{};
            rowObj.serial = row.A;
            rowObj.surname = row.B;
            rowObj.firstName = row.C;
            rowObj.gender = row.D;
            rowObj.filNo = row.E;
            rowObj.category = row.F;
            rowObj.date = this.excelDateToJSDate(row.G);
            enrolleeList.push(rowObj);
          });
          const index = this.loginHMOListObject.companyCovers.findIndex(x => x._id === companyCover._id);
          const facHmo = this.loginHMOListObject.companyCovers[index];
          const enrolleeItem = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            enrollees: enrolleeList
          }
          facHmo.enrolleeList.push(enrolleeItem);
          this.loginHMOListObject.companyCovers[index] = facHmo;
          this.companyCoverService.update(this.loginHMOListObject).then(pay => {
            this.getLoginHMOList();
          })
        }
      }).catch(err => {
        this._notification('Error', 'There was an error uploading the file');
      });
    }
  }
  excelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }
  getLoginHMOList() {
    this.companyCoverService.find({
      query: {
        'facilityId._id': this.selelctedFacility._id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.loginHMOListObject = payload.data[0];
      } else {
        this.loginHMOListObject.facilityId = this.selelctedFacility;
        this.loginHMOListObject.companyCovers = [];
      }
    })
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    let isExisting = false;
    this.loginHMOListObject.companyCovers.forEach(item => {
      if (item._id === value._id) {
        isExisting = true;
      }
    });
    if (!isExisting) {
      this.selectedCompanyCover = value;
    } else {
      this.selectedCompanyCover = <any>{};
      this._notification('Info', 'Selected HMO is already in your list of Company Covers');
    }
  }
  checkCompanyCover() {
    return this.loginHMOListObject.companyCovers.findIndex(x => x.hmo_id === this.selectedCompanyCover._id) > -1;
  }
  save(valid, value) {
    if (this.checkCompanyCover()) {
      if (this.selectedCompanyCover._id === undefined) {
        this._notification('Warning', 'Please select and HMO to continue!');
        return;
      }
      this._notification('Warning', 'The selected HMO is already in the list of Company Covers');
      return;
    }
    const newCompanyCover = {
      hmo: this.selectedCompanyCover,
      enrolleeList: []
    }
    this.loginHMOListObject.companyCovers.push(newCompanyCover);
    if (this.selectedCompanyCover._id !== undefined) {
      if (this.loginHMOListObject._id === undefined) {
        this.companyCoverService.create(this.loginHMOListObject).then(payload => {
          this.frmAddCompany.controls['name'].reset();
          this.apmisLookupText = '';
          this.getLoginHMOList();
          this._notification('Success', 'Selected HMO added to your HMO list successfully');
        })
      } else {
        this.companyCoverService.update(this.loginHMOListObject).then(payload => {
          this.frmAddCompany.controls['name'].reset();
          this.apmisLookupText = '';
          this.getLoginHMOList();
          this._notification('Success', 'Selected HMO added to your HMO list successfully');
        })
      }
    }
  }
  show_beneficiaries(cover) {
    this.router.navigate(['/dashboard/health-coverage/company-beneficiaries/', cover._id]);
  }

  addCompany_show() {
    this.addCompany = !this.addCompany;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
