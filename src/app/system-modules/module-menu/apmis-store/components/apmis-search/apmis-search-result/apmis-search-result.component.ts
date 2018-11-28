import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-apmis-search-result',
  templateUrl: './apmis-search-result.component.html',
  styleUrls: ['./apmis-search-result.component.scss']
})
export class ApmisSearchResultComponent implements OnInit {


  apmisSearchResult:FormControl = new FormControl();
  constructor() { }

  ngOnInit() {
  }

}
