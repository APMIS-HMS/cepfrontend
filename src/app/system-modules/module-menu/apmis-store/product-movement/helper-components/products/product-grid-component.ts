import {
    Component,
    OnInit,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    ViewChildren,
    QueryList,
    ElementRef
} from '@angular/core';
import  * as  _ from "lodash";
import {ProductGridModel} from "../ProductGridModel";
import {FormControl} from "@angular/forms";
import {ProductGridItemComponent} from "./product-grid-item-component";

@Component({
    selector: 'product-grid',
    templateUrl: 'product-grid.component.html',
    encapsulation : ViewEncapsulation.None
})
export class ProductGridComponent implements OnInit {
    checkAll : FormControl  =  new FormControl(false);
    @Input() products : ProductGridModel[] = [];
    @Input() selectedStore : string  = "";
    @Output() onItemSelected : EventEmitter<any[]> =  new EventEmitter<any[]>();
    @Output() onItemRemoved : EventEmitter<any>  =  new EventEmitter<any>();
    @ViewChildren("item") items : QueryList<ProductGridItemComponent>  =  new QueryList<ProductGridItemComponent>();
    constructor() {
    }
    ngOnInit() {
       // console.log(this.checkAll.value);
        this.checkAll.valueChanges.subscribe(
            x => {
                this.items.forEach(i => {
                   i.isSelected = x;
                })
            }
        )
    }
    // Manage double-click on each grid item
    manageEditting(cmpRef : ProductGridItemComponent )
    {
        
        // remove selection on others except this one
      this._resetEditable(cmpRef);
      console.log(cmpRef, cmpRef.isEditMode)
        if(cmpRef.isEditMode)
        {
            cmpRef.resetEditMode();
        }
           
        else
        {
            cmpRef.makeEditable();
        }
           
        
    }
    private _resetEditable(except : ProductGridItemComponent = null)
    {
        this.items.forEach(x => {
            if(_.isNil(except))
            {
                x.resetEditMode();
            }
            else{
                if(except != x)
                {
                   x.resetEditMode();
                }
            }

        });
    }
    addNewItem()
    {
       this._resetEditable();
        // This creates an Empty ProductGridModel 
        const pm : ProductGridModel = {
            productName : "[New Line Item]",
            qtyToSend : 1,
            availableQuantity : 0,
            unitOfMeasure : "",
            qtyOnHold  : 0,
            price  : 0,
            totalQuantity : 0,
            size  : 0,
            reorderLevel  : 0,
            productId : "",
            _id  : null
        };
        this.products.push(pm);
        // make the component editable at the index of data
        console.log(this.products, this.items);
        const cmp  : ProductGridItemComponent   =  this.items[this.products.length-1];
       // cmp.makeEditable();
        console.log(cmp);
    }
    removeItem(data, cmRef : ProductGridComponent)
    {
        // dispose  the component
        const index  = _.findIndex(this.products, x =>{
            return x == data;
        });
        if( index > -1)
        {
            this.products.splice(index, 1);
        }
    }
}
/*
* Product Data structure
        availableQuantity: 625
        price: 20
        productConfiguration:
        isBase: true
        name: "Tablet"
        packId: "5ab0ea0ade9b2431b88b50ad"
        size: 1
        _id: "5b7586822a8f7034b42a44d0"
        __proto__: Object
        productId: "5abc02a5c8ac61402697441a"
        productName: "Metronidazole 400 MG Oral Tablet [Vaginyl]"
        reOrderLevel: 0
* */