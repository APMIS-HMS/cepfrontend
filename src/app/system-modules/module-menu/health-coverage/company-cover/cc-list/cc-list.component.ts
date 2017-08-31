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
  stateCtrl: FormControl;
  filteredStates: any;

  states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

  constructor(private formBuilder: FormBuilder) { 
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterStates(name));
  }

  ngOnInit() {
    // this.frmNewBeneficiary = this.formBuilder.group({
    //   name: ['', [Validators.required]],
    //   address: ['', [Validators.required]],
    //   email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
    //   phone: ['', [<any>Validators.required]],
    //   principalGender: ['', [<any>Validators.required]],
    //   principalstatus: ['', [<any>Validators.required]],
    //   principalEmpID: ['', [<any>Validators.required]]
    // });
  }

  show_beneficiaries() {
    this.showBeneficiaries.emit(true);
  }

  addCompany_show(){
    this.addCompany = !this.addCompany;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  filterStates(val: string) {
    return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
               : this.states;
  }


}