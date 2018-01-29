import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  forwardRef
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator
} from "@angular/forms";
import {
  FacilitiesService,
  FacilitiesServiceCategoryService
} from "./../../services/facility-manager/setup/index";
import { SocketService, RestService } from "./../../feathers/feathers.service";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "apmis-lookup",
  templateUrl: "./apmis-lookup.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ApmisLookupComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ApmisLookupComponent),
      multi: true
    }
  ],
  styleUrls: ["./apmis-lookup.component.scss"]
})
export class ApmisLookupComponent
  implements OnInit, ControlValueAccessor, Validator {
  @Input() displayKey = "";
  @Input() url = "";
  @Input() placeholder = "";
  @Input() query = {};
  @Input() imgObj = "";
  @Input() otherKeys = [];
  @Input() isSocket = false;
  @Input() multipleKeys = false;
  @Input() displayImage = false;
  @Output() selectedItem = new EventEmitter();
  public _socket;
  public _rest;
  public valueString = "";
  public valueParseError: boolean;
  public data: any;
  searchText = "";
  showCuDropdown = false;
  cuDropdownLoading = false;
  form: FormGroup;
  selectedValue: any = {};
  baseUrl: any;
  imgError = false;
  results = [];
  constructor(
    private fb: FormBuilder,
    private _socketService: SocketService,
    private _restService: RestService,
    private facilitiesService: FacilitiesService,
    private facilityServiceCategory: FacilitiesServiceCategoryService
  ) {}

  ngOnInit() {
    this._rest = this._restService.getService(this.url);
    this._socket = this._socketService.getService(this.url);
    this.baseUrl = this._restService.HOST;
    this.form = this.fb.group({ searchtext: [""] });
    console.log(this.query);
    // this.facilityServiceCategory.find(this.query).then(
    //   payload => {
    //     console.log(payload);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
    this.form.controls["searchtext"].valueChanges
    .debounceTime(200)
    .distinctUntilChanged()
    .switchMap(value => this.filter({ query: this.query }, this.isSocket))
    .subscribe((payload: any) => {
      console.log(payload)

        this.cuDropdownLoading = false;
         if (payload !== undefined && payload.data !== undefined) {
            this.results = payload.data;
        } else {
            this.results = payload;
        }
    });
  }
  getImgUrl(item) {
    const splitArray = this.imgObj.split(".");
    let counter = 0;
    splitArray.forEach((obj, i) => {
      if (item[obj] != undefined) {
        item = item[obj];
      } else {
        item = "undefined";
      }
      counter++;
    });
    if (counter == splitArray.length) {
      if (item == "undefined") {
        let imgUri = undefined;
        return imgUri;
      } else {
        let imgUri = this.baseUrl + "/" + item;
        //this.imgError = false;
        return imgUri;
      }
    }
  }

  filter(query: any, isSocket: boolean) {
    this.cuDropdownLoading = true;
    console.log(query);
    if (isSocket) {
      return this._socket.find(query);
    } else {
      return this._rest.find(query);
    }
  }
  getName(item, displayKey: String) {
    const splitArray = displayKey.split(".");
    let counter = 0;
    splitArray.forEach((obj, i) => {
      item = item[obj];
      counter++;
    });
    if (counter === splitArray.length) {
      return item;
    }
  }
  getOtherKeyValues(item) {
    var otherValues = [];
    let mainCounter = 0;
    let objItem = item;
    this.otherKeys.forEach((key, i) => {
      var splitArray = key.split(".");
      let counter = 0;
      mainCounter++;
      splitArray.forEach((obj, i) => {
        if (objItem[obj] != undefined) {
          objItem = objItem[obj];
        } else {
          objItem = "";
        }
        counter++;
      });
      if (counter == splitArray.length) {
        var checkDate = new Date(objItem);
        let NaN = "" + checkDate.getDate().toString() + "";
        if (NaN == "NaN") {
          otherValues.push(objItem);
        } else {
          let d = new Date(objItem);
          otherValues.push(d.toDateString());
        }
        objItem = item;
      }
    });
    if (mainCounter == this.otherKeys.length) {
      return otherValues;
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
    return !this.valueParseError
      ? null
      : {
          valueParseError: {
            valid: false
          }
        };
  }

  // not used, used for touch input
  public registerOnTouched() {}

  // change events from the textarea
  public onChange(event) {
    // get value from text area
    const newValue = event.target.value;

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
  public propagateChange = (_: any) => {};
}
