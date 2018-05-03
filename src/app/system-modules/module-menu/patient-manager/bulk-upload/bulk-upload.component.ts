import { Component, OnInit, EventEmitter, Output, Input, Renderer, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import * as XLSX from 'xlsx';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import {
  ProfessionService, RelationshipService, MaritalStatusService, GenderService,
  TitleService, CountriesService, PatientService, PersonService, EmployeeService, FacilitiesService, FacilitiesServiceCategoryService,
  BillingService, ServicePriceService, HmoService, FamilyHealthCoverService
} from '../../../../services/facility-manager/setup/index';
import { Tag, Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

type AOA = any[][];

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr: boolean = true;
  errMsg;

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  pageEvent: PageEvent;


  patients: any[] = [];

  uploadingLoading: boolean = false;

  showInsurance: boolean = false;
  showWallet: boolean = false;
  showFamily: boolean = false;
  showCompany: boolean = false;

  openBox: any = '';
  shownForm: FormGroup;
  items: any = [];

  genders: any[] = [];
  titles: any[] = [];

  btnLoading:boolean = false;

  facility: Facility = <Facility>{};


  constructor(private formBuilder: FormBuilder,
    private titleService: TitleService,
    private genderService: GenderService, 
    private patientService: PatientService,
    private _locker: CoolLocalStorage,
  private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.shownForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createForm()])
    });
    this.items = this.shownForm.get('items') as FormArray;
    this.getGenders();
    this.getTitles();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      title: '',
      firstName: '',
      lastName: '',
      gender: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      payPlan: ''
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onPaginateChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    // this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    // this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
  }

  uploadingData(e) {
    this.uploadingLoading = true;
    const target: DataTransfer = <DataTransfer>(e.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    // tslint:disable-next-line:no-shadowed-variable
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
      //this.finalExcelFileUpload(data, hmo);
      this.turningDataToArrayOfObjects(data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  turningDataToArrayOfObjects(data) {
    data.splice(0, 1);
    let len = data.length;
    let arr = [];
    for (let i = 0; i < len; i++) {
      if (data[i][0] !== undefined) {
        const rowObj: any = <any>{};
        rowObj.title = data[i][0];
        rowObj.firstName = data[i][1];
        rowObj.lastName = data[i][2];
        rowObj.gender = data[i][3];
        rowObj.dateOfBirth = new Date(data[i][4]);
        rowObj.email = data[i][5];
        rowObj.primaryContactPhoneNo = data[i][6];
        rowObj.motherMaidenName = data[i][7];
        rowObj.maritalStatus = (data[i][8] !== undefined) ? data[i][8] : '';
        rowObj.lgaOfOrigin = (data[i][9] !== undefined) ? data[i][9] : '';
        rowObj.stateOfOrigin = (data[i][10] !== undefined) ? data[i][10] : '';
        rowObj.nationality = (data[i][11] !== undefined) ? data[i][11] : '';
        rowObj.payPlan = 'Wallet';
        this.items.push(this.createForm());
        let datas: any = this.shownForm.controls.items;
        datas.controls[i].controls.firstName.setValue(rowObj.firstName);
        datas.controls[i].controls.lastName.setValue(rowObj.lastName);
        datas.controls[i].controls.gender.setValue(rowObj.gender);
        datas.controls[i].controls.phone.setValue(rowObj.primaryContactPhoneNo);
        datas.controls[i].controls.email.setValue(rowObj.email);
        datas.controls[i].controls.dateOfBirth.setValue(rowObj.dateOfBirth);
        datas.controls[i].controls.title.setValue(rowObj.title);
        datas.controls[i].controls.payPlan.setValue(rowObj.payPlan.toLowerCase());
        datas.controls[i].controls.payPlan.disable()

        arr.push(rowObj);
      }
    }
    this.uploadingLoading = false;
    this.patients = arr;
  }

  excelDateToJSDate(date) {
    new Date(date.toString());
    let dateIsh = new Date(Math.round((date - 25569) * 86400 * 1000));
    return dateIsh;
  }

  changeInput(ev) {
    if (ev.value === 'wallet') {
      this.showInsurance = false;
      this.showWallet = true;
      this.showFamily = false;
      this.showCompany = false;
    }else if(ev.value === 'insurance'){
      this.showInsurance = true;
      this.showWallet = false;
      this.showFamily = false;
      this.showCompany = false;
    }else if(ev.value === 'company'){
      this.showInsurance = false;
      this.showWallet = false;
      this.showFamily = false;
      this.showCompany = true;
    }else if(ev.value === 'family'){
      this.showInsurance = false;
      this.showWallet = false;
      this.showFamily = true;
      this.showCompany = false;
    }else{
      this.showInsurance = false;
      this.showWallet = false;
      this.showFamily = false;
      this.showCompany = false;
    }
  }

  editBtn(data) {
  }

  deleteBtn(i) {
    const ind = this.patients.findIndex(x => x.serialNo === i);
    if(this.patients[i] !== undefined){
      this.patients.splice(i, 1);
    }
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  saveRow(i) {
    let data: any = this.shownForm.controls.items;
    let info = data.controls[i].controls;
    let patientInfo = this.patients[i];
    patientInfo.firstName = info.firstName.value;
    patientInfo.lastName = info.lastName.value;
    patientInfo.email = info.email.value;
    patientInfo.dateOfBirth = info.dateOfBirth.value;
    patientInfo.primaryContactPhoneNo = info.phone.value;
    patientInfo.title = info.title.value;
    patientInfo.gender = info.gender.value;
    patientInfo.payPlan = info.payPlan.value;
    this.openBox = '';
  }

  getGenders() {
    this.genderService.findAll().then(payload => {
      this.genders = payload.data;
    }).catch(err => {

    });
  }
  getTitles() {
    this.titleService.findAll().then(payload => {
      this.titles = payload.data;
    }).catch(err => {

    });
  }

  submit(){
    this.btnLoading = true;
    this.patients.map(pa => {
      pa.facilityId = this.facility._id
    })
    this.patientService.bulkUpload(this.patients).then(payload => {
      this.btnLoading = false;
      if( payload.failed !== undefined || payload.failed.length > 0 ){
        this.patients = [];
        this.systemModuleService.announceSweetProxy('Patients information successfully uploaded!','success');
      }else{
        this.patients = payload.failed;
        this.systemModuleService.announceSweetProxy('Ooops!!','An error occured. The following list had an issue when uploading','warning');
      }
    }).catch(err => {
      this.btnLoading = false;
      this.systemModuleService.announceSweetProxy('An error occured!','error');
    });
  }

}
