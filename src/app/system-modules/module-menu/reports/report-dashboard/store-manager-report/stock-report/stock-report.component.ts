import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {

<<<<<<< HEAD
=======
  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');

>>>>>>> ab0a644967becfaf526976c70c7d6612dab07fb6
  activeTabIndex: number;

  constructor(private _router: Router) { }

  ngOnInit() {
    this.activeTabIndex = 0;
  }

  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
  }

}
