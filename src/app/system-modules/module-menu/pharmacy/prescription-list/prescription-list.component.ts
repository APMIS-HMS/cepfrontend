import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.scss']
})
export class PrescriptionListComponent implements OnInit {
  status: string[];
  prescriptionLists = [
    {
      "date": "11-12-2017",
      "patient": "rita dominic",
      "unit": "clinic unit",
      "priority": "---",
      "prescriber": "Dr. Afolabi", 
    },
      {
      "date": "11-12-2017",
      "patient": "rita dominic",
      "unit": "clinic unit",
      "priority": "---",
      "prescriber": "Dr. Afolabi", 
    },
      {
      "date": "11-12-2017",
      "patient": "rita dominic",
      "unit": "clinic unit",
      "priority": "---",
      "prescriber": "Dr. Afolabi", 
    }
  ]

  constructor() {
    this.status = ['assessed'];
   }

  ngOnInit() {
  }

}
