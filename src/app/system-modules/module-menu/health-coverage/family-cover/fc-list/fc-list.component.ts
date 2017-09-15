import { FacilityFamilyCoverService } from './../../../../../services/facility-manager/setup/facility-family-cover.service';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../../../../models/facility-manager/setup/user';
import { MdPaginator } from '@angular/material';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
  selector: 'app-fc-list',
  templateUrl: './fc-list.component.html',
  styleUrls: ['./fc-list.component.scss']
})
export class FcListComponent implements OnInit {

  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput: ElementRef;

  public frmNewBeneficiary: FormGroup;
  public frmDependant: FormGroup;
  principal = new FormControl('', []);
  newFamily = false;

  selectedFacility: any = <any>{};
  beneficiaries: any[] = [];
  filteredBeneficiaries: any[] = [];
  operateBeneficiaries: any[] = [];
  selectedFamilyCover: any = <any>{};

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  @ViewChild(MdPaginator) paginator: MdPaginator;
  user: User = <User>{};
  genders: any[] = [
    {
      name: 'Male',
      _id: 'M'
    },
    {
      name: 'Female',
      _id: 'F'
    }
  ];
  statuses: any[] = [
    {
      name: 'Active',
      _id: 'Active'
    },
    {
      name: 'Inactive',
      _id: 'Inactive'
    }
  ];

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private locker: CoolLocalStorage,
    private familyCoverService: FacilityFamilyCoverService, private facilityService: FacilitiesService) { }

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject('miniFacility');
    this.user = <User>this.locker.getObject('auth');
    this.frmNewBeneficiary = this.formBuilder.group({
      surname: ['', [Validators.required]],
      othernames: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
      phone: ['', [<any>Validators.required]],
      status: ['', [<any>Validators.required]],
      filNo: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      serial: [0, [<any>Validators.required]],
      operation: ['save']
    });
    this.addDependant();
    this.getBeneficiaryList(this.selectedFacility._id);
  }

  addDependant() {
    this.frmDependant = this.formBuilder.group({
      'dependantArray': this.formBuilder.array([
        this.formBuilder.group({
          surname: ['', [Validators.required]],
          othernames: ['', [Validators.required]],
          gender: ['', [Validators.required]],
          email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
          phone: ['', []],
          status: ['', [<any>Validators.required]],
          filNo: [''],
          readOnly: [false],
          operation: ['save'],
          serial: [0]
        })
      ])
    });
  }
  pushNewDependant(dependant?, index?) {
    if (dependant !== undefined && dependant.valid) {
      dependant.value.readOnly = true;
    }
    (<FormArray>this.frmDependant.controls['dependantArray'])
      .push(
      this.formBuilder.group({
        surname: ['', [Validators.required]],
        othernames: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
        phone: ['', []],
        status: ['', [<any>Validators.required]],
        filNo: [''],
        readOnly: [false],
        operation: ['save'],
        serial: [0]
      })
      );
  }
  closeDependant(dependant, i) {
    (<FormArray>this.frmDependant.controls['dependantArray']).controls.splice(i, 1);
    if ((<FormArray>this.frmDependant.controls['dependantArray']).controls.length === 0) {
      this.addDependant()
    }
  }

  showEdit(beneficiary) {
    if (this.getRole(beneficiary) === 'P') {
      this.frmNewBeneficiary.controls['surname'].setValue(beneficiary.surname);
      this.frmNewBeneficiary.controls['othernames'].setValue(beneficiary.othernames);
      this.frmNewBeneficiary.controls['gender'].setValue(beneficiary.gender);
      this.frmNewBeneficiary.controls['filNo'].setValue(beneficiary.filNo);
      this.frmNewBeneficiary.controls['operation'].setValue('update');
      this.frmNewBeneficiary.controls['serial'].setValue(beneficiary.serial);
      this.frmNewBeneficiary.controls['email'].setValue(beneficiary.email);
      this.frmNewBeneficiary.controls['phone'].setValue(beneficiary.phone);
      this.frmNewBeneficiary.controls['address'].setValue(beneficiary.address);
      if (beneficiary.isActive === undefined) {
        this.frmNewBeneficiary.controls['status'].setValue(this.statuses[0]._id);
      }
      let filtered = this.beneficiaries.filter(x => x.filNo.includes(beneficiary.filNo));
      console.log(filtered);
      let hasRecord = false;
      this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
      filtered.forEach((filter, i) => {
        if (this.getRole(filter) === 'D') {
          hasRecord = true;
          (<FormArray>this.frmDependant.controls['dependantArray'])
            .push(
            this.formBuilder.group({
              surname: [filter.surname],
              othernames: [filter.othernames],
              gender: [filter.gender],
              email: [filter.email],
              phone: [filter.phone],
              status: [filter.status],
              operation: ['update'],
              filNo: [filter.filNo],
              serial: [filter.serial],
              category: 'Dependant',
              readOnly: [true],
            }));

        }
      })
      this.newFamily = true;
    } else {
      this.frmNewBeneficiary.reset();
      const filNoLength = beneficiary.filNo.length;
      const lastCharacter = beneficiary.filNo[filNoLength - 1];
      let sub = beneficiary.filNo.substring(0, (filNoLength - 1));
      let filtered = this.beneficiaries.filter(x => x.filNo.includes(sub));
      console.log(filtered)
      let hasRecord = false;
      this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
      filtered.forEach((filter, i) => {
        if (this.getRole(filter) === 'D') {
          hasRecord = true;
          console.log('isD');
          (<FormArray>this.frmDependant.controls['dependantArray'])
            .push(
            this.formBuilder.group({
              surname: [filter.surname],
              othernames: [filter.othernames],
              gender: [filter.gender],
              email: [filter.email],
              phone: [filter.phone],
              status: [filter.status],
              operation: ['update'],
              filNo: [filter.filNo],
              serial: [filter.serial],
              category: 'Dependant',
              readOnly: [true],
            }));
            console.log((<FormArray>this.frmDependant.controls['dependantArray']))
        } else if (this.getRole(filter) === 'P') {
          this.frmNewBeneficiary.controls['surname'].setValue(filter.surname);
          this.frmNewBeneficiary.controls['othernames'].setValue(filter.othernames);
          this.frmNewBeneficiary.controls['gender'].setValue(filter.gender);
          this.frmNewBeneficiary.controls['filNo'].setValue(filter.filNo);
          this.frmNewBeneficiary.controls['operation'].setValue('update');
          // this.frmNewBeneficiary.controls['date'].setValue(filter.date);
          this.frmNewBeneficiary.controls['serial'].setValue(filter.serial);
          this.frmNewBeneficiary.controls['email'].setValue(filter.email);
          this.frmNewBeneficiary.controls['phone'].setValue(filter.phone);
          this.frmNewBeneficiary.controls['address'].setValue(filter.address);
          if (beneficiary.isActive === undefined) {
            this.frmNewBeneficiary.controls['status'].setValue(this.statuses[0]._id);
          }
        }
      });
      this.newFamily = true;
    }

  }
  change(value){
    console.log(value)
  }
  save(valid, value, dependantValid, dependantValue) {
    console.log(dependantValue.controls.dependantArray.controls)
    console.log(dependantValid)
    console.log(value)
    let unsavedFiltered = dependantValue.controls.dependantArray.controls.filter(x => x.value.readOnly === false && x.valid);
    if(unsavedFiltered.length > 0){
      this._notification('Warning', 'There seems to unsaved but valid dependant yet to be saved, please save and try again!');
      return;
    }
    if (valid) {
      let param = {
        model: value,
        operation: value.operation,
        dependants: [],
        facilityId: this.selectedFacility._id,
        facilityObject:this.selectedFacility
      };
      // console.log(dependantValue.dependantArray);
      let filtered = dependantValue.controls.dependantArray.controls.filter(x => x.value.readOnly === true);
      filtered.forEach(item =>{
        param.dependants.push(item.value);
      })
  
      console.log(param);

      this.familyCoverService.updateBeneficiaryList(param).then(payload => {
        console.log(payload);
        this.getBeneficiaryList(this.selectedFacility._id);
        this.cancel();
      })
    } else {
      this._notification('Warning', 'A value is missing, please fill all required field and try again!');
    }

  }
  cancel() {
    this.frmNewBeneficiary.reset();
    this.frmDependant.reset();
    this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
    this.pushNewDependant();
  }

  getBeneficiaryList(id) {
    this.familyCoverService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then(payload => {
      if (payload.data.length > 0) {
        let facFamilyCover = payload.data[0];
        this.selectedFamilyCover = facFamilyCover;
        this.beneficiaries = facFamilyCover.familyCovers;
        console.log(this.beneficiaries);
        const startIndex = 0 * 10;
        this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
        this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
      }
    })
  }
  getRole(beneficiary) {
    let filNo = beneficiary.filNo;
    if (filNo !== undefined) {
      const filNoLength = filNo.length;
      const lastCharacter = filNo[filNoLength - 1];
      return isNaN(lastCharacter) ? 'D' : 'P';
    }
  }
  onPaginateChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  newFamily_show() {
    this.newFamily = !this.newFamily;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  show_beneficiaries() {
    this.showBeneficiaries.emit(true);
  }
}
