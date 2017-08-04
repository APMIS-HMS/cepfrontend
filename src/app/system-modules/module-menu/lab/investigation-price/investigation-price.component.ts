import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-investigation-price',
  templateUrl: './investigation-price.component.html',
  styleUrls: ['./investigation-price.component.scss']
})
export class InvestigationPriceComponent implements OnInit {

  apmisLookupUrl = "";
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey ="";

  pricing_view = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewPrice: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewPrice = this.formBuilder.group({
      price: ['', [Validators.required]],
      investigation: ['', [Validators.required]],
    });
  }

  apmisLookupHandleSelectedItem(value){

  }
  pricing_show() {
    this.pricing_view = !this.pricing_view;
  }
  
  close_onClick(message: boolean): void {
    
  }
}

