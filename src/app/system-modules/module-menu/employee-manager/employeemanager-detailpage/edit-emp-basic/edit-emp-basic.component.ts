import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';

@Component({
  selector: 'app-edit-emp-basic',
  templateUrl: './edit-emp-basic.component.html',
  styleUrls: ['./edit-emp-basic.component.scss']
})
export class EditEmpBasicComponent implements OnInit {

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

			firstname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			lastname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			othernames: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			email: ['', [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
			// network: ['', [<any>Validators.minLength(2)]],
			status: ['', [<any>Validators.required]],
			dept: ['', [<any>Validators.required]],
			phone: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
		});
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
