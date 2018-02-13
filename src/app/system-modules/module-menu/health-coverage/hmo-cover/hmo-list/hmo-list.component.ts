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
  ev:any;
  HMO:any;

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
  submitExcel(e, hmo){
    this.ev = e;
    this.HMO = hmo;
    this.systemModuleService.announceSweetProxy('You are trying to upload an excel file. Please make sure it conforms with the accepted excel sheet format', 'question', this);
  }
  sweetAlertCallback(result){
    if(result.value){
      console.log(result, this.ev, this.HMO);
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
    /*  this.facilityService.upload(this.formData, {
       query:
         {
           'hmoId': this.selectedHMO._id,
           'file': this.excelFile
         }
     }).then(res => {
 
       console.log(res);
 
       let enrolleeList: any[] = [];
       if (res.body !== undefined && res.body.error_code === 0) {
         res.body.data.Sheet1.forEach(row => {
           let rowObj: any = <any>{};
           rowObj.serial = row.A;
           rowObj.surname = row.B;
           rowObj.firstName = row.C;
           rowObj.gender = row.D;
           rowObj.filNo = row.E;
           rowObj.category = row.F;
           rowObj.sponsor = row.G;
           rowObj.plan = row.H;
           rowObj.type = row.I;
           rowObj.date = this.excelDateToJSDate(row.J);
           rowObj.status = 'active';
           enrolleeList.push(rowObj);
         });
         const index = this.loginHMOListObject.hmos.findIndex(x => x._id === hmo._id);
         let facHmo = this.loginHMOListObject.hmos[index];
         let enrolleeItem = {
           month: new Date().getMonth() + 1,
           year: new Date().getFullYear(),
           enrollees: enrolleeList
         }
 
         facHmo.enrolleeList.push(enrolleeItem);
         this.loginHMOListObject.hmos[index] = facHmo;
 
         console.log(this.loginHMOListObject);
       }
     }).catch(err => {
       console.log(err);
       this.systemModuleService.announceSweetProxy('There was an error uploading the file', 'error');
     }); */

    console.log(hmo);

    this.hmoService.find({
      query: {
        facilityId: this.selelctedFacility._id
      }
    }).then(payload => {
      console.log(payload);
      let hmoData = payload.data[0].hmos.filter(x => x.hmo == hmo._id);
      console.log(hmoData);
      let enrolleeList = [];
      let currentDate = new Date();
      let prevMonth = currentDate.getMonth() - 1;
      let year = currentDate.getFullYear();
      let dataLength = data.length;
      let rowObj: any = <any>{};
      if (hmoData[0].enrolleeList.length > 0) {
        let lastMonthEnrollees = hmoData[0].enrolleeList.filter(x => x.month == prevMonth && x.year == year);
        console.log(lastMonthEnrollees);
        if (lastMonthEnrollees.length > 0) {
          while (dataLength--) {
            let enr = lastMonthEnrollees[0].enrollees.filter(x => x.filNo == data[dataLength][4]);
            if (enr) {
              console.log(enr);
            }
          }
        } else {
          console.log(hmoData[0].enrolleeList[0].enrollees);
          while (dataLength--) {
            let enr = hmoData[0].enrolleeList[0].enrollees.filter(x => x.filNo == data[dataLength][4]);
            if (enr.length > 0) {
              enr[0].status = "inactive";
              rowObj = enr[0];
            } else {
              console.log('Serial = '+data[dataLength][0]);
              rowObj.serial = data[dataLength][0];
              rowObj.surname = data[dataLength][1];
              rowObj.firstName = data[dataLength][2];
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
        }
      } else {
        console.log(data, hmoData);
        data.forEach(row => {
          rowObj.serial = row[0];
          rowObj.surname = row[1];
          rowObj.firstName = row[2];
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
        /* const index = this.loginHMOListObject.hmos.findIndex(x => x._id === hmo._id);
        let facHmo = this.loginHMOListObject.hmos[index]; */
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
        console.log(hmoData[0]);
        this.hmoService.patch(payload.data[0]._id, {
          hmos: payload.data[0].hmos
        }, {}).then(hmoPayload => {
          console.log(hmoPayload);
        })
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
          rowObj.firstName = row[2];
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
