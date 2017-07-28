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

    result = [];
    constructor(private fb: FormBuilder,
        private _socketService: SocketService,
        private _restService: RestService) {
        this._rest = _restService.getService(this.url);
        this._socket = _socketService.getService(this.url);
       
    }

    ngOnInit() {
        this.form = this.fb.group({ searchtext: [''] });

        this.form.controls['searchtext'].valueChanges
            .distinctUntilChanged()
            .debounceTime(100)
            .switchMap((term) => Observable.fromPromise(this.filter({ query: this.query }, this.isRest)))
            .subscribe((payload: any) => {
                this.result = payload.data;
                console.log(this.result);
            });
    }

    filter(query: any, isRest: boolean) {
        if (isRest) {
            return this._socket.find(query);
        } else {
            return this._rest.find(query);
        }
    }

    onSelectedItem(value){
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

}
