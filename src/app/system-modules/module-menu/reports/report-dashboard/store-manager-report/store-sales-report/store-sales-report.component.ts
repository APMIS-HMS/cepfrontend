import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-sales-report',
  templateUrl: './store-sales-report.component.html',
  styleUrls: ['./store-sales-report.component.scss']
})
export class StoreSalesReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');

  constructor(private _router: Router) { }

  ngOnInit() {
  }

}
