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
        this._getHMOFacilities(payload.data[0]);
      } else {
        this.loginHMOListObject.facilityId = this.selelctedFacility._id;
        this.loginHMOListObject.hmos = [];
      }
    })
  }
  _getHMOFacilities(facilityHMOs) {
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
  public upload(e, hmo) {
    /* let fileBrowser = this.fileInput.nativeElement;
    console.log(fileBrowser.files);
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.formData = new FormData();
      this.formData.append("excelfile", fileBrowser.files[0]);
      this.formData.append("hmoId", hmo._id);
      console.log(this.formData);
      let filePath = URL.createObjectURL(fileBrowser.files[0]);
      this.finalExcelFileUpload(hmo);

      let reader = new FileReader();
      reader.readAsDataURL(fileBrowser.files[0]);
      reader.onload = () => {
        let base64 = reader.result;
        this.excelFile = fileBrowser.files[0].name;
        
        
      };

    } */
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
      let data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
    };
    reader.readAsBinaryString(target.files[0]);
  }

  finalExcelFileUpload(hmo) {
    this.facilityService.upload(this.formData, {
      query:
        {
          'hmoId': this.selectedHMO._id,
          'file': this.excelFile
        }
    }).then(res => {

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

        /* this.hmoService.update(this.loginHMOListObject).then(pay => {
          this.getLoginHMOList();
        }) */
      }
    }).catch(err => {
      this.systemModuleService.announceSweetProxy('There was an error uploading the file', 'error');
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
    return new Date(Math.round((date - 25569) * 86400 * 1000));
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
