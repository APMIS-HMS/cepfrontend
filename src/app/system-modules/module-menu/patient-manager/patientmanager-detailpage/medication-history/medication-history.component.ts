import { Component, OnInit } from '@angular/core';
import Query from 'devextreme/data/query';
import { DxSchedulerComponent } from 'devextreme-angular';
import dataSource from 'devextreme/data/data_source';
// import 'devextreme-intl';
import { Service } from './history.service';

@Component({
  selector: 'app-medication-history',
  templateUrl: './medication-history.component.html',
   providers: [Service],
  styleUrls: ['./medication-history.component.scss']
})
export class MedicationHistoryComponent implements OnInit {
  status: string[]
  medicationHistory = [
    {
        "date": "11-12-2001",
        "drugs": "syrap tetrasyrup omega2 red syrup",
        "prescriber": "Sam Doe",
      }
  ]
    prescription = true;
    nonprescription = false;
    employees: string[];
    dataSource: any;
      constructor(service: Service) {
      
       this.status = ['discontinue'];
       this.dataSource = new dataSource({ 
           store: service.getTasks(), 
           group: "Assigned"
        });
        this.employees = service.getEmployees();
  
    }

  ngOnInit() {
  }
  /*onshowPrescription(){
    this.prescription= true;
    this.nonprescription = false;
  }
  onshownonPrescription() {
    this.prescription = false;
    this.nonprescription = true;
  }*/

}
