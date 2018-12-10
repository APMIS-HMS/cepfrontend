import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ReportGeneratorService} from "../../../../../core-ui-modules/ui-components/report-generator-service";
import * as _ from "lodash";
import {InventoryService, StoreService} from "../../../../../services/facility-manager/setup";
import {ProductGridModel} from "../helper-components/ProductGridModel";

@Component({
    selector: 'app-outbound-requisition',
    templateUrl: './outbound-requisition.component.html',
    styleUrls: ['./outbound-requisition.component.scss']
})
export class OutboundRequisitionComponent implements OnInit {

    check: FormControl = new FormControl();
    storeLocation: FormControl = new FormControl();
    storeName: FormControl = new FormControl();
    
    data : ProductGridModel[] = [];
    
    locations: any[] = [];// we have to cache all stores in the selected location so that we don't hit the server for every selection
    stores: any[] = []; // we have to cache all products in the selected store for reuse
    activeStoreObj: any = null;
    activeLocationObj: any = null;

    constructor(private locService: ReportGeneratorService,
                private storeService: StoreService,
                private inventoryService: InventoryService
    ) {
        
        
    }

    ngOnInit() {
        this.getLocations();
        this.data   = [
            {
                _id  : _.uniqueId("000-0"),
                availableQuantity : 100,
                unitOfMeasure : "tablet",
                productId  :"0001",
                productName  : "Oral Tablet [Vaginyl]",
                price : 40.00,
                qtyOnHold  : 30,
                reorderLevel:10,
                size : 1,
                totalQuantity : 130,
                qtyToSend : 30
            },
            {
                _id  : _.uniqueId("000-1"),
                availableQuantity : 60,
                unitOfMeasure : "Capsules",
                productId  :"0002",
                productName  : "Amozyl Capsule",
                price : 240.00,
                qtyOnHold  : 10,
                reorderLevel:10,
                size : 1,
                totalQuantity : 70,
                qtyToSend : 5
            },
        ];
        
    }

    getLocations() {
        this.locations = _.map(this.locService.getLocations(), x => {
            return {
                ...x,
                stores: []
            }

        });
        console.log(this.locations, "LOCATIONS");
    }

    getStoresInLocation() {
        const selectedLocId = (this.storeLocation.value);
        this.activeLocationObj = _.find(this.locations, {"id": selectedLocId});
        if (this.activeLocationObj.stores.length === 0)  // I included the check because the storeService does not filter by location at the moment
        {
            this.storeService.find({
                query: {
                    facilityId: this.locService.facilityId,
                    minorLocationId: selectedLocId
                }
            }).then(x => {

                const stores = _.map(x.data, s => {
                   
                    return {
                        storeName: s.name, storeId: s._id, description: s.description,
                        products: [], // products for this store will be cached here for reuse
                       
                    };
                });
               
                this.stores = stores;
            }, x => {
                console.log("There is an issue connecting with the server!", x);
            });
        }
        else {
            this.stores = this.activeLocationObj.stores || []; // set the stores to the selected location's stores property
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