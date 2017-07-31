import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SocketService, RestService } from './../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'apmis-simdilized-lookup',
    templateUrl: './simdilized-lookup.component.html',
    styleUrls: ['./simdilized-lookup.component.scss']
})
export class SimdilizedLookupComponent implements OnInit {
    @Input() displayKey = "";
    @Input() innerValue = "";
    @Input() url = "";
    @Input() query = {};
    @Input() isRest = false;
    @Output() selectedItem = new EventEmitter();
    public _socket;
    private _rest;
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

        // this.form.controls['searchtext'].valueChanges
        //     .distinctUntilChanged()
        //     .debounceTime(100)
        //     .switchMap((term) => this.filter({ query: this.query }, this.isRest))
        //     .subscribe((payload: any) => {
        //         console.log(this.query);
        //         console.log(this.isRest);
        //         this.result = payload;
        //         console.log(this.result);
        //     });

        this.form.controls['searchtext'].valueChanges.subscribe(value => {
            console.log(this.displayKey);
            this.cuDropdownLoading = true;
            this.filter({ query: this.query }, this.isRest).then(filteredValue => {
                this.cuDropdownLoading = false;
                this.results = filteredValue;
            })
                .catch(err => {
                    this.cuDropdownLoading = false;
                    console.log(err);
                });
        });
    }

    filter(query: any, isRest: boolean) {
        if (isRest) {
            return this._socket.find(query);
        } else {
            return this._rest.find(query);
        }
    }

    onSelectedItem(value) {
        this.form.controls['searchtext'].setValue(value[this.innerValue]);
        this.selectedItem.emit(value);
    }

    onDisplayText() {
        console.log(this.innerValue);
    }

    focusSearch() {
        this.showCuDropdown = !this.showCuDropdown;
    }

    focusOutSearch() {
        setTimeout(() => {
            this.showCuDropdown = !this.showCuDropdown;
        }, 300);
    }

}
