import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';

@Component({
  selector: 'app-facility-basicinfo-edit',
  templateUrl: './facility-basicinfo-edit.component.html',
  styleUrls: ['./facility-basicinfo-edit.component.scss']
})
export class FacilityBasicinfoEditComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = "";

  public facilityForm1: FormGroup;
	userSettings: any = {
		geoCountryRestriction: [GEO_LOCATIONS],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	};

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.facilityForm1 = this.formBuilder.group({

			facilityname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			facilityemail: ['', [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
			facilitywebsite: ['', [<any>Validators.required, <any>Validators.pattern(WEBSITE_REGEX)]],
			// network: ['', [<any>Validators.minLength(2)]],
			address: ['', [<any>Validators.required]],
			cac: ['', [<any>Validators.required]],
			facilitystreet: ['', [<any>Validators.required]],
			facilitycity: ['', [<any>Validators.required]],
			facilitystate: ['', [<any>Validators.required]],
			facilitycountry: ['', [<any>Validators.required]],
			facilityphonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
		});
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
