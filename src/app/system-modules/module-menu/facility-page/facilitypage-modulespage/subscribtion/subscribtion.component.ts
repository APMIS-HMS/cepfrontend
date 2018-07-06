import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-subscribtion',
  templateUrl: './subscribtion.component.html',
  styleUrls: ['./subscribtion.component.scss']
})
export class SubscribtionComponent implements OnInit {

  mainErr = true;
  errMsg = "you have unresolved errors";
  public frmSubscribe: FormGroup;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  subscribe_click() {
    this.frmSubscribe = this.formBuilder.group({
      plan: ["", [<any>Validators.required]],
      deptAlias: ["", [<any>Validators.minLength(2)]],
      deptDesc: ["", [<any>Validators.minLength(10)]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
