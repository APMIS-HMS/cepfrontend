import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

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
