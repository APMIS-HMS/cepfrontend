import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductPackSize } from '../../../store-utils/global';
import { ArrayFunctionHelper } from 'app/shared-module/helpers/array-function-helper';

@Component({
  selector: 'app-apmis-search-result',
  templateUrl: './apmis-search-result.component.html',
  styleUrls: ['./apmis-search-result.component.scss']
})
export class ApmisSearchResultComponent implements OnInit {

  @Input() PackSizes;
  selectedIndex;
  checked = false;
  selectedPack: ProductPackSize[] = [];
  apmisSearchResult: FormControl = new FormControl();


  constructor(private arrayFunc: ArrayFunctionHelper) { }

  ngOnInit() {
  }
  onSelect(index, data) {
    this.PackSizes[index].checked = !this.PackSizes[index].checked;
    // create an for selected pack types
    // if (this.selectedPack.length > 0) {
    //   const packIndex = this.arrayFunc.getIndexofObjectInArray(this.selectedPack, data._id);
    //   console.log(packIndex);
    // } else {
    //   this.selectedPack.push(data);
    // }
    //console.log(this.selectedPack);
  }
}
