import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductPackSize } from '../../../store-utils/global';

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


  constructor() { }

  ngOnInit() {
  }
  onSelect(index, data) {
    this.PackSizes[index].checked = !this.PackSizes[index].checked;
    // create an array of the selected packs by the user
    this.selectedPack.push(data);
    if (this.selectedPack.length > 1) {
      // set the base text 
    }
    console.log(this.selectedPack);
  }
}
