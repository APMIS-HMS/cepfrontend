import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-recieve-payment',
  templateUrl: './recieve-payment.component.html',
  styleUrls: ['./recieve-payment.component.scss']
})
export class RecievePaymentComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  public frmRecieve: FormGroup;
  recieve = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmRecieve = this.formBuilder.group({
      paytype: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      payfor: ['', [<any>Validators.required]],
      invoiceNo: ['', [<any>Validators.required]],
      comment: ['', [<any>Validators.required]]
    });
  }

  recieve_show(){
    this.recieve = !this.recieve;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

}
