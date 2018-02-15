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
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey = "name";
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
    console.log(this.selectedFacilityType);
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
      console.log(payload);
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
    this.systemModuleService.announceSweetProxy('You are trying to upload an excel file. Please make sure it conforms with the accepted excel sheet format', 'question', this);
  }
  sweetAlertCallback(result) {
    if (result.value) {
      console.log(this.ev, this.HMO);
      this.upload(this.ev, this.HMO);
    }
  }
  upload(e, hmo) {
    const target: DataTransfer = <DataTransfer>(e.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let datas = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      var data = datas.filter(function (x) { // Removing empty rows from the array.
        return x.length;
      });
      console.log(data);
      this.finalExcelFileUpload(data, hmo);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  finalExcelFileUpload(data, hmo?) {
    var enrolleeList = [];
    this.hmoService.find({
      query: {
        facilityId: this.selelctedFacility._id
      }
    }).then(payload => {
      console.log(payload);
      let hmoData = payload.data[0].hmos.filter(x => x.hmo == hmo._id);
      console.log(hmoData);

      const index = payload.data[0].hmos.findIndex(x => x.hmo === hmo._id);
      let facHmo = payload.data[0].hmos[index];

      let currentDate = new Date();
      let prevMonth = currentDate.getMonth();
      let year = currentDate.getFullYear();
      let dataLength = data.length - 1;
      var rowObj: any = <any>{};
      console.log(hmoData[0].enrolleeList.length);
      if (hmoData[0].enrolleeList.length >= 1) {
        console.log('---- Inside The first If --------');
        let lastMonthEnrollees = hmoData[0].enrolleeList.filter(x => x.month == prevMonth && x.year == year);
        let lastMonthEnrLen = lastMonthEnrollees[0].enrollees.length;
        let lastMonthIndex = hmoData[0].enrolleeList.findIndex(x => x.month == prevMonth && x.year == year);
        let presentMonthEnrollees = hmoData[0].enrolleeList.filter(x => x.month == prevMonth && x.year == year);
        console.log(lastMonthIndex);
        console.log(lastMonthEnrollees);
        if (lastMonthEnrollees.length > 0) {
          for (let m = 0; m <= data.length - 1; m++) {
            var rowObj: any = <any>{};
            let enr = lastMonthEnrollees[0].enrollees.filter(x => x.filNo == data[dataLength][4]);
            if (enr.length > 0) {
              enr[0].status = "active";
              enr[0].updatedAt = Date.now();
              rowObj = enr[0];
            } else if (enr.length! > 0) {
              console.log('Serial = ' + data[dataLength][0]);
              rowObj.serial = data[dataLength][0];
              rowObj.surname = data[dataLength][1];
              rowObj.firstname = data[dataLength][2];
              rowObj.gender = data[dataLength][3];
              rowObj.filNo = data[dataLength][4];
              rowObj.category = data[dataLength][5];
              rowObj.sponsor = data[dataLength][6];
              rowObj.plan = data[dataLength][7];
              rowObj.type = data[dataLength][8];
              rowObj.date = this.excelDateToJSDate(data[dataLength][9]);
              rowObj.status = 'active';
            }
            enrolleeList.push(rowObj);
          }
          console.log(enrolleeList);

          let noChangeEnrollees = lastMonthEnrollees[0].enrollees.filter(x => new Date(x.updatedAt).getMonth() == prevMonth);
          console.log(noChangeEnrollees);
          if(noChangeEnrollees.length > 0){
            for(let n = 0; n <= noChangeEnrollees.length; n++){
              console.log(noChangeEnrollees[n]);
            }
          }
          
        } else {
          for (let m = 0; m <= data.length - 1; m++) {
            var rowObj: any = <any>{};
            let enr = hmoData[0].enrolleeList[0].enrollees.filter(x => x.filNo == data[dataLength][4]);
            if (enr.length > 0) {
              rowObj = enr[0];
            } else {
              rowObj.serial = data[dataLength][0];
              rowObj.surname = data[dataLength][1];
              rowObj.firstname = data[dataLength][2];
              rowObj.gender = data[dataLength][3];
              rowObj.filNo = data[dataLength][4];
              rowObj.category = data[dataLength][5];
              rowObj.sponsor = data[dataLength][6];
              rowObj.plan = data[dataLength][7];
              rowObj.type = data[dataLength][8];
              rowObj.date = this.excelDateToJSDate(data[dataLength][9]);
              rowObj.status = 'active';
              console.log(rowObj);
            }
            enrolleeList.push(rowObj);
          }
        }
        const index = payload.data[0].hmos.findIndex(x => x.hmo === hmo._id);
        let facHmo = payload.data[0].hmos[index]; 
      } else {
        console.log(data, hmoData);
        for (let m = 0; m <= data.length - 1; m++) {
          var rowObj: any = <any>{};
          rowObj.serial = (data[m][0] == undefined) ? '' : data[m][0];
          rowObj.surname = (data[m][1] == undefined) ? '' : data[m][1];
          rowObj.firstname = (data[m][2] == undefined) ? '' : data[m][2];
          rowObj.gender = (data[m][3] == undefined) ? '' : data[m][3];
          rowObj.filNo = (data[m][4] == undefined) ? '' : data[m][4];
          rowObj.category = (data[m][5] == undefined) ? '' : data[m][5];
          rowObj.sponsor = (data[m][6] == undefined) ? '' : data[m][6];
          rowObj.plan = (data[m][7] == undefined) ? '' : data[m][7];
          rowObj.type = (data[m][8] == undefined) ? '' : data[m][8];
          rowObj.date = (data[m][9] != undefined) ? this.excelDateToJSDate(data[m][9]) : '';
          rowObj.status = 'active';
          enrolleeList.push(rowObj);
        }
        let enrolleeItem = {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          enrollees: enrolleeList
        }
        const index = payload.data[0].hmos.findIndex(x => x.hmo === hmo._id);
        let facHmo = payload.data[0].hmos[index];
        facHmo.enrolleeList.push(enrolleeItem);
        payload.data[0].hmos[index] = facHmo;
        console.log(facHmo);
        console.log(payload.data[0].hmos);
        this.hmoService.patch(payload.data[0]._id, {
          hmos: payload.data[0].hmos
        }, {}).then(hmoPayload => {
          console.log(hmoPayload);
        });
      }

      /* if(LastMonthEnrollees){
        if(hmoData.enrolleeList.enrollees){
          let len = hmo.enrolleeList.enrollees
        }
      }else{
        data.forEach(row => {
          let rowObj: any = <any>{};
          rowObj.serial = row[0];
          rowObj.surname = row[1];
          rowObj.firstname = row[2];
          rowObj.gender = row[3];
          rowObj.filNo = row[4];
          rowObj.category = row[5];
          rowObj.sponsor = row[6];
          rowObj.plan = row[7];
          rowObj.type = row[8];
          rowObj.date = this.excelDateToJSDate(row[9]);
          rowObj.status = 'active';
          enrolleeList.push(rowObj);
        });
      } */
    }).catch(err => {
      console.log(err);
    });
  }

  anotherExcelFileUpload(data, hmo?) {
    let uniqueData = [];
    let notUniqueData = [];
    this.hmoService.find({
      query: {
        facilityId: this.selelctedFacility._id
      }
    }).then(payload => {
      console.log(payload.data[0]);
      let incomingDataLength = data.length - 1;
      let hmoData = payload.data[0].hmos.filter(x => x.hmo == hmo._id);
      let enrolleeList = [];

      console.log(hmoData[0]);

      let isCurrent = false;
      let isPrevious = false;
      let len = hmoData[0].enrolleeList.length - 1;
      console.log(len);
      if (len == -1) {
        
        for (let m = 0; m <= data.length - 1; m++) {
          {

            var rowObj: any = {};
            //console.log('Below the If statement ', data[m][0]);
            rowObj.serial = (data[m][0] == undefined) ? '' : data[m][0];
            rowObj.surname = (data[m][1] == undefined) ? '' : data[m][1];
            rowObj.firstname = (data[m][2] == undefined) ? '' : data[m][2];
            rowObj.gender = (data[m][3] == undefined) ? '' : data[m][3];
            rowObj.filNo = (data[m][4] == undefined) ? '' : data[m][4];
            rowObj.category = (data[m][5] == undefined) ? '' : data[m][5];
            rowObj.sponsor = (data[m][6] == undefined) ? '' : data[m][6];
            rowObj.plan = (data[m][7] == undefined) ? '' : data[m][7];
            rowObj.type = (data[m][8] == undefined) ? '' : data[m][8];
            rowObj.date = (data[m][9] != undefined) ? this.excelDateToJSDate(data[m][9]) : '';
            rowObj.status = 'active';
            enrolleeList.push(rowObj);
            console.log(rowObj);
          }
        }
        let enrolleeItem = {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          enrollees: enrolleeList
        }
        console.log(enrolleeItem);
      } else {
        for (let i = 0; i <= len; i++) {
          let len2 = hmoData[0].enrolleeList[i].enrollees.length - 1;
          let len2End = len2 - 1;
          console.log(len2);
          for (let j = len2; j >= len2End; j--) {
            for (let k = incomingDataLength; k >= 0; k--) {
              if (j == len2) {
                if (hmoData[0].enrolleeList[i].enrollees[j].fileNo === data[k][4]) {
                  isCurrent = true;
                }
              } else if (j === len2End) {
                if (hmoData[0].enrolleeList[i].enrollees[j].fileNo === data[k][4]) {
                  isPrevious = true
                  data[k] //Exist in the previous month
                }
              }
              if (isCurrent === true && isPrevious === false) {
                data[k] // Exist in Present month
                console.log('Present Month', data[k]);
              } else if (isCurrent === false && isPrevious === true) {
                data[k] // Exist in Previous month
                console.log('Previous Month', data[k]);
              } else if (isCurrent === false && isPrevious === false) {
                data[k] // Exist in Previous month
              }
            }
          }
        }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  getEnrolleeCount(hmo) {
    let retCount = 0;
    let index = this.hmoEnrolleList.findIndex(x => x.hmo === hmo);
    if (index > -1) {
      return this.hmoEnrolleList[index].enrolles.length;
    }
    return retCount;
  }
  excelDateToJSDate(date) {
    //return new Date(Math.round((date - 25569) * 86400 * 1000));
    return new Date(date);
  }
  checkHmo() {
    console.log(this.loginHMOListObject.hmos)
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
        let newHmo = {
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
