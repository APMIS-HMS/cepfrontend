import { Component, OnInit, EventEmitter, Output, Input, ElementRef, forwardRef } from '@angular/core';
import {
    FormGroup, FormControl, FormBuilder,
    Validators, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validator
} from '@angular/forms';
import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'apmis-lookup',
    templateUrl: './apmis-lookup.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ApmisLookupComponent),
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ApmisLookupComponent),
            multi: true,
        }],
    styleUrls: ['./apmis-lookup.component.scss']
})
export class ApmisLookupComponent implements OnInit, ControlValueAccessor, Validator {
    @Input() displayKey = "";
    @Input() url = "";
    @Input() query = {};
    @Input() isRest = false;
    @Output() selectedItem = new EventEmitter();
    public _socket;
    private _rest;
    private valueString = "";
    private valueParseError: boolean;
    private data: any;
    searchText = '';
    showCuDropdown: boolean = false;
    cuDropdownLoading: boolean = false;
    form: FormGroup;
    selectedValue: any = {};

    results = [];
    constructor(private fb: FormBuilder,
        private _socketService: SocketService,
        private _restService: RestService) { }

    ngOnInit() {
        this._rest = this._restService.getService(this.url);
        this._socket = this._socketService.getService(this.url);
        this.form = this.fb.group({ searchtext: [''] });
        console.log(this.query);
        console.log(this.url);
        console.log(this.isRest);
        this.cuDropdownLoading = true;
        this.form.controls['searchtext'].valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
    .switchMap((value) =>{
Observable.of(this.filter({ query: this.query }, this.isRest))
    })
                 

            .subscribe((payload: any) => {
                this.cuDropdownLoading = false;
                this.results = payload;
            });

        // this.form.controls['searchtext'].valueChanges.subscribe(value => {
        //     console.log(this.displayKey);
        //     console.log(this.query);
        //     
        //     this.filter({ query: this.query }, this.isRest).then(filteredValue => {
        //         this.cuDropdownLoading = false;
        //         this.results = filteredValue;
        //     })
        //         .catch(err => {
        //             this.cuDropdownLoading = false;
        //             console.log(err);
        //         });
        // });
    }

    filter(query: any, isRest: boolean) {
        if (isRest) {
            return this._socket.find(query);
        } else {
            return this._rest.find(query);
        }
    }

    onSelectedItem(value) {
        this.selectedItem.emit(value);
    }

    focusSearch() {
        this.showCuDropdown = !this.showCuDropdown;
    }

    focusOutSearch() {
        setTimeout(() => {
            this.showCuDropdown = !this.showCuDropdown;
        }, 300);
    }

    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.data = obj;
            this.valueString = this.data;
        }
    }

    // registers 'fn' that will be fired wheb changes are made
    // this is how we emit the changes back to the form
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    public validate(c: FormControl) {
        return (!this.valueParseError) ? null : {
            valueParseError: {
                valid: false,
            },
        };
    }

    // not used, used for touch input
    public registerOnTouched() { }

    // change events from the textarea
    private onChange(event) {

        // get value from text area
        let newValue = event.target.value;

        try {
            this.data = newValue;
            this.valueParseError = false;
        } catch (ex) {
            // set parse error if it fails
            this.valueParseError = true;
        }

        // update the form
        this.propagateChange(this.data);
    }

    // the method set in registerOnChange to emit changes back to the form
    private propagateChange = (_: any) => { };

}
