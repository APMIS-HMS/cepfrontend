import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ProductGridModel} from "../ProductGridModel";
import {Form, FormControl} from "@angular/forms";
import {InventoryService} from "../../../../../../services/facility-manager/setup";
import {ReportGeneratorService} from "../../../../../../core-ui-modules/ui-components/report-generator-service";
import * as _ from "lodash";
@Component({
    selector: 'product-grid-item',
    templateUrl: 'product-grid-item-component.html',
    styles: [`
        .marked {
            background-color: #fff6da;
        }

        div.product-suggestion-popup {
            z-index: 2100;
            position: absolute;
            width: 300px;
            background-color: white;
            box-shadow: 1px 2px 12px rgba(95, 95, 95, 0.5);
            padding: 0px;
            top: 30px;
            max-height: 450px;
            overflow-y: auto;
            min-height: 100px;

        }

        div.product-suggestion-popup .item {
            cursor: pointer;
            transition: all 300ms linear;
            padding: 5px 15px;
            font-size: 12px;
        }

        div.product-suggestion-popup .item:hover, div.product-suggestion-popup .item:focus {
            background-color: #c7dff9;
            font-weight: 400;

        }

        input[type=text].form-control, input[type].form-control {
            transition: all 100ms linear;
            padding: 7px 10px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            border: solid 1px #b9b9b9;
            box-shadow: 1px 1px 13px rgba(167, 167, 167, 0.4) inset;
        }

        input[type].form-control:hover, input[type].form-control:focus {
            border: solid 1px #99acb9;
            box-shadow: 1px 1px 13px rgba(150, 150, 150, 0.4) inset;
        }
    `]
})

export class ProductGridItemComponent implements OnInit {
    //lineCheck : FormControl =  new FormControl();
    isEditMode: boolean = false;
    isSelected: boolean = false;
    searching : boolean  = false;
  
    productName: FormControl  =  new FormControl();
    qtyToSend : FormControl  =  new FormControl(1);
    @Input() data: ProductGridModel;
    @Input() storeId: string;
    @Output() onRemove : EventEmitter<ProductGridModel> =  new EventEmitter<ProductGridModel>();
    searchedProducts : ProductGridModel[] = [];
    constructor(private inventoryService: InventoryService,private locService: ReportGeneratorService) {
    }

    ngOnInit() {
        this.productName.valueChanges
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe(x => {
            this.data.productName  = x;
            // perform a search Here
             
                if((!_.isEmpty(x) && x.length>2)  &&  !_.isEmpty(this.storeId))
                {
                    this.findProductInStore(x);
                }
                else{
                    console.log("Empty value")
                }
        });
        this.qtyToSend.valueChanges.subscribe(x => {
            this.data.qtyToSend  = x  ;
        });
    }

    makeEditable() {
        this.isEditMode = true;
        this.isSelected  = false;
        console.log(this.isEditMode);
    }
    resetEditMode()
    {
        this.isEditMode = false;
    }

    toggleSelect() {
        this.isSelected = !this.isSelected;
    }
    findProductInStore(searchText: string) {
        // 

        const selectedStore: string = this.storeId;
        
        if (_.isEmpty(selectedStore)) {
            alert("Select a Store");
            return;
        }
        this.searching   = true;
        this.inventoryService.findFacilityProductList(
            {
                query: {
                    facilityId: this.locService.facilityId,
                    storeId: selectedStore,
                    searchText: searchText,
                    limit: 20,
                    skip: 0


                }
            }
        ).then(x => {
            this.searching  = false;
            this.searchedProducts  = x.data;
            console.log(x, "Inventory Service Search Result");
        }, x => {
            this.searching  = false;
            console.log("Error on Server!", x);
        });


    }
    itemClicked(item  : ProductGridModel)
    {
        // emit an event here
        
        // assign the selected product line to the selected product
        this.data  = item;
        
        // close the search suggested items
        this.searchedProducts  =[];
        
    }
    removeItem(item : ProductGridModel)
    {
       this.onRemove.emit(item);
    }
   
}/*
data:
availableQuantity: 500
price: 40
productConfiguration:
isBase: true
name: "Tablet"
packId: "5ab0ea0ade9b2431b88b50ad"
size: 1
_id: "5b7581ab2a8f7034b42a4488"
__proto__: Object
productId: "5abc02a5c8ac614026973932"
productName: "Ibuprofen 50 MG/ML Topical Cream [Proflex Pain Relief]"
qtyToSend: 80
reOrderLevel: 0
transactions: [{…}]

*/