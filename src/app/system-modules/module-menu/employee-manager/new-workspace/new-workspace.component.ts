import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-workspace',
  templateUrl: './new-workspace.component.html',
  styleUrls: ['./new-workspace.component.scss']
})
export class NewWorkspaceComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewEmp1: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewEmp1 = this.formBuilder.group({

        majorLoc: ['', []],
        minorLoc: ['', []]

    });
  }

  close_onClick() {
      this.closeModal.emit(true);
  }

}
