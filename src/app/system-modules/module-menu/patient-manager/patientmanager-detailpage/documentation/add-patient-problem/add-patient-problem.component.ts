import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patient-problem',
  templateUrl: './add-patient-problem.component.html',
  styleUrls: ['./add-patient-problem.component.scss']
})
export class AddPatientProblemComponent implements OnInit {

  problemFormCtrl: FormControl;
  statusFormCtrl: FormControl;
  noteFormCtrl: FormControl;
  filteredStates: any;

  mainErr = true;
  errMsg = 'you have unresolved errors';

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

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { 
    this.problemFormCtrl = new FormControl();
    this.filteredStates = this.problemFormCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterStates(name));

    this.statusFormCtrl = new FormControl();
    this.filteredStates = this.statusFormCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterStates(name));
  }

  ngOnInit() {
  }

  close_onClick() {
      this.closeModal.emit(true);
  }

  filterStates(val: string) {
    return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
               : this.states;
  }

}
