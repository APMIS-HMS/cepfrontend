import { Component, OnInit } from '@angular/core';
import { DxLookupModule } from 'devextreme-angular';
import dataSource from 'devextreme/data/data_source';
import { Service } from './dispense.service';


@Component({
  selector: 'app-dispense',
   providers: [Service],
  templateUrl: './dispense.component.html',
  styleUrls: ['./dispense.component.scss']
})
export class DispenseComponent implements OnInit {
  employees: string[];
    dataSource: any;
    billshow = false;
    hasPrescription = true;
    noPrescription = false;
    individualShow = true;
    corporateShow = false;
    internalShow = false;


  constructor(service: Service) {
       this.dataSource = new dataSource({ 
           store: service.getTasks(),  
           group: "Assigned"
        });
        this.employees = service.getEmployees();
   }

  ngOnInit() {
  }
  billToggle() {
    this.billshow = !this.billshow;
  }
  hasPrescriptionShow() {
    this.hasPrescription= true;
    this.noPrescription = false;
  }
  noPrescriptionShow() {
    this.noPrescription = true;
    this.hasPrescription = false;
  }
    onChange(param){
    switch(param){
      case 'Individual':
      this.individualShow = true;
      this.corporateShow = false;
      this.internalShow = false;
      break;
      case 'Corporate':
       this.individualShow = false;
      this.corporateShow = true;
      this.internalShow = false;
      break;
      case 'Internal':
      this.individualShow = false;
      this.corporateShow = false;
      this.internalShow = true;
      break;
    }
  }

}
