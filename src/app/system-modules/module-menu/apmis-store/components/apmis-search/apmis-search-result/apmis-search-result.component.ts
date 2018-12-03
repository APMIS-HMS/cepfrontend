import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ApmisFilterBadgeService } from './../../../../../../services/tools/apmis-filter-badge.service';

@Component({
  selector: 'app-apmis-search-result',
  templateUrl: './apmis-search-result.component.html',
  styleUrls: ['./apmis-search-result.component.scss']
})
export class ApmisSearchResultComponent implements OnInit {

  @Input() data: any = <any>[];
  @Output() onSelectedItems = new EventEmitter();
  @Output() onCreateItem = new EventEmitter();
  bindableData: any = <any>[];
  apmisSearchResult: FormControl = new FormControl();
  selectedItems: any = <any>[];
  constructor(private _locker: CoolLocalStorage, private apmisFilterBadgeService: ApmisFilterBadgeService) { }

  ngOnInit() {
    this.selectedItems = <any>this._locker.getObject('APMIS_SELECTED_ITEMS');
    this.selectedItems = (this.selectedItems === null) ? [] : this.selectedItems;
    this.bindableData = JSON.parse(JSON.stringify(this.data));

    this.apmisFilterBadgeService.storage$.subscribe(status => {
      if (status) {
        this._locker.setObject('APMIS_SELECTED_ITEMS', []);
        this.bindableData = JSON.parse(JSON.stringify(this.data));
      }
    });


    this.apmisSearchResult.valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        this.bindableData = JSON.parse(JSON.stringify(this.data));
        this.selectedItems.map(x => {
          this.bindableData.map(y => {
            if (y.id === x.id) {
              y.isSelected = true;
            }
          });
        });
        const data = this.bindableData.filter(x => x.label.toLowerCase().includes(value.toLowerCase()));
        if (data.length > 0) {
          this.bindableData = data;
        } else if (this.apmisSearchResult.value.toString() === '') {
          this.bindableData = JSON.parse(JSON.stringify(this.data));
        } else {
          this.bindableData = data;
        }
      } else {
        if (this.selectedItems === null || this.selectedItems.length === 0) {
          this.bindableData = JSON.parse(JSON.stringify(this.data));
        }
      }
    });
  }

  onToggleItem(item) {
    item.isSelected = (item.isSelected === undefined) ? false : item.isSelected;
    item.isSelected = !item.isSelected;
    if (item.isSelected) {
      const checkExistingItem = this.selectedItems.filter(x => x.id === item.id);
      if (checkExistingItem.length === 0) {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems.map((x, index) => {
        if (x.id === item.id) {
          this.selectedItems.splice(index, 1);
        }
      });
    }
    this._locker.setObject('APMIS_SELECTED_ITEMS', this.selectedItems);
    const _selectedItems = <any>this._locker.getObject('APMIS_SELECTED_ITEMS');
    this.onSelectedItems.emit(this.selectedItems);
  }

  onCreateNewItem() {
    this.onCreateItem.emit(this.apmisSearchResult.value);
  }
  // onSelect(index, data) {
  //   let baseIndex;
  //     this.PackSizes[index].checked = !this.PackSizes[index].checked;
  //   // add selected pack type to array collection
  //   if (this.selectedPack.length < 1) {
  //     this.selectedPack.push(data);
  //     // find element in packSizes array to modify
  //       baseIndex = this.arrayFunc.getIndexofObjectInArray(this.PackSizes, data._id);
  //       // we modify the base pack
  //       // this.PackSizes[baseIndex].name = `${data.name} - Base Unit`;
  //   } else {
  //       const packIndex = this.arrayFunc.getIndexofObjectInArray(this.selectedPack, data._id);
  //     if (packIndex !== undefined) {
  //       // if pack type is unchecked, remove from array collection
  //         this.selectedPack.splice(packIndex, 1);
  //         // this.PackSizes[baseIndex].name = data.name;
  //     } else {
  //       this.selectedPack.push(data);
  //     }
  //   }



  // }
}
