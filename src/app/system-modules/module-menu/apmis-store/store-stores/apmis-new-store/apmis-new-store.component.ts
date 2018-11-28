import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-apmis-new-store',
  templateUrl: './apmis-new-store.component.html',
  styleUrls: ['./apmis-new-store.component.scss']
})
export class ApmisNewStoreComponent implements OnInit {

  tab_store = true;
  newStoreForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.newStoreForm = this.fb.group({
      'majorLoc': [' ', Validators.required ],
      'minorLoc': [' ', Validators.required ],
      'storeName': [' ', Validators.required ],
      'productType': [' ', Validators.required ],
      'desc': [' ', Validators.required ],
      'dispense': [' ', Validators.required ],
      'recievePurchase': [' ', Validators.required ]
    });
  }

  tab_click(tab){
    if(tab==='store'){
      this.tab_store = true;
    }
  } 

}
