import { HmoService } from './../../../../../services/facility-manager/setup/hmo.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material';

@Component({
  selector: 'app-beneficiary-list',
  templateUrl: './beneficiary-list.component.html',
  styleUrls: ['./beneficiary-list.component.scss']
})
export class BeneficiaryListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  public frmNewHmo: FormGroup;

  hmo = new FormControl('', []);
  searchBeneficiary = new FormControl();
  newHmo = false;
  selectedFacility: any = <any>{};
  beneficiaries: any[] = [];
  filteredBeneficiaries: any[] = [];
  operateBeneficiaries: any[] = [];
  selectedHMO: any = <any>{};
  mselectedHMO: any = <any>{};
  selectedBeneficiary: any = <any>{};

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  loading = true;
  newBeneficiary = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageEvent: PageEvent;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private locker: CoolLocalStorage,
    private hmoService: HmoService) { }

  ngOnInit() {
    this.selectedFacility = this.locker.getObject('selectedFacility');
    this.frmNewHmo = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators
        .pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
      plans: ['', [<any>Validators.required]]
    });

    this.searchBeneficiary.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.findBeneficiaries(value)
      });


    this.route.params.subscribe(parameters => {
      this.selectedBeneficiary.id = parameters.id;
      this.getBeneficiaryList(parameters.id);
    })
  }
  getBeneficiaryList(id) {
    this.hmoService.find({ query: { 'facilityId': this.selectedFacility._id } }).then(payload => {
      if (payload.data.length > 0) {
        const facHmo = payload.data[0];
        const index = facHmo.hmos.findIndex(x => x.hmo === id);
        this.mselectedHMO = facHmo.hmos[index];
        if (index > -1) {
          if (facHmo.hmos[index].enrolleeList.length > 0) {
            const bene = [];
            for (let s = 0; s < facHmo.hmos[index].enrolleeList.length; s++) {
              this.selectedHMO = facHmo.hmos[index].hmo;
              bene.push(...facHmo.hmos[index].enrolleeList[s].enrollees);
            }
            this.loading = false;
            this.beneficiaries = bene;
            const startIndex = 0 * 10;
            this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
            this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
          }
        }
      }
    }).catch(err => { console.log(err) });
  }
  getRole(beneficiary) {
    if (this.mselectedHMO.policyIDRegexFormat !== undefined) {
      let arrayOfRegexFormat = this.mselectedHMO.policyIDRegexFormat.split(';');
      for (let index = 0; index < arrayOfRegexFormat.length; index++) {
        const element = arrayOfRegexFormat[index];
        const itemRegexFormat = element.split('|');
        if (itemRegexFormat.length === 2) {
          var principalRegex = '^' + itemRegexFormat[0] + '$';
          var principalRegexFormat = RegExp(principalRegex);
          const beneficiaryRegex = '^' + itemRegexFormat[0] + itemRegexFormat[1] + '$';
          const beneficiaryRegexFormat = new RegExp(beneficiaryRegex);
          if (principalRegexFormat.test(beneficiary.filNo)) {
            return 'P';
          }
          if (beneficiaryRegexFormat.test(beneficiary.filNo)) {
            return 'D';
          }
        }
      }
    }
  }
  newHmo_show() {
    this.newHmo = !this.newHmo;
  }

  onBeneficiaryValueChange(e) {
    const facHmo = e;
    const index = facHmo.hmos.findIndex(x => x.hmo === this.selectedBeneficiary.id);
    if (index > -1) {
      if (facHmo.hmos[index].enrolleeList.length > 0) {
        const bene = [];
        for (let s = 0; s < facHmo.hmos[index].enrolleeList.length; s++) {
          this.selectedHMO = facHmo.hmos[index].hmo;
          bene.push(...facHmo.hmos[index].enrolleeList[s].enrollees);
        }
        this.loading = false;
        this.beneficiaries = JSON.parse(JSON.stringify(bene));
        const startIndex = 0 * 10;
        this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
        this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
        this.newBeneficiary = false;
      }
    }
  }

  findBeneficiaries(value) {
    const startIndex = 0 * 10;
    this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries.filter(x => (x.surname !== undefined && x.surname.toLowerCase().includes(value)) || (x.firstname !== undefined && x.firstname.toLowerCase().includes(value)))));
    this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
  }

  edit_show(value, i) {
    this.newBeneficiary = !this.newBeneficiary;
    value.id = this.selectedBeneficiary.id;
    value.index = i;
    this.selectedBeneficiary = value;
    this.selectedBeneficiary.type = (this.selectedBeneficiary.type !== undefined) ? this.removeWhiteSpace(this.selectedBeneficiary.type) : '';
    this.selectedBeneficiary.status = (this.selectedBeneficiary.status === 'active' || this.selectedBeneficiary.status === true) ? true : false;
    this.selectedBeneficiary.category = (this.selectedBeneficiary.category === undefined || this.selectedBeneficiary.status === null) ? '' : this.selectedBeneficiary.category;
    this.selectedBeneficiary.gender = (this.selectedBeneficiary.gender === undefined || this.selectedBeneficiary.gender === null) ? 'M' : this.selectedBeneficiary.gender;
    this.selectedBeneficiary.sponsor = (this.selectedBeneficiary.sponsor === undefined || this.selectedBeneficiary.sponsor === null) ? '' : this.selectedBeneficiary.sponsor;
    this.selectedBeneficiary.date = (this.selectedBeneficiary.date === undefined || this.selectedBeneficiary.date === null) ? new Date() : this.selectedBeneficiary.date;
  }

  removeWhiteSpace(value) {
    return value.replace(/\s/g, '');
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click();
  }

  onPaginateChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
  }
  newBeneficiary_click() {
    this.newBeneficiary = true;
    let _value = {
      id: this.selectedBeneficiary.id,
      firstname: '',
      index: '',
      surname: '',
      category: '',
      serial: '',
      sponsor: '',
      type: '',
      plan: '',
      gender: '',
      filNo: '',
      date: new Date(),
      status: ''
    }
    this.selectedBeneficiary = _value;
  }
  close_onClick(e) {
    this.newBeneficiary = false;
  }
}
