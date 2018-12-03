import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductPackSize } from '../../../store-utils/global';
import { ArrayFunctionHelper } from 'app/shared-module/helpers/array-function-helper';
import { ProductService } from './../../../../../../services/facility-manager/setup/index';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-apmis-search-result',
  templateUrl: './apmis-search-result.component.html',
  styleUrls: ['./apmis-search-result.component.scss']
})
export class ApmisSearchResultComponent implements OnInit, OnDestroy, OnChanges {

  @Input() PackSizes;
  packs = [];
  selectedIndex;
  selectedPack: ProductPackSize[] = [];
  apmisSearchResult: FormControl = new FormControl();
  subscription: Subscription;
  tagOptionViewState: string;
  packSelected = false;

  constructor(private productService: ProductService,
    private arrayFunc: ArrayFunctionHelper) { }

  ngOnInit() {
    this.subscription = this.productService.getPackSizeViewState().subscribe((data: string) => {
      this.tagOptionViewState = data;
      // this.tagOptionViewState = data;
      // console.log(data);
      if (data === 'open') {
         // this.PackSizes[0].checked = true;
      } else {
        this.productService.sendSelectedProductPackSize(this.selectedPack);
      }
    });
    // TODO: Get base name, query index to set the base unit label
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['PackSizes'] !== null) {
      this.packs = this.PackSizes;
      console.log(this.packs);
    }
  }
  onSelect(index, data) {
    let baseIndex;
      this.PackSizes[index].checked = !this.PackSizes[index].checked;
    // add selected pack type to array collection
    if (this.selectedPack.length < 1) {
      this.selectedPack.push(data);
      // find element in packSizes array to modify
        baseIndex = this.arrayFunc.getIndexofObjectInArray(this.PackSizes, data._id);
        // we modify the base pack
        // this.PackSizes[baseIndex].name = `${data.name} - Base Unit`;
    } else {
        const packIndex = this.arrayFunc.getIndexofObjectInArray(this.selectedPack, data._id);
      if (packIndex !== undefined) {
        // if pack type is unchecked, remove from array collection
          this.selectedPack.splice(packIndex, 1);
          // this.PackSizes[baseIndex].name = data.name;
      } else {
        this.selectedPack.push(data);
      }
    }



  }
  ngOnDestroy() {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }
}
