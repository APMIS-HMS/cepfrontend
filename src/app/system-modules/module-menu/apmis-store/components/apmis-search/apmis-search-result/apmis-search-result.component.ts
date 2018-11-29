import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductPackSize } from '../../../store-utils/global';

@Component({
  selector: 'app-apmis-search-result',
  templateUrl: './apmis-search-result.component.html',
  styleUrls: ['./apmis-search-result.component.scss']
})
export class ApmisSearchResultComponent implements OnInit, OnChanges {

  @Input() PackSizes;
  packs = [];
  apmisSearchResult: FormControl = new FormControl();
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['PackSizes'] != null ) {
        console.log(this.PackSizes);
    }
  }

}
