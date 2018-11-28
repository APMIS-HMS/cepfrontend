import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-apmis-search',
  templateUrl: './apmis-search.component.html',
  styleUrls: ['./apmis-search.component.scss']
})
export class ApmisSearchComponent implements OnInit {

  apmisSearch:FormControl = new FormControl();
  showSearch = false;

  constructor() { }

  ngOnInit() {
  }

  toggler_click(){
    this.showSearch = !this.showSearch;
  }

}
