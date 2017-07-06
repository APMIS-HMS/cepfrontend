import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-profession',
  templateUrl: './add-profession.component.html',
  styleUrls: ['./add-profession.component.scss']
})
export class AddProfessionComponent implements OnInit {

  public frm_profession: FormGroup;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  inputs = [{ value: 'target.value' }];
  professionForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_profession = this.formBuilder.group({
      profession: ['', [<any>Validators.required]],
      level: ['', [<any>Validators.required]],
    });
    this.addNewProfessionArray();
  }
  addNewProfessionArray() {
    this.professionForm = this.formBuilder.group({
      'professionArray': this.formBuilder.array([
        this.formBuilder.group({
          name: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
          'readonly': [false],
        })
      ])
    });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

  addInput() {
    this.inputs.push({ value: '' });
  }

}
