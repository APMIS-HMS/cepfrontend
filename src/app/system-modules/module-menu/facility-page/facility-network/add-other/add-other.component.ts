import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-other',
  templateUrl: './add-other.component.html',
  styleUrls: ['./add-other.component.scss']
})
export class AddOtherComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = "";
  public facilityForm1: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.facilityForm1 = this.formBuilder.group({
			facilitySearch: ['', []]
		});
  }
  close_onClick() {
		this.closeModal.emit(true);
	}

}
