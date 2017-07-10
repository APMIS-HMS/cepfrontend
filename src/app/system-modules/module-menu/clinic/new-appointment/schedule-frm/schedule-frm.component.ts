import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
// import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

// const now = new Date();

@Component({
    selector: 'app-schedule-frm',
    templateUrl: './schedule-frm.component.html',
    styleUrls: ['./schedule-frm.component.scss']
})

export class ScheduleFrmComponent implements OnInit {

    mainErr = true;
    errMsg = 'you have unresolved errors';

    //   model: NgbDateStruct;
    //   dateVal: {year: number, month: number};

    //   selectToday() {
    //     this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
    //   }

    filteredStates: any;
    patient: FormControl;
    clinic: FormControl;
    provider: FormControl;
    type: FormControl;
    category: FormControl;
    date = new Date(); // FormControl = new FormControl();
    reason: FormControl = new FormControl();

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

    constructor() {
        this.patient = new FormControl();
        this.filteredStates = this.patient.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.clinic = new FormControl();
        this.filteredStates = this.clinic.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.provider = new FormControl();
        this.filteredStates = this.provider.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.type = new FormControl();
        this.filteredStates = this.type.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.category = new FormControl();
        this.filteredStates = this.category.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));
    }

    ngOnInit() { }

    filterStates(val: string) {
        return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
            : this.states;
    }
    clickMe(){
        console.log('you clicked me');
    }

}
