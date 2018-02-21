import { SystemModuleService } from './../../../../../services/module-manager/setup/system-module.service';
import { User } from './../../../../../models/facility-manager/setup/user';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { FacilityType } from './../../../../../models/facility-manager/setup/facilitytype';
import { Facility } from './../../../../../models/facility-manager/setup/facility';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { HmoService, FacilitiesService, FacilityTypesService } from '../../../../../services/facility-manager/setup/index';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';
import { element } from 'protractor';

type AOA = any[][];

@Component({
  selector: 'app-hmo-list',
  templateUrl: './hmo-list.component.html',
  styleUrls: ['./hmo-list.component.scss']
})
export class HmoListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frmNewHmo: FormGroup;
  hmo = new FormControl('', []);
  newHmo = false;
  newHMO = false;

  apmisLookupUrl = 'facilities';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = 'name';
  apmisLookupOtherKeys = [];

  excelFile: any;
  formData: any;
  ev: any;
  HMO: any;

  selelctedFacility: Facility = <Facility>{};
  selectedHMO: Facility = <Facility>{};
  selectedFacilityType: FacilityType = <FacilityType>{};
  loginHMOListObject: any = <any>{};
  user: User = <User>{};

  hmoFacilities: any[] = [];
  hmoEnrolleList: any[] = [];
  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private facilityService: FacilitiesService,
    private facilityTypeService: FacilityTypesService, private locker: CoolLocalStorage, private router: Router,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.frmNewHmo = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.frmNewHmo.controls['name'].valueChanges.subscribe(value => {

      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          'facilityTypeId': this.selectedFacilityType.name,
          name: { $regex: -1, '$options': 'i' },
          $select: ['name', 'email', 'primaryContactPhoneNo', 'shortName', 'website']
        }
      } else {
        this.apmisLookupQuery = {
          'facilityTypeId': this.selectedFacilityType.name,
          name: { $regex: value, '$options': 'i' },
          $select: ['name', 'email', 'primaryContactPhoneNo', 'shortName', 'website']
        }
      }
    });
    this.getFacilityTypes();
    this.getLoginHMOList();
  }
  getLoginHMOList() {
    this.hmoService.find({
      query: {
        'facilityId': this.selelctedFacility._id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.loginHMOListObject = payload.data[0];
        console.log(this.loginHMOListObject);
        this._getHMOFacilities(payload.data[0]);
      } else {
        this.loginHMOListObject.facilityId = this.selelctedFacility._id;
        this.loginHMOListObject.hmos = [];
      }
    })
  }
  _getHMOFacilities(facilityHMOs) {
    console.log(facilityHMOs);
    this.hmoEnrolleList = facilityHMOs.hmos.map(obj => {
      return { hmo: obj.hmo, enrolles: obj.enrolleeList };
    });
    const flist = this.hmoEnrolleList.map(obj => {
      return obj.hmo;
    })
    this.facilityService.find({
      query: { _id: { $in: flist } }
    }).then(payload => {
      this.hmoFacilities = payload.data;
    });
  }
  getFacilityTypes() {
    this.facilityTypeService.findAll().then(payload => {
      payload.data.forEach(item => {
        if (item.name === 'HMO') {
          this.selectedFacilityType = item;
        }
      });
    })
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    let isExisting = false;
    if (this.loginHMOListObject.hmos !== undefined) {
      this.loginHMOListObject.hmos.forEach(item => {
        if (item._id === value._id) {
          isExisting = true;
        }
      });
    }

    if (!isExisting) {
      this.selectedHMO = value;
    } else {
      this.selectedHMO = <any>{};
      this.systemModuleService.announceSweetProxy('Selected HMO is already in your list of HMOs', 'info');
    }
  }

  newHmo_show() {
    this.newHmo = !this.newHmo;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  show_beneficiaries(hmo) {
    this.router.navigate(['/dashboard/health-coverage/hmo-cover-beneficiaries/', hmo._id]);
  }
  onChange(e) {

  }
  submitExcel(e, hmo) {
    this.ev = e;
    this.HMO = hmo;
    this.systemModuleService.announceSweetProxy
      ('You are trying to upload an excel file. Please make sure it conforms with the accepted excel sheet format', 'question', this);
  }
  sweetAlertCallback(result) {
    if (result.value) {
      console.log(this.ev, this.HMO);
      this.upload(this.ev, this.HMO);
    }
  }
  upload(e, hmo) {
    const target: DataTransfer = <DataTransfer>(e.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      const datas = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      const data = datas.filter(function (x) { // Removing empty rows from the array.
        return x.length;
      });
      this.finalExcelFileUpload(data, hmo);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  finalExcelFileUpload(data, hmo?) {
    const enrolleeList = [];
    this.hmoService.find({
      query: {
        facilityId: this.selelctedFacility._id
      }
    }).then(payload => {
      const hmoData = payload.data[0].hmos.filter(x => x.hmo === hmo._id);

      const index = payload.data[0].hmos.findIndex(x => x.hmo === hmo._id);
      const facHmo = payload.data[0].hmos[index];

      const currentDate = new Date();
      const prevMonth = currentDate.getMonth();
      const year = currentDate.getFullYear();
      const dataLength = data.length - 1;
      let rowObj: any = <any>{};
      let lastMonth = false;
      let lastMonthEnrollees;
      const lastMonthEnrolleesListIndex = payload.data[0].hmos[index].enrolleeList.findIndex(x => x.month == prevMonth && x.year == year);

      if (hmoData[0].enrolleeList.length >= 1) {
        lastMonthEnrollees = hmoData[0].enrolleeList.filter(x => x.month == prevMonth && x.year == year);
        let lastMonthEnrLen;

        if (lastMonthEnrollees.length > 0) { lastMonthEnrLen = lastMonthEnrollees[0].enrollees.length; }

        const lastMonthIndex = hmoData[0].enrolleeList.findIndex(x => x.month === prevMonth && x.year === year);
        const presentMonthEnrollees = hmoData[0].enrolleeList.filter(x => x.month === prevMonth && x.year === year);


        if (lastMonthEnrollees.length > 0) {

          lastMonth = true;

          for (let m = 0; m < data.length; m++) {
            const enr = lastMonthEnrollees[0].enrollees.filter(x => x.filNo === data[dataLength][4]);
            if (Boolean(data[m][0])) {
              if (enr.length === 0) {
                const rowObj: any = <any>{};
                rowObj.serial = data[m][0];
                rowObj.surname = data[m][1];
                rowObj.firstname = data[m][2];
                rowObj.gender = data[m][3];
                rowObj.filNo = data[m][4];
                rowObj.category = data[m][5];
                rowObj.sponsor = data[m][6];
                rowObj.plan = data[m][7];
                rowObj.type = data[m][8];
                rowObj.date = this.excelDateToJSDate(data[m][9]);
                rowObj.status = 'active';
                // thisMonth = true;
              }
            }
            enrolleeList.push(rowObj);
          }

          const enrolleeItem = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            enrollees: enrolleeList
          }

          const index = payload.data[0].hmos.findIndex(x => x.hmo === hmo._id);
          const facHmo = payload.data[0].hmos[index];
          facHmo.enrolleeList.push(enrolleeItem);
          payload.data[0].hmos[index] = facHmo;

        } else {
          for (let m = 0; m < data.length; m++) {
            const enr = hmoData[0].enrolleeList[0].enrollees.filter(x => x.filNo == data[m][4]);
            if (Boolean(data[m][0])) {
              if (enr.length == 0) {
                let rowObjs: any = <any>{};
                rowObjs.serial = data[m][0];
                rowObjs.surname = data[m][1];
                rowObjs.firstname = data[m][2];
                rowObjs.gender = data[m][3];
                rowObjs.filNo = data[m][4];
                rowObjs.category = data[m][5];
                rowObjs.sponsor = data[m][6];
                rowObjs.plan = data[m][7];
                rowObjs.type = data[m][8];
                rowObjs.date = this.excelDateToJSDate(data[m][9]);
                rowObjs.status = 'active';

                enrolleeList.push(rowObjs);
              }
            }
          }
          facHmo.enrolleeList[0].enrollees.push(...enrolleeList);
          payload.data[0].hmos[index] = facHmo;
        }

      } else {
        console.log(data, hmoData);
        for (let m = 0; m < data.length; m++) {
          if (Boolean(data[m][0])) {
            let rowObj: any = <any>{};
            rowObj.serial = data[m][0];
            rowObj.surname = data[m][1];
            rowObj.firstname = data[m][2];
            rowObj.gender = data[m][3];
            rowObj.filNo = data[m][4];
            rowObj.category = data[m][5];
            rowObj.sponsor = data[m][6];
            rowObj.plan = data[m][7];
            rowObj.type = data[m][8];
            rowObj.date = this.excelDateToJSDate(data[m][9]);
            rowObj.status = 'active';
            enrolleeList.push(rowObj);
          }
        }
        const enrolleeItem = {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          enrollees: enrolleeList
        }
        const index = payload.data[0].hmos.findIndex(x => x.hmo === hmo._id);
        const facHmo = payload.data[0].hmos[index];
        facHmo.enrolleeList.push(enrolleeItem);
        payload.data[0].hmos[index] = facHmo;
      }

      this.hmoService.patch(payload.data[0]._id, {
        hmos: payload.data[0].hmos
      }, {}).then(hmoPayload => {
        if (lastMonth === true) {
          const noChangeEnrollees = lastMonthEnrollees[0].enrollees.filter(x => new Date(x.updatedAt).getMonth() === prevMonth);
          if (noChangeEnrollees.length > 0) {
            for (let n = 0; n < noChangeEnrollees.length; n++) {
              if (Boolean(noChangeEnrollees)) {

                const noChangeIndex = payload.data[0].hmos[index].enrolleeList[lastMonthEnrolleesListIndex]
                  .enrollees.findIndex(x => x.filNo === noChangeEnrollees[n].filNo);
                payload.data[0].hmos[index].enrolleeList[lastMonthEnrolleesListIndex].enrollees[noChangeIndex].status = 'inactive';
                payload.data[0].hmos[index].enrolleeList[lastMonthEnrolleesListIndex].enrollees[noChangeIndex].updatedAt = Date.now();

                this.hmoService.patch(payload.data[0]._id, {
                  hmos: payload.data[0].hmos
                }, {}).then(noChangPayload => {
                  this.systemModuleService.announceSweetProxy
                    (`You have successfully uploaded ${data.length} enrollees to ${hmo.name}`, 'success');
                });
              }
            }
          }
        }
      });

    }).catch(err => {
      console.log(err);
      this.systemModuleService.announceSweetProxy('Something went wrong while uploading the enrollees. Please try again', 'warning');
    });
  }

  getEnrolleeCount(hmo) {
    const retCount = 0;
    const index = this.hmoEnrolleList.findIndex(x => x.hmo === hmo);
    if (index > -1) {
      return this.hmoEnrolleList[index].enrolles.length;
    }
    return retCount;
  }
  excelDateToJSDate(date) {
    // return new Date(Math.round((date - 25569) * 86400 * 1000));
    return new Date(date);
  }
  checkHmo() {
    return this.loginHMOListObject.hmos.findIndex(x => x.hmo === this.selectedHMO._id) > -1;
  }
  save(valid, value) {
    this.systemModuleService.on();
    if (this.checkHmo()) {
      this.systemModuleService.announceSweetProxy('The selected HMO is already in the list of HMOs', 'warning');
      this.systemModuleService.off();
    } else {
      if (this.selectedHMO._id === undefined) {
        this.systemModuleService.announceSweetProxy('Please select an HMO to continue!', 'warning');
        this.systemModuleService.off();
      } else {
        const newHmo = {
          hmo: this.selectedHMO._id,
          enrolleeList: []
        }
        this.loginHMOListObject.hmos.push(newHmo);
        if (this.selectedHMO._id !== undefined) {
          if (this.loginHMOListObject._id === undefined) {
            this.hmoService.create(this.loginHMOListObject).then(payload => {
              this.frmNewHmo.controls['name'].reset();
              this.apmisLookupText = '';
              this.getLoginHMOList();
              this.systemModuleService.off();
              this.systemModuleService.announceSweetProxy('Selected HMO added to your HMO list successfully', 'success');
            })
          } else {
            this.hmoService.update(this.loginHMOListObject).then(payload => {
              this.frmNewHmo.controls['name'].reset();
              this.apmisLookupText = '';
              this.getLoginHMOList();
              this.systemModuleService.off();
              this.systemModuleService.announceSweetProxy('Selected HMO added to your HMO list successfully', 'success');
            })
          }
        }
      }
    }
  }
}
