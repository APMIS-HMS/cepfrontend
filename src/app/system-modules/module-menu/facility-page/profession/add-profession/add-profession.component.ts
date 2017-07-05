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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_profession = this.formBuilder.group({
      profession: ['', [<any>Validators.required]],
      level: ['', [<any>Validators.required]],
  });
}

 close_onClick() {
    this.closeModal.emit(true);
  }
   inputs = [{value: "target.value"}];
  addInput()  {
    this.inputs.push({value: ''});
  }

}
