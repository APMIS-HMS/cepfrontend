import { Component, ViewChild, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-appointment',
    templateUrl: './appointment.component.html',
    styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

    currentDate: Date = new Date();

    clinicCtrl: FormControl;
    providerCtrl: FormControl;
    typeCtrl: FormControl;
    statusCtrl: FormControl;
    searchControl: FormControl = new FormControl();
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

    constructor() {
        this.clinicCtrl = new FormControl();
        this.filteredStates = this.clinicCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.providerCtrl = new FormControl();
        this.filteredStates = this.providerCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.typeCtrl = new FormControl();
        this.filteredStates = this.typeCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));

        this.statusCtrl = new FormControl();
        this.filteredStates = this.statusCtrl.valueChanges
            .startWith(null)
            .map(name => this.filterStates(name));
    }

    ngOnInit() {}

    filterStates(val: string) {
        return val ? this.states.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
                : this.states;
    }      
        
}
